import { useTranslation } from 'react-i18next';
import { FormInput, FormGrid, FormContainer } from '../shared/FormComponents';
import type { LinkItem } from '../../../types/resume';

interface LinkEntryFormProps {
  link: LinkItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function LinkEntryForm({ link, onUpdate }: LinkEntryFormProps) {
  const { t } = useTranslation();

  const handleChange = (field: string, value: unknown) => {
    onUpdate(link.id, field, value);
  };

  return (
    <FormContainer>
      <FormGrid columns={2}>
        <FormInput
          label={t('forms.links.linkTitle')}
          type="text"
          value={link.linkTitle}
          onChange={(e) => handleChange('linkTitle', e.target.value)}
          placeholder={t('forms.links.linkTitlePlaceholder')}
        />
        <FormInput
          label={t('forms.links.url')}
          type="url"
          value={link.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder={t('forms.links.urlPlaceholder')}
        />
      </FormGrid>
    </FormContainer>
  );
}

export default LinkEntryForm;
