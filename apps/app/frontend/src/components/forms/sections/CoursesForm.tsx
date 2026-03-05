import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import CourseEntryForm from '../entries/CourseEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import type { FormData, CourseItem } from '../../../types/resume';

interface CoursesFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

function CoursesForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: CoursesFormProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const courses = (formData.courses || []) as (CourseItem & { id: string })[];

  const addCourse = () => {
    const newItemId = addSectionItem('courses');
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeCourse = (id: string) => {
    removeSectionItem('courses', id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateCourse = (id: string, field: string, value: unknown) => {
    updateSectionItem('courses', id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <FormHeader title={t('forms.courses.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.courses.description')}
      </FormDescription>

      <FormSection>
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={course.courseName || t('common.untitled')}
              isExpanded={expandedItems[course.id]}
              onToggleExpanded={() => toggleExpanded(course.id)}
              onRemove={() => removeCourse(course.id)}
            />

            {expandedItems[course.id] && (
              <CourseEntryForm course={course} onUpdate={updateCourse} />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addCourse} label={t('forms.courses.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default CoursesForm;
