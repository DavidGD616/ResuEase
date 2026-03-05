import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      <FormHeader title={t('forms.skills.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.skills.description')}
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
          <div key={skill.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={skill.skillName || t('common.untitled')}
              isExpanded={expandedItems[skill.id]}
              onToggleExpanded={() => toggleExpanded(skill.id)}
              onRemove={() => removeSkill(skill.id)}
            />

            {expandedItems[skill.id] && (
              <SkillEntryForm skill={skill} onUpdate={updateSkill} />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addSkill} label={t('forms.skills.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default SkillsForm;
