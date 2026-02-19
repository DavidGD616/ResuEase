import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

interface FormEntryHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onRemove: () => void;
}

function FormEntryHeader({ title, isExpanded, onToggleExpanded, onRemove }: FormEntryHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <h3 className="font-medium text-gray-900">
          {title || 'Untitled'}
        </h3>
        <button
          onClick={onToggleExpanded}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          {isExpanded ?
            <ChevronUp className="w-4 h-4" /> :
            <ChevronDown className="w-4 h-4" />
          }
        </button>
      </div>
      <button
        onClick={onRemove}
        className="p-1 text-gray-400 hover:text-gray-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default FormEntryHeader;
