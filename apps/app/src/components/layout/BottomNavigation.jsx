import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';

function BottomNavigation({ activeSection, onSectionChange }) {
  // Define the section order to determine navigation
  const sectionOrder = ['personal', 'contact', 'summary', 'employment', 'skills', 'education'];
  const currentIndex = sectionOrder.indexOf(activeSection);
  const isFirstSection = currentIndex === 0;
  const isLastSection = currentIndex === sectionOrder.length - 1;

  const handleBack = () => {
    if (!isFirstSection && currentIndex > 0) {
      const previousSection = sectionOrder[currentIndex - 1];
      onSectionChange(previousSection);
    }
  };

  const handleNext = () => {
    if (!isLastSection && currentIndex < sectionOrder.length - 1) {
      const nextSection = sectionOrder[currentIndex + 1];
      onSectionChange(nextSection);
    } else if (isLastSection) {
      // When on the last section, go to additional sections
      onSectionChange('additional');
    }
  };

  return (
    <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
      <div>
        {!isFirstSection && (
          <button
            onClick={handleBack}
            className="flex px-6 bg-gray-200 py-3 rounded-lg items-center gap-2 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>
      
      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <Menu className="w-4 h-4" />
        Reorder sections
      </button>

      <button 
        onClick={handleNext}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default BottomNavigation;