// ─── AI endpoints ────────────────────────────────────────────────────────────

export interface SoftSkillsBody {
  jobTitle: string;
  currentSkills?: string[];
  experienceLevel?: string;
  count?: number;
}

export interface TechnicalSkillsBody {
  jobTitle?: string;
  currentSkills?: string[];
  experienceLevel?: string;
  count?: number;
}

export interface SkillSuggestionMetadata {
  model: string;
  jobTitle: string;
  experienceLevel: string;
  requestedCount: number;
  returnedCount: number;
}

export interface SkillSuggestionData {
  suggestedSkills: string[];
  metadata: SkillSuggestionMetadata;
}

export type SkillSuggestionResult =
  | { success: true; data: SkillSuggestionData }
  | { success: false; error: string };

// ─── PDF endpoint ─────────────────────────────────────────────────────────────

export interface HtmlToPdfOptions {
  format?: string;
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  printBackground?: boolean;
}

export interface HtmlToPdfBody {
  html: string;
  options?: HtmlToPdfOptions;
}
