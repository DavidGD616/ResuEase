import { useTranslation } from 'react-i18next';
import { FormInput, FormContainer } from '../shared/FormComponents';
import type { HobbyItem } from '../../../types/resume';

interface HobbyEntryFormProps {
  hobby: HobbyItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function HobbyEntryForm({ hobby, onUpdate }: HobbyEntryFormProps) {
  const { t } = useTranslation();

  const handleChange = (field: string, value: unknown) => {
    onUpdate(hobby.id, field, value);
  };

  return (
    <FormContainer>
      <FormInput
        label={t('forms.hobbies.hobbyName')}
        type="text"
        value={hobby.hobbyName}
        onChange={(e) => handleChange('hobbyName', e.target.value)}
        placeholder={t('forms.hobbies.hobbyNamePlaceholder')}
      />
    </FormContainer>
  );
}

export default HobbyEntryForm;
