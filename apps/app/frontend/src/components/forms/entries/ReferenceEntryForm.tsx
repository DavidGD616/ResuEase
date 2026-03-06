import { useTranslation } from 'react-i18next';
import { FormInput, FormGrid, FormContainer } from '../shared/FormComponents';
import type { ReferenceItem } from '../../../types/resume';

interface ReferenceEntryFormProps {
  reference: ReferenceItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function ReferenceEntryForm({ reference, onUpdate }: ReferenceEntryFormProps) {
  const { t } = useTranslation();

  const handleChange = (field: string, value: unknown) => {
    onUpdate(reference.id, field, value);
  };

  return (
    <FormContainer>
      <FormGrid columns={2}>
        <FormInput
          label={t('forms.references.referentName')}
          type="text"
          value={reference.referentName}
          onChange={(e) => handleChange('referentName', e.target.value)}
          placeholder={t('forms.references.referentNamePlaceholder')}
        />
        <FormInput
          label={t('forms.references.referentCompany')}
          type="text"
          value={reference.referentCompany}
          onChange={(e) => handleChange('referentCompany', e.target.value)}
          placeholder={t('forms.references.referentCompanyPlaceholder')}
        />
      </FormGrid>

      <FormGrid columns={2}>
        <FormInput
          label={t('forms.references.referentEmail')}
          type="email"
          value={reference.referentEmail}
          onChange={(e) => handleChange('referentEmail', e.target.value)}
          placeholder={t('forms.references.referentEmailPlaceholder')}
        />
        <FormInput
          label={t('forms.references.referentPhone')}
          type="tel"
          value={reference.referentPhone}
          onChange={(e) => handleChange('referentPhone', e.target.value)}
          placeholder={t('forms.references.referentPhonePlaceholder')}
        />
      </FormGrid>
    </FormContainer>
  );
}

export default ReferenceEntryForm;
