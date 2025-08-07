import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
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
      <FormHeader title="Employment history" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        Show employers your past experience and what you have accomplished. Include simple, clear examples with action verbs to demonstrate your skills.
      </FormDescription>
      
      <FormSection>
        {experiences.map((experience) => (
          <div key={experience.id} className="border border-gray-200 rounded-md sm:rounded-lg">
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

export default EmploymentHistoryForm;