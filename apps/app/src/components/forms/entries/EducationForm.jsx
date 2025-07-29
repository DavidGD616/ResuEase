import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import FormEntryHeader from '../shared/FormEntryHeader';
import EducationEntryForm from '../sections/EducationEntryForm';
import AddEntryButton from '../shared/AddEntryButton';

function EducationForm({ onDeleteSection }) {
  const [educationEntries, setEducationEntries] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const addEducation = () => {
    const newId = Date.now().toString();
    const newEducation = {
      id: newId,
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ''
    };
    
    setEducationEntries(prev => [...prev, newEducation]);
    setExpandedItems(prev => ({ ...prev, [newId]: true }));
  };

  const removeEducation = (id) => {
    setEducationEntries(prev => prev.filter(edu => edu.id !== id));
    setExpandedItems(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const updateEducation = (id, field, value) => {
    setEducationEntries(prev => 
      prev.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
   const handleDeleteSection = () => {
    if (window.confirm('Are you sure you want to delete the entire Education section? This action cannot be undone.')) {
      onDeleteSection();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Education</h1>
        <button 
          onClick={handleDeleteSection}
          className="p-2 text-gray-400 hover:text-gray-600">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-8">
        Add the name of your school, where it is located, what degree you obtained, your field of study, and your graduation year.
      </p>
      
      <div className="space-y-4">
        {educationEntries.map((education) => (
          <div key={education.id} className="border border-gray-200 rounded-lg">
            <FormEntryHeader
              title={education.institution}
              isExpanded={expandedItems[education.id]}
              onToggleExpanded={() => toggleExpanded(education.id)}
              onRemove={() => removeEducation(education.id)}
            />

            {expandedItems[education.id] && (
              <EducationEntryForm
                education={education}
                onUpdate={updateEducation}
              />
            )}
          </div>
        ))}

        <AddEntryButton
          onClick={addEducation}
          label="Add education"
        />
      </div>
    </div>
  );
}

export default EducationForm;