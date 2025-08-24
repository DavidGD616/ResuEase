import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import CourseEntryForm from '../entries/CourseEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function CoursesForm({ 
  onDeleteSection, 
  formData, 
  addSectionItem, 
  updateSectionItem, 
  removeSectionItem 
}) {
  const [expandedItems, setExpandedItems] = useState({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const courses = formData.courses || [];

  const addCourse = () => {
    const newItemId = addSectionItem('courses');
    setExpandedItems(prev => ({ ...prev, [newItemId]: true }));
  };

  const removeCourse = (id) => {
    removeSectionItem('courses', id);
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateCourse = (id, field, value) => {
    updateSectionItem('courses', id, field, value);
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <FormHeader title="Courses" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        Include relevant courses, certifications, and training programs that demonstrate your commitment to professional development and skill enhancement.
      </FormDescription>
      
      <FormSection>
        {courses.map((course) => (
          <div key={course.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={course.courseName || 'Untitled'}
              isExpanded={expandedItems[course.id]}
              onToggleExpanded={() => toggleExpanded(course.id)}
              onRemove={() => removeCourse(course.id)}
            />

            {expandedItems[course.id] && (
              <CourseEntryForm
                course={course}
                onUpdate={updateCourse}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addCourse}
          label="Add course"
        />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
        title="Are you sure you want to delete this section?"
        message="You can't undo this action."
        confirmText="Delete Section"
        cancelText="Cancel"
      />
    </div>
  );
}

export default CoursesForm;