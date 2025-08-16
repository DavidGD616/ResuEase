import { useState } from 'react';
import { FormHeader, FormDescription, FormSection, FormEntryHeader } from '../shared/FormComponents';
import CustomSectionEntryForm from '../entries/CustomSectionEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function CustomSectionForm({ onDeleteSection }) {
  const [customEntries, setCustomEntries] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const deleteModal = useDeleteModal(onDeleteSection);

  const addCustomEntry = () => {
    const newId = Date.now().toString();
    const newEntry = {
      id: newId,
      header: '',
      subheader: '',
      description: ''
    };
    
    setCustomEntries(prev => [...prev, newEntry]);
    setExpandedItems(prev => ({ ...prev, [newId]: true }));
  };

  const removeCustomEntry = (id) => {
    setCustomEntries(prev => prev.filter(entry => entry.id !== id));
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateCustomEntry = (id, field, value) => {
    setCustomEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
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