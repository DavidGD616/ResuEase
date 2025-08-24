import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import CustomSectionEntryForm from '../entries/CustomSectionEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function CustomSectionForm({ 
  onDeleteSection, 
  formData, 
  addSectionItem, 
  updateSectionItem, 
  removeSectionItem,
  sectionId 
}) {
  const [expandedItems, setExpandedItems] = useState({});
  const deleteModal = useDeleteModal(onDeleteSection);

  // Extract the section name from the sectionId (e.g., "custom-1" -> "Custom section 1")
  const sectionKey = `customEntries_${sectionId}`;
  
  // Get custom entries from global form data using the section-specific key
  const customEntries = formData[sectionKey] || [];

  const addCustomEntry = () => {
    const newItemId = addSectionItem(sectionKey);
    setExpandedItems(prev => ({ ...prev, [newItemId]: true }));
  };

  const removeCustomEntry = (id) => {
    removeSectionItem(sectionKey, id);
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateCustomEntry = (id, field, value) => {
    updateSectionItem(sectionKey, id, field, value);
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <FormHeader title="Custom section" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        You can add anything you want in the custom section.
      </FormDescription>
      
      <FormSection>
        {customEntries.map((entry) => (
          <div key={entry.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={entry.header || 'Untitled'}
              isExpanded={expandedItems[entry.id]}
              onToggleExpanded={() => toggleExpanded(entry.id)}
              onRemove={() => removeCustomEntry(entry.id)}
            />

            {expandedItems[entry.id] && (
              <CustomSectionEntryForm
                entry={entry}
                onUpdate={updateCustomEntry}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addCustomEntry}
          label="Add entry"
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

export default CustomSectionForm;