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

  return (
    <div className={`
        ${sidebarOpen ? 'block' : 'hidden'}
        lg:block
        w-64 bg-white border-r border-gray-200 min-h-screen
      `}>
      <div className="p-4 space-y-1">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isDragging = draggedItem?.index === index;
          const isDragOver = dragOverIndex === index;
          const canDrag = !item.fixed;
          
          return (
            <div
              key={item.id}
              draggable={canDrag}
              onDragStart={(e) => handleDragStart(e, item, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                group relative ${canDrag ? 'cursor-move' : 'cursor-default'}
                ${isDragging ? 'opacity-50' : ''}
                ${isDragOver ? 'border-t-2 border-blue-500' : ''}
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
                  <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-4 h-4" /> /* Spacer for fixed items */
                )}
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            </div>
          );
        })}
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-gray-500 hover:bg-gray-50">
          <div className="w-4 h-4" /> {/* Spacer for alignment */}
          <Plus className="w-4 h-4" />
          Additional section
        </button>
      </div>
    </div>
  );
}

export default Sidebar;