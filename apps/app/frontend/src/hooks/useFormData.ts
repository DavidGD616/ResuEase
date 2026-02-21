import { useState, useCallback, useEffect, useRef } from 'react';
import { INITIAL_FORM_DATA, createSectionItem } from '../data/formFields';
import type { FormData } from '../types/resume';

// Legacy key used before user-scoped storage was introduced.
// Kept here only for the one-time migration path.
const LEGACY_FORM_DATA_KEY = 'resumeBuilder_formData';
const DEBOUNCE_DELAY = 2000;

type SaveStatus = 'saved' | 'saving' | 'error';

export const useFormData = (userId: string) => {
  const storageKey = userId ? `resumeBuilder_formData_${userId}` : null;

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load form data from localStorage on mount.
  // Tries the user-scoped key first; if absent, migrates any data from the
  // legacy unscoped key and removes it.
  useEffect(() => {
    if (!storageKey) return;

    const loadFormData = () => {
      try {
        // 1. Try user-scoped key
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (typeof parsedData === 'object' && parsedData !== null) {
            setFormData({ ...INITIAL_FORM_DATA, ...parsedData });
            return;
          }
        }

        // 2. Migrate from legacy unscoped key (one-time, on first login after this change)
        const legacyData = localStorage.getItem(LEGACY_FORM_DATA_KEY);
        if (legacyData) {
          const parsedLegacy = JSON.parse(legacyData);
          if (typeof parsedLegacy === 'object' && parsedLegacy !== null) {
            const mergedData: FormData = { ...INITIAL_FORM_DATA, ...parsedLegacy };
            setFormData(mergedData);
            localStorage.setItem(storageKey, JSON.stringify(mergedData));
            localStorage.removeItem(LEGACY_FORM_DATA_KEY);
            return;
          }
        }
      } catch (error) {
        console.warn('Error loading form data from localStorage:', error);
        setSaveStatus('error');
      }
    };

    loadFormData();
  }, [storageKey]);

  // Debounced save to localStorage
  const debouncedSave = useCallback((data: FormData) => {
    if (!storageKey) return;

    setSaveStatus('saving');

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
        setSaveStatus('saved');
      } catch (error) {
        console.warn('Error saving form data to localStorage:', error);
        setSaveStatus('error');
      }
    }, DEBOUNCE_DELAY);
  }, [storageKey]);

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
