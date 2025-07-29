import { useState } from 'react';
import { Plus, Trash2, RefreshCw, Sparkles } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
        <button 
          onClick={deleteModal.openModal}
          className="p-2 text-gray-400 hover:text-gray-600">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-8">
        Highlight your most important and applicable professional skills.
      </p>
      
      <div className="space-y-6">
        {/* Suggested Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Suggested</span>
            <button className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700">
              <span>Refresh</span>
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
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
            <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Skills</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700"
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
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 hover:bg-gray-100 cursor-pointer transition-colors">
          <button className="flex items-center gap-2 text-gray-600 font-medium">
            <Plus className="w-5 h-5" />
            Add skill
          </button>
        </div>
      </div>
      {/* Delete Section Modal */}
            <Modal.Confirmation
              isOpen={deleteModal.isOpen}
              onClose={deleteModal.closeModal}
              onConfirm={deleteModal.confirmDelete}
              title="Are you sure you want to delete this section?"
              message="You can’t undo this action."
              confirmText="Delete Section"
              cancelText="Cancel"
            />
    </div>
  );
}

export default SkillsForm;