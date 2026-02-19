import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Mail, FileX } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CreateDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DropdownItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

function CreateDropdown({ isOpen, onClose }: CreateDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleItemClick = (type: string) => {
    switch (type) {
      case 'resume':
        navigate('/resume-builder');
        break;
      case 'cover-letter':
        console.log('Cover letter builder coming soon');
        break;
      case 'resignation-letter':
        console.log('Resignation letter builder coming soon');
        break;
    }
    onClose();
  };

  if (!isOpen) return null;

  const items: DropdownItem[] = [
    { id: 'resume', icon: FileText, label: 'New resume' },
    { id: 'cover-letter', icon: Mail, label: 'New cover letter' },
    { id: 'resignation-letter', icon: FileX, label: 'New resignation letter' },
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
      <div ref={dropdownRef}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <Icon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CreateDropdown;
