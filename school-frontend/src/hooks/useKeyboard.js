// src/hooks/useKeyboard.js
import { useEffect } from 'react';

/**
 * useKeyboard — Global hotkey hook for operational speed.
 * 
 * Supports:
 * - Single keys ('Enter', 'Escape')
 * - Combined keys ('Ctrl+S', 'Alt+N')
 */
export const useKeyboard = (keyMap) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const keys = [];
      if (event.ctrlKey) keys.push('Ctrl');
      if (event.altKey) keys.push('Alt');
      if (event.shiftKey) keys.push('Shift');
      if (event.metaKey) keys.push('Meta');
      
      // Don't add the modifier key itself twice
      if (!['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
        keys.push(event.key.toUpperCase());
      }

      const shortcut = keys.join('+');

      // Check for exact matches in the map
      if (keyMap[shortcut]) {
        event.preventDefault();
        keyMap[shortcut](event);
      } else if (keyMap[event.key]) {
        // Check for single key matches (e.g. 'Enter')
        keyMap[event.key](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyMap]);
};
