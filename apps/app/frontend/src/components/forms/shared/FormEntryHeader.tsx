import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FormEntryHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onRemove: () => void;
}

function FormEntryHeader({ title, isExpanded, onToggleExpanded, onRemove }: FormEntryHeaderProps) {
  const { t } = useTranslation();
  return (
    <div
      className="flex items-center justify-between p-3 sm:p-4 bg-white hover:bg-gray-50/50 transition-colors"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3">
        <h3 className="font-medium" style={{ color: 'var(--ink)' }}>
          {title || t('common.untitled')}
        </h3>
        <button
          onClick={onToggleExpanded}
          className="p-1 transition-colors"
          style={{ color: 'var(--ink-3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink-2)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}
        >
          {isExpanded ?
            <ChevronUp className="w-4 h-4" /> :
            <ChevronDown className="w-4 h-4" />
          }
        </button>
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded transition-colors"
        style={{ color: 'var(--ink-3)' }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-3)'; e.currentTarget.style.backgroundColor = ''; }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default FormEntryHeader;
