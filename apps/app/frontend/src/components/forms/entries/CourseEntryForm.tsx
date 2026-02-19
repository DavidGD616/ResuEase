import { FormInput, FormContainer } from '../shared/FormComponents';
import type { CourseItem } from '../../../types/resume';

interface CourseEntryFormProps {
  course: CourseItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function CourseEntryForm({ course, onUpdate }: CourseEntryFormProps) {
  const handleChange = (field: string, value: unknown) => {
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
