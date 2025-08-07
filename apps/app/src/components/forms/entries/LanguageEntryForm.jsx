import { FormInput, FormGrid, FormContainer, FormSelect } from '../shared/FormComponents';

function LanguageEntryForm({ language, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(language.id, field, value);
  };

  const proficiencyLevels = [
    'Not applicable',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Native'
  ];

  return (
    <FormContainer>
      <FormGrid columns={2}>
        <FormInput
          label="Language"
          type="text"
          value={language.language}
          onChange={(e) => handleChange('language', e.target.value)}
          placeholder="English"
        />
        <FormSelect
          label="Proficiency"
          value={language.proficiency}
          onChange={(e) => handleChange('proficiency', e.target.value)}
          options={proficiencyLevels}
        />
      </FormGrid>
    </FormContainer>
  );
}

export default LanguageEntryForm;