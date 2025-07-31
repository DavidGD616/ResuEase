import { useState } from 'react';
import { Trash2 } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Languages</h1>
        <button 
          onClick={deleteModal.openModal}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-8">
        Include languages you speak and your proficiency level. This can be valuable for positions requiring multilingual communication.
      </p>
      
      <div className="space-y-4">
        {languages.map((language) => (
          <div key={language.id} className="border border-gray-200 rounded-lg">
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
      </div>

      {/* Delete Section Modal */}
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