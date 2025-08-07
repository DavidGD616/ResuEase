import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import LinkEntryForm from '../entries/LinkEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function LinksForm({ onDeleteSection }) {
  const [links, setLinks] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const deleteModal = useDeleteModal(onDeleteSection);

  const addLink = () => {
    const newId = Date.now().toString();
    const newLink = {
      id: newId,
      linkTitle: '',
      url: ''
    };
    
    setLinks(prev => [...prev, newLink]);
    setExpandedItems(prev => ({ ...prev, [newId]: true }));
  };

  const removeLink = (id) => {
    setLinks(prev => prev.filter(link => link.id !== id));
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateLink = (id, field, value) => {
    setLinks(prev => 
      prev.map(link => 
        link.id === id ? { ...link, [field]: value } : link
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