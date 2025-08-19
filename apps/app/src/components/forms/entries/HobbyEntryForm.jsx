import { FormInput, FormContainer } from '../shared/FormComponents';

function HobbyEntryForm({ hobby, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(hobby.id, field, value);
  };

  return (
    <FormContainer>
      <FormInput
        label="Hobby name"
        type="text"
        value={hobby.hobbyName}
        onChange={(e) => handleChange('hobbyName', e.target.value)}
        placeholder="Photography"
      />
    </FormContainer>
  );
}

export default HobbyEntryForm;