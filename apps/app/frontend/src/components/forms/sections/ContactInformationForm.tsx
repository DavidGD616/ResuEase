import { useTranslation } from 'react-i18next';
import {
  FormHeader,
  FormDescription,
  FormSection,
  FormGrid,
  FormInput,
} from '../shared/FormComponents';
import type { FormData } from '../../../types/resume';

interface ContactInformationFormProps {
  formData: FormData;
  handleInputChange: (field: string, value: unknown) => void;
}

function ContactInformationForm({ formData, handleInputChange }: ContactInformationFormProps) {
  const { t } = useTranslation();

  return (
    <div>
      <FormHeader title={t('forms.contact.header')} />

      <FormDescription>
        {t('forms.contact.description')}
      </FormDescription>

      <FormSection>
        <FormGrid columns={2}>
          <FormInput
            label={t('forms.contact.email')}
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder={t('forms.contact.emailPlaceholder')}
          />
          <FormInput
            label={t('forms.contact.phone')}
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder={t('forms.contact.phonePlaceholder')}
          />
        </FormGrid>

        <FormGrid columns={2}>
          <FormInput
            label={t('forms.contact.location')}
            hint={{
              title: t('forms.contact.locationHint.title'),
              description: t('forms.contact.locationHint.description'),
            }}
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder={t('forms.contact.locationPlaceholder')}
          />
          <FormInput
            label={t('forms.contact.portfolio')}
            hint={{
              title: t('forms.contact.portfolioHint.title'),
              description: t('forms.contact.portfolioHint.description'),
            }}
            type="url"
            value={formData.portfolio}
            onChange={(e) => handleInputChange('portfolio', e.target.value)}
            placeholder={t('forms.contact.portfolioPlaceholder')}
          />
        </FormGrid>
      </FormSection>
    </div>
  );
}

export default ContactInformationForm;
