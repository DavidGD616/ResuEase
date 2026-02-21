const REQUIRED_VARS = [
  {
    name: 'SUPABASE_URL',
    description: 'Supabase project URL (required by auth middleware)',
  },
  {
    name: 'SUPABASE_ANON_KEY',
    description: 'Supabase anonymous key (required by auth middleware)',
  },
  {
    name: 'GOOGLE_GEMINI_API_KEY',
    description: 'Google Gemini API key (required for AI endpoints)',
  },
] as const;

type VarSpec = { name: string; description: string };

/**
 * Returns every required variable that is absent or empty in the given env map.
 * Accepts an explicit env object so it can be called with a mock in tests.
 */
export function getMissingVars(env: NodeJS.ProcessEnv = process.env): VarSpec[] {
  return REQUIRED_VARS.filter(({ name }) => !env[name]);
}

// Validate on import — exit immediately with a full list of missing variables
// rather than letting individual modules fail one at a time.
const missing = getMissingVars();

if (missing.length > 0) {
  const lines = missing
    .map(({ name, description }) => `  ${name}: ${description}`)
    .join('\n');
  console.error(`Server cannot start — missing required environment variables:\n${lines}`);
  process.exit(1);
}
