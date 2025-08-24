import { useState, useRef } from 'react';

export const useDragDrop = (items, onReorderItems, options = {}) => {
  const {
    canDrag = () => true,
    canDrop = () => true,
    updateOrder = true,
    orderKey = 'order',
  } = options;

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
  const [dragPreview, setDragPreview] = useState({ element: null, position: { x: 0, y: 0 } });
  const dragPreviewRef = useRef(null);

  const createDragPreview = (element, touch) => {
    // Clone the element for the preview
    const clone = element.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.top = `${touch.clientY - touchOffset.y}px`;
    clone.style.left = `${touch.clientX - touchOffset.x}px`;
    clone.style.width = `${element.offsetWidth}px`;
    clone.style.height = `${element.offsetHeight}px`;
    clone.style.pointerEvents = 'none';
    clone.style.zIndex = '9999';
    clone.style.opacity = '0.9';
    clone.style.transform = 'scale(1.02)';
    clone.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
    clone.style.borderRadius = '8px';
    clone.style.backgroundColor = '#ffffff';
    clone.style.transition = 'none'; // Remove any transitions for immediate response
    
    document.body.appendChild(clone);
    return clone;
  };

  const updateDragPreview = (element, touch) => {
    if (element) {
      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        element.style.top = `${touch.clientY - touchOffset.y}px`;
        element.style.left = `${touch.clientX - touchOffset.x}px`;
      });
    }
  };

  const removeDragPreview = (element) => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  };

  const handleDragStart = (e, item, index) => {
    if (!canDrag(item, index, items)) {
      e.preventDefault();
      return;
    }
    setDraggedItem({ item, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTouchStart = (e, item, index) => {
    if (!canDrag(item, index, items)) {
      return;
    }
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    
    setDraggedItem({ item, index });
    setTouchOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });

    // Create and store the drag preview immediately
    const preview = createDragPreview(e.currentTarget, touch);
    dragPreviewRef.current = preview;
    setDragPreview({ 
      element: preview, 
      position: { x: touch.clientX, y: touch.clientY } 
    });
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling
    
    if (!draggedItem || !dragPreviewRef.current) return;
    
    const touch = e.touches[0];
    
    // Update drag preview position immediately
    updateDragPreview(dragPreviewRef.current, touch);
    setDragPreview(prev => ({ 
      ...prev, 
      position: { x: touch.clientX, y: touch.clientY } 
    }));
    
    // Check for drop zone
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (elementBelow) {
      const dropZone = elementBelow.closest('[data-drop-index]');
      if (dropZone) {
        const dropIndex = parseInt(dropZone.getAttribute('data-drop-index'));
        if (canDrop(dropIndex, items, draggedItem)) {
          setDragOverIndex(dropIndex);
        }
      } else {
        setDragOverIndex(null);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (!draggedItem) return;
    
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Remove drag preview immediately
    if (dragPreviewRef.current) {
      removeDragPreview(dragPreviewRef.current);
      dragPreviewRef.current = null;
    }
    setDragPreview({ element: null, position: { x: 0, y: 0 } });
    
    if (elementBelow) {
      const dropZone = elementBelow.closest('[data-drop-index]');
      if (dropZone) {
        const dropIndex = parseInt(dropZone.getAttribute('data-drop-index'));
        
        if (canDrop(dropIndex, items, draggedItem) && draggedItem.index !== dropIndex) {
          const newItems = [...items];
          const [draggedElement] = newItems.splice(draggedItem.index, 1);
          newItems.splice(dropIndex, 0, draggedElement);
          
          let updatedItems = newItems;
          if (updateOrder) {
            updatedItems = newItems.map((item, index) => ({
              ...item,
              [orderKey]: index
            }));
          }
          
          onReorderItems(updatedItems);
        }
      }
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
    setTouchOffset({ x: 0, y: 0 });
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    
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
    
    if (!canDrop(dropIndex, items, draggedItem)) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }
    
    if (draggedItem && draggedItem.index !== dropIndex) {
      const newItems = [...items];
      const [draggedElement] = newItems.splice(draggedItem.index, 1);
      newItems.splice(dropIndex, 0, draggedElement);
      
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
    
    // Clean up any remaining drag preview
    if (dragPreviewRef.current) {
      removeDragPreview(dragPreviewRef.current);
      dragPreviewRef.current = null;
      setDragPreview({ element: null, position: { x: 0, y: 0 } });
    }
  };

  const getPreviewItems = () => {
    if (!draggedItem || dragOverIndex === null) {
      return items;
    }

    const itemsCopy = [...items];
    const draggedElement = itemsCopy[draggedItem.index];
    
    itemsCopy.splice(draggedItem.index, 1);
    
    const adjustedDropIndex = dragOverIndex > draggedItem.index ? dragOverIndex - 1 : dragOverIndex;
    itemsCopy.splice(adjustedDropIndex, 0, draggedElement);
    
    return itemsCopy;
  };

  const isDragging = (originalIndex) => draggedItem?.index === originalIndex;

  return {
    draggedItem,
    dragOverIndex,
    touchOffset,
    dragPreview,
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
  };
};