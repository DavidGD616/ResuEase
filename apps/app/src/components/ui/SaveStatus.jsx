import { Check, Clock, AlertCircle } from 'lucide-react';

function SaveStatus({ status }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Clock,
          text: 'Saving...',
        };
      case 'saved':
        return {
          icon: Check,
          text: 'Saved',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Error saving',
          className: 'text-red-600'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  
  if (!config) return null;

  const { icon: Icon, text, className } = config;

  return (
    <div className={`flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1.5 text-sm ${className}`}>
      <Icon className="w-3 h-3" />
      {text}
    </div>
  );
}

export default SaveStatus;