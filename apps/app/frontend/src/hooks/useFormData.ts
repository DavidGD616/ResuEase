import { useState, useCallback, useEffect, useRef } from 'react';
import { INITIAL_FORM_DATA, createSectionItem } from '../data/formFields';
import type { FormData } from '../types/resume';

const FORM_DATA_STORAGE_KEY = 'resumeBuilder_formData';
const DEBOUNCE_DELAY = 2000;

type SaveStatus = 'saved' | 'saving' | 'error';

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load form data from localStorage on component mount
  useEffect(() => {
    const loadFormData = () => {
      try {
        const storedData = localStorage.getItem(FORM_DATA_STORAGE_KEY);

        if (storedData) {
          const parsedData = JSON.parse(storedData);

          if (typeof parsedData === 'object' && parsedData !== null) {
            const mergedData: FormData = {
              ...INITIAL_FORM_DATA,
              ...parsedData,
            };
            setFormData(mergedData);
            return;
          }
        }
      } catch (error) {
        console.warn('Error loading form data from localStorage:', error);
        setSaveStatus('error');
      }
    };

    loadFormData();
  }, []);

  // Debounced save to localStorage
  const debouncedSave = useCallback((data: FormData) => {
    setSaveStatus('saving');

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(data));
        setSaveStatus('saved');
      } catch (error) {
        console.warn('Error saving form data to localStorage:', error);
        setSaveStatus('error');
      }
    }, DEBOUNCE_DELAY);
  }, []);

  // Update simple fields (strings, numbers, etc.)
  const updateField = useCallback(
    (field: string, value: unknown) => {
      setFormData((prev) => {
        const newData: FormData = { ...prev, [field]: value };
        debouncedSave(newData);
        return newData;
      });
    },
    [debouncedSave]
  );

  // Add item to array section
  const addSectionItem = useCallback(
    (sectionType: string) => {
      const newItem = createSectionItem(sectionType);
      setFormData((prev) => {
        const existing = (prev[sectionType] as unknown[]) || [];
        const newData: FormData = { ...prev, [sectionType]: [...existing, newItem] };
        debouncedSave(newData);
        return newData;
      });
      return newItem.id;
    },
    [debouncedSave]
  );

  // Update specific item in array section
  const updateSectionItem = useCallback(
    (sectionType: string, itemId: string, field: string, value: unknown) => {
      setFormData((prev) => {
        const section = (prev[sectionType] as Array<Record<string, unknown>>) || [];
        const newData: FormData = {
          ...prev,
          [sectionType]: section.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
          ),
        };
        debouncedSave(newData);
        return newData;
      });
    },
    [debouncedSave]
  );

  // Remove item from array section
  const removeSectionItem = useCallback(
    (sectionType: string, itemId: string) => {
      setFormData((prev) => {
        const section = (prev[sectionType] as Array<Record<string, unknown>>) || [];
        const newData: FormData = {
          ...prev,
          [sectionType]: section.filter((item) => item.id !== itemId),
        };
        debouncedSave(newData);
        return newData;
      });
    },
    [debouncedSave]
  );

  // Update entire section (useful for reordering)
  const updateSection = useCallback(
    (sectionType: string, items: unknown[]) => {
      setFormData((prev) => {
        const newData: FormData = { ...prev, [sectionType]: items };
        debouncedSave(newData);
        return newData;
      });
    },
    [debouncedSave]
  );

  // Add custom section
  const addCustomSection = useCallback(
    (sectionName: string, content: string = '') => {
      setFormData((prev) => {
        const customSections = (prev.customSections as Record<string, unknown>) ?? {};
        const newData: FormData = {
          ...prev,
          customSections: { ...customSections, [sectionName]: content },
        };
        debouncedSave(newData);
        return newData;
      });
    },
    [debouncedSave]
  );

  // Update custom section
  const updateCustomSection = useCallback(
    (sectionName: string, content: string) => {
      setFormData((prev) => {
        const customSections = (prev.customSections as Record<string, unknown>) ?? {};
        const newData: FormData = {
          ...prev,
          customSections: { ...customSections, [sectionName]: content },
        };
        debouncedSave(newData);
        return newData;
      });
    },
    [debouncedSave]
  );

  // Remove custom section
  const removeCustomSection = useCallback(
    (sectionName: string) => {
      setFormData((prev) => {
        const customSections = (prev.customSections as Record<string, unknown>) ?? {};
        const { [sectionName]: _removed, ...restCustomSections } = customSections;
        const newData: FormData = { ...prev, customSections: restCustomSections };
        debouncedSave(newData);
        return newData;
      });
    },
    [debouncedSave]
  );

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
    saveStatus,
    updateField,
    addSectionItem,
    updateSectionItem,
    removeSectionItem,
    updateSection,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
  };
};
