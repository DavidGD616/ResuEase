import ContactInformationForm from './ContactInformationForm';
import EducationForm from './EducationForm';
import EmploymentHistoryForm from './EmploymentHistoryForm';
import PersonalDetailsForm from './PersonalDetailsForm';
import ProfessionalSummaryForm from './ProfessionalSummaryForm';
import SkillsForm from './SkillsForm';
import BottomNavigation from './BottomNavigation';

function MainContent({ 
  activeSection, 
  formData, 
  handleInputChange, 
  showAdditional, 
  setShowAdditional 
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
        <EmploymentHistoryForm />
      )}

      {activeSection === 'skills' && (
        <SkillsForm 
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}

      {activeSection === 'education' && (
        <EducationForm />
      )}

      <BottomNavigation />
    </div>
  );
}

export default MainContent;