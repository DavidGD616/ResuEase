import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import TechnologiesSkillEntryForm from '../entries/TechnologiesSkillEntryForm';

function TechnologiesSkillsForm({ 
  onDeleteSection, 
  formData, 
  addSectionItem, 
  updateSectionItem, 
  removeSectionItem 
}) {
  const [expandedItems, setExpandedItems] = useState({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const technologiesSkills = formData.technologiesSkills || [];

  const addTechnologiesSkill = () => {
    const newItemId = addSectionItem('technologiesSkills');
    setExpandedItems(prev => ({ ...prev, [newItemId]: true }));
  };

  const removeTechnologiesSkill = (id) => {
    removeSectionItem('technologiesSkills', id);
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateTechnologiesSkill = (id, field, value) => {
    updateSectionItem('technologiesSkills', id, field, value);
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <FormHeader title="Technologies" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        List your technical skills, programming languages, frameworks, tools, and technologies you're proficient in. This helps employers quickly identify your technical capabilities.
      </FormDescription>
      
      <FormSection>
        {technologiesSkills.map((technologiesSkill) => (
          <div key={technologiesSkill.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={technologiesSkill.technologiesSkillName || 'Untitled'}
              isExpanded={expandedItems[technologiesSkill.id]}
              onToggleExpanded={() => toggleExpanded(technologiesSkill.id)}
              onRemove={() => removeTechnologiesSkill(technologiesSkill.id)}
            />

            {expandedItems[technologiesSkill.id] && (
              <TechnologiesSkillEntryForm
                technologiesSkill={technologiesSkill}
                onUpdate={updateTechnologiesSkill}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addTechnologiesSkill}
          label="Add technology"
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

export default TechnologiesSkillsForm;