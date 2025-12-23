/**
 * Text Editor Context - سياق محرر النص
 * يستبدل window.__currentTextEditor بـ React Context
 * @module features/planning/elements/text/TextEditorContext
 */

import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { TextEditorAPI } from './types';

// ============================================
// Context Definition
// ============================================

interface TextEditorContextValue {
  /** API المحرر النشط - Active editor API */
  activeEditor: TextEditorAPI | null;
  
  /** تسجيل محرر - Register an editor */
  registerEditor: (api: TextEditorAPI) => void;
  
  /** إلغاء تسجيل محرر - Unregister an editor */
  unregisterEditor: (elementId: string) => void;
  
  /** هل المحرر نشط - Is editor active */
  isEditorActive: boolean;
  
  /** منع الإغلاق مؤقتاً - Temporarily prevent closing */
  preventClose: () => void;
  
  /** السماح بالإغلاق - Allow closing */
  allowClose: () => void;
  
  /** هل يمكن الإغلاق - Can close */
  canClose: boolean;
}

const TextEditorContext = createContext<TextEditorContextValue | null>(null);

// ============================================
// Provider Component
// ============================================

interface TextEditorProviderProps {
  children: ReactNode;
}

export const TextEditorProvider: React.FC<TextEditorProviderProps> = ({ children }) => {
  const [activeEditor, setActiveEditor] = useState<TextEditorAPI | null>(null);
  const [canClose, setCanClose] = useState(true);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const registerEditor = useCallback((api: TextEditorAPI) => {
    setActiveEditor(api);
    
    // للتوافق مع الكود القديم (سيتم إزالته لاحقاً)
    (window as any).__currentTextEditor = api;
  }, []);

  const unregisterEditor = useCallback((elementId: string) => {
    setActiveEditor((current) => {
      if (current?.elementId === elementId) {
        // إزالة من window أيضاً
        (window as any).__currentTextEditor = null;
        return null;
      }
      return current;
    });
  }, []);

  const preventClose = useCallback(() => {
    // إلغاء أي timeout سابق
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setCanClose(false);
  }, []);

  const allowClose = useCallback(() => {
    // تأخير صغير للسماح بالنقرات على الأزرار
    closeTimeoutRef.current = setTimeout(() => {
      setCanClose(true);
    }, 100);
  }, []);

  const value: TextEditorContextValue = {
    activeEditor,
    registerEditor,
    unregisterEditor,
    isEditorActive: activeEditor !== null,
    preventClose,
    allowClose,
    canClose,
  };

  return (
    <TextEditorContext.Provider value={value}>
      {children}
    </TextEditorContext.Provider>
  );
};

// ============================================
// Hook
// ============================================

/**
 * استخدام سياق محرر النص
 * Use text editor context
 */
export const useTextEditorContext = (): TextEditorContextValue => {
  const context = useContext(TextEditorContext);
  
  if (!context) {
    // إرجاع قيمة افتراضية بدلاً من رمي خطأ
    // هذا يسمح باستخدام الـ hook خارج الـ Provider
    return {
      activeEditor: null,
      registerEditor: () => {},
      unregisterEditor: () => {},
      isEditorActive: false,
      preventClose: () => {},
      allowClose: () => {},
      canClose: true,
    };
  }
  
  return context;
};

/**
 * الحصول على API المحرر النشط
 * Get active editor API (shorthand)
 */
export const useActiveTextEditor = (): TextEditorAPI | null => {
  const { activeEditor } = useTextEditorContext();
  return activeEditor;
};

// ============================================
// Utility Hook for Editor Registration
// ============================================

interface UseTextEditorRegistrationOptions {
  elementId: string;
  editorRef: React.RefObject<HTMLDivElement>;
  applyFormat: (command: string, value?: string) => void;
  toggleList: (listType: 'ul' | 'ol') => void;
  removeFormatting: () => void;
}

/**
 * Hook لتسجيل المحرر تلقائياً
 * Hook for automatic editor registration
 */
export const useTextEditorRegistration = (options: UseTextEditorRegistrationOptions) => {
  const { elementId, editorRef, applyFormat, toggleList, removeFormatting } = options;
  const { registerEditor, unregisterEditor, preventClose, allowClose, canClose } = useTextEditorContext();
  const isRegistered = useRef(false);

  const restoreFocus = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      // استعادة موضع المؤشر في النهاية
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [editorRef]);

  // تسجيل المحرر عند الإنشاء
  React.useEffect(() => {
    if (editorRef.current && !isRegistered.current) {
      const api: TextEditorAPI = {
        applyFormat,
        toggleList,
        removeFormatting,
        editorRef: editorRef.current,
        elementId,
        restoreFocus,
      };
      
      registerEditor(api);
      isRegistered.current = true;
    }

    return () => {
      if (isRegistered.current) {
        unregisterEditor(elementId);
        isRegistered.current = false;
      }
    };
  }, [elementId, registerEditor, unregisterEditor, applyFormat, toggleList, removeFormatting, restoreFocus, editorRef]);

  // تحديث API عند تغير الـ callbacks
  React.useEffect(() => {
    if (editorRef.current && isRegistered.current) {
      const api: TextEditorAPI = {
        applyFormat,
        toggleList,
        removeFormatting,
        editorRef: editorRef.current,
        elementId,
        restoreFocus,
      };
      
      registerEditor(api);
    }
  }, [applyFormat, toggleList, removeFormatting, elementId, restoreFocus, registerEditor, editorRef]);

  return {
    preventClose,
    allowClose,
    canClose,
    restoreFocus,
  };
};

export default TextEditorContext;
