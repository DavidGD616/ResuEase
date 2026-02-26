import useBulletPoints from '../../../hooks/useBulletPoints';
import { FormInput, FormGrid, FormContainer, FormTextarea, FormEntryBullet, AddEntryButton, HintIcon } from '../shared/FormComponents';
import type { EmploymentItem } from '../../../types/resume';

interface EmploymentEntryFormProps {
  experience: EmploymentItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
  jobTitle?: string;
}

function EmploymentEntryForm({ experience, onUpdate, jobTitle }: EmploymentEntryFormProps) {
  const { bulletPoints, addBulletPoint, updateBulletPoint, removeBulletPoint } = useBulletPoints(experience.bulletPoints || []);

  const handleChange = (field: string, value: unknown) => {
    onUpdate(experience.id, field, value);
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
          label="Job title"
          hint={{
            title: 'About this field',
            description: (
              <div className="text-left">
                <p className="mb-4">
                  It's okay to adjust your job title on your resume so it lines up better with the role you're applying for, as long as it's still true to what you actually did. Recruiters won't care, and it can make a big difference in how your application is received.
                </p>
                <p className="mb-4">
                  For example, if your official title was "Data Analyst" but your work included engineering tasks, you could list it as "Data Analytics Engineer" when applying to a "Data Engineer" role. That small change makes your experience look like a closer match.
                </p>
                <p>
                  And don't feel bad about it—job titles aren't some universal standard. Companies make them up, and sometimes they even use vague ones on purpose so their people don't get poached on LinkedIn.
                </p>
              </div>
            ),
          }}
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
          hint={{
            title: 'Date Start - Date End',
            description: (
              <div className="text-left">
                <p className="mb-4">
                  Try to keep your work history clean without big overlaps or long gaps. It's fine to polish the way you present dates, but don't stretch the truth if it's obvious you weren't working for a while.
                </p>
                <p className="mb-4">
                  One way to make gaps less noticeable is to list only years instead of months. For example, "2019–2021" looks smoother than "May 2019–January 2021." This works especially well for people with 10+ years of experience, where exact months don't matter as much anyway.
                </p>
              </div>
            ),
          }}
          type="text"
          value={experience.isCurrentJob ? 'Present' : experience.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          placeholder={experience.isCurrentJob ? 'Present' : 'Feb 2019'}
          disabled={experience.isCurrentJob}
        />
        <FormInput
          label="Location (City, State)"
          type="text"
          value={experience.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="San Francisco, CA"
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
                handleChange('endDate', 'Present');
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
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            Company Description
          </label>
          <HintIcon
            title="About this Section"
            description={
              <p className="text-left font-medium">
                This section helps employers understand the company you worked for. Keep the description short, but include key details that add weight. For example, mention if the company is a Fortune 500 or Fortune 100, if they've raised major funding, or if they bring in significant revenue (over $100M) or have a large market cap (over $1B). Those details give context and make your experience stand out more.
              </p>
            }
          />
        </div>
        <FormTextarea
          value={experience.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief summary of role and impact."
          rows={3}
          aiTransform={{
            jobTitle,
            sectionName: 'Employment History',
            fieldLabel: 'Description',
            onTransformAccept: (text) => handleChange('description', text),
          }}
        />
      </div>

      {/* Responsibilities / Achievements */}
      {bulletPoints.map((bullet, index) => (
        <div key={index} className="border border-gray-300 rounded-lg mt-3">
          <FormEntryBullet
            hint={{
              title: 'About this field',
              description: (
                <div className="text-left">
                  <p className="mb-4">
                    This is the spot to highlight what you did at the company your key responsibilities or the achievements you're most proud of.
                  </p>
                  <p>
                    Example: Led the full product development lifecycle from concept to launch, making sure it matched both market needs and company goals.
                  </p>
                </div>
              ),
            }}
            title="Responsibilities / Achievements"
            onRemove={() => handleRemoveBulletPoint(index)}
          />
          <div className="p-3 sm:p-4">
            <FormTextarea
              value={bullet}
              onChange={(e) => handleUpdateBulletPoint(index, e.target.value)}
              placeholder="• Led cross-functional teams to deliver product improvements."
              rows={3}
              aiTransform={{
                jobTitle,
                sectionName: 'Employment History',
                fieldLabel: 'Responsibility / Achievement',
                onTransformAccept: (text) => handleUpdateBulletPoint(index, text),
              }}
            />
          </div>
        </div>
      ))}

      <div className="mt-3">
        <AddEntryButton onClick={handleAddBulletPoint} label="Add Bullet Point" />
      </div>
    </FormContainer>
  );
}

export default EmploymentEntryForm;
