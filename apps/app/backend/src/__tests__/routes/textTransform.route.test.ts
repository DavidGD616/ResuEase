import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import rateLimit from 'express-rate-limit';
import request from 'supertest';

// ─── Module mocks ─────────────────────────────────────────────────────────────

const mockGenerateContent = vi.hoisted(() => vi.fn());
const mockGetUser = vi.hoisted(() => vi.fn());

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = { generateContent: mockGenerateContent };
  },
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

import { requireAuth } from '../../middleware/auth.js';
import { textTransform } from '../../controllers/aiController.js';

// ─── Test app factory ─────────────────────────────────────────────────────────
//
// Creates a fresh Express app + rate limiter for each test (or test group) so
// that rate-limit counters don't bleed between tests.

function buildApp() {
  const aiLimiter = rateLimit({
    windowMs: 60_000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: true,
    message: { success: false, message: 'Too many AI requests, please try again later.' },
  });

  const app = express();
  app.use(express.json());
  app.post('/api/ai/text-transform', requireAuth, aiLimiter, textTransform);
  return app;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/ai/text-transform route', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset();
    mockGetUser.mockReset();
  });

  // --- Auth guard ---

  it('returns 401 when the Authorization header is missing', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/ai/text-transform')
      .send({ text: 'Some text.', mode: 'rewrite' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBeDefined();
  });

  it('returns 401 when the Authorization header is not a Bearer token', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/ai/text-transform')
      .set('Authorization', 'Basic abc123')
      .send({ text: 'Some text.', mode: 'rewrite' });

    expect(res.status).toBe(401);
  });

  it('returns 401 when the token is invalid (supabase returns error)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error('bad token') });

    const app = buildApp();
    const res = await request(app)
      .post('/api/ai/text-transform')
      .set('Authorization', 'Bearer bad-token')
      .send({ text: 'Some text.', mode: 'rewrite' });

    expect(res.status).toBe(401);
  });

  // --- Rate limiting ---

  it('returns 429 after 20 authenticated requests in one window', async () => {
    const fakeUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: fakeUser }, error: null });
    mockGenerateContent.mockResolvedValue({ text: 'Improved.' });

    const app = buildApp();

    // Send 20 requests — all should pass through (either 200 or handler-level error)
    for (let i = 0; i < 20; i++) {
      await request(app)
        .post('/api/ai/text-transform')
        .set('Authorization', 'Bearer valid-token')
        .send({ text: 'Some text.', mode: 'rewrite' });
    }

    // 21st request must be rate-limited
    const res = await request(app)
      .post('/api/ai/text-transform')
      .set('Authorization', 'Bearer valid-token')
      .send({ text: 'Some text.', mode: 'rewrite' });

    expect(res.status).toBe(429);
  });

  // --- Happy path (middleware chain passes through to handler) ---

  it('returns 200 with transformed text when authenticated and input is valid', async () => {
    const fakeUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: fakeUser }, error: null });
    mockGenerateContent.mockResolvedValue({ text: 'Delivered outstanding results.' });

    const app = buildApp();
    const res = await request(app)
      .post('/api/ai/text-transform')
      .set('Authorization', 'Bearer valid-token')
      .send({ text: 'Met expectations.', mode: 'make-stronger' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.transformedText).toBeDefined();
    expect(res.body.data.metadata.mode).toBe('make-stronger');
  });
});
