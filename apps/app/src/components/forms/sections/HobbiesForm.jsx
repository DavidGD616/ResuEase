import { FormHeader, FormDescription } from '../shared/FormComponents';
import RichTextEditor from '../shared/RichTextEditor';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function HobbiesForm({ formData, handleInputChange, onDeleteSection }) {
  const deleteModal = useDeleteModal(onDeleteSection);

  return (
    <div>
      <FormHeader title="Hobbies" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        Showcase your passion and highlight your achievements, such as special projects completed, unique skills developed, or notable experiences gained.
      </FormDescription>
      
      <RichTextEditor
        value={formData.hobbies || ''}
        onChange={(e) => handleInputChange('hobbies', e.target.value)}
        placeholder="I love landscape and nature photography, and my work has been featured in a local gallery."
        label=""
      />

      {/* Delete Section Modal */}
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

export default HobbiesForm;