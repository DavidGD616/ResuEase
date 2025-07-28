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

  return {
    formData,
    updateField,
  };
};