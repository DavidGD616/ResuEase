import { useState } from 'react';
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
      <FormHeader title="Internships" onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        Include internships and temporary positions that demonstrate your skills and experience. Focus on what you learned and accomplished during these roles.
      </FormDescription>

      <FormSection>
        {internships.map((internship) => (
          <div key={internship.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={internship.jobTitle || internship.company || 'Untitled'}
              isExpanded={expandedItems[internship.id]}
              onToggleExpanded={() => toggleExpanded(internship.id)}
              onRemove={() => removeInternship(internship.id)}
            />

            {expandedItems[internship.id] && (
              <InternshipEntryForm
                internship={internship}
                onUpdate={updateInternship}
              />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addInternship} label="Add internship" />
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

export default InternshipsForm;
