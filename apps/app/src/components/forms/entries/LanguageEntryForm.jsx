import { ChevronDown } from 'lucide-react';

function LanguageEntryForm({ language, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(language.id, field, value);
  };

  const proficiencyLevels = [
    'Not applicable',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Native'
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Language and Proficiency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <input
            type="text"
            value={language.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="English"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency</label>
          <div className="relative">
            <select
              value={language.proficiency}
              onChange={(e) => handleChange('proficiency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              {proficiencyLevels.map((level) => (
                <option 
                    key={level} 
                    value={level}
                    >
                  {level}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LanguageEntryForm;