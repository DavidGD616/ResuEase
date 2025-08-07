import RichTextEditor from '../shared/RichTextEditor';
import { FormInput, FormGrid, FormContainer } from '../shared/FormComponents';


function EducationEntryForm({ education, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(education.id, field, value);
  };

  return (
    <FormContainer>
      <FormGrid columns={2}>
        <FormInput
          label="Institution"
          type="text"
          value={education.institution}
          onChange={(e) => handleChange('institution', e.target.value)}
          placeholder="Harvard University"
        />
        <FormInput
          label="Degree"
          type="text"
          value={education.degree}
          onChange={(e) => handleChange('degree', e.target.value)}
          placeholder="Bachelor's Degree in Design"
        />
      </FormGrid>

      <FormGrid columns={3}>
        <FormInput
          label="Start date"
          type="text"
          value={education.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          placeholder="Jan 2016"
        />
        <FormInput
          label="End date"
          type="text"
          value={education.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          placeholder="Feb 2019"
        />
        <FormInput
          label="Location"
          type="text"
          value={education.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Washington, D.C."
        />
      </FormGrid>

      <RichTextEditor
        value={education.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Graduated with honors, recognized for outstanding achievement in Product Design."
      />
    </FormContainer>
  );
}

export default EducationEntryForm;