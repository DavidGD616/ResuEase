import useBulletPoints from '../../../hooks/useBulletPoints';
import { FormInput, FormGrid, FormContainer, FormTextarea, FormEntryBullet, AddEntryButton } from '../shared/FormComponents';
import type { EducationItem } from '../../../types/resume';

interface EducationEntryFormProps {
  education: EducationItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function EducationEntryForm({ education, onUpdate }: EducationEntryFormProps) {
  const { bulletPoints, addBulletPoint, updateBulletPoint, removeBulletPoint } = useBulletPoints(education.bulletPoints || []);

  const handleChange = (field: string, value: unknown) => {
    onUpdate(education.id, field, value);
  };

  const handleAddBulletPoint = () => {
    const newPoints = addBulletPoint();
    handleChange('bulletPoints', newPoints);
  };

  const handleUpdateBulletPoint = (index: number, value: string) => {
    const newPoints = updateBulletPoint(index, value);
    handleChange('bulletPoints', newPoints);
  };

  const handleRemoveBulletPoint = (index: number) => {
    const newPoints = removeBulletPoint(index);
    handleChange('bulletPoints', newPoints);
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
          hint={{
            title: 'Note',
            description: 'If you graduated, list your degree here. If not, list your major.',
          }}
          type="text"
          value={education.degree}
          onChange={(e) => handleChange('degree', e.target.value)}
          placeholder="Bachelor's Degree in Design"
        />
      </FormGrid>

      <FormGrid columns={2}>
        <FormInput
          label="Date Start - Date End"
          hint={{
            title: 'Note',
            description: (
              <div>
                <p className="mb-4">
                  List your graduation or completion date here. If it's recent, include the month and year (for example, May 2023). If it's something you finished more than a few years ago, just the year is enough (like 2018).
                </p>
                <p className="mb-4">
                  If you didn't finish the program but still want to show the education, you can just list the years you attended (for example, 2016–2018). That way it still adds value without drawing attention to the fact that you didn't graduate.
                </p>
              </div>
            ),
          }}
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

      {/* Responsibility/Achievement Sections */}
      {bulletPoints.map((bullet, index) => (
        <div key={index} className="border border-gray-300 rounded-lg">
          <FormEntryBullet
            hint={{
              title: 'About this field',
              description: (
                <div>
                  <p className="mb-4">
                    This section is a good place to point out any coursework, projects, or achievements from your education that are worth showing off.
                  </p>
                  <p className="mb-4">
                    Example: Relevant Coursework: Data Structures, Algorithms, Machine Learning, Database Systems
                  </p>
                  <p className="mb-4">
                    If you want to add extra detail under one of these points, you can use a sub-bullet by clicking the three dots on the right.
                  </p>
                </div>
              ),
            }}
            title="Education Details"
            onRemove={() => handleRemoveBulletPoint(index)}
          />
          <div className="p-3 sm:p-4">
            <FormTextarea
              value={bullet}
              onChange={(e) => handleUpdateBulletPoint(index, e.target.value)}
              placeholder="• Graduated with honors, recognized for outstanding achievement in Product Design."
              rows={3}
            />
          </div>
        </div>
      ))}

      <AddEntryButton onClick={handleAddBulletPoint} label="Add Bullet Point" />
    </FormContainer>
  );
}

export default EducationEntryForm;
