import { useState } from 'react';

export const useDeleteModal = (onConfirm: () => void) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const confirmDelete = () => {
    onConfirm();
    closeModal();
  };

  return { isOpen, openModal, closeModal, confirmDelete };
};
