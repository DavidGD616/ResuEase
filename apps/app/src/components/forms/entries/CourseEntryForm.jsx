import { FormInput, FormGrid, FormContainer } from '../shared/FormComponents';

function CourseEntryForm({ course, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(course.id, field, value);
  };

  return (
    <FormContainer>
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