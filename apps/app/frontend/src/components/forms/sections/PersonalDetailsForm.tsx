import { Camera } from 'lucide-react';
import {
  FormHeader,
  FormDescription,
  FormSection,
  FormGrid,
  FormInput,
  FormButton,
  HintIcon,
} from '../shared/FormComponents';
import type { FormData } from '../../../types/resume';

interface PersonalDetailsFormProps {
  formData: FormData;
  handleInputChange: (field: string, value: unknown) => void;
}

function PersonalDetailsForm({ formData, handleInputChange }: PersonalDetailsFormProps) {
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
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="David"
          />
          <FormInput
            label="Last name"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Guerrero Diaz"
          />
        </FormGrid>

        <FormInput
          label="Job title (optional)"
          type="text"
          value={formData.jobTitle}
          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
          placeholder="Frontend developer"
        />

        <div>
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              Include photo (generally NOT recommended!)
            </p>
            <HintIcon
              title="Including Photos on Resumes"
              description={
                <div>
                  <p className="text-red-600 font-medium mb-4">
                    ⚠️ ONLY include a photo if photos are standard practice in your country
                  </p>
                  <p className="mb-4">
                    <strong>When photos are common:</strong> Some countries (like Germany, parts of Europe) expect photos on resumes.
                  </p>
                  <p className="mb-4">
                    <strong>When photos are NOT recommended:</strong> In the US, Canada, UK, and most countries, photos can lead to discrimination and are generally discouraged or even illegal for employers to require.
                  </p>
                  <p>
                    If you're unsure whether photos are normal in your country, DO NOT include one. When in doubt, leave it out.
                  </p>
                </div>
              }
            />
          </div>
          <button
            onClick={() => {/* handle photo upload */}}
            className="flex items-center gap-2 p-4 rounded-lg text-sm transition-colors"
            style={{ border: '1px dashed var(--border-strong)', color: 'var(--ink-3)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ink-2)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          >
            <Camera className="w-4 h-4" />
            Add photo <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>(Optional)</span>
          </button>
        </div>
      </FormSection>
    </div>
  );
}

export default PersonalDetailsForm;
