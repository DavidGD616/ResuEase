import { useDeleteModal } from '../../../hooks/useDeleteModal';
import Modal from '../../ui/Modal';
import { FormHeader, FormDescription, FormTextarea } from '../shared/FormComponents';

function ProfessionalSummaryForm({ formData, handleInputChange, onDeleteSection }) {
  const deleteModal = useDeleteModal(onDeleteSection)

  return (
    <div>
      <FormHeader title="Professional summary" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        Include your professional title, years of experience, and your most impressive achievements. Each achievement should be measurable and expressed in numbers.
      </FormDescription>
      
      <FormTextarea
        label="Summary"
        value={formData.about}
        onChange={(e) => handleInputChange('about', e.target.value)}
        rows="6"
        placeholder="e.g. Passionate frontend developer with 3+ years of experience..."
      />

      <Modal.Confirmation 
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
        confirmText='Delete Section'
      />
    </div>
  );
}

export default ProfessionalSummaryForm;