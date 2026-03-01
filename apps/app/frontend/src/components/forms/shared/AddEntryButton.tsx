import { Plus } from 'lucide-react';

interface AddEntryButtonProps {
  onClick: () => void;
  label: string;
}

function AddEntryButton({ onClick, label }: AddEntryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 py-2 text-sm font-medium transition-colors hover:text-blue-600"
      style={{ color: 'var(--ink-3)' }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

export default AddEntryButton;
