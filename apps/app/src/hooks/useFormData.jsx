import { useState, useCallback } from 'react';
import { INITIAL_FORM_DATA, createSectionItem } from '../data/formFields';

export const useFormData = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // Update simple fields (strings, numbers, etc.)
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Add item to array section
  const addSectionItem = useCallback((sectionType) => {
    const newItem = createSectionItem(sectionType);
    setFormData(prev => ({
      ...prev,
      [sectionType]: [...(prev[sectionType] || []), newItem]
    }));
    return newItem.id; // Return ID for immediate expansion
  }, []);

  // Update specific item in array section
  const updateSectionItem = useCallback((sectionType, itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [sectionType]: prev[sectionType].map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  // Remove item from array section
  const removeSectionItem = useCallback((sectionType, itemId) => {
    setFormData(prev => ({
      ...prev,
      [sectionType]: prev[sectionType].filter(item => item.id !== itemId)
    }));
  }, []);

  // Update entire section (useful for reordering)
  const updateSection = useCallback((sectionType, items) => {
    setFormData(prev => ({
      ...prev,
      [sectionType]: items
    }));
  }, []);

  // Add custom section
  const addCustomSection = useCallback((sectionName, content = '') => {
    setFormData(prev => ({
      ...prev,
      customSections: {
        ...prev.customSections,
        [sectionName]: content
      }
    }));
  }, []);

  // Update custom section
  const updateCustomSection = useCallback((sectionName, content) => {
    setFormData(prev => ({
      ...prev,
      customSections: {
        ...prev.customSections,
        [sectionName]: content
      }
    }));
  }, []);

  // Remove custom section
  const removeCustomSection = useCallback((sectionName) => {
    setFormData(prev => {
      const { [sectionName]: _, ...restCustomSections } = prev.customSections;
      return {
        ...prev,
        customSections: restCustomSections
      };
    });
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