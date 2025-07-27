import { Plus, Trash2 } from 'lucide-react';

function EmploymentHistoryForm() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Employment history</h1>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-8">
        Show employers your past experience and what you have accomplished. Include simple, clear examples with action verbs to demonstrate your skills.
      </p>
      
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-gray-400 hover:bg-gray-100 cursor-pointer transition-colors">
        <button className="flex items-center gap-2 text-gray-600 font-medium">
          <Plus className="w-5 h-5" />
          Add work experience
        </button>
      </div>
    </div>
  );
}

export default EmploymentHistoryForm;