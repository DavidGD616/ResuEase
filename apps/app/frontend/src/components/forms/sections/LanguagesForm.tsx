import { useState } from 'react';
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
      <FormHeader title="Languages" onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        Include languages you speak and your proficiency level. This can be valuable for positions requiring multilingual communication.
      </FormDescription>

      <FormSection>
        {languages.map((language) => (
          <div key={language.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={language.language || 'Untitled'}
              isExpanded={expandedItems[language.id]}
              onToggleExpanded={() => toggleExpanded(language.id)}
              onRemove={() => removeLanguage(language.id)}
            />

            {expandedItems[language.id] && (
              <LanguageEntryForm language={language} onUpdate={updateLanguage} />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addLanguage} label="Add one more language" />
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

export default LanguagesForm;
