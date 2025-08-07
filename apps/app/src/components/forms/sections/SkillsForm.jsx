import { useState } from 'react';
import { Plus, RefreshCw, Sparkles } from 'lucide-react';
import { FormHeader,FormDescription, FormSection } from '../shared/FormComponents';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function SkillsForm({ onDeleteSection }) {
  const [selectedSkills, setSelectedSkills] = useState([
    'Project Management',
    'Data Analysis',
    'Problem Solving',
    'Team Leadership',
    'Customer Service',
    'Digital Marketing',
    'Time Management'
  ]);

  const suggestedSkills = [
    'Project Management',
    'Data Analysis',
    'Problem Solving',
    'Team Leadership',
    'Customer Service',
    'Digital Marketing',
    'Time Management',
    'Communication',
    'Strategic Planning',
    'Software Development'
  ];

  const deleteModal = useDeleteModal(onDeleteSection);

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const addSkill = (skillToAdd) => {
    if (!selectedSkills.includes(skillToAdd)) {
      setSelectedSkills(prev => [...prev, skillToAdd]);
    }
  };

  return (
    <div>
      <FormHeader title="Skills" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        Highlight your most important and applicable professional skills.
      </FormDescription>
      
      <FormSection>
        {/* Suggested Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
            <span className="text-xs sm:text-sm font-medium text-purple-600">Suggested</span>
            <button className="flex items-center gap-1 text-xs sm:text-sm text-purple-600 hover:text-purple-700">
              <span>Refresh</span>
              <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {suggestedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm border transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Skills Display */}
        {selectedSkills.length > 0 && (
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Selected Skills</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {selectedSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm text-blue-700"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Skill */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-md sm:rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 hover:bg-gray-100 cursor-pointer transition-colors">
          <button className="flex items-center gap-1 sm:gap-2 text-gray-600 font-medium text-sm sm:text-base">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add skill
          </button>
        </div>
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
        title="Are you sure you want to delete this section?"
        message="You can't undo this action."
        confirmText="Delete Section"
        cancelText="Cancel"
      />
    </div>
  );
}

export default SkillsForm;