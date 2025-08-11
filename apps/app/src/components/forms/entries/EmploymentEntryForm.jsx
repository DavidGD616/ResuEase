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
          value={experience.isCurrentJob ? "Present" : experience.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          placeholder={experience.isCurrentJob ? "Present" : "Feb 2019"}
          disabled={experience.isCurrentJob}
          
        />
        <FormInput
          label="Location"
          type="text"
          value={experience.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Washington, D.C."
        />
      </FormGrid>

      <div className="mb-3 sm:mb-4">
        <label className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={experience.isCurrentJob || false}
            onChange={(e) => {
              handleChange('isCurrentJob', e.target.checked);
              if (e.target.checked) {
                handleChange('endDate', '');
              }
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          I currently work here
        </label>
      </div>

      <RichTextEditor
        value={experience.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="• Designed user-friendly interfaces for web and mobile applications.&#10;• Worked with teams to improve product features and overall user experience."
      />
    </FormContainer>
  );
}

export default EmploymentEntryForm;