import useBulletPoints from '../../../hooks/useBulletPoints';
import { FormInput, FormGrid, FormContainer, FormTextarea, FormEntryBullet, AddEntryButton } from '../shared/FormComponents';

function CustomSectionEntryForm({ entry, onUpdate }) {
  const { bulletPoints, addBulletPoint, updateBulletPoint, removeBulletPoint } = useBulletPoints(entry.bulletPoints || []);

  console.log(entry)

  const handleChange = (field, value) => {
    onUpdate(entry.id, field, value);
  };

  const handleAddBulletPoint = () => {
    const addPoints = addBulletPoint();
    handleChange('bulletPoints', addPoints);
  };

  const handleUpdateBulletPoint = (index, value) => {
    const updatePoints = updateBulletPoint(index, value);
    handleChange('bulletPoints', updatePoints);
  };

  const handleRemoveBulletPoint = (index) => {
    const removePoint = removeBulletPoint(index);
    handleChange('bulletPoints', removePoint)
  }

  return (
    <FormContainer>
      {/* Header and Subheader */}
      <FormGrid columns={2}>
        <FormInput
          label="Header"
          type="text"
          value={entry.header}
          onChange={(e) => handleChange('header', e.target.value)}
          placeholder="Foundation"
        />
        <FormInput
          label="Subheader"
          type="text"
          value={entry.subheader}
          onChange={(e) => handleChange('subheader', e.target.value)}
          placeholder="Isaac Asimov"
        />
      </FormGrid>

      <div>
        <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>
          Custom Description
        </label>
        <FormTextarea 
          value={entry.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Write any custom data"
          rows={3}
        />
      </div>

      {/* Custom Bulletpoints */}
      {bulletPoints.map((bullet, index) => (
        <div key={index} className='border border-gray-300 rounded-lg'>
          <FormEntryBullet
            title="Custom Section Details"
            onRemove={() => handleRemoveBulletPoint(index)}
          />
          <div className='p-3 sm:p-4'>
            <FormTextarea
              value={bullet}
              onChange={(e) => handleUpdateBulletPoint(index, e.target.value)}
              placeholder="• Custom bulletpoint"
              rows={3}
            />
          </div>
        </div>
      ))}

      <AddEntryButton 
        onClick={handleAddBulletPoint}
        label="Add Bullet Point"
      />
    </FormContainer>
  );
}

export default CustomSectionEntryForm;