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
  const [customSectionCounter, setCustomSectionCounter] = useState(1);

  const handleReorderItems = (newItems) => {
    setSidebarItems(newItems);
  }

  const handleAdditionalSectionClick = () => {
    setShowAdditionalSections(true);
    setActiveSection('additional');
  }

  const handleAddSection = (section) => {
    if (section.id === 'custom') {
      // For custom sections, create a unique ID and add to sidebar
      const customSection = {
        ...section,
        id: `custom-${customSectionCounter}`,
        label: `Custom section ${customSectionCounter}`,
        order: sidebarItems.length,
        fixed: false
      };
      setSidebarItems(prev => [...prev, customSection]);
      setCustomSectionCounter(prev => prev + 1);
      setActiveSection(customSection.id);
    } else {
      // For predefined sections, add to sidebar
      const newSection = {
        ...section,
        order: sidebarItems.length,
        fixed: false
      };
      setSidebarItems(prev => [...prev, newSection]);
      setActiveSection(section.id);
    }
  }

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Close mobile sidebar when navigating
    setSidebarOpen(false);
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
            sidebarItems={sidebarItems}
            onAddSection={handleAddSection}
            onSectionChange={handleSectionChange}
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