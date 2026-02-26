import useBulletPoints from '../../../hooks/useBulletPoints';
import { FormInput, FormGrid, FormContainer, FormEntryBullet, FormTextarea, AddEntryButton } from '../shared/FormComponents';
import type { ProjectItem } from '../../../types/resume';

interface ProjectEntryFormProps {
  project: ProjectItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
  jobTitle?: string;
}

function ProjectEntryForm({ project, onUpdate, jobTitle }: ProjectEntryFormProps) {
  const { bulletPoints, addBulletPoint, updateBulletPoint, removeBulletPoint } =
    useBulletPoints(project.bulletPoints || []);

  const handleChange = (field: string, value: unknown) => {
    onUpdate(project.id, field, value);
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
      <FormInput
        label="Project Name"
        type="text"
        value={project.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Superawesome App"
      />

      <FormGrid columns={2}>
        <FormInput
          label="Project URL (optional)"
          type="url"
          value={project.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://github.com/username/project"
        />
        <FormInput
          label="Date Range (optional)"
          type="text"
          value={project.dateRange}
          onChange={(e) => handleChange('dateRange', e.target.value)}
          placeholder="March 2024 - July 2025"
        />
      </FormGrid>

      {bulletPoints.map((bullet, index) => (
        <div key={index} className="border border-gray-300 rounded-lg mt-3">
          <FormEntryBullet
            hint={{
              title: 'About this field',
              description: (
                <div>
                  <p className="mb-4">
                    This is where you can tell the employer about your responsibilities or achievements for this project.
                  </p>
                  <p>Example: Developed Devsboard, a job aggregator web app that scrapes and displays real-time job listings across the U.S.</p>
                </div>
              ),
            }}
            title="Description/Achievement"
            onRemove={() => handleRemoveBulletPoint(index)}
          />
          <div className="p-3 sm:p-4">
            <FormTextarea
              value={bullet}
              onChange={(e) => handleUpdateBulletPoint(index, e.target.value)}
              placeholder="• Developed Devsboard, a job aggregator web app that scrapes and displays real-time job listings across the U.S."
              rows={3}
              aiTransform={{
                jobTitle,
                sectionName: 'Projects',
                fieldLabel: 'Project Detail',
                onTransformAccept: (text) => handleUpdateBulletPoint(index, text),
              }}
            />
          </div>
        </div>
      ))}
      <AddEntryButton onClick={handleAddBulletPoint} label="Add Bullet Point" />
    </FormContainer>
  );
}

export default ProjectEntryForm;
