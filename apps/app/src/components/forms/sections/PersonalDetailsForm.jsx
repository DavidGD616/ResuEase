import { Camera, Plus } from 'lucide-react';
import { 
  FormHeader, 
  FormDescription, 
  FormSection, 
  FormGrid, 
  FormInput, 
  FormButton, 
  FormToggleButton  } from '../shared/FormComponents';

function PersonalDetailsForm({ formData, handleInputChange, showAdditional, setShowAdditional }) {
  return (
    <div>
      <FormHeader title="Personal details" />
      
      <FormDescription>
        Personal details such as name and job title are essential in a resume to
        give the recruiter a quick overview of the candidate.
      </FormDescription>

      <FormSection>
        <FormGrid columns={2}>
          <FormInput
            label="First name"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="David"
          />
          <FormInput
            label="Last name"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Guerrero Diaz"
          />
        </FormGrid>

        <FormInput
          label="Job title"
          type="text"
          value={formData.jobTitle}
          onChange={(e) => handleInputChange("jobTitle", e.target.value)}
          placeholder="Frontend developer"
        />

        <FormButton 
          variant="panel" 
          icon={Camera}
          onClick={() => {/* handle photo upload */}}
        >
          Add photo
        </FormButton>

        <FormToggleButton
          isOpen={showAdditional}
          icon={Plus}
          onClick={() => setShowAdditional(!showAdditional)}
        >
          {showAdditional ? "Hide additional details" : "Show additional details"}
        </FormToggleButton>

        {showAdditional && (
          <div className="pt-3 sm:pt-4 border-t border-gray-200">
            <FormSection>
              <FormGrid columns={2}>
                <FormInput
                  label="Nationality"
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  placeholder="American"
                />
                <FormInput
                  label="Driver's License"
                  type="text"
                  value={formData.driversLicense}
                  onChange={(e) => handleInputChange("driversLicense", e.target.value)}
                  placeholder="D74837465"
                />
              </FormGrid>
              
              <FormInput
                label="Birth date"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
              />
            </FormSection>
          </div>
        )}
      </FormSection>
    </div>
  );
}

export default PersonalDetailsForm;