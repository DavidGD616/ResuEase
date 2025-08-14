import RichTextEditor from '../shared/RichTextEditor';
import useBulletPoints from '../../../hooks/useBulletPoints';
import { FormInput, FormGrid, FormContainer, FormTextarea, FormEntryBullet, AddEntryButton } from '../shared/FormComponents';


function InternshipEntryForm({ internship, onUpdate }) {
  const { bulletPoints, addBulletPoint, updateBulletPoint, removeBulletPoint } = useBulletPoints(internship.bulletPoints || []);

  const handleChange = (field, value) => {
    onUpdate(internship.id, field, value);
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
          placeholder="Jun 2020"
        />
        <FormInput
          label="End date"
          type="text"
          value={internship.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          placeholder="Aug 2020"
        />
        <FormInput
          label="Location"
          type="text"
          value={internship.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="San Francisco, CA"
        />
      </FormGrid>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Company / Role Description
        </label>
        <FormTextarea
          value={internship.description}
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
              placeholder="• Worked with teams to improve product features and overall user experience."
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

export default InternshipEntryForm;