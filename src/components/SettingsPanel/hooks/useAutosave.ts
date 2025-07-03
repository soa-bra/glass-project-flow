import { useEffect, useRef } from 'react';

interface AutosaveConfig {
  interval: number; // in milliseconds
  userId: string;
  section: string;
  data: any;
  onSave?: (data: any) => void;
}

export const useAutosave = ({ interval, userId, section, data, onSave }: AutosaveConfig) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<any>(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only autosave if data has changed
    if (JSON.stringify(data) !== JSON.stringify(lastSavedDataRef.current)) {
      timeoutRef.current = setTimeout(() => {
        const path = `draft_settings/${userId}/${section}`;
        
        // Save to localStorage as a fallback
        try {
          localStorage.setItem(path, JSON.stringify({
            data,
            timestamp: new Date().toISOString(),
            section
          }));
          
          lastSavedDataRef.current = data;
          
          if (onSave) {
            onSave(data);
          }
          
          console.log(`Autosaved settings for ${section} at ${new Date().toLocaleTimeString()}`);
        } catch (error) {
          console.error('Failed to autosave settings:', error);
        }
      }, interval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, interval, userId, section, onSave]);

  const loadDraft = () => {
    try {
      const path = `draft_settings/${userId}/${section}`;
      const saved = localStorage.getItem(path);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          data: parsed.data,
          timestamp: parsed.timestamp,
          section: parsed.section
        };
      }
    } catch (error) {
      console.error('Failed to load draft settings:', error);
    }
    
    return null;
  };

  const clearDraft = () => {
    try {
      const path = `draft_settings/${userId}/${section}`;
      localStorage.removeItem(path);
    } catch (error) {
      console.error('Failed to clear draft settings:', error);
    }
  };

  return {
    loadDraft,
    clearDraft
  };
};