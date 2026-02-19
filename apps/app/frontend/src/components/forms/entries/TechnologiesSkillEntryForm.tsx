import { FormInput, FormContainer } from '../shared/FormComponents';
import type { TechSkillItem } from '../../../types/resume';

interface TechnologiesSkillsEntryFormProps {
  technologiesSkill: TechSkillItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function TechnologiesSkillsEntryForm({ technologiesSkill, onUpdate }: TechnologiesSkillsEntryFormProps) {
  const handleChange = (field: string, value: unknown) => {
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
