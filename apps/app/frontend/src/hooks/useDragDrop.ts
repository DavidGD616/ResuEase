import { useState, useRef } from 'react';
import type React from 'react';

interface DraggedItem<T> {
  item: T;
  index: number;
}

interface DragPreview {
  element: HTMLElement | null;
  position: { x: number; y: number };
}

interface TouchOffset {
  x: number;
  y: number;
}

interface UseDragDropOptions<T> {
  canDrag?: (item: T, index: number, items: T[]) => boolean;
  canDrop?: (index: number, items: T[], draggedItem: DraggedItem<T> | null) => boolean;
  updateOrder?: boolean;
  orderKey?: string;
}

export const useDragDrop = <T extends object>(
  items: T[],
  onReorderItems: (items: T[]) => void,
  options: UseDragDropOptions<T> = {}
) => {
  const {
    canDrag = () => true,
    canDrop = () => true,
    updateOrder = true,
    orderKey = 'order',
  } = options;

  const [draggedItem, setDraggedItem] = useState<DraggedItem<T> | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchOffset, setTouchOffset] = useState<TouchOffset>({ x: 0, y: 0 });
  const [dragPreview, setDragPreview] = useState<DragPreview>({
    element: null,
    position: { x: 0, y: 0 },
  });
  const dragPreviewRef = useRef<HTMLElement | null>(null);

  const createDragPreview = (element: HTMLElement, touch: React.Touch): HTMLElement => {
    const clone = element.cloneNode(true) as HTMLElement;
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
    clone.style.transition = 'none';
    document.body.appendChild(clone);
    return clone;
  };

  const updateDragPreviewPosition = (element: HTMLElement, touch: React.Touch): void => {
    requestAnimationFrame(() => {
      element.style.top = `${touch.clientY - touchOffset.y}px`;
      element.style.left = `${touch.clientX - touchOffset.x}px`;
    });
  };

  const removeDragPreview = (element: HTMLElement): void => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: T, index: number): void => {
    if (!canDrag(item, index, items)) {
      e.preventDefault();
      return;
    }
    setDraggedItem({ item, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTouchStart = (e: React.TouchEvent, item: T, index: number): void => {
    if (!canDrag(item, index, items)) return;

    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    setDraggedItem({ item, index });
    setTouchOffset({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });

    const preview = createDragPreview(e.currentTarget as HTMLElement, touch);
    dragPreviewRef.current = preview;
    setDragPreview({ element: preview, position: { x: touch.clientX, y: touch.clientY } });
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    e.preventDefault();
    if (!draggedItem || !dragPreviewRef.current) return;

    const touch = e.touches[0];
    updateDragPreviewPosition(dragPreviewRef.current, touch);
    setDragPreview((prev) => ({ ...prev, position: { x: touch.clientX, y: touch.clientY } }));

    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elementBelow) {
      const dropZone = (elementBelow as HTMLElement).closest('[data-drop-index]');
      if (dropZone) {
        const dropIndex = parseInt(dropZone.getAttribute('data-drop-index') ?? '0');
        if (canDrop(dropIndex, items, draggedItem)) {
          setDragOverIndex(dropIndex);
        }
      } else {
        setDragOverIndex(null);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent): void => {
    if (!draggedItem) return;

    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dragPreviewRef.current) {
      removeDragPreview(dragPreviewRef.current);
      dragPreviewRef.current = null;
    }
    setDragPreview({ element: null, position: { x: 0, y: 0 } });

    if (elementBelow) {
      const dropZone = (elementBelow as HTMLElement).closest('[data-drop-index]');
      if (dropZone) {
        const dropIndex = parseInt(dropZone.getAttribute('data-drop-index') ?? '0');

        if (canDrop(dropIndex, items, draggedItem) && draggedItem.index !== dropIndex) {
          const newItems = [...items];
          const [draggedElement] = newItems.splice(draggedItem.index, 1);
          newItems.splice(dropIndex, 0, draggedElement);

          const updatedItems = updateOrder
            ? newItems.map((item, index) => ({ ...item, [orderKey]: index } as T))
            : newItems;

          onReorderItems(updatedItems);
        }
      }
    }

    setDraggedItem(null);
    setDragOverIndex(null);
    setTouchOffset({ x: 0, y: 0 });
  };

  const handleDragOver = (e: React.DragEvent, index: number): void => {
    e.preventDefault();

    if (!canDrop(index, items, draggedItem)) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = (): void => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number): void => {
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

      const updatedItems = updateOrder
        ? newItems.map((item, index) => ({ ...item, [orderKey]: index } as T))
        : newItems;

      onReorderItems(updatedItems);
    }

    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = (): void => {
    setDraggedItem(null);
    setDragOverIndex(null);

    if (dragPreviewRef.current) {
      removeDragPreview(dragPreviewRef.current);
      dragPreviewRef.current = null;
      setDragPreview({ element: null, position: { x: 0, y: 0 } });
    }
  };

  const getPreviewItems = (): T[] => {
    if (!draggedItem || dragOverIndex === null) return items;

    const itemsCopy = [...items];
    const draggedElement = itemsCopy[draggedItem.index];

    itemsCopy.splice(draggedItem.index, 1);

    const adjustedDropIndex =
      dragOverIndex > draggedItem.index ? dragOverIndex - 1 : dragOverIndex;
    itemsCopy.splice(adjustedDropIndex, 0, draggedElement);

    return itemsCopy;
  };

  const isDragging = (originalIndex: number): boolean =>
    draggedItem?.index === originalIndex;

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
