import { FormInput, FormGrid, FormContainer } from '../shared/FormComponents';

function CourseEntryForm({ course, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(course.id, field, value);
  };

  return (
    <FormContainer>
      <FormInput
        label="Institution"
        type="text"
        value={course.institution}
        onChange={(e) => handleChange('institution', e.target.value)}
        placeholder="Harvard University"
      />

      <FormGrid columns={2}>
        <FormInput
          label="Start date"
          type="text"
          value={course.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          placeholder="Jan 2016"
        />
        <FormInput
          label="End date"
          type="text"
          value={course.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          placeholder="Feb 2019"
        />
      </FormGrid>

      <FormInput
        label="Course"
        type="text"
        value={course.courseName}
        onChange={(e) => handleChange('courseName', e.target.value)}
        placeholder="Advanced Product Design"
      />
    </FormContainer>
  );
}

export default CourseEntryForm;