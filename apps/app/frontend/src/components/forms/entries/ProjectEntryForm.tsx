import { useTranslation } from 'react-i18next';
import useBulletPoints from '../../../hooks/useBulletPoints';
import { FormInput, FormGrid, FormContainer, FormEntryBullet, FormTextarea, AddEntryButton } from '../shared/FormComponents';
import type { ProjectItem } from '../../../types/resume';

interface ProjectEntryFormProps {
  project: ProjectItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
  jobTitle?: string;
}

function ProjectEntryForm({ project, onUpdate, jobTitle }: ProjectEntryFormProps) {
  const { t } = useTranslation();
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
        label={t('forms.projects.name')}
        type="text"
        value={project.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder={t('forms.projects.namePlaceholder')}
      />

      <FormGrid columns={2}>
        <FormInput
          label={t('forms.projects.url')}
          type="url"
          value={project.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder={t('forms.projects.urlPlaceholder')}
        />
        <FormInput
          label={t('forms.projects.dateRange')}
          type="text"
          value={project.dateRange}
          onChange={(e) => handleChange('dateRange', e.target.value)}
          placeholder={t('forms.projects.dateRangePlaceholder')}
        />
      </FormGrid>

      {bulletPoints.map((bullet, index) => (
        <div key={index} className="border border-gray-300 rounded-lg mt-3">
          <FormEntryBullet
            hint={{
              title: t('forms.projects.detailHint.title'),
              description: (
                <div>
                  <p className="mb-4">{t('forms.projects.detailHint.p1')}</p>
                  <p>{t('forms.projects.detailHint.example')}</p>
                </div>
              ),
            }}
            title={t('forms.projects.detail')}
            onRemove={() => handleRemoveBulletPoint(index)}
          />
          <div className="p-3 sm:p-4">
            <FormTextarea
              value={bullet}
              onChange={(e) => handleUpdateBulletPoint(index, e.target.value)}
              placeholder={t('forms.projects.bulletPlaceholder')}
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
      <AddEntryButton onClick={handleAddBulletPoint} label={t('forms.projects.addBullet')} />
    </FormContainer>
  );
}

export default ProjectEntryForm;
