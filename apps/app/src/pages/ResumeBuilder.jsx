import { useState } from 'react';
import { useFormData } from '../hooks/useFormData';
import { SIDEBAR_ITEMS, SECTION_TYPES } from '../data/sidebarItems';
import TopNavigation from '../components/layout/TopNavigation';
import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/forms/sections/MainContent';
import PreviewPanel from '../components/layout/PreviewPanel';

function ResumeBuilder() {
  const { 
    formData, 
    updateField,
    addSectionItem,
    updateSectionItem,
    removeSectionItem,
    updateSection,
  } = useFormData();
  
  const [activeSection, setActiveSection] = useState(SECTION_TYPES.PERSONAL);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [sidebarItems, setSidebarItems] = useState(SIDEBAR_ITEMS);
  const [showAdditionalSections, setShowAdditionalSections] = useState(false);
  const [customSectionCounter, setCustomSectionCounter] = useState(1);

  // function to reorder items of any non-fixed section
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
      const customSectionName = `Custom section ${customSectionCounter}`;
      const customSectionId = `custom-${customSectionCounter}`;
      const customSection = {
        ...section,
        id: customSectionId,
        label: customSectionName,
        order: sidebarItems.length,
        fixed: false
      };
      setSidebarItems(prev => [...prev, customSection]);
      setCustomSectionCounter(prev => prev + 1);
      
      // Initialize empty array for this custom section's entries in form data
      // This creates a field like 'customEntries_custom-1': []
      const customSectionKey = `customEntries_${customSectionId}`;
      updateField(customSectionKey, []);
      
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

  // Function to handle section deletion of any non-fixed section
  const handleDeleteSection = (sectionId) => {
    // Prevent deletion of fixed sections
    const sectionToDelete = sidebarItems.find(item => item.id === sectionId);
    if (sectionToDelete?.fixed) {
      return;
    }

    // If it's a custom section, remove from form data
    if (sectionId.startsWith('custom-')) {
      const customSectionKey = `customEntries_${sectionId}`;
      updateField(customSectionKey, undefined); // Remove the field entirely
    }

    // Remove the section from sidebar
    setSidebarItems(prev => prev.filter(item => item.id !== sectionId));

    // If the deleted section was active, navigate to the first available section
    if (activeSection === sectionId) {
      const remainingSections = sidebarItems.filter(item => item.id !== sectionId);
      if (remainingSections.length > 0) {
        setActiveSection(remainingSections[0].id);
      } else {
        setActiveSection(SECTION_TYPES.PERSONAL);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
        formData={formData} 
        onMenuClick={() => setSidebarOpen(open => !open)} 
      />
      
      <div className="flex flex-col lg:flex-row w-full mx-auto">
        <Sidebar 
          sidebarItems={sidebarItems}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          onReorderItems={handleReorderItems}
          onAdditionalSectionClick={handleAdditionalSectionClick}
        />

        <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start">
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
            onDeleteSection={handleDeleteSection}
            onReorderItems={handleReorderItems}
            addSectionItem={addSectionItem}
            updateSectionItem={updateSectionItem}
            removeSectionItem={removeSectionItem}
            updateSection={updateSection}
          />
          
         <div className="order-last lg:order-none flex justify-center">
            <PreviewPanel 
              formData={formData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;