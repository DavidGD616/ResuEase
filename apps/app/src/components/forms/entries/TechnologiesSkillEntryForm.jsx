import { FormInput, FormContainer } from '../shared/FormComponents';

function TechnologiesSkillsEntryForm({ technologiesSkill, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(technologiesSkill.id, field, value);
  };

  return (
    <FormContainer>
      <FormInput
        label="Technology/Skill name"
        type="text"
        value={technologiesSkill.technologiesSkillName}
        onChange={(e) => handleChange('technologiesSkillName', e.target.value)}
        placeholder="React"
      />
    </FormContainer>
  );
}

export default TechnologiesSkillsEntryForm;