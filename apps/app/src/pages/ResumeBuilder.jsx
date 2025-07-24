import { useState } from 'react';
import { useFormData } from '../hooks/useFormData';
import { SIDEBAR_ITEMS, SECTION_TYPES } from '../data/sidebarItems';
import TopNavigation from '../components/layout/TopNavigation';
import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/forms/MainContent';
import PreviewPanel from '../components/layout/PreviewPanel';

function ResumeBuilder() {
  const { formData, updateField } = useFormData();
  const [activeSection, setActiveSection] = useState(SECTION_TYPES.PERSONAL);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [sidebarItems, setSidebarItems] = useState(SIDEBAR_ITEMS);
  const [showAdditionalSections, setShowAdditionalSections] = useState(false);

  const handleReorderItems = (newItems) => {
    setSidebarItems(newItems);
  }

  const handleAdditionalSectionClick = () => {
    setShowAdditionalSections(true);
    setActiveSection(''); // Clear active section to show additional sections form
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
          formData={formData} 
          onMenuClick={() => setSidebarOpen(open => !open)
          } />
      
      <div className="flex w-full mx-auto">
        <Sidebar 
          sidebarItems={sidebarItems}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          onReorderItems={handleReorderItems}
          onAdditionalSectionClick={handleAdditionalSectionClick}
        />

        <div className="flex-1 flex">
          <MainContent 
            activeSection={activeSection}
            formData={formData}
            handleInputChange={updateField}
            showAdditional={showAdditional}
            setShowAdditional={setShowAdditional}
            showAdditionalSections={showAdditionalSections}
          />
          
          <PreviewPanel 
            formData={formData}
          />
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;