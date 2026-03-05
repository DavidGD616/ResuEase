import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import HobbyEntryForm from '../entries/HobbyEntryForm';
import type { FormData, HobbyItem } from '../../../types/resume';

interface HobbiesFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

function HobbiesForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: HobbiesFormProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const hobbies = (formData.hobbies || []) as (HobbyItem & { id: string })[];

  const addHobby = () => {
    const newItemId = addSectionItem('hobbies');
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeHobby = (id: string) => {
    removeSectionItem('hobbies', id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateHobby = (id: string, field: string, value: unknown) => {
    updateSectionItem('hobbies', id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <FormHeader title={t('forms.hobbies.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.hobbies.description')}
      </FormDescription>

      <FormSection>
        {hobbies.map((hobby) => (
          <div key={hobby.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={hobby.hobbyName || t('common.untitled')}
              isExpanded={expandedItems[hobby.id]}
              onToggleExpanded={() => toggleExpanded(hobby.id)}
              onRemove={() => removeHobby(hobby.id)}
            />

            {expandedItems[hobby.id] && (
              <HobbyEntryForm hobby={hobby} onUpdate={updateHobby} />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addHobby} label={t('forms.hobbies.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default HobbiesForm;
