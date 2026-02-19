import { FormInput, FormGrid, FormContainer } from '../shared/FormComponents';
import type { ReferenceItem } from '../../../types/resume';

interface ReferenceEntryFormProps {
  reference: ReferenceItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function ReferenceEntryForm({ reference, onUpdate }: ReferenceEntryFormProps) {
  const handleChange = (field: string, value: unknown) => {
    onUpdate(reference.id, field, value);
  };

  return (
    <FormContainer>
      <FormGrid columns={2}>
        <FormInput
          label="Referent name"
          type="text"
          value={reference.referentName}
          onChange={(e) => handleChange('referentName', e.target.value)}
          placeholder="John Smith"
        />
        <FormInput
          label="Referent company"
          type="text"
          value={reference.referentCompany}
          onChange={(e) => handleChange('referentCompany', e.target.value)}
          placeholder="Apple Inc."
        />
      </FormGrid>

      <FormGrid columns={2}>
        <FormInput
          label="Referent email"
          type="email"
          value={reference.referentEmail}
          onChange={(e) => handleChange('referentEmail', e.target.value)}
          placeholder="john@example.com"
        />
        <FormInput
          label="Referent phone"
          type="tel"
          value={reference.referentPhone}
          onChange={(e) => handleChange('referentPhone', e.target.value)}
          placeholder="999 888 7777"
        />
      </FormGrid>
    </FormContainer>
  );
}

export default ReferenceEntryForm;
