import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import LinkEntryForm from '../entries/LinkEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function LinksForm({ 
  onDeleteSection, 
  formData, 
  addSectionItem, 
  updateSectionItem, 
  removeSectionItem 
}) {
  const [expandedItems, setExpandedItems] = useState({});
  const deleteModal = useDeleteModal(onDeleteSection);

  // Get links from global form data
  const links = formData.links || [];

  const addLink = () => {
    const newItemId = addSectionItem('links');
    setExpandedItems(prev => ({ ...prev, [newItemId]: true }));
  };

  const removeLink = (id) => {
    removeSectionItem('links', id);
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateLink = (id, field, value) => {
    updateSectionItem('links', id, field, value);
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <FormHeader title="Links" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        Add relevant links: personal website, socials, LinkedIn profile, etc.
      </FormDescription>
      
      <FormSection>
        {links.map((link) => (
          <div key={link.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={link.linkTitle || 'Untitled'}
              isExpanded={expandedItems[link.id]}
              onToggleExpanded={() => toggleExpanded(link.id)}
              onRemove={() => removeLink(link.id)}
            />

            {expandedItems[link.id] && (
              <LinkEntryForm
                link={link}
                onUpdate={updateLink}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addLink}
          label="Add one more link"
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

export default LinksForm;