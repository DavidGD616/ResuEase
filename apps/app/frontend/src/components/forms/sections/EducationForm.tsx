import { useState } from 'react';
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
      <FormHeader title="Education" onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        Add the name of your school, where it is located, what degree you obtained, your field of study, and your graduation year.
      </FormDescription>

      <FormSection>
        {educationEntries.map((education) => (
          <div key={education.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={education.institution || education.degree || 'Untitled'}
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

        <AddEntryButton onClick={addEducation} label="Add education" />
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

export default EducationForm;
