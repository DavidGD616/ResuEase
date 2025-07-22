import { useState, useCallback } from 'react';
import { INITIAL_FORM_DATA } from '../data/formFields';

export const useFormData = (initialData = INITIAL_FORM_DATA) => {
  const [formData, setFormData] = useState(initialData);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateMultipleFields = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
  }, []);

  return {
    formData,
    updateField,
    updateMultipleFields,
    resetForm
  };
};