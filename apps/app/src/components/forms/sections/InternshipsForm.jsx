import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import InternshipEntryForm from '../entries/InternshipEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function InternshipsForm({ onDeleteSection }) {
  const [internships, setInternships] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const deleteModal = useDeleteModal(onDeleteSection);

  const addInternship = () => {
    const newId = Date.now().toString();
    const newInternship = {
      id: newId,
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ''
    };
    
    setInternships(prev => [...prev, newInternship]);
    setExpandedItems(prev => ({ ...prev, [newId]: true }));
  };

  const removeInternship = (id) => {
    setInternships(prev => prev.filter(internship => internship.id !== id));
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateInternship = (id, field, value) => {
    setInternships(prev => 
      prev.map(internship => 
        internship.id === id ? { ...internship, [field]: value } : internship
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
      <FormHeader title="Internships" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        Include internships and temporary positions that demonstrate your skills and experience. Focus on what you learned and accomplished during these roles.
      </FormDescription>
      
      <FormSection>
        {internships.map((internship) => (
          <div key={internship.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={internship.jobTitle || internship.company}
              isExpanded={expandedItems[internship.id]}
              onToggleExpanded={() => toggleExpanded(internship.id)}
              onRemove={() => removeInternship(internship.id)}
            />

            {expandedItems[internship.id] && (
              <InternshipEntryForm
                internship={internship}
                onUpdate={updateInternship}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addInternship}
          label="Add internship"
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

export default InternshipsForm;