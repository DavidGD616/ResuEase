import ContactInformationForm from './ContactInformationForm';
import EducationForm from './EducationForm';
import EmploymentHistoryForm from './EmploymentHistoryForm';
import PersonalDetailsForm from './PersonalDetailsForm';
import ProfessionalSummaryForm from './ProfessionalSummaryForm';
import SkillsForm from './SkillsForm';
import BottomNavigation from '../../layout/BottomNavigation';
import AdditionalSectionsForm from './AdditionalSectionsForm';

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