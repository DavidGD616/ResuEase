import RichTextEditor from '../shared/RichTextEditor';
import { FormInput, FormGrid, FormContainer } from '../shared/FormComponents';


function CustomSectionEntryForm({ entry, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(entry.id, field, value);
  };

  return (
    <FormContainer>
      {/* Header and Subheader */}
      <FormGrid columns={2}>
        <FormInput
          label="Header"
          type="text"
          value={entry.header}
          onChange={(e) => handleChange('header', e.target.value)}
          placeholder="Foundation"
        />
        <FormInput
          label="Subheader"
          type="text"
          value={entry.subheader}
          onChange={(e) => handleChange('subheader', e.target.value)}
          placeholder="Isaac Asimov"
        />
      </FormGrid>

      <RichTextEditor
        value={entry.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Asimov's Foundation is a groundbreaking science fiction series that explores themes of humanity, power, and the fate of civilizations."
        label=""
      />
    </FormContainer>
  );
}

export default CustomSectionEntryForm;