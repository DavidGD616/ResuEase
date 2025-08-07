import RichTextEditor from '../shared/RichTextEditor';
import { FormInput, FormGrid, FormContainer } from '../shared/FormComponents';


function EmploymentEntryForm({ experience, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(experience.id, field, value);
  };

  return (
    <FormContainer>
      <FormGrid columns={2}>
        <FormInput
          label="Job title"
          type="text"
          value={experience.jobTitle}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          placeholder="Product Designer"
        />
        <FormInput
          label="Company name"
          type="text"
          value={experience.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Apple Inc."
        />
      </FormGrid>

      <FormGrid columns={3}>
        <FormInput
          label="Start date"
          type="text"
          value={experience.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          placeholder="Jan 2016"
        />
        <FormInput
          label="End date"
          type="text"
          value={experience.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          placeholder="Feb 2019"
        />
        <FormInput
          label="Location"
          type="text"
          value={experience.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Washington, D.C."
        />
      </FormGrid>

      <RichTextEditor
        value={experience.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="• Designed user-friendly interfaces for web and mobile applications.&#10;• Worked with teams to improve product features and overall user experience."
      />
    </FormContainer>
  );
}

export default EmploymentEntryForm;