import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import ReferenceEntryForm from '../entries/ReferenceEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import type { FormData, ReferenceItem } from '../../../types/resume';

interface ReferencesFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

function ReferencesForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: ReferencesFormProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const references = (formData.references || []) as (ReferenceItem & { id: string })[];

  const addReference = () => {
    const newItemId = addSectionItem('references');
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeReference = (id: string) => {
    removeSectionItem('references', id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateReference = (id: string, field: string, value: unknown) => {
    updateSectionItem('references', id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
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
              title={reference.referentName || reference.referentCompany || 'Untitled'}
              isExpanded={expandedItems[reference.id]}
              onToggleExpanded={() => toggleExpanded(reference.id)}
              onRemove={() => removeReference(reference.id)}
            />

            {expandedItems[reference.id] && (
              <ReferenceEntryForm reference={reference} onUpdate={updateReference} />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addReference} label="Add one more reference" />
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
