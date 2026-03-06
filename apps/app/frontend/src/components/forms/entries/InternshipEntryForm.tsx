import { useTranslation } from 'react-i18next';
import useBulletPoints from '../../../hooks/useBulletPoints';
import { FormInput, FormGrid, FormContainer, FormTextarea, FormEntryBullet, AddEntryButton } from '../shared/FormComponents';
import type { InternshipItem } from '../../../types/resume';

interface InternshipEntryFormProps {
  internship: InternshipItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
  jobTitle?: string;
}

function InternshipEntryForm({ internship, onUpdate, jobTitle }: InternshipEntryFormProps) {
  const { t } = useTranslation();
  const { bulletPoints, addBulletPoint, updateBulletPoint, removeBulletPoint } = useBulletPoints(internship.bulletPoints || []);

  const handleChange = (field: string, value: unknown) => {
    onUpdate(internship.id, field, value);
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
          label={t('forms.internships.jobTitle')}
          type="text"
          value={internship.jobTitle}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          placeholder={t('forms.internships.jobTitlePlaceholder')}
        />
        <FormInput
          label={t('forms.internships.company')}
          type="text"
          value={internship.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder={t('forms.internships.companyPlaceholder')}
        />
      </FormGrid>

      <FormGrid columns={3}>
        <FormInput
          label={t('forms.internships.startDate')}
          type="text"
          value={internship.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          placeholder={t('forms.internships.startDatePlaceholder')}
        />
        <FormInput
          label={t('forms.internships.endDate')}
          type="text"
          value={internship.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          placeholder={t('forms.internships.endDatePlaceholder')}
        />
        <FormInput
          label={t('forms.internships.location')}
          type="text"
          value={internship.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder={t('forms.internships.locationPlaceholder')}
        />
      </FormGrid>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-(--ink-2) mb-1 sm:mb-2">
          {t('forms.internships.roleDescription')}
        </label>
        <FormTextarea
          value={internship.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder={t('forms.internships.descriptionPlaceholder')}
          rows={3}
          aiTransform={{
            jobTitle,
            sectionName: 'Internships',
            fieldLabel: 'Description',
            onTransformAccept: (text) => handleChange('description', text),
          }}
        />
      </div>

      {bulletPoints.map((bullet, index) => (
        <div key={index} className="border border-gray-300 rounded-lg mt-3">
          <FormEntryBullet
            title={t('forms.internships.responsibilities')}
            onRemove={() => handleRemoveBulletPoint(index)}
          />
          <div className="p-3 sm:p-4">
            <FormTextarea
              value={bullet}
              onChange={(e) => handleUpdateBulletPoint(index, e.target.value)}
              placeholder={t('forms.internships.bulletPlaceholder')}
              rows={3}
              aiTransform={{
                jobTitle,
                sectionName: 'Internships',
                fieldLabel: 'Responsibility / Achievement',
                onTransformAccept: (text) => handleUpdateBulletPoint(index, text),
              }}
            />
          </div>
        </div>
      ))}

      <div className="mt-3">
        <AddEntryButton onClick={handleAddBulletPoint} label={t('forms.internships.addBullet')} />
      </div>
    </FormContainer>
  );
}

export default InternshipEntryForm;
