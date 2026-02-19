import { FormInput, FormContainer } from '../shared/FormComponents';
import type { SkillItem } from '../../../types/resume';

interface SkillEntryFormProps {
  skill: SkillItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function SkillEntryForm({ skill, onUpdate }: SkillEntryFormProps) {
  const handleChange = (field: string, value: unknown) => {
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
