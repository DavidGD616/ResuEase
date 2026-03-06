import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Mail, FileX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
    { id: 'resume', icon: FileText, label: t('home.createDropdown.newResume') },
    { id: 'cover-letter', icon: Mail, label: t('home.createDropdown.newCoverLetter') },
    { id: 'resignation-letter', icon: FileX, label: t('home.createDropdown.newResignationLetter') },
  ];

  const comingSoon = new Set(['cover-letter', 'resignation-letter']);

  return (
    <div
      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg py-2 z-50"
      style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.10)', border: '1px solid var(--border)' }}
    >
      <div ref={dropdownRef}>
        {items.map((item) => {
          const Icon = item.icon;
          const disabled = comingSoon.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              disabled={disabled}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-dim)'; }}
              onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = ''; }}
            >
              <Icon className="w-5 h-5" style={{ color: 'var(--ink-3)' }} />
              <div>
                <span className="text-sm" style={{ color: 'var(--ink-2)' }}>{item.label}</span>
                {disabled && <p className="text-xs mt-0.5" style={{ color: 'var(--ink-3)' }}>{t('home.createDropdown.comingSoon')}</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CreateDropdown;
