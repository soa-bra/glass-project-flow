
import { useEffect, useState } from 'react';

interface AccessibilityPreferences {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersDarkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export const useAccessibility = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersDarkMode: false,
    fontSize: 'medium'
  });

  useEffect(() => {
    // فحص تفضيلات النظام
    const checkPreferences = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      setPreferences(prev => ({
        ...prev,
        prefersReducedMotion,
        prefersHighContrast,
        prefersDarkMode
      }));
    };

    checkPreferences();

    // إضافة مستمعين للتغييرات
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    reducedMotionQuery.addEventListener('change', checkPreferences);
    highContrastQuery.addEventListener('change', checkPreferences);
    darkModeQuery.addEventListener('change', checkPreferences);

    return () => {
      reducedMotionQuery.removeEventListener('change', checkPreferences);
      highContrastQuery.removeEventListener('change', checkPreferences);
      darkModeQuery.removeEventListener('change', checkPreferences);
    };
  }, []);

  const updateFontSize = (size: 'small' | 'medium' | 'large') => {
    setPreferences(prev => ({ ...prev, fontSize: size }));
    
    // تطبيق حجم الخط على الـ root
    const root = document.documentElement;
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    
    root.style.fontSize = sizes[size];
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.classList.add('sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return {
    preferences,
    updateFontSize,
    announceToScreenReader
  };
};
