import { FormInput, FormGrid, FormContainer } from '../shared/FormComponents';
import type { LinkItem } from '../../../types/resume';

interface LinkEntryFormProps {
  link: LinkItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function LinkEntryForm({ link, onUpdate }: LinkEntryFormProps) {
  const handleChange = (field: string, value: unknown) => {
    onUpdate(link.id, field, value);
  };

  return (
    <FormContainer>
      <FormGrid columns={2}>
        <FormInput
          label="Link title"
          type="text"
          value={link.linkTitle}
          onChange={(e) => handleChange('linkTitle', e.target.value)}
          placeholder="My Website"
        />
        <FormInput
          label="URL"
          type="url"
          value={link.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="www.example.com"
        />
      </FormGrid>
    </FormContainer>
  );
}

export default LinkEntryForm;
