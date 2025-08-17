import { useEffect, useRef } from 'react';
import SecureStorage from '../../../utils/secureStorage';

interface AutosaveConfig {
  interval: number; // in milliseconds
  userId: string;
  section: string;
  data: Record<string, unknown>;
  onSave?: (data: Record<string, unknown>) => void;
}

export const useAutosave = ({ interval, userId, section, data, onSave }: AutosaveConfig) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only autosave if data has changed
    if (JSON.stringify(data) !== JSON.stringify(lastSavedDataRef.current)) {
      timeoutRef.current = setTimeout(() => {
        const path = `draft_settings/${userId}/${section}`;
        
        // Save to secure storage with encryption
        try {
          SecureStorage.setItem(path, {
            data,
            timestamp: new Date().toISOString(),
            section
          }, 24); // Expire after 24 hours
          
          lastSavedDataRef.current = data;
          
          if (onSave) {
            onSave(data);
          }
          
          
        } catch (error) {
          // Failed to autosave settings securely - using fallback
          // Fallback to regular localStorage for non-sensitive data
          try {
            localStorage.setItem(`fallback_${path}`, JSON.stringify({
              data,
              timestamp: new Date().toISOString(),
              section
            }));
          } catch (fallbackError) {
            // Fallback save also failed - silent handling
          }
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
      const saved = SecureStorage.getItem(path);
      
      if (saved && typeof saved === 'object' && saved !== null) {
        const typedSaved = saved as { data: Record<string, unknown>; timestamp: string; section: string };
        return {
          data: typedSaved.data,
          timestamp: typedSaved.timestamp,
          section: typedSaved.section
        };
      }
      
      // Fallback to regular localStorage
      const fallbackSaved = localStorage.getItem(`fallback_${path}`);
      if (fallbackSaved) {
        const parsed = JSON.parse(fallbackSaved);
        // Migrate to secure storage
        SecureStorage.setItem(path, parsed, 24);
        localStorage.removeItem(`fallback_${path}`);
        return parsed;
      }
    } catch (error) {
      // Failed to load draft settings - silent handling
    }
    
    return null;
  };

  const clearDraft = () => {
    try {
      const path = `draft_settings/${userId}/${section}`;
      SecureStorage.removeItem(path);
      // Also clear any fallback data
      localStorage.removeItem(`fallback_${path}`);
    } catch (error) {
      // Failed to clear draft settings - silent handling
    }
  };

  return {
    loadDraft,
    clearDraft
  };
};