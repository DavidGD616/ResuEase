import { Plus } from 'lucide-react';

interface AddEntryButtonProps {
  onClick: () => void;
  label: string;
}

function AddEntryButton({ onClick, label }: AddEntryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-gray-400 hover:bg-gray-100 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-2 text-gray-600 font-medium">
        <Plus className="w-5 h-5" />
        {label}
      </div>
    </button>
  );
}

export default AddEntryButton;
