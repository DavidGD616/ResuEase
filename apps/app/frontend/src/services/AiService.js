const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class AIService {
  /**
   * Suggest soft skills based on job title and current skills
   * @param {string} jobTitle - The job title to get suggestions for
   * @param {Array<string>} currentSkills - Array of current skill names to avoid duplicates
   * @param {number} count - Number of skills to suggest (default: 8)
   * @returns {Promise<Object>} Response with suggested skills
   */
  static async suggestSoftSkills(jobTitle, currentSkills = [], count = 8) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/soft-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          currentSkills,
          count
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.data };
      
    } catch (error) {
      console.error('AI soft skills suggestion failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Suggest technical skills based on job title and current skills
   * @param {string} jobTitle - The job title to get suggestions for
   * @param {Array<string>} currentSkills - Array of current skill names to avoid duplicates
   * @param {number} count - Number of skills to suggest (default: 8)
   * @returns {Promise<Object>} Response with suggested skills
   */
  static async suggestTechnicalSkills(jobTitle, currentSkills = [], count = 8) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/technical-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          currentSkills,
          count
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.data };
      
    } catch (error) {
      console.error('AI technical skills suggestion failed:', error);
      return { success: false, error: error.message };
    }
  }
}