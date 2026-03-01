import { Plus, GripVertical, X } from 'lucide-react';
import { useDragDrop } from '../../hooks/useDragDrop';
import type { SidebarItem } from '../../types/resume';

interface SidebarProps {
  sidebarItems: SidebarItem[];
  activeSection: string;
  setActiveSection: (id: string) => void;
  sidebarOpen: boolean;
  onReorderItems: (items: SidebarItem[]) => void;
  onAdditionalSectionClick: () => void;
  onClose?: () => void;
}

function Sidebar({
  sidebarItems,
  activeSection,
  setActiveSection,
  sidebarOpen,
  onReorderItems,
  onAdditionalSectionClick,
  onClose,
}: SidebarProps) {
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
    <div
      className={`
        ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'}
        lg:block lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto
        w-72 sm:w-80 lg:w-64 xl:w-72 bg-white
      `}
      style={{ borderRight: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-end p-2 lg:hidden">
        <button
          onClick={onClose}
          className="p-1 rounded-md transition-colors hover:bg-gray-100"
          style={{ color: 'var(--ink-2)' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 space-y-1 overflow-y-auto">
        {previewItems.map((item, previewIndex) => {
          const originalIndex = sidebarItems.findIndex((origItem) => origItem.id === item.id);
          const Icon = item.icon;
          const itemIsDragging = isDragging(originalIndex);
          const canDrag = !item.fixed;
          const isActive = activeSection === item.id;

          return (
            <div
              key={item.id}
              data-drop-index={previewIndex}
              draggable={canDrag}
              onDragStart={(e) => handleDragStart(e, item, originalIndex)}
              onDragOver={(e) => handleDragOver(e, previewIndex)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, previewIndex)}
              onDragEnd={handleDragEnd}
              onTouchStart={canDrag ? (e) => {
                if (!(e.target as Element).closest('[data-drag-handle]')) return;
                handleTouchStart(e, item, originalIndex);
              } : undefined}
              onTouchMove={canDrag ? handleTouchMove : undefined}
              onTouchEnd={canDrag ? handleTouchEnd : undefined}
              className={`
                group relative ${canDrag ? 'cursor-move' : 'cursor-default'}
                ${itemIsDragging ? 'opacity-50 scale-95' : ''}
                ${itemIsDragging ? 'transition-all duration-200' : 'transition-all duration-300'}
              `}
              style={{ userSelect: 'none', touchAction: 'auto' }}
            >
              <button
                onClick={() => setActiveSection(item.id)}
                className="w-full flex items-center gap-3 py-2 rounded-lg text-left text-sm relative transition-colors"
                style={isActive ? {
                  paddingLeft: 'calc(0.75rem - 2px)',
                  paddingRight: '0.75rem',
                  borderLeft: '2px solid var(--accent)',
                  backgroundColor: 'var(--accent-dim)',
                  color: 'var(--accent)',
                } : {
                  paddingLeft: '0.75rem',
                  paddingRight: '0.75rem',
                  color: 'var(--ink-2)',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '';
                }}
              >
                {canDrag ? (
                  <GripVertical
                    data-drag-handle
                    className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity"
                    style={{ color: isActive ? 'var(--accent)' : 'var(--ink-3)', touchAction: 'none' }}
                  />
                ) : (
                  <div className="w-4 h-4" />
                )}
                <Icon
                  className="w-4 h-4"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--ink-3)' }}
                />
                {item.label}

                {itemIsDragging && (
                  <div
                    className="absolute inset-0 border-2 border-dashed rounded-lg pointer-events-none"
                    style={{ borderColor: 'var(--accent)', opacity: 0.4 }}
                  />
                )}
              </button>
            </div>
          );
        })}
        <button
          onClick={onAdditionalSectionClick}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors"
          style={activeSection === 'additional' ? {
            paddingLeft: 'calc(0.75rem - 2px)',
            borderLeft: '2px solid var(--accent)',
            backgroundColor: 'var(--accent-dim)',
            color: 'var(--accent)',
          } : {
            color: 'var(--ink-3)',
          }}
          onMouseEnter={e => {
            if (activeSection !== 'additional') e.currentTarget.style.backgroundColor = '#f9fafb';
          }}
          onMouseLeave={e => {
            if (activeSection !== 'additional') e.currentTarget.style.backgroundColor = '';
          }}
        >
          <div className="w-4 h-4" />
          <Plus className="w-4 h-4" />
          Additional section
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
