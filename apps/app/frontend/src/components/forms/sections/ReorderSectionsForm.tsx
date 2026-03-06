import { useState, useRef } from 'react';
import { ChevronLeft, GripVertical, Lock, Trash2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDragDrop } from '../../../hooks/useDragDrop';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import Modal from '../../ui/Modal';
import type { SidebarItem } from '../../../types/resume';

interface ReorderSectionsFormProps {
  sidebarItems: SidebarItem[];
  onReorderItems: (items: SidebarItem[]) => void;
  onBack: () => void;
  onDone: () => void;
  onDeleteSection: (id: string) => void;
  onAddSectionClick: () => void;
  activeSection: string;
  onSectionChange: (id: string) => void;
}

function ReorderSectionsForm({
  sidebarItems,
  onReorderItems,
  onBack,
  onDone,
  onDeleteSection,
  onAddSectionClick,
  activeSection,
  onSectionChange,
}: ReorderSectionsFormProps) {
  const { t } = useTranslation();
  const dragFromHandle = useRef(false);

  const [pendingDelete, setPendingDelete] = useState<{ id: string | null; label: string }>({
    id: null,
    label: '',
  });

  const deleteModal = useDeleteModal(() => {
    if (pendingDelete.id) {
      onDeleteSection(pendingDelete.id);
      setPendingDelete({ id: null, label: '' });
    }
  });

  const handleDeleteClick = (sectionId: string, sectionLabel: string) => {
    setPendingDelete({ id: sectionId, label: sectionLabel });
    deleteModal.openModal();
  };

  const {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getPreviewItems,
    isDragging,
  } = useDragDrop(sidebarItems, onReorderItems, {
    canDrag: (item) => !item.fixed,
    canDrop: (index, items) => !items[index]?.fixed,
    updateOrder: true,
    orderKey: 'order',
  });

  const previewItems = getPreviewItems();

  return (
    <div className="flex-1 p-4 sm:p-6 w-full sm:max-w-2xl mx-auto">
      <div className="bg-white rounded-md sm:rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base transition-colors"
            style={{ color: 'var(--ink-2)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-2)')}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t('reorder.back')}</span>
          </button>

          <button
            onClick={onDone}
            className="px-4 sm:px-6 py-1.5 sm:py-2 text-white rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
            style={{ background: 'var(--accent)' }}
          >
            {t('reorder.done')}
          </button>
        </div>

        {/* Sections List */}
        <div className="p-3 sm:p-4">
          {previewItems.map((item, previewIndex) => {
            const originalIndex = sidebarItems.findIndex((origItem) => origItem.id === item.id);
            const Icon = item.icon;
            const itemIsDragging = isDragging(originalIndex);
            const canDrag = !item.fixed;
            const itemLabel = item.labelKey ? t(item.labelKey) : item.label;

            return (
              <div
                key={item.id}
                data-drop-index={previewIndex}
                draggable={canDrag}
                onDragStart={(e) => {
                  if (!dragFromHandle.current) { e.preventDefault(); return; }
                  handleDragStart(e, item, originalIndex);
                }}
                onDragOver={(e) => handleDragOver(e, previewIndex)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, previewIndex)}
                onDragEnd={() => { dragFromHandle.current = false; handleDragEnd(); }}
                onTouchStart={canDrag ? (e) => {
                  if (!(e.target as Element).closest('[data-drag-handle]')) return;
                  handleTouchStart(e, item, originalIndex);
                } : undefined}
                onTouchMove={canDrag ? handleTouchMove : undefined}
                onTouchEnd={canDrag ? handleTouchEnd : undefined}
                onClick={() => onSectionChange(item.id)}
                className={`
                  flex items-center justify-between p-3 sm:p-4 rounded-md sm:rounded-lg mb-2 cursor-pointer
                  ${itemIsDragging ? 'opacity-50' : ''}
                  transition-all duration-200
                `}
                style={{
                  userSelect: 'none',
                  touchAction: 'auto',
                  ...(activeSection === item.id
                    ? { border: '1px solid rgba(37,99,235,0.3)', backgroundColor: 'var(--accent-dim)' }
                    : item.fixed
                    ? { backgroundColor: 'var(--surface)' }
                    : { border: '1px solid var(--border)', backgroundColor: 'white' }),
                }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {canDrag ? (
                    <GripVertical
                      data-drag-handle
                      className="w-4 h-4 sm:w-5 sm:h-5 cursor-grab active:cursor-grabbing"
                      style={{ color: 'var(--ink-3)', touchAction: 'none' }}
                      onMouseDown={() => { dragFromHandle.current = true; }}
                      onMouseUp={() => { dragFromHandle.current = false; }}
                    />
                  ) : (
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: 'var(--ink-3)' }} />
                  )}
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--ink-2)' }} />
                  <span className="font-medium text-sm sm:text-base" style={{ color: 'var(--ink)' }}>{itemLabel}</span>
                </div>

                {canDrag && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(item.id, itemLabel); }}
                    className="p-1.5 sm:p-2 rounded transition-colors"
                    style={{ color: 'var(--ink-3)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-3)'; e.currentTarget.style.backgroundColor = ''; }}
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
            className="flex items-center gap-1.5 p-2 text-sm font-medium transition-colors mt-2"
            style={{ color: 'var(--ink-3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}
          >
            <Plus className="w-4 h-4" />
            <span>{t('reorder.addSection')}</span>
          </button>
        </div>
      </div>

      {/* Delete Section Modal */}
      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
        title={t('reorder.deleteTitle', { sectionLabel: pendingDelete.label })}
        message={t('reorder.deleteMessage')}
        confirmText={t('reorder.deleteConfirm')}
        cancelText={t('reorder.deleteCancel')}
      />
    </div>
  );
}

export default ReorderSectionsForm;
