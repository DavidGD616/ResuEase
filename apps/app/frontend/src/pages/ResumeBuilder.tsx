import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFormData } from '../hooks/useFormData';
import { useSidebarStorage } from '../hooks/useSidebarStorage';
import { useDebounce } from '../hooks/useDebounce';
import { SECTION_TYPES } from '../data/sidebarItems';
import type { SidebarItem } from '../types/resume';
import type { AdditionalSectionItem } from '../data/sidebarItems';
import TopNavigation from '../components/layout/TopNavigation';
import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/layout/MainContent';
import PreviewPanel from '../components/layout/PreviewPanel';

function ResumeBuilder() {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const {
    formData,
    saveStatus,
    updateField,
    addSectionItem,
    updateSectionItem,
    removeSectionItem,
  } = useFormData(userId);

  const { sidebarItems, updateSidebarItems } = useSidebarStorage(userId);
  const debouncedFormData = useDebounce(formData, 300);
  const [activeSection, setActiveSection] = useState<string>(SECTION_TYPES.PERSONAL);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showAdditional, setShowAdditional] = useState(false);
  const [customSectionCounter, setCustomSectionCounter] = useState(1);

  // Derive the counter from the highest existing custom-N ID so that adding
  // a new custom section after a page reload never collides with an existing one.
  useEffect(() => {
    const max = sidebarItems
      .filter((item) => /^custom-\d+$/.test(item.id))
      .map((item) => parseInt(item.id.slice('custom-'.length), 10))
      .reduce((acc, n) => Math.max(acc, n), 0);
    setCustomSectionCounter(max + 1);
  }, [sidebarItems]);

  const handleReorderItems = (newItems: SidebarItem[]) => {
    updateSidebarItems(newItems);
  };

  const handleAdditionalSectionClick = () => {
    setActiveSection('additional');
  };

  const handleAddSection = (section: AdditionalSectionItem) => {
    if (section.id === 'custom') {
      const customSectionName = `Custom section ${customSectionCounter}`;
      const customSectionId = `custom-${customSectionCounter}`;
      const customSection: SidebarItem = {
        ...section,
        id: customSectionId,
        label: customSectionName,
        order: sidebarItems.length,
        fixed: false,
      };
      updateSidebarItems([...sidebarItems, customSection]);
      setCustomSectionCounter((prev) => prev + 1);

      const customSectionKey = `customEntries_${customSectionId}`;
      updateField(customSectionKey, []);

      setActiveSection(customSection.id);
    } else {
      const newSection: SidebarItem = {
        ...section,
        order: sidebarItems.length,
        fixed: false,
      };
      updateSidebarItems([...sidebarItems, newSection]);
      setActiveSection(section.id);
    }
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  const handleDeleteSection = (sectionId: string) => {
    const sectionToDelete = sidebarItems.find((item) => item.id === sectionId);
    if (sectionToDelete?.fixed) return;

    if (sectionId.startsWith('custom-')) {
      const customSectionKey = `customEntries_${sectionId}`;
      updateField(customSectionKey, undefined);
    } else {
      if (formData[sectionId]) {
        updateField(sectionId, []);
      }
      if (sectionId === 'summary') {
        updateField('about', '');
      }
    }

    const updatedItems = sidebarItems.filter((item) => item.id !== sectionId);
    updateSidebarItems(updatedItems);

    if (activeSection === sectionId) {
      setActiveSection(updatedItems.length > 0 ? updatedItems[0].id : SECTION_TYPES.PERSONAL);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation
        formData={formData}
        sidebarItems={sidebarItems}
        onMenuClick={() => setSidebarOpen((open) => !open)}
      />

      <div className="flex lg:hidden border-b border-gray-200 bg-white sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'edit' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Edit
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Preview
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col lg:flex-row w-full mx-auto">
        <Sidebar
          sidebarItems={sidebarItems}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          onReorderItems={handleReorderItems}
          onAdditionalSectionClick={handleAdditionalSectionClick}
        />

        <div className="flex-1 flex flex-col lg:flex-row items-start">
          <div className={activeTab === 'edit' ? 'block w-full' : 'hidden lg:block'}>
            <MainContent
              activeSection={activeSection}
              formData={formData}
              handleInputChange={updateField}
              showAdditional={showAdditional}
              setShowAdditional={setShowAdditional}
              sidebarItems={sidebarItems}
              onAddSection={handleAddSection}
              onSectionChange={handleSectionChange}
              onDeleteSection={handleDeleteSection}
              onReorderItems={handleReorderItems}
              addSectionItem={addSectionItem}
              updateSectionItem={updateSectionItem}
              removeSectionItem={removeSectionItem}
            />
          </div>

          <div className={activeTab === 'preview' ? 'block w-full' : 'hidden lg:flex lg:justify-center'}>
            <PreviewPanel
              formData={debouncedFormData}
              sidebarItems={sidebarItems}
              saveStatus={saveStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
