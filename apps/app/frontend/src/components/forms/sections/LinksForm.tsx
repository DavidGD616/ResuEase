import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import LinkEntryForm from '../entries/LinkEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';
import type { FormData, LinkItem } from '../../../types/resume';

interface LinksFormProps {
  onDeleteSection: () => void;
  formData: FormData;
  addSectionItem: (sectionType: string) => string;
  updateSectionItem: (sectionType: string, itemId: string, field: string, value: unknown) => void;
  removeSectionItem: (sectionType: string, itemId: string) => void;
}

function LinksForm({
  onDeleteSection,
  formData,
  addSectionItem,
  updateSectionItem,
  removeSectionItem,
}: LinksFormProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const deleteModal = useDeleteModal(onDeleteSection);

  const links = (formData.links || []) as (LinkItem & { id: string })[];

  const addLink = () => {
    const newItemId = addSectionItem('links');
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  const removeLink = (id: string) => {
    removeSectionItem('links', id);
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateLink = (id: string, field: string, value: unknown) => {
    updateSectionItem('links', id, field, value);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <FormHeader title={t('forms.links.header')} onDelete={deleteModal.openModal} showDelete />

      <FormDescription>
        {t('forms.links.description')}
      </FormDescription>

      <FormSection>
        {links.map((link) => (
          <div key={link.id} className="bg-white rounded-md sm:rounded-lg" style={{ border: '1px solid var(--border)' }}>
            <FormEntryHeader
              title={link.linkTitle || t('common.untitled')}
              isExpanded={expandedItems[link.id]}
              onToggleExpanded={() => toggleExpanded(link.id)}
              onRemove={() => removeLink(link.id)}
            />

            {expandedItems[link.id] && (
              <LinkEntryForm link={link} onUpdate={updateLink} />
            )}
          </div>
        ))}

        <AddEntryButton onClick={addLink} label={t('forms.links.addEntry')} />
      </FormSection>

      <Modal.Confirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteModal.confirmDelete}
      />
    </div>
  );
}

export default LinksForm;
