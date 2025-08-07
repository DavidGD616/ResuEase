import { Plus } from 'lucide-react';
import { FormHeader, FormDescription } from '../shared/FormComponents';
import { SIDEBAR_ITEMS, ADDITIONAL_SECTION } from '../../../data/sidebarItems';

function AdditionalSectionsForm({ sidebarItems, onAddSection }) {
  // Combine core sections from SIDEBAR_ITEMS with additional section types
  const allAvailableSections = [
    ...SIDEBAR_ITEMS.filter(item => !item.fixed), // Non-fixed core sections that can be re-added
    ...ADDITIONAL_SECTION
  ];

  // Filter out sections that are already in the sidebar (except custom sections)
  const availableSections = allAvailableSections.filter(section => {
    if (section.id === 'custom') {
      return true; // Always show custom section
    }
    
    // Check if section is currently in sidebar
    const isInSidebar = sidebarItems.some(item => item.id === section.id);
    
    // If not in sidebar, it's available to add
    return !isInSidebar;
  });

  const handleSectionClick = (section) => {
    onAddSection(section);
  };

  return (
    <div>
      <FormHeader title="Additional section" />
      
      <FormDescription>
        You should only add resume categories if they are relevant and you can list a few things in each section. Pick the most impactful categories first.
      </FormDescription>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {availableSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section)}
              className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-md sm:rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-left"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="font-medium text-sm sm:text-base text-gray-900">{section.label}</span>
              </div>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AdditionalSectionsForm;