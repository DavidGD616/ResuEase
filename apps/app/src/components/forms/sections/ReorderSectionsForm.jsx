import { useState } from 'react';
import { ChevronLeft, GripVertical, Lock, Trash2, Plus } from 'lucide-react';
import { useDragDrop } from '../../../hooks/useDragDrop';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import Modal from '../../ui/Modal';

function ReorderSectionsForm({ 
  sidebarItems, 
  onReorderItems, 
  onBack, 
  onDone,
  onDeleteSection,
  onAddSectionClick 
}) {
  const [pendingDelete, setPendingDelete] = useState({ id: null, label: '' });
  
  const deleteModal = useDeleteModal(() => {
    if (pendingDelete.id) {
      onDeleteSection(pendingDelete.id);
      setPendingDelete({ id: null, label: '' });
    }
  });

  const handleDeleteClick = (sectionId, sectionLabel) => {
    setPendingDelete({ id: sectionId, label: sectionLabel });
    deleteModal.openModal();
  };

  const {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getPreviewItems,
    isDragging,
  } = useDragDrop(sidebarItems, onReorderItems, {
    canDrag: (item) => !item.fixed,
    canDrop: (index, items) => !items[index]?.fixed,
    updateOrder: true,
    orderKey: 'order'
  });

  const previewItems = getPreviewItems();

  return (
    <div className="flex-1 p-4 sm:p-6 w-full sm:max-w-2xl mx-auto">
      <div className="bg-white rounded-md sm:rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </button>
          
          <button
            onClick={onDone}
            className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium text-sm sm:text-base"
          >
            Done
          </button>
        </div>

        {/* Sections List */}
        <div className="p-3 sm:p-4">
          {previewItems.map((item, previewIndex) => {
            const originalIndex = sidebarItems.findIndex(origItem => origItem.id === item.id);
            const Icon = item.icon;
            const itemIsDragging = isDragging(originalIndex);
            const canDrag = !item.fixed;
            
            return (
              <div
                key={item.id}
                draggable={canDrag}
                onDragStart={(e) => handleDragStart(e, item, originalIndex)}
                onDragOver={(e) => handleDragOver(e, previewIndex)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, previewIndex)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center justify-between p-3 sm:p-4 rounded-md sm:rounded-lg mb-2
                  ${item.fixed ? 'bg-gray-50' : 'bg-white border border-gray-200'}
                  ${itemIsDragging ? 'opacity-50' : ''}
                  ${canDrag ? 'cursor-move' : 'cursor-default'}
                  transition-all duration-200
                `}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {canDrag ? (
                    <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  ) : (
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  )}
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium text-sm sm:text-base">{item.label}</span>
                </div>
                
                {canDrag && (
                  <button
                    onClick={() => handleDeleteClick(item.id, item.label)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            );
          })}
          
          {/* Add section button */}
          <button
            onClick={onAddSectionClick}
            className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-md sm:rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors mt-2"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <span className="text-gray-600 text-sm sm:text-base">Add section</span>
          </button>
        </div>
      </div>

      {/* Delete Section Modal */}
      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
        title={`Delete ${pendingDelete.label}?`}
        message="This will permanently remove this section and all its content."
        confirmText="Delete Section"
        cancelText="Cancel"
      />
    </div>
  );
}

export default ReorderSectionsForm;