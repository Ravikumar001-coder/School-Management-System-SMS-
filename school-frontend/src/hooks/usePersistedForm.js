import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../context/ToastContext';

/**
 * usePersistedForm hook
 * Automatically saves and restores form data to/from localStorage.
 * 
 * @param {string} key - Unique key for localStorage (e.g., 'add_student_form')
 * @param {object} initialState - Default values for the form
 * @param {object} options - Configuration (debounceTime, excludeFields, etc.)
 */
const usePersistedForm = (key, initialState = {}, options = {}) => {
  const { debounceTime = 500, excludeFields = ['password', 'token', 'creditCard'] } = options;
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialState);
  const [isRestored, setIsRestored] = useState(false);
  const saveTimerRef = useRef(null);

  // 1. Initialize: Load from localStorage
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(key);
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        
        // Bonus: Check for expiration (7 days)
        const timestamp = parsedDraft._timestamp;
        const now = new Date().getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (timestamp && (now - timestamp > sevenDays)) {
          localStorage.removeItem(key);
          console.log(`[Draft] Expired draft removed for ${key}`);
        } else {
          // Filter out excluded fields from restoration just in case
          const filteredDraft = { ...parsedDraft };
          excludeFields.forEach(field => delete filteredDraft[field]);
          delete filteredDraft._timestamp;

          setFormData(prev => ({ ...prev, ...filteredDraft }));
          showToast('Draft restored from previous session', 'info');
          console.log(`[Draft] Restored for ${key}`);
        }
      }
    } catch (error) {
      console.error(`[Draft] Error restoring draft for ${key}:`, error);
      localStorage.removeItem(key);
    } finally {
      setIsRestored(true);
    }
  }, [key]); // Run once on mount or when key changes

  // 2. Persist: Save to localStorage (Debounced)
  const persistData = useCallback((data) => {
    if (!isRestored) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      try {
        // Filter out sensitive fields before saving
        const dataToSave = { ...data };
        excludeFields.forEach(field => delete dataToSave[field]);
        
        // Add timestamp
        dataToSave._timestamp = new Date().getTime();

        localStorage.setItem(key, JSON.stringify(dataToSave));
        // console.log(`[Draft] Saved for ${key}`); // Silenced to avoid console spam
      } catch (error) {
        console.error(`[Draft] Error saving draft for ${key}:`, error);
        if (error.name === 'QuotaExceededError') {
          showToast('Storage quota exceeded. Draft might not be saved.', 'warning');
        }
      }
    }, debounceTime);
  }, [key, isRestored, debounceTime, excludeFields, showToast]);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const newState = { ...prev, [name]: fieldValue };
      persistData(newState);
      return newState;
    });
  };

  // Manual state update (for custom components)
  const setPersistedValue = (name, value) => {
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      persistData(newState);
      return newState;
    });
  };

  // Bulk set (useful for initial data fetch in Edit pages)
  const setPersistedData = (newData) => {
    setFormData(prev => {
      const newState = typeof newData === 'function' ? newData(prev) : { ...prev, ...newData };
      persistData(newState);
      return newState;
    });
  };

  // 3. Clear: Remove draft
  const clearDraft = useCallback((notify = false) => {
    localStorage.removeItem(key);
    if (notify) {
      showToast('Draft cleared', 'success');
    }
    console.log(`[Draft] Cleared for ${key}`);
  }, [key, showToast]);

  return {
    formData,
    setFormData: setPersistedData, // Overwriting state with persistence
    handleChange,
    setPersistedValue,
    clearDraft,
    isRestored
  };
};

export default usePersistedForm;
