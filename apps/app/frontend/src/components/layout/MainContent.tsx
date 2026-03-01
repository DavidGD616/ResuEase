import { useState } from 'react';
import type { ReactElement } from 'react';
import BottomNavigation from './BottomNavigation';
import PersonalDetailsForm from '../forms/sections/PersonalDetailsForm';
import ContactInformationForm from '../forms/sections/ContactInformationForm';
import ProfessionalSummaryForm from '../forms/sections/ProfessionalSummaryForm';
import EducationForm from '../forms/sections/EducationForm';
import EmploymentHistoryForm from '../forms/sections/EmploymentHistoryForm';
import SkillsForm from '../forms/sections/SkillsForm';
import TechnologiesSkillsForm from '../forms/sections/TechnologiesSkillsForm';
import InternshipsForm from '../forms/sections/InternshipsForm';
import AdditionalSectionsForm from '../forms/sections/AdditionalSectionsForm';
import CoursesForm from '../forms/sections/CoursesForm';
import ReferencesForm from '../forms/sections/ReferencesForm';
import LanguagesForm from '../forms/sections/LanguagesForm';
import LinksForm from '../forms/sections/LinksForm';
import HobbiesForm from '../forms/sections/HobbiesForm';
import CustomSectionForm from '../forms/sections/CustomSectionForm';
import ReorderSectionsForm from '../forms/sections/ReorderSectionsForm';
import ProjectsForm from '../forms/sections/ProjectsForm';
import type { FormData, SidebarItem } from '../../types/resume';
import type { AdditionalSectionItem } from '../../data/sidebarItems';

interface MainContentProps {
  activeSection: string;
  formData: FormData;
  handleInputChange: (field: string, value: unknown) => void;
  showAdditional: boolean;
  setShowAdditional: (value: boolean) => void;
  sidebarItems: SidebarItem[];
  onAddSection: (section: AdditionalSectionItem) => void;
  onSectionChange: (id: string) => void;
  onDeleteSection: (id: string) => void;
  onReorderItems: (items: SidebarItem[]) => void;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

// Props forwarded from MainContent into every section renderer.
interface SectionProps {
  formData: FormData;
  handleInputChange: (field: string, value: unknown) => void;
  sidebarItems: SidebarItem[];
  onAddSection: (section: AdditionalSectionItem) => void;
  onDeleteSection: (id: string) => void;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
  sectionId: string;
}

type SectionRenderer = (props: SectionProps) => ReactElement;

// Maps every fixed section ID to its render function.
// Adding a new section only requires one entry here — no conditional chain to extend.
const SECTION_REGISTRY: Record<string, SectionRenderer> = {
  personal: ({ formData, handleInputChange }) => (
    <PersonalDetailsForm formData={formData} handleInputChange={handleInputChange} />
  ),
  contact: ({ formData, handleInputChange }) => (
    <ContactInformationForm formData={formData} handleInputChange={handleInputChange} />
  ),
  summary: ({ formData, handleInputChange, onDeleteSection }) => (
    <ProfessionalSummaryForm
      onDeleteSection={() => onDeleteSection('summary')}
      formData={formData}
      handleInputChange={handleInputChange}
    />
  ),
  employment: ({ formData, addSectionItem, updateSectionItem, removeSectionItem, onDeleteSection }) => (
    <EmploymentHistoryForm
      onDeleteSection={() => onDeleteSection('employment')}
      formData={formData}
      addSectionItem={addSectionItem}
      updateSectionItem={updateSectionItem}
      removeSectionItem={removeSectionItem}
    />
  ),
  skills: ({ formData, addSectionItem, updateSectionItem, removeSectionItem, onDeleteSection }) => (
    <SkillsForm
      onDeleteSection={() => onDeleteSection('skills')}
      formData={formData}
      addSectionItem={addSectionItem}
      updateSectionItem={updateSectionItem}
      removeSectionItem={removeSectionItem}
    />
  ),
  technologiesSkills: ({ formData, addSectionItem, updateSectionItem, removeSectionItem, onDeleteSection }) => (
    <TechnologiesSkillsForm
      onDeleteSection={() => onDeleteSection('technologiesSkills')}
      formData={formData}
      addSectionItem={addSectionItem}
      updateSectionItem={updateSectionItem}
      removeSectionItem={removeSectionItem}
    />
  ),
  education: ({ formData, addSectionItem, updateSectionItem, removeSectionItem, onDeleteSection }) => (
    <EducationForm
      onDeleteSection={() => onDeleteSection('education')}
      formData={formData}
      addSectionItem={addSectionItem}
      updateSectionItem={updateSectionItem}
      removeSectionItem={removeSectionItem}
    />
  ),
  projects: ({ formData, addSectionItem, updateSectionItem, removeSectionItem, onDeleteSection }) => (
    <ProjectsForm
      onDeleteSection={() => onDeleteSection('projects')}
      formData={formData}
      addSectionItem={addSectionItem}
      updateSectionItem={updateSectionItem}
      removeSectionItem={removeSectionItem}
    />
  ),
  internships: ({ formData, addSectionItem, updateSectionItem, removeSectionItem, onDeleteSection }) => (
    <InternshipsForm
      onDeleteSection={() => onDeleteSection('internships')}
      formData={formData}
      addSectionItem={addSectionItem}
      updateSectionItem={updateSectionItem}
      removeSectionItem={removeSectionItem}
    />
  ),
  courses: ({ formData, addSectionItem, updateSectionItem, removeSectionItem, onDeleteSection }) => (
    <CoursesForm
      onDeleteSection={() => onDeleteSection('courses')}
      formData={formData}
      addSectionItem={addSectionItem}
      updateSectionItem={updateSectionItem}
      removeSectionItem={removeSectionItem}
    />
  ),
  references: ({ formData, addSectionItem, updateSectionItem, removeSectionItem, onDeleteSection }) => (
    <ReferencesForm
      onDeleteSection={() => onDeleteSection('references')}
      formData={formData}
      addSectionItem={addSectionItem}
      updateSectionItem={updateSectionItem}
      removeSectionItem={removeSectionItem}
    />
  ),
  languages: ({ formData, addSectionItem, updateSectionItem, removeSectionItem, onDeleteSection }) => (
    <LanguagesForm
      onDeleteSection={() => onDeleteSection('languages')}
      formData={formData}
      addSectionItem={addSectionItem}
      updateSectionItem={updateSectionItem}
      removeSectionItem={removeSectionItem}
    />
  ),
  links: ({ formData, addSectionItem, updateSectionItem, removeSectionItem, onDeleteSection }) => (
    <LinksForm
      onDeleteSection={() => onDeleteSection('links')}
      formData={formData}
      addSectionItem={addSectionItem}
      updateSectionItem={updateSectionItem}
      removeSectionItem={removeSectionItem}
    />
  ),
  hobbies: ({ formData, addSectionItem, updateSectionItem, removeSectionItem, onDeleteSection }) => (
    <HobbiesForm
      onDeleteSection={() => onDeleteSection('hobbies')}
      formData={formData}
      addSectionItem={addSectionItem}
      updateSectionItem={updateSectionItem}
      removeSectionItem={removeSectionItem}
    />
  ),
  additional: ({ sidebarItems, onAddSection }) => (
    <AdditionalSectionsForm sidebarItems={sidebarItems} onAddSection={onAddSection} />
  ),
};

// Renderer for any custom-* section — handles dynamic IDs not known at build time.
const customSectionRenderer: SectionRenderer = ({
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
  onDeleteSection,
  sectionId,
}) => (
  <CustomSectionForm
    onDeleteSection={() => onDeleteSection(sectionId)}
    formData={formData}
    addSectionItem={addSectionItem}
    updateSectionItem={updateSectionItem}
    removeSectionItem={removeSectionItem}
    sectionId={sectionId}
  />
);

function MainContent({
  activeSection,
  formData,
  handleInputChange,
  sidebarItems,
  onAddSection,
  onSectionChange,
  onDeleteSection,
  onReorderItems,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: MainContentProps) {
  const [showReorder, setShowReorder] = useState(false);

  if (showReorder) {
    return (
      <ReorderSectionsForm
        sidebarItems={sidebarItems}
        onReorderItems={onReorderItems}
        onBack={() => setShowReorder(false)}
        onDone={() => setShowReorder(false)}
        onDeleteSection={onDeleteSection}
        onAddSectionClick={() => {
          setShowReorder(false);
          onSectionChange('additional');
        }}
      />
    );
  }

  const renderer = activeSection.startsWith('custom-')
    ? customSectionRenderer
    : SECTION_REGISTRY[activeSection];

  const sectionProps: SectionProps = {
    formData,
    handleInputChange,
    sidebarItems,
    onAddSection,
    onDeleteSection,
    addSectionItem,
    updateSectionItem,
    removeSectionItem,
    sectionId: activeSection,
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:px-8 xl:px-12 pb-20 sm:pb-6">
      {renderer?.(sectionProps) ?? null}
      <BottomNavigation
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        sidebarItems={sidebarItems}
        onReorderClick={() => setShowReorder(true)}
      />
    </div>
  );
}

export default MainContent;
