import { Check, Clock, AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type SaveStatusValue = 'saving' | 'saved' | 'error';

interface SaveStatusProps {
  status: SaveStatusValue | undefined;
}

interface StatusConfig {
  icon: LucideIcon;
  text: string;
  className?: string;
}

function SaveStatus({ status }: SaveStatusProps) {
  const getStatusConfig = (): StatusConfig | null => {
    switch (status) {
      case 'saving':
        return { icon: Clock, text: 'Saving...' };
      case 'saved':
        return { icon: Check, text: 'Saved' };
      case 'error':
        return { icon: AlertCircle, text: 'Error saving', className: 'text-red-600' };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (!config) return null;

  const { icon: Icon, text, className } = config;

  return (
    <div className={`inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 ${className ?? ''}`}>
      <Icon className="w-3 h-3" />
      {text}
    </div>
  );
}

export default SaveStatus;
