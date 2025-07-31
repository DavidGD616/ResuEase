import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import FormEntryHeader from '../shared/FormEntryHeader';
import CustomSectionEntryForm from '../entries/CustomSectionEntryForm';
import AddEntryButton from '../shared/AddEntryButton';
import Modal from '../../ui/Modal';
import { useDeleteModal } from '../../../hooks/useDeleteModal';

function CustomSectionForm({ onDeleteSection }) {
  const [customEntries, setCustomEntries] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const deleteModal = useDeleteModal(onDeleteSection);

  const addCustomEntry = () => {
    const newId = Date.now().toString();
    const newEntry = {
      id: newId,
      header: '',
      subheader: '',
      description: ''
    };
    
    setCustomEntries(prev => [...prev, newEntry]);
    setExpandedItems(prev => ({ ...prev, [newId]: true }));
  };

  const removeCustomEntry = (id) => {
    setCustomEntries(prev => prev.filter(entry => entry.id !== id));
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateCustomEntry = (id, field, value) => {
    setCustomEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
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
        <h1 className="text-2xl font-bold text-gray-900">Custom section</h1>
        <button 
          onClick={deleteModal.openModal}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-8">
        You can add anything you want in the custom section.
      </p>
      
      <div className="space-y-4">
        {customEntries.map((entry) => (
          <div key={entry.id} className="border border-gray-200 rounded-lg">
            <FormEntryHeader
              title={entry.header || 'Untitled'}
              isExpanded={expandedItems[entry.id]}
              onToggleExpanded={() => toggleExpanded(entry.id)}
              onRemove={() => removeCustomEntry(entry.id)}
            />

            {expandedItems[entry.id] && (
              <CustomSectionEntryForm
                entry={entry}
                onUpdate={updateCustomEntry}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addCustomEntry}
          label="Add entry"
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

export default CustomSectionForm;