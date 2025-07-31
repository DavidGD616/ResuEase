import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import FormEntryHeader from '../shared/FormEntryHeader';
import EmploymentEntryForm from '../entries/EmploymentEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function EmploymentHistoryForm({ onDeleteSection }) {
  const [experiences, setExperiences] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

    const deleteModal = useDeleteModal(onDeleteSection);

  const addExperience = () => {
    const newId = Date.now().toString();
    const newExperience = {
      id: newId,
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ''
    };
    
    setExperiences(prev => [...prev, newExperience]);
    setExpandedItems(prev => ({ ...prev, [newId]: true }));
  };

  const removeExperience = (id) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateExperience = (id, field, value) => {
    setExperiences(prev => 
      prev.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Employment history</h1>
        <button 
          onClick={deleteModal.openModal}
          className="p-2 text-gray-400 hover:text-gray-600">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-8">
        Show employers your past experience and what you have accomplished. Include simple, clear examples with action verbs to demonstrate your skills.
      </p>
      
      <div className="space-y-4">
        {experiences.map((experience) => (
          <div key={experience.id} className="border border-gray-200 rounded-lg">
            <FormEntryHeader
              title={experience.jobTitle}
              isExpanded={expandedItems[experience.id]}
              onToggleExpanded={() => toggleExpanded(experience.id)}
              onRemove={() => removeExperience(experience.id)}
            />

            {expandedItems[experience.id] && (
              <EmploymentEntryForm
                experience={experience}
                onUpdate={updateExperience}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addExperience}
          label="Add work experience"
        />
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

export default EmploymentHistoryForm;