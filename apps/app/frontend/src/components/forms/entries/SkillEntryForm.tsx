import { useTranslation } from 'react-i18next';
import { FormInput, FormContainer } from '../shared/FormComponents';
import type { SkillItem } from '../../../types/resume';

interface SkillEntryFormProps {
  skill: SkillItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function SkillEntryForm({ skill, onUpdate }: SkillEntryFormProps) {
  const { t } = useTranslation();

  const handleChange = (field: string, value: unknown) => {
    onUpdate(skill.id, field, value);
  };

  return (
    <FormContainer>
      <FormInput
        label={t('forms.skills.skillName')}
        type="text"
        value={skill.skillName}
        onChange={(e) => handleChange('skillName', e.target.value)}
        placeholder={t('forms.skills.skillNamePlaceholder')}
      />
    </FormContainer>
  );
}

export default SkillEntryForm;
