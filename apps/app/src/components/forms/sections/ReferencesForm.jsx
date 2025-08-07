import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import ReferenceEntryForm from '../entries/ReferenceEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function ReferencesForm({ onDeleteSection }) {
  const [references, setReferences] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const deleteModal = useDeleteModal(onDeleteSection);

  const addReference = () => {
    const newId = Date.now().toString();
    const newReference = {
      id: newId,
      referentName: '',
      referentCompany: '',
      referentEmail: '',
      referentPhone: ''
    };
    
    setReferences(prev => [...prev, newReference]);
    setExpandedItems(prev => ({ ...prev, [newId]: true }));
  };

  const removeReference = (id) => {
    setReferences(prev => prev.filter(reference => reference.id !== id));
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateReference = (id, field, value) => {
    setReferences(prev => 
      prev.map(reference => 
        reference.id === id ? { ...reference, [field]: value } : reference
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
      <FormHeader title="References" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        Include professional references who can vouch for your work experience, skills, and character. Make sure to ask for their permission before listing them.
      </FormDescription>
      
      <FormSection>
        {references.map((reference) => (
          <div key={reference.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={reference.referentName || reference.referentCompany}
              isExpanded={expandedItems[reference.id]}
              onToggleExpanded={() => toggleExpanded(reference.id)}
              onRemove={() => removeReference(reference.id)}
            />

            {expandedItems[reference.id] && (
              <ReferenceEntryForm
                reference={reference}
                onUpdate={updateReference}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addReference}
          label="Add one more reference"
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

export default ReferencesForm;
