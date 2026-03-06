import { useTranslation } from 'react-i18next';
import { FormInput, FormContainer } from '../shared/FormComponents';
import type { CourseItem } from '../../../types/resume';

interface CourseEntryFormProps {
  course: CourseItem & { id: string };
  onUpdate: (id: string, field: string, value: unknown) => void;
}

function CourseEntryForm({ course, onUpdate }: CourseEntryFormProps) {
  const { t } = useTranslation();

  const handleChange = (field: string, value: unknown) => {
    onUpdate(course.id, field, value);
  };

  return (
    <FormContainer>
      <FormInput
        label={t('forms.courses.courseName')}
        type="text"
        value={course.courseName}
        onChange={(e) => handleChange('courseName', e.target.value)}
        placeholder={t('forms.courses.courseNamePlaceholder')}
      />
    </FormContainer>
  );
}

export default CourseEntryForm;
