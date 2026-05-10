import { useState, useCallback } from 'react';
import { useToast } from './useToast';

/**
 * useSequentialFlow — Hook for "Save & Next" productivity workflows.
 * Used for Marks Entry, Fee Collection, etc.
 */
export const useSequentialFlow = ({
  items = [],
  onSave = async () => {},
  onComplete = () => {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const currentItem = items[currentIndex] || null;
  const isLast = currentIndex === items.length - 1;
  const progress = items.length ? Math.round(((currentIndex + 1) / items.length) * 100) : 0;

  const next = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return true;
    }
    onComplete();
    return false;
  }, [currentIndex, items.length, onComplete]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return true;
    }
    return false;
  }, [currentIndex]);

  const saveAndNext = useCallback(async (data) => {
    setIsSaving(true);
    try {
      await onSave(currentItem, data);
      toast.showSuccess(`Saved record for ${currentItem.name || 'item'}`);
      
      if (!next()) {
        toast.showInfo("All records processed successfully!");
      }
    } catch (err) {
      toast.showError(err.message || "Failed to save record.");
    } finally {
      setIsSaving(false);
    }
  }, [currentItem, next, onSave, toast]);

  return {
    currentIndex,
    currentItem,
    isLast,
    isSaving,
    progress,
    next,
    prev,
    saveAndNext,
    setCurrentIndex
  };
};
