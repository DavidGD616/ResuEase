import { createClient } from "@supabase/supabase-js";
import { Request, Response, NextFunction } from "express";
import type { User } from "@supabase/supabase-js";

// Extend the Express Request type so controllers can access req.user.
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
}

// Single client used only for token verification — no persistent sessions.
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

/**
 * Express middleware that verifies a Supabase JWT from the Authorization header.
 * Attaches the verified user to req.user and calls next() on success.
 * Returns 401 if the header is absent, malformed, or the token is invalid/expired.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authorization header is required",
    });
    return;
  }

  const token = authHeader.slice(7); // strip "Bearer "

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
    return;
  }

  req.user = user;
  next();
};
