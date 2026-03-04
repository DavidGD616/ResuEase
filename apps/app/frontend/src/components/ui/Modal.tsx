import { useEffect } from 'react';
import type { FC, ReactNode, MouseEvent } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  icon?: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

interface ChildrenClassNameProps {
  children?: ReactNode;
  className?: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: ReactNode;
}

const sizes: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
};

type ModalType = FC<ModalProps> & {
  Header: FC<ChildrenClassNameProps>;
  Body: FC<ChildrenClassNameProps>;
  Footer: FC<ChildrenClassNameProps>;
  Confirmation: FC<ConfirmationModalProps>;
  Hint: FC<HintModalProps>;
};

const Modal: ModalType = ({
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
  iconColor = 'text-red-600',
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={handleOverlayClick}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full ${sizes[size]} bg-white rounded-xl shadow-xl
            transform transition-all ${className}
          `}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 transition-colors"
              style={{ color: 'var(--ink-3)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}
            >
              <X className="w-6 h-6" />
            </button>
          )}

          <div className="p-6 pt-10 sm:p-8 sm:pt-12 text-center">
            {icon && (
              <div className="mx-auto mb-4">
                <div className={`w-14 h-14 ${iconBgColor} rounded-full flex items-center justify-center mx-auto`}>
                  <div className={`w-7 h-7 ${iconColor}`}>
                    {icon}
                  </div>
                </div>
              </div>
            )}

            {title && (
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--ink)' }}>
                {title}
              </h3>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalHeader: FC<ChildrenClassNameProps> = ({ children, className = '' }) => (
  <div className={`text-center mb-6 ${className}`}>
    {children}
  </div>
);

const ModalBody: FC<ChildrenClassNameProps> = ({ children, className = '' }) => (
  <div className={`text-center mb-8 ${className}`} style={{ color: 'var(--ink-3)' }}>
    {children}
  </div>
);

const ModalFooter: FC<ChildrenClassNameProps> = ({ children, className = '' }) => (
  <div className={`flex flex-col sm:flex-row gap-3 justify-center ${className}`}>
    {children}
  </div>
);

const ConfirmationModal: FC<ConfirmationModalProps> = ({
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
        className="px-8 py-3 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors min-w-30"
        style={{ border: '1px solid var(--border-strong)', color: 'var(--ink-2)' }}
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        className="px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors min-w-30"
      >
        {confirmText}
      </button>
    </Modal.Footer>
  </Modal>
);

const HintModal: FC<HintModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={title}
    >
      <Modal.Body className='text-left'>
        {description}
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={onClose}
          className="px-6 py-2 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          style={{ background: 'var(--accent)' }}
        >
          {t('common.gotIt')}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Confirmation = ConfirmationModal;
Modal.Hint = HintModal;

export default Modal;
