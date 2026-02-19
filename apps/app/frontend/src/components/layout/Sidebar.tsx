import { Plus, GripVertical } from 'lucide-react';
import { useDragDrop } from '../../hooks/useDragDrop';
import type { SidebarItem } from '../../types/resume';

interface SidebarProps {
  sidebarItems: SidebarItem[];
  activeSection: string;
  setActiveSection: (id: string) => void;
  sidebarOpen: boolean;
  onReorderItems: (items: SidebarItem[]) => void;
  onAdditionalSectionClick: () => void;
}

function Sidebar({
  sidebarItems,
  activeSection,
  setActiveSection,
  sidebarOpen,
  onReorderItems,
  onAdditionalSectionClick,
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
    <div className={`
        ${sidebarOpen ? 'block fixed z-50' : 'hidden'}
        lg:block
        w-80 lg:w-1/5 bg-white border-r border-gray-200 min-h-screen
      `}>
      <div className="p-4 space-y-1">
        {previewItems.map((item, previewIndex) => {
          const originalIndex = sidebarItems.findIndex((origItem) => origItem.id === item.id);
          const Icon = item.icon;
          const itemIsDragging = isDragging(originalIndex);
          const canDrag = !item.fixed;

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
              onTouchStart={canDrag ? (e) => handleTouchStart(e, item, originalIndex) : undefined}
              onTouchMove={canDrag ? handleTouchMove : undefined}
              onTouchEnd={canDrag ? handleTouchEnd : undefined}
              className={`
                group relative ${canDrag ? 'cursor-move' : 'cursor-default'}
                ${itemIsDragging ? 'opacity-50 scale-95' : ''}
                ${itemIsDragging ? 'transition-all duration-200' : 'transition-all duration-300'}
              `}
              style={{
                userSelect: 'none',
                touchAction: canDrag ? 'none' : 'auto',
              }}
            >
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm relative ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {canDrag ? (
                  <GripVertical className="w-4 h-4 text-gray-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-4 h-4" />
                )}
                <Icon className="w-4 h-4" />
                {item.label}

                {itemIsDragging && (
                  <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none opacity-60" />
                )}
              </button>
            </div>
          );
        })}
        <button
          onClick={onAdditionalSectionClick}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm ${
            activeSection === 'additional'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
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
