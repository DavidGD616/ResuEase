import { useState } from 'react';

export const useDragDrop = (items, onReorderItems) => {
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
      const newItems = [...items];
      const [draggedElement] = newItems.splice(draggedItem.index, 1);
      newItems.splice(dropIndex, 0, draggedElement);
      
      // Update order property for all items
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
      return items;
    }

    const itemsCopy = [...items];
    const draggedElement = itemsCopy[draggedItem.index];
    
    // Remove dragged item from its current position
    itemsCopy.splice(draggedItem.index, 1);
    
    // Insert at new position (adjust index if needed)
    const adjustedDropIndex = dragOverIndex > draggedItem.index ? dragOverIndex - 1 : dragOverIndex;
    itemsCopy.splice(adjustedDropIndex, 0, draggedElement);
    
    return itemsCopy;
  };

  const isDragging = (originalIndex) => draggedItem?.index === originalIndex;

  return {
    draggedItem,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getPreviewItems,
    isDragging,
  };
};