import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import LanguageEntryForm from '../entries/LanguageEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import type { FormData, LanguageItem } from '../../../types/resume';

interface LanguagesFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

function LanguagesForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: LanguagesFormProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const languages = (formData.languages || []) as (LanguageItem & { id: string })[];

  const addLanguage = () => {
    const newItemId = addSectionItem('languages');
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeLanguage = (id: string) => {
    removeSectionItem('languages', id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateLanguage = (id: string, field: string, value: unknown) => {
    updateSectionItem('languages', id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <FormHeader title={t('forms.languages.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.languages.description')}
      </FormDescription>

      <FormSection>
        {languages.map((language) => (
          <div key={language.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={language.language || t('common.untitled')}
              isExpanded={expandedItems[language.id]}
              onToggleExpanded={() => toggleExpanded(language.id)}
              onRemove={() => removeLanguage(language.id)}
            />

            {expandedItems[language.id] && (
              <LanguageEntryForm language={language} onUpdate={updateLanguage} />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addLanguage} label={t('forms.languages.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default LanguagesForm;
