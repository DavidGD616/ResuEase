import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import TechnologiesSkillEntryForm from '../entries/TechnologiesSkillEntryForm';
import AISkillSuggester from '../shared/AiSkillSuggester';
import type { FormData, TechSkillItem } from '../../../types/resume';

interface TechnologiesSkillsFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

function TechnologiesSkillsForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: TechnologiesSkillsFormProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const technologiesSkills = (formData.technologiesSkills || []) as (TechSkillItem & { id: string })[];

  const addTechnologiesSkill = () => {
    const newItemId = addSectionItem('technologiesSkills');
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeTechnologiesSkill = (id: string) => {
    removeSectionItem('technologiesSkills', id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateTechnologiesSkill = (id: string, field: string, value: unknown) => {
    updateSectionItem('technologiesSkills', id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSkillFromAI = (skillName: string) => {
    const newItemId = addSectionItem('technologiesSkills');
    updateSectionItem('technologiesSkills', newItemId, 'technologiesSkillName', skillName);
  };

  return (
    <div>
      <FormHeader title={t('forms.technologies.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.technologies.description')}
      </FormDescription>

      {/* AI Skill Suggester Component */}
      <AISkillSuggester
        jobTitle={formData.jobTitle}
        currentSkills={technologiesSkills}
        onAddSkill={handleAddSkillFromAI}
        skillType="technical"
      />

      <FormSection>
        {technologiesSkills.map((technologiesSkill) => (
          <div key={technologiesSkill.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={technologiesSkill.technologiesSkillName || t('common.untitled')}
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

        <AddEntryButton onClick={addTechnologiesSkill} label={t('forms.technologies.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default TechnologiesSkillsForm;
