import { describe, it, expect } from 'vitest';

// vitest.setup.ts sets all required env vars before this module is imported,
// so the module-level side effect (process.exit) will not fire during tests.
import { getMissingVars } from '../../lib/validateConfig.js';

describe('getMissingVars', () => {
  it('returns an empty array when all required variables are present', () => {
    const result = getMissingVars({
      SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_ANON_KEY: 'anon-key',
      GOOGLE_GEMINI_API_KEY: 'gemini-key',
    });

    expect(result).toHaveLength(0);
  });

  it('reports all three variables when the env is empty', () => {
    const result = getMissingVars({});
    const names = result.map((v) => v.name);

    expect(names).toContain('SUPABASE_URL');
    expect(names).toContain('SUPABASE_ANON_KEY');
    expect(names).toContain('GOOGLE_GEMINI_API_KEY');
  });

  it('reports only the variables that are missing, not the ones that are present', () => {
    const result = getMissingVars({ SUPABASE_URL: 'https://test.supabase.co' });
    const names = result.map((v) => v.name);

    expect(names).not.toContain('SUPABASE_URL');
    expect(names).toContain('SUPABASE_ANON_KEY');
    expect(names).toContain('GOOGLE_GEMINI_API_KEY');
  });

  it('includes a human-readable description for each missing variable', () => {
    const result = getMissingVars({});

    for (const v of result) {
      expect(v.description.length).toBeGreaterThan(0);
    }
  });
});
