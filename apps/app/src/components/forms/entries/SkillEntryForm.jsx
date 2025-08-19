import { FormInput, FormContainer } from '../shared/FormComponents';

function SkillEntryForm({ skill, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(skill.id, field, value);
  };

  return (
    <FormContainer>
      <FormInput
        label="Skill name"
        type="text"
        value={skill.skillName}
        onChange={(e) => handleChange('skillName', e.target.value)}
        placeholder="Project Management"
      />
    </FormContainer>
  );
}

export default SkillEntryForm;