import { FormInput, FormGrid, FormContainer } from '../shared/FormComponents';

function ReferenceEntryForm({ reference, onUpdate }) {
  const handleChange = (field, value) => {
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