import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';

function BottomNavigation({ activeSection, onSectionChange, sidebarItems, onReorderClick }) {
  // Get dynamic section order from sidebar items, excluding 'additional'
  const sectionOrder = sidebarItems
    .sort((a, b) => a.order - b.order)
    .map(item => item.id);
  
  const currentIndex = sectionOrder.indexOf(activeSection);
  const isFirstSection = currentIndex === 0;
  const isLastSection = currentIndex === sectionOrder.length - 1;
  
  // Special handling for 'additional' section
  const isAdditionalSection = activeSection === 'additional';

  const handleBack = () => {
    if (isAdditionalSection) {
      // From additional section, go to the last item in sidebar
      const lastSection = sectionOrder[sectionOrder.length - 1];
      onSectionChange(lastSection);
    } else if (!isFirstSection && currentIndex > 0) {
      const previousSection = sectionOrder[currentIndex - 1];
      onSectionChange(previousSection);
    }
  };

  const handleNext = () => {
    if (isAdditionalSection) {
      // From additional section, can't go further
      return;
    } else if (!isLastSection && currentIndex < sectionOrder.length - 1) {
      const nextSection = sectionOrder[currentIndex + 1];
      onSectionChange(nextSection);
    } else if (isLastSection) {
      // When on the last section, go to additional sections
      onSectionChange('additional');
    }
  };

  return (
    <div className="flex justify-between items-center pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-200">
      <div>
        {(!isFirstSection || isAdditionalSection) && (
          <button
            onClick={handleBack}
            className="flex px-4 sm:px-6 bg-gray-200 py-2 sm:py-3 rounded-lg items-center gap-1 sm:gap-2 text-gray-700 hover:bg-gray-300 transition-colors text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}
      </div>
      
      <button 
        onClick={onReorderClick}
        className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 text-xs sm:text-base"
      >
        <Menu className="w-4 h-4" />
        <span className="hidden sm:inline">Reorder sections</span>
        <span className="sm:hidden">Reorder</span>
      </button>

      {!isAdditionalSection && (
        <button 
          onClick={handleNext}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
      
      {isAdditionalSection && (
        <div className="px-4 sm:px-6 py-2 sm:py-3"></div> // Empty space to maintain layout
      )}
    </div>
  );
}

export default BottomNavigation;