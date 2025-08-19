import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import HobbyEntryForm from '../entries/HobbyEntryForm';

function HobbiesForm({ 
  onDeleteSection, 
  formData, 
  addSectionItem, 
  updateSectionItem, 
  removeSectionItem 
}) {
  const [expandedItems, setExpandedItems] = useState({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const hobbies = formData.hobbies || [];

  const addHobby = () => {
    const newItemId = addSectionItem('hobbies');
    setExpandedItems(prev => ({ ...prev, [newItemId]: true }));
  };

  const removeHobby = (id) => {
    removeSectionItem('hobbies', id);
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateHobby = (id, field, value) => {
    updateSectionItem('hobbies', id, field, value);
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <FormHeader title="Hobbies" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        This small section is a chance to add some personality to your resume. Share a few hobbies or interests that give employers a glimpse of who you are outside of work.
      </FormDescription>
      
      <FormSection>
        {hobbies.map((hobby) => (
          <div key={hobby.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={hobby.hobbyName || 'Untitled'}
              isExpanded={expandedItems[hobby.id]}
              onToggleExpanded={() => toggleExpanded(hobby.id)}
              onRemove={() => removeHobby(hobby.id)}
            />

            {expandedItems[hobby.id] && (
              <HobbyEntryForm
                hobby={hobby}
                onUpdate={updateHobby}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addHobby}
          label="Add hobby"
        />
      </FormSection>

      {/* Delete Section Modal */}
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

export default HobbiesForm;