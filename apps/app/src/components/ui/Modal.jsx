import { useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  icon,
  iconBgColor = 'bg-red-100',
  iconColor = 'text-red-600'
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black opacity-30 transition-opacity"
        onClick={handleOverlayClick}
      />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`
            relative w-full ${sizes[size]} bg-white rounded-3xl shadow-xl 
            transform transition-all ${className}
          `}
        >
          {/* Close button in top-right corner */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
          
          {/* Content */}
          <div className="p-8 pt-12 text-center">
            {/* Icon */}
            {icon && (
              <div className="mx-auto mb-8">
                <div className={`w-20 h-20 ${iconBgColor} rounded-full flex items-center justify-center mx-auto`}>
                  <div className={`w-8 h-8 ${iconColor}`}>
                    {icon}
                  </div>
                </div>
              </div>
            )}
            
            {/* Title */}
            {title && (
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {title}
              </h3>
            )}
            
            {/* Children content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal components for better composition
const ModalHeader = ({ children, className = '' }) => (
  <div className={`text-center mb-6 ${className}`}>
    {children}
  </div>
);

const ModalBody = ({ children, className = '' }) => (
  <div className={`text-center mb-8 text-gray-600 ${className}`}>
    {children}
  </div>
);

const ModalFooter = ({ children, className = '' }) => (
  <div className={`flex flex-col sm:flex-row gap-3 justify-center ${className}`}>
    {children}
  </div>
);

// Specific modal for confirmations
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Are you sure you want to delete this section?",
  message = "You can't undo this action.",
  confirmText = "Delete",
  cancelText = "Cancel",
}) => (
  <Modal 
    isOpen={isOpen} 
    onClose={onClose} 
    size="sm"
    icon={<Trash2 className="w-8 h-8" />}
    iconBgColor="bg-red-100"
    iconColor="text-red-600"
    title={title}
  >
    <Modal.Body>
      {message}
    </Modal.Body>
    <Modal.Footer>
      <button
        onClick={onClose}
        className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors min-w-[120px]"
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        className="px-8 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors min-w-[120px]"
      >
        {confirmText}
      </button>
    </Modal.Footer>
  </Modal>
);

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Confirmation = ConfirmationModal;

export default Modal;