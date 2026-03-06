import { useTranslation } from 'react-i18next';
import { FormInput, FormGrid, FormContainer, FormSelect } from '../shared/FormComponents';
import type { LanguageItem } from '../../../types/resume';

interface LanguageEntryFormProps {
  language: LanguageItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function LanguageEntryForm({ language, onUpdate }: LanguageEntryFormProps) {
  const { t } = useTranslation();

  const handleChange = (field: string, value: unknown) => {
    onUpdate(language.id, field, value);
  };

  const proficiencyOptions = [
    { value: 'Not applicable', label: t('forms.languages.proficiencyLevels.notApplicable') },
    { value: 'Beginner', label: t('forms.languages.proficiencyLevels.beginner') },
    { value: 'Intermediate', label: t('forms.languages.proficiencyLevels.intermediate') },
    { value: 'Advanced', label: t('forms.languages.proficiencyLevels.advanced') },
    { value: 'Native', label: t('forms.languages.proficiencyLevels.native') },
  ];

  return (
    <FormContainer>
      <FormGrid columns={2}>
        <FormInput
          label={t('forms.languages.language')}
          type="text"
          value={language.language}
          onChange={(e) => handleChange('language', e.target.value)}
          placeholder={t('forms.languages.languagePlaceholder')}
        />
        <FormSelect
          label={t('forms.languages.proficiency')}
          value={language.proficiency}
          onChange={(e) => handleChange('proficiency', e.target.value)}
          options={proficiencyOptions}
        />
      </FormGrid>
    </FormContainer>
  );
}

export default LanguageEntryForm;
