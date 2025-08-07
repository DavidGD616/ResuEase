import { useState } from 'react';
import { FormHeader, FormDescription, FormSection } from '../shared/FormComponents';
import FormEntryHeader from '../shared/FormEntryHeader';
import LanguageEntryForm from '../entries/LanguageEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function LanguagesForm({ onDeleteSection }) {
  const [languages, setLanguages] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const deleteModal = useDeleteModal(onDeleteSection);

  const addLanguage = () => {
    const newId = Date.now().toString();
    const newLanguage = {
      id: newId,
      language: '',
      proficiency: 'Not applicable'
    };
    
    setLanguages(prev => [...prev, newLanguage]);
    setExpandedItems(prev => ({ ...prev, [newId]: true }));
  };

  const removeLanguage = (id) => {
    setLanguages(prev => prev.filter(language => language.id !== id));
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateLanguage = (id, field, value) => {
    setLanguages(prev => 
      prev.map(language => 
        language.id === id ? { ...language, [field]: value } : language
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
      <FormHeader title="Languages" onDelete={deleteModal.openModal} showDelete />
      
      <FormDescription>
        Include languages you speak and your proficiency level. This can be valuable for positions requiring multilingual communication.
      </FormDescription>
      
      <FormSection>
        {languages.map((language) => (
          <div key={language.id} className="border border-gray-200 rounded-md sm:rounded-lg">
            <FormEntryHeader
              title={language.language || 'Untitled'}
              isExpanded={expandedItems[language.id]}
              onToggleExpanded={() => toggleExpanded(language.id)}
              onRemove={() => removeLanguage(language.id)}
            />

            {expandedItems[language.id] && (
              <LanguageEntryForm
                language={language}
                onUpdate={updateLanguage}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addLanguage}
          label="Add one more language"
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

export default LanguagesForm;