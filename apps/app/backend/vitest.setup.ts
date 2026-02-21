// Set required environment variables before any test module is imported.
// auth.ts reads these at module load time and throws if they are absent.
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
