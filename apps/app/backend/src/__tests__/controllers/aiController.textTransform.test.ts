import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockGenerateContent = vi.hoisted(() => vi.fn());

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = { generateContent: mockGenerateContent };
  },
}));

import { textTransform } from '../../controllers/aiController.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRes() {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  return { res: { status, json } as unknown as Response, status, json };
}

function makeReq(body: Record<string, unknown>): Request {
  return { body } as unknown as Request;
}

function geminiReturns(text: string) {
  mockGenerateContent.mockResolvedValue({ text });
}

function geminiThrows(message = 'API error') {
  mockGenerateContent.mockRejectedValue(new Error(message));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('textTransform handler', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset();
  });

  // --- Input validation: text ---

  it('returns 400 when text is missing', async () => {
    const { res, status, json } = makeRes();
    await textTransform(makeReq({ mode: 'rewrite' }), res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('returns 400 when text is an empty string', async () => {
    const { res, status } = makeRes();
    await textTransform(makeReq({ text: '', mode: 'rewrite' }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when text is whitespace only', async () => {
    const { res, status } = makeRes();
    await textTransform(makeReq({ text: '   ', mode: 'rewrite' }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when text exceeds 2000 characters', async () => {
    const { res, status } = makeRes();
    await textTransform(makeReq({ text: 'a'.repeat(2001), mode: 'rewrite' }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('accepts text of exactly 2000 characters', async () => {
    geminiReturns('Improved text.');
    const { res, status } = makeRes();
    await textTransform(makeReq({ text: 'a'.repeat(2000), mode: 'rewrite' }), res);
    expect(status).not.toHaveBeenCalledWith(400);
  });

  // --- Input validation: mode ---

  it('returns 400 when mode is missing', async () => {
    const { res, status } = makeRes();
    await textTransform(makeReq({ text: 'Some text.' }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when mode is an unrecognised value', async () => {
    const { res, status } = makeRes();
    await textTransform(makeReq({ text: 'Some text.', mode: 'summarise' }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it.each(['rewrite', 'add-metrics', 'make-stronger'])(
    'accepts mode "%s"',
    async (mode) => {
      geminiReturns('Improved text.');
      const { res, status } = makeRes();
      await textTransform(makeReq({ text: 'Some text.', mode }), res);
      expect(status).not.toHaveBeenCalledWith(400);
    }
  );

  // --- Happy path ---

  it('returns 200 with correct shape on success', async () => {
    geminiReturns('Improved summary sentence.');
    const { res, status, json } = makeRes();
    await textTransform(makeReq({ text: 'Original summary.', mode: 'rewrite' }), res);

    expect(status).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith({
      success: true,
      data: {
        transformedText: 'Improved summary sentence.',
        metadata: {
          model: 'gemini-2.5-flash-lite',
          mode: 'rewrite',
          originalLength: expect.any(Number),
          transformedLength: expect.any(Number),
        },
      },
    });
  });

  it('metadata.mode echoes the requested mode', async () => {
    geminiReturns('Hit targets.');
    const { res, json } = makeRes();
    await textTransform(makeReq({ text: 'Met targets.', mode: 'add-metrics' }), res);
    expect(json.mock.calls[0][0].data.metadata.mode).toBe('add-metrics');
  });

  it('metadata.model is gemini-2.5-flash-lite', async () => {
    geminiReturns('Spearheaded key initiatives.');
    const { res, json } = makeRes();
    await textTransform(makeReq({ text: 'Led initiatives.', mode: 'make-stronger' }), res);
    expect(json.mock.calls[0][0].data.metadata.model).toBe('gemini-2.5-flash-lite');
  });

  it('metadata.originalLength reflects the sanitized input length', async () => {
    geminiReturns('Clean output.');
    const { res, json } = makeRes();
    const text = 'Hello world.';
    await textTransform(makeReq({ text, mode: 'rewrite' }), res);
    expect(json.mock.calls[0][0].data.metadata.originalLength).toBe(text.length);
  });

  // --- Output validation ---

  it('returns 500 when Gemini returns an empty string', async () => {
    geminiReturns('');
    const { res, status, json } = makeRes();
    await textTransform(makeReq({ text: 'Some text.', mode: 'rewrite' }), res);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('returns 500 when Gemini response exceeds 3x the input length', async () => {
    const input = 'Short.';
    geminiReturns('x'.repeat(input.length * 3 + 1));
    const { res, status } = makeRes();
    await textTransform(makeReq({ text: input, mode: 'rewrite' }), res);
    expect(status).toHaveBeenCalledWith(500);
  });

  it('accepts a Gemini response exactly at the 3x limit', async () => {
    const input = 'Short.';
    geminiReturns('x'.repeat(input.length * 3));
    const { res, status } = makeRes();
    await textTransform(makeReq({ text: input, mode: 'rewrite' }), res);
    expect(status).not.toHaveBeenCalledWith(500);
  });

  // --- Sanitization ---

  it('strips HTML tags from the Gemini response before returning', async () => {
    // Input is long enough that the HTML-tagged response stays within the 3x limit.
    const input = 'Strong candidate with proven results working in a professional environment.';
    geminiReturns('<b>Strong</b> candidate with <em>proven</em> results.');
    const { res, json } = makeRes();
    await textTransform(makeReq({ text: input, mode: 'rewrite' }), res);
    expect(json.mock.calls[0][0].data.transformedText).not.toMatch(/<[^>]*>/);
    expect(json.mock.calls[0][0].data.transformedText).toContain('Strong');
  });

  it('strips markdown characters from the Gemini response before returning', async () => {
    geminiReturns('**Strong** candidate with _proven_ results.');
    const { res, json } = makeRes();
    await textTransform(makeReq({ text: 'Good candidate.', mode: 'rewrite' }), res);
    const result: string = json.mock.calls[0][0].data.transformedText;
    expect(result).not.toContain('**');
    expect(result).not.toContain('_');
  });

  // --- Gemini failure ---

  it('returns 500 when Gemini throws', async () => {
    geminiThrows('Network error');
    const { res, status, json } = makeRes();
    await textTransform(makeReq({ text: 'Some text.', mode: 'rewrite' }), res);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });
});
