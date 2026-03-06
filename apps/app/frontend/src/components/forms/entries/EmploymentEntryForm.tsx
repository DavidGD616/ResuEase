import { useTranslation } from 'react-i18next';
import useBulletPoints from '../../../hooks/useBulletPoints';
import { FormInput, FormGrid, FormContainer, FormTextarea, FormEntryBullet, AddEntryButton, HintIcon } from '../shared/FormComponents';
import type { EmploymentItem } from '../../../types/resume';

interface EmploymentEntryFormProps {
  experience: EmploymentItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
  jobTitle?: string;
}

function EmploymentEntryForm({ experience, onUpdate, jobTitle }: EmploymentEntryFormProps) {
  const { t } = useTranslation();
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
          label={t('forms.employment.jobTitle')}
          hint={{
            title: t('forms.employment.jobTitleHint.title'),
            description: (
              <div className="text-left">
                <p className="mb-4">{t('forms.employment.jobTitleHint.p1')}</p>
                <p className="mb-4">{t('forms.employment.jobTitleHint.p2')}</p>
                <p>{t('forms.employment.jobTitleHint.p3')}</p>
              </div>
            ),
          }}
          type="text"
          value={experience.jobTitle}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          placeholder={t('forms.employment.jobTitlePlaceholder')}
        />
        <FormInput
          label={t('forms.employment.company')}
          type="text"
          value={experience.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder={t('forms.employment.companyPlaceholder')}
        />
      </FormGrid>

      <FormGrid columns={3}>
        <FormInput
          label={t('forms.employment.startDate')}
          type="text"
          value={experience.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          placeholder={t('forms.employment.startDatePlaceholder')}
        />
        <FormInput
          label={t('forms.employment.endDate')}
          hint={{
            title: t('forms.employment.endDateHint.title'),
            description: (
              <div className="text-left">
                <p className="mb-4">{t('forms.employment.endDateHint.p1')}</p>
                <p className="mb-4">{t('forms.employment.endDateHint.p2')}</p>
              </div>
            ),
          }}
          type="text"
          value={experience.isCurrentJob ? t('forms.employment.present') : experience.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          placeholder={experience.isCurrentJob ? t('forms.employment.present') : t('forms.employment.endDatePlaceholder')}
          disabled={experience.isCurrentJob}
        />
        <FormInput
          label={t('forms.employment.location')}
          type="text"
          value={experience.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder={t('forms.employment.locationPlaceholder')}
        />
      </FormGrid>

      <div className="mb-3 sm:mb-4">
        <label className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-(--ink-2) cursor-pointer">
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
          {t('forms.employment.currentlyWork')}
        </label>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <label className="block text-xs sm:text-sm font-medium text-(--ink-2)">
            {t('forms.employment.companyDescription')}
          </label>
          <HintIcon
            title={t('forms.employment.companyDescriptionHint.title')}
            description={
              <p className="text-left font-medium">
                {t('forms.employment.companyDescriptionHint.description')}
              </p>
            }
          />
        </div>
        <FormTextarea
          value={experience.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder={t('forms.employment.companyDescriptionPlaceholder')}
          rows={3}
          aiTransform={{
            jobTitle,
            sectionName: 'Employment History',
            fieldLabel: 'Description',
            onTransformAccept: (text) => handleChange('description', text),
          }}
        />
      </div>

      {bulletPoints.map((bullet, index) => (
        <div key={index} className="border border-gray-300 rounded-lg mt-3">
          <FormEntryBullet
            hint={{
              title: t('forms.employment.responsibilitiesHint.title'),
              description: (
                <div className="text-left">
                  <p className="mb-4">{t('forms.employment.responsibilitiesHint.p1')}</p>
                  <p>{t('forms.employment.responsibilitiesHint.example')}</p>
                </div>
              ),
            }}
            title={t('forms.employment.responsibilities')}
            onRemove={() => handleRemoveBulletPoint(index)}
          />
          <div className="p-3 sm:p-4">
            <FormTextarea
              value={bullet}
              onChange={(e) => handleUpdateBulletPoint(index, e.target.value)}
              placeholder={t('forms.employment.bulletPlaceholder')}
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
        <AddEntryButton onClick={handleAddBulletPoint} label={t('forms.employment.addBullet')} />
      </div>
    </FormContainer>
  );
}

export default EmploymentEntryForm;
