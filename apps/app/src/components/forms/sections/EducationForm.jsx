import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import EducationEntryForm from '../entries/EducationEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function EducationForm({ onDeleteSection }) {
  const [educationEntries, setEducationEntries] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const deleteModal = useDeleteModal(onDeleteSection);

  const addEducation = () => {
    const newId = Date.now().toString();
    const newEducation = {
      id: newId,
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ''
    };
    
    setEducationEntries(prev => [...prev, newEducation]);
    setExpandedItems(prev => ({ ...prev, [newId]: true }));
  };

  const removeEducation = (id) => {
    setEducationEntries(prev => prev.filter(edu => edu.id !== id));
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateEducation = (id, field, value) => {
    setEducationEntries(prev => 
      prev.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
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
      <FormHeader title="Education" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        Add the name of your school, where it is located, what degree you obtained, your field of study, and your graduation year.
      </FormDescription>
      
      <FormSection>
        {educationEntries.map((education) => (
          <div key={education.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={education.institution}
              isExpanded={expandedItems[education.id]}
              onToggleExpanded={() => toggleExpanded(education.id)}
              onRemove={() => removeEducation(education.id)}
            />

            {expandedItems[education.id] && (
              <EducationEntryForm
                education={education}
                onUpdate={updateEducation}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addEducation}
          label="Add education"
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

export default EducationForm;