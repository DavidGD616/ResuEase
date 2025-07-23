import { useState } from 'react';
import { Plus, GripVertical } from 'lucide-react';

function Sidebar({ sidebarItems, activeSection, setActiveSection, sidebarOpen, onReorderItems }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, item, index) => {
    // Only allow dragging if item is not fixed
    if (item.fixed) {
      e.preventDefault();
      return;
    }
    setDraggedItem({ item, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    // Only allow dropping on non-fixed items (index >= 3)
    if (index < 3) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    // Prevent dropping on fixed items
    if (dropIndex < 3) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }
    
    if (draggedItem && draggedItem.index !== dropIndex) {
      const newItems = [...sidebarItems];
      const [draggedElement] = newItems.splice(draggedItem.index, 1);
      newItems.splice(dropIndex, 0, draggedElement);
      
      // Update order property only for non-fixed items
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index
      }));
      
      onReorderItems(updatedItems);
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  // Create preview array without actually modifying the original
  const getPreviewItems = () => {
    if (!draggedItem || dragOverIndex === null) {
      return sidebarItems;
    }

    const items = [...sidebarItems];
    const draggedElement = items[draggedItem.index];
    
    // Remove dragged item from its current position
    items.splice(draggedItem.index, 1);
    
    // Insert at new position (adjust index if needed)
    const adjustedDropIndex = dragOverIndex > draggedItem.index ? dragOverIndex - 1 : dragOverIndex;
    items.splice(adjustedDropIndex, 0, draggedElement);
    
    return items;
  };

  const previewItems = getPreviewItems();

  return (
    <div className={`
        ${sidebarOpen ? 'block fixed z-50' : 'hidden'}
        lg:block
        w-1/4 bg-white border-r border-gray-200 min-h-screen
      `}>
      <div className="p-4 space-y-1">
        {previewItems.map((item, previewIndex) => {
          const originalIndex = sidebarItems.findIndex(origItem => origItem.id === item.id);
          const Icon = item.icon;
          const isDragging = draggedItem?.index === originalIndex;
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
                group relative ${canDrag ? 'cursor-move' : 'cursor-default'}
                ${isDragging ? 'opacity-50 scale-95' : ''}
                ${isDragging ? 'transition-all duration-200' : 'transition-all duration-300'}
                ${draggedItem && !isDragging ? 'transform' : ''}
              `}
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
                
                {/* Preview indicator */}
                {isDragging && (
                  <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none opacity-60" />
                )}
              </button>
            </div>
          );
        })}
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-gray-500 hover:bg-gray-50">
          <div className="w-4 h-4" />
          <Plus className="w-4 h-4" />
          Additional section
        </button>
      </div>
    </div>
  );
}

export default Sidebar;