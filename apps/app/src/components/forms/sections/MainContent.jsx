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

function MainContent({ 
  activeSection, 
  formData, 
  handleInputChange, 
  showAdditional, 
  setShowAdditional,
  sidebarItems,
  onAddSection,
  onSectionChange,
  onDeleteSection
}) {
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
      />
    </div>
  );
}

export default MainContent;