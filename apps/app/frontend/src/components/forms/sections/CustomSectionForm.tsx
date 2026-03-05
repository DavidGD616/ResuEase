import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import CustomSectionEntryForm from '../entries/CustomSectionEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import type { FormData, CustomEntryItem } from '../../../types/resume';

interface CustomSectionFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
  sectionId: string;
}

function CustomSectionForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
  sectionId,
}: CustomSectionFormProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const sectionKey = `customEntries_${sectionId}`;
  const customEntries = ((formData[sectionKey] as CustomEntryItem[] | undefined) || []) as (CustomEntryItem & { id: string })[];

  const addCustomEntry = () => {
    const newItemId = addSectionItem(sectionKey);
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeCustomEntry = (id: string) => {
    removeSectionItem(sectionKey, id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateCustomEntry = (id: string, field: string, value: unknown) => {
    updateSectionItem(sectionKey, id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <FormHeader title={t('forms.custom.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.custom.description')}
      </FormDescription>

      <FormSection>
        {customEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={entry.header || t('common.untitled')}
              isExpanded={expandedItems[entry.id]}
              onToggleExpanded={() => toggleExpanded(entry.id)}
              onRemove={() => removeCustomEntry(entry.id)}
            />

            {expandedItems[entry.id] && (
              <CustomSectionEntryForm entry={entry} onUpdate={updateCustomEntry} jobTitle={formData.jobTitle} />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addCustomEntry} label={t('forms.custom.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default CustomSectionForm;
