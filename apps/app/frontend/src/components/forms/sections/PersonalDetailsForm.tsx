import { Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <div>
      <FormHeader title={t('forms.personal.header')} />

      <FormDescription>
        {t('forms.personal.description')}
      </FormDescription>

      <FormSection>
        <FormGrid columns={2}>
          <FormInput
            label={t('forms.personal.firstName')}
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder={t('forms.personal.firstNamePlaceholder')}
          />
          <FormInput
            label={t('forms.personal.lastName')}
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder={t('forms.personal.lastNamePlaceholder')}
          />
        </FormGrid>

        <FormInput
          label={t('forms.personal.jobTitle')}
          type="text"
          value={formData.jobTitle}
          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
          placeholder={t('forms.personal.jobTitlePlaceholder')}
        />

        <div>
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              {t('forms.personal.includePhoto')}
            </p>
            <HintIcon
              title={t('forms.personal.photoHint.title')}
              description={
                <div>
                  <p className="text-red-600 font-medium mb-4">
                    {t('forms.personal.photoHint.warning')}
                  </p>
                  <p className="mb-4">
                    <strong>{t('forms.personal.photoHint.whenCommon')}</strong> {t('forms.personal.photoHint.whenCommonText')}
                  </p>
                  <p className="mb-4">
                    <strong>{t('forms.personal.photoHint.whenNotRecommended')}</strong> {t('forms.personal.photoHint.whenNotRecommendedText')}
                  </p>
                  <p>
                    {t('forms.personal.photoHint.unsure')}
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
            {t('forms.personal.addPhoto')} <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>{t('forms.personal.addPhotoOptional')}</span>
          </button>
        </div>
      </FormSection>
    </div>
  );
}

export default PersonalDetailsForm;
