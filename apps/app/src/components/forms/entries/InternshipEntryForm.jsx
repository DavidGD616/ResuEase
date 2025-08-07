import RichTextEditor from '../shared/RichTextEditor';
import { FormInput, FormGrid, FormContainer } from '../shared/FormComponents';


function InternshipEntryForm({ internship, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(internship.id, field, value);
  };

  return (
    <FormContainer>
      <FormGrid columns={2}>
        <FormInput
          label="Job title"
          type="text"
          value={internship.jobTitle}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          placeholder="Product Design Intern"
        />
        <FormInput
          label="Company name"
          type="text"
          value={internship.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Apple Inc."
        />
      </FormGrid>

      <FormGrid columns={3}>
        <FormInput
          label="Start date"
          type="text"
          value={internship.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          placeholder="Jan 2016"
        />
        <FormInput
          label="End date"
          type="text"
          value={internship.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          placeholder="Feb 2019"
        />
        <FormInput
          label="Location"
          type="text"
          value={internship.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Washington, D.C."
        />
      </FormGrid>

      <RichTextEditor
        value={internship.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="• Designed user-friendly interfaces for web and mobile applications.&#10;• Worked with teams to improve product features and overall user experience."
      />
    </FormContainer>
  );
}

export default InternshipEntryForm;