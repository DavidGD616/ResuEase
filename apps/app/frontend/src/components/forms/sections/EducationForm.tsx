import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import EducationEntryForm from '../entries/EducationEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import type { FormData, EducationItem } from '../../../types/resume';

interface EducationFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

function EducationForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: EducationFormProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const educationEntries = (formData.education || []) as (EducationItem & { id: string })[];

  const addEducation = () => {
    const newItemId = addSectionItem('education');
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeEducation = (id: string) => {
    removeSectionItem('education', id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateEducation = (id: string, field: string, value: unknown) => {
    updateSectionItem('education', id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <FormHeader title={t('forms.education.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.education.description')}
      </FormDescription>

      <FormSection>
        {educationEntries.map((education) => (
          <div key={education.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={education.institution || education.degree || t('common.untitled')}
              isExpanded={expandedItems[education.id]}
              onToggleExpanded={() => toggleExpanded(education.id)}
              onRemove={() => removeEducation(education.id)}
            />

            {expandedItems[education.id] && (
              <EducationEntryForm
                education={education}
                onUpdate={updateEducation}
                jobTitle={formData.jobTitle}
              />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addEducation} label={t('forms.education.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default EducationForm;
