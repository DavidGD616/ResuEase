import { useTranslation } from 'react-i18next';
import useBulletPoints from '../../../hooks/useBulletPoints';
import { FormInput, FormGrid, FormContainer, FormTextarea, FormEntryBullet, AddEntryButton } from '../shared/FormComponents';
import type { EducationItem } from '../../../types/resume';

interface EducationEntryFormProps {
  education: EducationItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
  jobTitle?: string;
}

function EducationEntryForm({ education, onUpdate, jobTitle }: EducationEntryFormProps) {
  const { t } = useTranslation();
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
          label={t('forms.education.institution')}
          type="text"
          value={education.institution}
          onChange={(e) => handleChange('institution', e.target.value)}
          placeholder={t('forms.education.institutionPlaceholder')}
        />
        <FormInput
          label={t('forms.education.degree')}
          hint={{
            title: t('forms.education.degreeHint.title'),
            description: t('forms.education.degreeHint.description'),
          }}
          type="text"
          value={education.degree}
          onChange={(e) => handleChange('degree', e.target.value)}
          placeholder={t('forms.education.degreePlaceholder')}
        />
      </FormGrid>

      <FormGrid columns={2}>
        <FormInput
          label={t('forms.education.dateRange')}
          hint={{
            title: t('forms.education.dateRangeHint.title'),
            description: (
              <div>
                <p className="mb-4">{t('forms.education.dateRangeHint.p1')}</p>
                <p className="mb-4">{t('forms.education.dateRangeHint.p2')}</p>
              </div>
            ),
          }}
          type="text"
          value={education.dateRange}
          onChange={(e) => handleChange('dateRange', e.target.value)}
          placeholder={t('forms.education.dateRangePlaceholder')}
        />
        <FormInput
          label={t('forms.education.location')}
          type="text"
          value={education.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder={t('forms.education.locationPlaceholder')}
        />
      </FormGrid>

      {bulletPoints.map((bullet, index) => (
        <div key={index} className="border border-gray-300 rounded-lg">
          <FormEntryBullet
            hint={{
              title: t('forms.education.detailsHint.title'),
              description: (
                <div>
                  <p className="mb-4">{t('forms.education.detailsHint.p1')}</p>
                  <p className="mb-4">{t('forms.education.detailsHint.example')}</p>
                  <p className="mb-4">{t('forms.education.detailsHint.p2')}</p>
                </div>
              ),
            }}
            title={t('forms.education.details')}
            onRemove={() => handleRemoveBulletPoint(index)}
          />
          <div className="p-3 sm:p-4">
            <FormTextarea
              value={bullet}
              onChange={(e) => handleUpdateBulletPoint(index, e.target.value)}
              placeholder={t('forms.education.detailsPlaceholder')}
              rows={3}
              aiTransform={{
                jobTitle,
                sectionName: 'Education',
                fieldLabel: 'Education Details',
                onTransformAccept: (text) => handleUpdateBulletPoint(index, text),
              }}
            />
          </div>
        </div>
      ))}

      <AddEntryButton onClick={handleAddBulletPoint} label={t('forms.education.addBullet')} />
    </FormContainer>
  );
}

export default EducationEntryForm;
