// Set required environment variables before any test module is imported.
// auth.ts and validateConfig.ts read these at module load time and exit/throw if absent.
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.GOOGLE_GEMINI_API_KEY = 'test-gemini-key';
