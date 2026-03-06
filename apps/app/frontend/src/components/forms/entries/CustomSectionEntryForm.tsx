import { useTranslation } from 'react-i18next';
import useBulletPoints from '../../../hooks/useBulletPoints';
import { FormInput, FormGrid, FormContainer, FormTextarea, FormEntryBullet, AddEntryButton } from '../shared/FormComponents';
import type { CustomEntryItem } from '../../../types/resume';

interface CustomSectionEntryFormProps {
  entry: CustomEntryItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
  jobTitle?: string;
}

function CustomSectionEntryForm({ entry, onUpdate, jobTitle }: CustomSectionEntryFormProps) {
  const { t } = useTranslation();
  const { bulletPoints, addBulletPoint, updateBulletPoint, removeBulletPoint } = useBulletPoints(entry.bulletPoints || []);

  const handleChange = (field: string, value: unknown) => {
    onUpdate(entry.id, field, value);
  };

  const handleAddBulletPoint = () => {
    const addPoints = addBulletPoint();
    handleChange('bulletPoints', addPoints);
  };

  const handleUpdateBulletPoint = (index: number, value: string) => {
    const updatePoints = updateBulletPoint(index, value);
    handleChange('bulletPoints', updatePoints);
  };

  const handleRemoveBulletPoint = (index: number) => {
    const removePoint = removeBulletPoint(index);
    handleChange('bulletPoints', removePoint);
  };

  return (
    <FormContainer>
      <FormGrid columns={2}>
        <FormInput
          label={t('forms.custom.entryHeader')}
          type="text"
          value={entry.header}
          onChange={(e) => handleChange('header', e.target.value)}
          placeholder={t('forms.custom.entryHeaderPlaceholder')}
        />
        <FormInput
          label={t('forms.custom.entrySubheader')}
          type="text"
          value={entry.subheader}
          onChange={(e) => handleChange('subheader', e.target.value)}
          placeholder={t('forms.custom.entrySubheaderPlaceholder')}
        />
      </FormGrid>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-(--ink-2) mb-1 sm:mb-2">
          {t('forms.custom.entryDescription')}
        </label>
        <FormTextarea
          value={entry.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder={t('forms.custom.entryDescriptionPlaceholder')}
          rows={3}
        />
      </div>

      {bulletPoints.map((bullet, index) => (
        <div key={index} className="border border-gray-300 rounded-lg">
          <FormEntryBullet
            title={t('forms.custom.entryDetail')}
            onRemove={() => handleRemoveBulletPoint(index)}
          />
          <div className="p-3 sm:p-4">
            <FormTextarea
              value={bullet}
              onChange={(e) => handleUpdateBulletPoint(index, e.target.value)}
              placeholder={t('forms.custom.entryBulletPlaceholder')}
              rows={3}
              aiTransform={{
                jobTitle,
                sectionName: 'Custom Section',
                fieldLabel: 'Detail',
                onTransformAccept: (text) => handleUpdateBulletPoint(index, text),
              }}
            />
          </div>
        </div>
      ))}

      <AddEntryButton onClick={handleAddBulletPoint} label={t('forms.custom.addBullet')} />
    </FormContainer>
  );
}

export default CustomSectionEntryForm;
