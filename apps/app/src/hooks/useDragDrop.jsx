import { useState } from 'react';

export const useDragDrop = (items, onReorderItems, options = {}) => {
  const {
    canDrag = () => true,                    // Function to determine if item can be dragged
    canDrop = () => true,                    // Function to determine if can drop at index
    updateOrder = true,                      // Whether to update order property
    orderKey = 'order',                      // Property name for order (could be 'position', 'index', etc.)
  } = options;

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, item, index) => {
    // Check if item can be dragged using the provided function
    if (!canDrag(item, index, items)) {
      e.preventDefault();
      return;
    }
    setDraggedItem({ item, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    // Check if can drop at this index using the provided function
    if (!canDrop(index, items, draggedItem)) {
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
    
    // Check if can drop at this index
    if (!canDrop(dropIndex, items, draggedItem)) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }
    
    if (draggedItem && draggedItem.index !== dropIndex) {
      const newItems = [...items];
      const [draggedElement] = newItems.splice(draggedItem.index, 1);
      newItems.splice(dropIndex, 0, draggedElement);
      
      // Update order property if enabled
      let updatedItems = newItems;
      if (updateOrder) {
        updatedItems = newItems.map((item, index) => ({
          ...item,
          [orderKey]: index
        }));
      }
      
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