import { useState, useCallback, useEffect, useRef } from 'react';
import { INITIAL_FORM_DATA, createSectionItem } from '../data/formFields';

const FORM_DATA_STORAGE_KEY = 'resumeBuilder_formData';
const DEBOUNCE_DELAY = 1000; // 1 second debounce

export const useFormData = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const debounceTimeoutRef = useRef(null);

  // Load form data from localStorage on component mount
  useEffect(() => {
    const loadFormData = () => {
      try {
        const storedData = localStorage.getItem(FORM_DATA_STORAGE_KEY);
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          
          // Validate basic structure
          if (typeof parsedData === 'object' && parsedData !== null) {
            // Merge with initial data to ensure all required fields exist
            const mergedData = {
              ...INITIAL_FORM_DATA,
              ...parsedData
            };
            setFormData(mergedData);
            return;
          }
        }
      } catch (error) {
        console.warn('Error loading form data from localStorage:', error);
      }
    };

    loadFormData();
  }, []);

  // Debounced save to localStorage
  const debouncedSave = useCallback((data) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.warn('Error saving form data to localStorage:', error);
      }
    }, DEBOUNCE_DELAY);
  }, []);

  // Update simple fields (strings, numbers, etc.)
  const updateField = useCallback((field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Save all form data changes
      debouncedSave(newData);
      
      return newData;
    });
  }, [debouncedSave]);

  // Add item to array section
  const addSectionItem = useCallback((sectionType) => {
    const newItem = createSectionItem(sectionType);
    setFormData(prev => {
      const newData = {
        ...prev,
        [sectionType]: [...(prev[sectionType] || []), newItem]
      };
      debouncedSave(newData);
      return newData;
    });
    return newItem.id; // Return ID for immediate expansion
  }, [debouncedSave]);

  // Update specific item in array section
  const updateSectionItem = useCallback((sectionType, itemId, field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [sectionType]: prev[sectionType].map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        )
      };
      debouncedSave(newData);
      return newData;
    });
  }, [debouncedSave]);

  // Remove item from array section
  const removeSectionItem = useCallback((sectionType, itemId) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [sectionType]: prev[sectionType].filter(item => item.id !== itemId)
      };
      debouncedSave(newData);
      return newData;
    });
  }, [debouncedSave]);

  // Update entire section (useful for reordering)
  const updateSection = useCallback((sectionType, items) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [sectionType]: items
      };
      debouncedSave(newData);
      return newData;
    });
  }, [debouncedSave]);

  // Add custom section
  const addCustomSection = useCallback((sectionName, content = '') => {
    setFormData(prev => {
      const newData = {
        ...prev,
        customSections: {
          ...prev.customSections,
          [sectionName]: content
        }
      };
      debouncedSave(newData);
      return newData;
    });
  }, [debouncedSave]);

  // Update custom section
  const updateCustomSection = useCallback((sectionName, content) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        customSections: {
          ...prev.customSections,
          [sectionName]: content
        }
      };
      debouncedSave(newData);
      return newData;
    });
  }, [debouncedSave]);

  // Remove custom section
  const removeCustomSection = useCallback((sectionName) => {
    setFormData(prev => {
      const { [sectionName]: _, ...restCustomSections } = prev.customSections;
      const newData = {
        ...prev,
        customSections: restCustomSections
      };
      debouncedSave(newData);
      return newData;
    });
  }, [debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    formData,
    updateField,
    addSectionItem,
    updateSectionItem,
    removeSectionItem,
    updateSection,
    addCustomSection,
    updateCustomSection,
    removeCustomSection
  };
};