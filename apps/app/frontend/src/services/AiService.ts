import { supabase } from '../lib/supabase';
import type { SkillSuggestionData, SkillSuggestionResult, TextTransformRequest, TextTransformResult } from '@resuease/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class AIService {
  static async suggestSoftSkills(
    jobTitle: string,
    currentSkills: string[] = [],
    count: number = 8
  ): Promise<SkillSuggestionResult> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_BASE_URL}/ai/soft-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
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
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_BASE_URL}/ai/technical-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
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

  static async transformText(payload: TextTransformRequest): Promise<TextTransformResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_BASE_URL}/ai/text-transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.data };

    } catch (error) {
      console.error('AI text transform failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    } finally {
      clearTimeout(timeout);
    }
  }
}
