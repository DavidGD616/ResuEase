import { useState } from 'react';
import ContactInformationForm from './ContactInformationForm';
import EducationForm from './EducationForm';
import EmploymentHistoryForm from './EmploymentHistoryForm';
import PersonalDetailsForm from './PersonalDetailsForm';
import ProfessionalSummaryForm from './ProfessionalSummaryForm';
import SkillsForm from './SkillsForm';
import InternshipsForm from './InternshipsForm';
import BottomNavigation from '../../layout/BottomNavigation';
import AdditionalSectionsForm from './AdditionalSectionsForm';
import CoursesForm from './CoursesForm';
import ReferencesForm from './ReferencesForm';
import LanguagesForm from './LanguagesForm';
import LinksForm from './LinksForm';
import HobbiesForm from './HobbiesForm';
import CustomSectionForm from './CustomSectionForm';
import ReorderSectionsForm from './ReorderSectionsForm';

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
  onReorderItems
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
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}

      {activeSection === 'employment' && (
        <EmploymentHistoryForm 
          onDeleteSection={() => onDeleteSection('employment')}
        />
      )}

      {activeSection === 'skills' && (
        <SkillsForm 
          formData={formData}
          handleInputChange={handleInputChange}
          onDeleteSection={() => onDeleteSection('skills')}
        />
      )}

      {activeSection === 'education' && (
        <EducationForm 
          onDeleteSection={() => onDeleteSection('education')}
        />
      )}

      {activeSection === 'internships' && (
        <InternshipsForm 
          onDeleteSection={() => onDeleteSection('internships')}
        />
      )}

      {activeSection === 'courses' && (
        <CoursesForm
          onDeleteSection={() => onDeleteSection('courses')}
        />
      )}

      {activeSection === 'references' && (
        <ReferencesForm
          onDeleteSection={() => onDeleteSection('references')}
        />
      )}

      {activeSection === 'languages' && (
        <LanguagesForm
          onDeleteSection={() => onDeleteSection('languages')}
        />
      )}

      {activeSection === 'links' && (
        <LinksForm 
          onDeleteSection={() => onDeleteSection('links')}
        />
      )}

      {activeSection === 'hobbies' && (
        <HobbiesForm 
          formData={formData}
          handleInputChange={handleInputChange}
          onDeleteSection={() => onDeleteSection('hobbies')}
        />
      )}

      {activeSection.startsWith('custom-') && (
        <CustomSectionForm 
          onDeleteSection={() => onDeleteSection(activeSection)}
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