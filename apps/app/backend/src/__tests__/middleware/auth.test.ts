import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// vi.hoisted ensures mockGetUser is available inside the vi.mock factory,
// which is hoisted to the top of the module before static imports are processed.
const mockGetUser = vi.hoisted(() => vi.fn());

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

// Static import — uses the mocked @supabase/supabase-js above.
import { requireAuth } from '../../middleware/auth.js';

describe('requireAuth middleware', () => {
  let req: Partial<Request>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    req = { headers: {} };
    res = { status: statusMock } as unknown as Response;
    next = vi.fn() as unknown as NextFunction;
    mockGetUser.mockReset();
  });

  it('returns 401 when the Authorization header is missing', async () => {
    await requireAuth(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Authorization header is required' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when the Authorization header does not start with "Bearer "', async () => {
    req.headers = { authorization: 'Basic abc123' };

    await requireAuth(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when supabase returns an error', async () => {
    req.headers = { authorization: 'Bearer invalid-token' };
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error('Invalid token') });

    await requireAuth(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid or expired token' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when supabase returns a null user with no error', async () => {
    req.headers = { authorization: 'Bearer some-token' };
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    await requireAuth(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and attaches user to req when the token is valid', async () => {
    const fakeUser = { id: 'user-123', email: 'alice@example.com' };
    req.headers = { authorization: 'Bearer valid-token' };
    mockGetUser.mockResolvedValue({ data: { user: fakeUser }, error: null });

    await requireAuth(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect((req as Request).user).toEqual(fakeUser);
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('strips the "Bearer " prefix before calling supabase.auth.getUser', async () => {
    req.headers = { authorization: 'Bearer my-jwt-token' };
    mockGetUser.mockResolvedValue({ data: { user: { id: '1' } }, error: null });

    await requireAuth(req as Request, res as Response, next);

    expect(mockGetUser).toHaveBeenCalledWith('my-jwt-token');
  });
});
