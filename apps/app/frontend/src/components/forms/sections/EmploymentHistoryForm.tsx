import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import EmploymentEntryForm from '../entries/EmploymentEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import type { FormData, EmploymentItem } from '../../../types/resume';

interface EmploymentHistoryFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

function EmploymentHistoryForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: EmploymentHistoryFormProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const experiences = (formData.employment || []) as (EmploymentItem & { id: string })[];

  const addExperience = () => {
    const newItemId = addSectionItem('employment');
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeExperience = (id: string) => {
    removeSectionItem('employment', id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateExperience = (id: string, field: string, value: unknown) => {
    updateSectionItem('employment', id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <FormHeader title={t('forms.employment.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.employment.description')}
      </FormDescription>

      <FormSection>
        {experiences.map((experience) => (
          <div key={experience.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={experience.jobTitle || experience.company || t('common.untitled')}
              isExpanded={expandedItems[experience.id]}
              onToggleExpanded={() => toggleExpanded(experience.id)}
              onRemove={() => removeExperience(experience.id)}
            />

            {expandedItems[experience.id] && (
              <EmploymentEntryForm
                experience={experience}
                onUpdate={updateExperience}
                jobTitle={formData.jobTitle}
              />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addExperience} label={t('forms.employment.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default EmploymentHistoryForm;
