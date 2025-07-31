import { Trash2 } from 'lucide-react';
import RichTextEditor from '../shared/RichTextEditor';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function HobbiesForm({ formData, handleInputChange, onDeleteSection }) {
  const deleteModal = useDeleteModal(onDeleteSection);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Hobbies</h1>
        <button 
          onClick={deleteModal.openModal}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-8">
        Showcase your passion and highlight your achievements, such as special projects completed, unique skills developed, or notable experiences gained.
      </p>
      
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