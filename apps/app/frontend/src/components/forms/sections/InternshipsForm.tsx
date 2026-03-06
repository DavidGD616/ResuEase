import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import InternshipEntryForm from '../entries/InternshipEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import type { FormData, InternshipItem } from '../../../types/resume';

interface InternshipsFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

function InternshipsForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: InternshipsFormProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const internships = (formData.internships || []) as (InternshipItem & { id: string })[];

  const addInternship = () => {
    const newItemId = addSectionItem('internships');
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeInternship = (id: string) => {
    removeSectionItem('internships', id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateInternship = (id: string, field: string, value: unknown) => {
    updateSectionItem('internships', id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <FormHeader title={t('forms.internships.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.internships.description')}
      </FormDescription>

      <FormSection>
        {internships.map((internship) => (
          <div key={internship.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={internship.jobTitle || internship.company || t('common.untitled')}
              isExpanded={expandedItems[internship.id]}
              onToggleExpanded={() => toggleExpanded(internship.id)}
              onRemove={() => removeInternship(internship.id)}
            />

            {expandedItems[internship.id] && (
              <InternshipEntryForm
                internship={internship}
                onUpdate={updateInternship}
                jobTitle={formData.jobTitle}
              />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addInternship} label={t('forms.internships.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default InternshipsForm;
