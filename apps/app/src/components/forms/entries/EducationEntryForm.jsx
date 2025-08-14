import { useState } from 'react';
import { FormInput, FormGrid, FormContainer, FormTextarea, FormEntryBullet, AddEntryButton } from '../shared/FormComponents';

function EducationEntryForm({ education, onUpdate }) {
  const [bulletPoints, setBulletPoints] = useState(education.bulletPoints || []);

  const handleChange = (field, value) => {
    onUpdate(education.id, field, value);
  };

  const addBulletPoint = () => {
    const newBulletPoints = [...bulletPoints, ''];
    setBulletPoints(newBulletPoints);
    handleChange('bulletPoints', newBulletPoints);
  };

  const updateBulletPoint = (index, value) => {
    const newBulletPoints = [...bulletPoints];
    newBulletPoints[index] = value;
    setBulletPoints(newBulletPoints);
    handleChange('bulletPoints', newBulletPoints);
  };

  const removeBulletPoint = (index) => {
    const newBulletPoints = bulletPoints.filter((_, i) => i !== index);
    setBulletPoints(newBulletPoints);
    handleChange('bulletPoints', newBulletPoints);
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

      <FormGrid columns={2}>
        <FormInput
          label="Date Start - Date End"
          type="text"
          value={education.dateRange}
          onChange={(e) => handleChange('dateRange', e.target.value)}
          placeholder="Feb 2018 - Jun 2022"
        />
        <FormInput
          label="Location (City, State)"
          type="text"
          value={education.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Washington, D.C."
        />
      </FormGrid>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Institution Description
        </label>
        <FormTextarea
          value={education.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Harvard University, a global leader in technology and innovation, ranked #2 on the Fortune 500 in 2023, with a revenue of $198.3 billion."
          rows={3}
        />
      </div>

      {/* Responsibility/Achievement Sections */}
      {bulletPoints.map((bullet, index) => (
        <div key={index} className="border border-gray-300 rounded-lg">
          <FormEntryBullet
            title="Education Details"
            onRemove={() => removeBulletPoint(index)}
          />
          <div className="p-3 sm:p-4">
            <FormTextarea
              value={bullet}
              onChange={(e) => updateBulletPoint(index, e.target.value)}
              placeholder="• Graduated with honors, recognized for outstanding achievement in Product Design."
              rows={3}
            />
          </div>
        </div>
      ))}
      
      <AddEntryButton
        onClick={addBulletPoint}
        label="Add Bullet Point"
      />
    </FormContainer>
  );
}

export default EducationEntryForm;