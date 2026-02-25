import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { TextTransformRequest } from '@resuease/types';

const mockGetSession = vi.hoisted(() => vi.fn());
const mockFetch = vi.hoisted(() => vi.fn());

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: { getSession: mockGetSession },
  },
}));

vi.stubGlobal('fetch', mockFetch);

// Set VITE_ env var before importing the module under test
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3001/api');

const { AIService } = await import('../AiService');

const VALID_TOKEN = 'test-token';
const VALID_PAYLOAD: TextTransformRequest = {
  text: 'I did stuff at my job.',
  mode: 'rewrite',
  jobTitle: 'Software Engineer',
};

function mockSession(token = VALID_TOKEN) {
  mockGetSession.mockResolvedValue({ data: { session: { access_token: token } } });
}

function mockSuccessResponse(transformedText = 'Rewrote the text.') {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      data: {
        transformedText,
        metadata: { model: 'gemini', mode: 'rewrite', originalLength: 10, transformedLength: 20 },
      },
    }),
  });
}

describe('AIService.transformText', () => {
  beforeEach(() => {
    mockGetSession.mockReset();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('POSTs to /api/ai/text-transform with Authorization header and payload', async () => {
    mockSession();
    mockSuccessResponse();

    await AIService.transformText(VALID_PAYLOAD);

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('http://localhost:3001/api/ai/text-transform');
    expect(init.method).toBe('POST');
    expect(init.headers['Authorization']).toBe(`Bearer ${VALID_TOKEN}`);
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(init.body)).toEqual(VALID_PAYLOAD);
  });

  it('returns { success: true, data } on a 200 response', async () => {
    mockSession();
    mockSuccessResponse('Improved text here.');

    const result = await AIService.transformText(VALID_PAYLOAD);

    expect(result).toEqual({
      success: true,
      data: {
        transformedText: 'Improved text here.',
        metadata: { model: 'gemini', mode: 'rewrite', originalLength: 10, transformedLength: 20 },
      },
    });
  });

  it('returns { success: false, error } on a non-2xx response', async () => {
    mockSession();
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'text is required' }),
    });

    const result = await AIService.transformText(VALID_PAYLOAD);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('text is required');
    }
  });

  it('falls back to HTTP status message when error body has no message field', async () => {
    mockSession();
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const result = await AIService.transformText(VALID_PAYLOAD);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('500');
    }
  });

  it('returns { success: false, error } on a network error', async () => {
    mockSession();
    mockFetch.mockRejectedValue(new Error('Network failure'));

    const result = await AIService.transformText(VALID_PAYLOAD);

    expect(result).toEqual({ success: false, error: 'Network failure' });
  });

  it('aborts the request and returns { success: false } after 15 seconds', async () => {
    vi.useFakeTimers();
    mockSession();

    // fetch never resolves — simulates a hung connection
    mockFetch.mockImplementation((_url: string, init: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init.signal?.addEventListener('abort', () =>
          reject(new DOMException('The operation was aborted.', 'AbortError'))
        );
      });
    });

    const resultPromise = AIService.transformText(VALID_PAYLOAD);
    await vi.advanceTimersByTimeAsync(15_001);
    const result = await resultPromise;

    expect(result.success).toBe(false);
  });

  it('passes all optional TextTransformRequest fields in the request body', async () => {
    mockSession();
    mockSuccessResponse();

    const fullPayload: TextTransformRequest = {
      text: 'Some bullet point.',
      mode: 'add-metrics',
      jobTitle: 'Data Analyst',
      sectionName: 'Employment',
      fieldLabel: 'Achievements',
    };

    await AIService.transformText(fullPayload);

    const [, init] = mockFetch.mock.calls[0];
    expect(JSON.parse(init.body)).toEqual(fullPayload);
  });
});
