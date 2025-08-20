import { useState } from 'react';
import BottomNavigation from '../../components/layout/BottomNavigation';
import ContactInformationForm from '../forms/sections/ContactInformationForm';
import EducationForm from '../forms/sections/EducationForm';
import EmploymentHistoryForm from '../forms/sections/EmploymentHistoryForm';
import PersonalDetailsForm from '../forms/sections/PersonalDetailsForm';
import ProfessionalSummaryForm from '../forms/sections/ProfessionalSummaryForm';
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

function MainContent({ 
  activeSection, 
  formData, 
  handleInputChange, 
  showAdditional, 
  setShowAdditional,
  sidebarItems,
  onAddSection,
  onSectionChange,
  onDeleteSection,
  onReorderItems,
  // New props for section management
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}) {
  const [showReorder, setShowReorder] = useState(false);

  // If showing reorder form, render it instead of the regular content
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

  return (
    <div className="flex-1 p-6 max-w-2xl">
      {activeSection === 'personal' && (
        <PersonalDetailsForm 
          formData={formData}
          handleInputChange={handleInputChange}
          showAdditional={showAdditional}
          setShowAdditional={setShowAdditional}
        />
      )}

      {activeSection === 'contact' && (
        <ContactInformationForm
          formData={formData}
          handleInputChange={handleInputChange}
          showAdditional={showAdditional}
          setShowAdditional={setShowAdditional}
        />
      )}

      {activeSection === 'summary' && (
        <ProfessionalSummaryForm 
          onDeleteSection={() => onDeleteSection('summary')}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}

      {activeSection === 'employment' && (
        <EmploymentHistoryForm 
          onDeleteSection={() => onDeleteSection('employment')}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
        />
      )}

      {activeSection === 'skills' && (
        <SkillsForm 
          onDeleteSection={() => onDeleteSection('skills')}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
        />
      )}

      {activeSection === 'technologiesSkills' && (
        <TechnologiesSkillsForm 
          onDeleteSection={() => onDeleteSection('technologiesSkills')}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
        />
      )}

      {activeSection === 'education' && (
        <EducationForm 
          onDeleteSection={() => onDeleteSection('education')}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
        />
      )}

      {activeSection === 'projects' && (
        <ProjectsForm 
          onDeleteSection={() => onDeleteSection('projects')}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
        />
      )}

      {activeSection === 'internships' && (
        <InternshipsForm 
          onDeleteSection={() => onDeleteSection('internships')}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
        />
      )}

      {activeSection === 'courses' && (
        <CoursesForm
          onDeleteSection={() => onDeleteSection('courses')}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
        />
      )}

      {activeSection === 'references' && (
        <ReferencesForm
          onDeleteSection={() => onDeleteSection('references')}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
        />
      )}

      {activeSection === 'languages' && (
        <LanguagesForm
          onDeleteSection={() => onDeleteSection('languages')}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
        />
      )}

      {activeSection === 'links' && (
        <LinksForm 
          onDeleteSection={() => onDeleteSection('links')}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
        />
      )}

      {activeSection === 'hobbies' && (
        <HobbiesForm 
          onDeleteSection={() => onDeleteSection('hobbies')}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
        />
      )}

      {activeSection.startsWith('custom-') && (
        <CustomSectionForm 
          onDeleteSection={() => onDeleteSection(activeSection)}
          formData={formData}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          removeSectionItem={removeSectionItem}
          sectionId={activeSection}
        />
      )}

      {activeSection === 'additional' && (
        <AdditionalSectionsForm 
          sidebarItems={sidebarItems}
          onAddSection={onAddSection}
        />
      )}
      
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