const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface SkillSuggestionMetadata {
  model: string;
  jobTitle: string;
  experienceLevel: string;
  requestedCount: number;
  returnedCount: number;
}

interface SkillSuggestionData {
  suggestedSkills: string[];
  metadata: SkillSuggestionMetadata;
}

type SkillSuggestionResult =
  | { success: true; data: SkillSuggestionData }
  | { success: false; error: string };

export class AIService {
  static async suggestSoftSkills(
    jobTitle: string,
    currentSkills: string[] = [],
    count: number = 8
  ): Promise<SkillSuggestionResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/soft-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle, currentSkills, count }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.data };

    } catch (error) {
      console.error('AI soft skills suggestion failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  static async suggestTechnicalSkills(
    jobTitle: string,
    currentSkills: string[] = [],
    count: number = 8
  ): Promise<SkillSuggestionResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/technical-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle, currentSkills, count }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.data };

    } catch (error) {
      console.error('AI technical skills suggestion failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}
