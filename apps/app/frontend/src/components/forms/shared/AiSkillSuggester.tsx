import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { AIService } from '../../../services/AiService';
import type { SkillItem, TechSkillItem } from '../../../types/resume';

interface AISkillSuggesterProps {
  jobTitle?: string;
  currentSkills?: Array<SkillItem | TechSkillItem>;
  onAddSkill: (skillName: string) => void;
  skillType?: 'soft' | 'technical';
}

function AISkillSuggester({
  jobTitle,
  currentSkills = [],
  onAddSkill,
  skillType = 'soft',
}: AISkillSuggesterProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleGetSuggestions = async () => {
    if (!jobTitle?.trim()) {
      setError('Please set your job title in the Personal Details section first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuggestedSkills([]);

    const currentSkillNames = currentSkills
      .map((skill) =>
        'skillName' in skill ? skill.skillName : skill.technologiesSkillName
      )
      .filter(Boolean) as string[];

    const result =
      skillType === 'technical'
        ? await AIService.suggestTechnicalSkills(jobTitle, currentSkillNames)
        : await AIService.suggestSoftSkills(jobTitle, currentSkillNames);

    if (result.success) {
      setSuggestedSkills(result.data.suggestedSkills || []);
      if (result.data.suggestedSkills?.length === 0) {
        setError('No new skills could be suggested. You may already have comprehensive skills listed.');
      }
    } else {
      setError(result.error || 'Failed to get suggestions');
    }

    setIsLoading(false);
  };

  const addSuggestedSkill = (skillName: string) => {
    onAddSkill(skillName);
    setSuggestedSkills((prev) => prev.filter((s) => s !== skillName));
  };

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      <button
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm shadow-md"
      >
        <Sparkles className="w-4 h-4" />
        {showSuggestions ? 'Hide AI Suggestions' : 'Get AI Skill Suggestions'}
      </button>

      {/* Suggestion Panel */}
      {showSuggestions && (
        <div className="mt-4 p-4 sm:p-6 border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              AI {skillType === 'technical' ? 'Technical' : 'Soft'} Skill Suggestions
            </h3>
          </div>

          {/* Job Title Display */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              Job Title: <span className="font-semibold text-gray-900">{jobTitle || 'Not set'}</span>
            </p>
            {!jobTitle && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>Please set your job title in the Personal Details section first</span>
              </div>
            )}
          </div>

          {/* Get Suggestions Button */}
          <button
            onClick={handleGetSuggestions}
            disabled={isLoading || !jobTitle}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${isLoading || !jobTitle
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating suggestions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Get Suggestions
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Suggested Skills */}
          {suggestedSkills.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Click to add skills to your resume:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => addSuggestedSkill(skill)}
                    className="group px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-sm font-medium text-gray-700 hover:text-blue-700 shadow-sm hover:shadow-md"
                  >
                    <span className="flex items-center gap-1">
                      <span className="text-blue-600 group-hover:scale-110 transition-transform duration-200">+</span>
                      {skill}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AISkillSuggester;
