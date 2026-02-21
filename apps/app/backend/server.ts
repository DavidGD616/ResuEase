import "dotenv/config";
import "./src/lib/validateConfig.js"; // exits with a clear error if any required env var is missing

import express, { type Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { healthCheck, softSkills, technicalSkills } from "./src/controllers/aiController.js";
import { generateTestPDF, convertHtmlToPdf } from "./src/controllers/pdfController.js";
import { requireAuth } from "./src/middleware/auth.js";
import { closeBrowser } from "./src/lib/browserManager.js";

const app: Express = express();
const PORT = process.env.PORT || 3001;

// CORS — restrict to an explicit origin allowlist.
// Set CORS_ALLOWED_ORIGINS to a comma-separated list of allowed origins.
// Defaults to localhost:5173 (Vite dev server) when not set.
const rawOrigins = process.env.CORS_ALLOWED_ORIGINS ?? "http://localhost:5173";
const allowedOrigins = new Set(
  rawOrigins
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)
);

// Rate limiters — applied per-route to protect paid external services.
// Both standard (RateLimit-*) and legacy (X-RateLimit-*) headers are sent.
const aiLimiter = rateLimit({
  windowMs: 60_000,       // 1 minute
  limit: 20,              // 20 requests per IP per window
  standardHeaders: "draft-8",
  legacyHeaders: true,
  message: { success: false, message: "Too many AI requests, please try again later." },
});

const pdfLimiter = rateLimit({
  windowMs: 60_000,       // 1 minute
  limit: 10,              // 10 requests per IP per window
  standardHeaders: "draft-8",
  legacyHeaders: true,
  message: { success: false, message: "Too many PDF requests, please try again later." },
});

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin header (server-to-server, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin '${origin}' is not allowed`));
    },
  })
);
app.use(express.json({ limit: "10mb" })); // Increase limit for form data
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "ResuEase Backend API is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Test route to make sure everything works
app.get("/api/test", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is working correctly!",
    data: {
      server: "Express",
      node_version: process.version,
      uptime: process.uptime(),
    },
  });
});

// Gemini integration endpoint (auth + rate-limited)
app.post("/api/ai/generate", requireAuth, aiLimiter, healthCheck);
app.post("/api/ai/soft-skills", requireAuth, aiLimiter, softSkills);
app.post("/api/ai/technical-skills", requireAuth, aiLimiter, technicalSkills);

// PDF generation test endpoint (no auth — dev/diagnostic only)
app.get("/api/generate-test-pdf", generateTestPDF);

// HTML to PDF conversion endpoint (auth + rate-limited)
app.post("/api/html-to-pdf", requireAuth, pdfLimiter, convertHtmlToPdf);

// Basic error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Handle 404 routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔒 CORS allowed origins: ${[...allowedOrigins].join(", ")}`);
  console.log("📍 API endpoints:");
  console.log(`   - Health check: http://localhost:${PORT}/`);
  console.log(`   - Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`   - Gemini: http://localhost:${PORT}/api/ai/generate`);
  console.log(`   - Test PDF: http://localhost:${PORT}/api/generate-test-pdf`);
});

// Graceful shutdown — close the shared browser and stop accepting new connections.
const shutdown = async () => {
  server.close();
  await closeBrowser();
  process.exit(0);
};

process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);

export default app;
