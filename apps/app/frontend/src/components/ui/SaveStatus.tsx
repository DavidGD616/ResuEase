import { Check, Loader2, AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type SaveStatusValue = 'saving' | 'saved' | 'error';

interface SaveStatusProps {
  status: SaveStatusValue | undefined;
}

interface StatusConfig {
  icon: LucideIcon;
  text: string;
  color: string;
  spin?: boolean;
}

function SaveStatus({ status }: SaveStatusProps) {
  const getStatusConfig = (): StatusConfig | null => {
    switch (status) {
      case 'saving':
        return { icon: Loader2, text: 'Saving...', color: 'var(--ink-3)', spin: true };
      case 'saved':
        return { icon: Check, text: 'Saved', color: '#16a34a' };
      case 'error':
        return { icon: AlertCircle, text: 'Error saving', color: 'var(--danger)' };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (!config) return null;

  const { icon: Icon, text, color, spin } = config;

  return (
    <div
      className="inline-flex items-center gap-1 bg-white rounded-full px-2.5 py-1 text-xs"
      style={{ border: '1px solid var(--border)', color }}
    >
      <Icon className={`w-3 h-3 ${spin ? 'animate-spin' : ''}`} />
      {text}
    </div>
  );
}

export default SaveStatus;
