import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      <FormHeader title={t('forms.references.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.references.description')}
      </FormDescription>

      <FormSection>
        {references.map((reference) => (
          <div key={reference.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={reference.referentName || reference.referentCompany || t('common.untitled')}
              isExpanded={expandedItems[reference.id]}
              onToggleExpanded={() => toggleExpanded(reference.id)}
              onRemove={() => removeReference(reference.id)}
            />

            {expandedItems[reference.id] && (
              <ReferenceEntryForm reference={reference} onUpdate={updateReference} />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addReference} label={t('forms.references.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default ReferencesForm;
