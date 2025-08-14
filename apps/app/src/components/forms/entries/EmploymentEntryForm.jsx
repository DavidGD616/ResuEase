import useBulletPoints from '../../../hooks/useBulletPoints';
import { FormInput, FormGrid, FormContainer, FormTextarea, FormEntryBullet, AddEntryButton } from '../shared/FormComponents';


function EmploymentEntryForm({ experience, onUpdate }) {
  const { bulletPoints, addBulletPoint, updateBulletPoint, removeBulletPoint } = useBulletPoints(experience.bulletPoints || []);

  const handleChange = (field, value) => {
    onUpdate(experience.id, field, value);
  };

  const handleAddBulletPoint = () => {
    const newPoints = addBulletPoint();
    handleChange('bulletPoints', newPoints);
  };

  const handleUpdateBulletPoint = (index, value) => {
    const newPoints = updateBulletPoint(index, value);
    handleChange('bulletPoints', newPoints);
  };

  const handleRemoveBulletPoint = (index) => {
    const newPoints = removeBulletPoint(index);
    handleChange('bulletPoints', newPoints);
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
                handleChange('endDate', 'Present'); // <-- send "Present" when checked
              } else {
                handleChange('endDate', '');
              }
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          I currently work here
        </label>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Company Description
        </label>
        <FormTextarea
          value={experience.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief summary of role and impact."
          rows={3}
        />
      </div>

      {/* Responsibilities / Achievements */}
      {bulletPoints.map((bullet, index) => (
        <div key={index} className="border border-gray-300 rounded-lg mt-3">
          <FormEntryBullet
            title="Responsibilities / Achievements"
            onRemove={() => handleRemoveBulletPoint(index)}
          />
          <div className="p-3 sm:p-4">
            <FormTextarea
              value={bullet}
              onChange={(e) => handleUpdateBulletPoint(index, e.target.value)}
              placeholder="• Led cross-functional teams to deliver product improvements."
              rows={3}
            />
          </div>
        </div>
      ))}

      <div className="mt-3">
        <AddEntryButton
          onClick={handleAddBulletPoint}
          label="Add Bullet Point"
        />
      </div>
    </FormContainer>
  );
}

export default EmploymentEntryForm;