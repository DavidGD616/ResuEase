import { Menu } from 'lucide-react';

function BottomNavigation() {
  return (
    <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <Menu className="w-4 h-4" />
        Reorder sections
      </button>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default BottomNavigation;