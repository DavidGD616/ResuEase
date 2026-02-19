import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import SkillEntryForm from '../entries/SkillEntryForm';
import AISkillSuggester from '../shared/AiSkillSuggester';
import type { FormData, SkillItem } from '../../../types/resume';

interface SkillsFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

function SkillsForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: SkillsFormProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const skills = (formData.skills || []) as (SkillItem & { id: string })[];

  const addSkill = () => {
    const newItemId = addSectionItem('skills');
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeSkill = (id: string) => {
    removeSectionItem('skills', id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateSkill = (id: string, field: string, value: unknown) => {
    updateSectionItem('skills', id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSkillFromAI = (skillName: string) => {
    const newItemId = addSectionItem('skills');
    updateSectionItem('skills', newItemId, 'skillName', skillName);
  };

  return (
    <div>
      <FormHeader title="Skills" onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        This section is for summarizing your key abilities. Include both hard skills (like technical knowledge) and soft skills (like communication or problem-solving). It gives employers a quick overview of your strengths and how they fit with the job.
      </FormDescription>

      {/* AI Skill Suggester Component */}
      <AISkillSuggester
        jobTitle={formData.jobTitle}
        currentSkills={skills}
        onAddSkill={handleAddSkillFromAI}
        skillType="soft"
      />

      <FormSection>
        {skills.map((skill) => (
          <div key={skill.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={skill.skillName || 'Untitled'}
              isExpanded={expandedItems[skill.id]}
              onToggleExpanded={() => toggleExpanded(skill.id)}
              onRemove={() => removeSkill(skill.id)}
            />

            {expandedItems[skill.id] && (
              <SkillEntryForm skill={skill} onUpdate={updateSkill} />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addSkill} label="Add skill" />
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

export default SkillsForm;
