import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import FormEntryHeader from '../shared/FormEntryHeader';
import CourseEntryForm from '../sections/CourseEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function CoursesForm({ onDeleteSection }) {
  const [courses, setCourses] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const deleteModal = useDeleteModal(onDeleteSection);

  const addCourse = () => {
    const newId = Date.now().toString();
    const newCourse = {
      id: newId,
      courseName: '',
      institution: '',
      startDate: '',
      endDate: ''
    };
    
    setCourses(prev => [...prev, newCourse]);
    setExpandedItems(prev => ({ ...prev, [newId]: true }));
  };

  const removeCourse = (id) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateCourse = (id, field, value) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <button 
          onClick={deleteModal.openModal}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-8">
        Include relevant courses, certifications, and training programs that demonstrate your commitment to professional development and skill enhancement.
      </p>
      
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="border border-gray-200 rounded-lg">
            <FormEntryHeader
              title={course.courseName || course.institution}
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
      </div>

      {/* Delete Section Modal */}
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