/**
 * Text Editor Context - سياق محرر النص
 * يستبدل window.__currentTextEditor بـ React Context
 * @module features/planning/elements/text/TextEditorContext
 */

import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { TextEditorAPI } from './types';

const CLOSE_DELAY_MS = 220;

interface TextEditorContextValue {
  activeEditor: TextEditorAPI | null;
  registerEditor: (api: TextEditorAPI) => void;
  unregisterEditor: (elementId: string) => void;
  isEditorActive: boolean;
  preventClose: () => void;
  allowClose: () => void;
  canClose: boolean;
}

const TextEditorContext = createContext<TextEditorContextValue | null>(null);

interface TextEditorProviderProps {
  children: ReactNode;
}

export const TextEditorProvider: React.FC<TextEditorProviderProps> = ({ children }) => {
  const [activeEditor, setActiveEditor] = useState<TextEditorAPI | null>(null);
  const [canClose, setCanClose] = useState(true);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const registerEditor = useCallback((api: TextEditorAPI) => {
    setActiveEditor(api);
    (window as any).__currentTextEditor = api;
  }, []);

  const unregisterEditor = useCallback((elementId: string) => {
    setActiveEditor((current) => {
      if (current?.elementId === elementId) {
        (window as any).__currentTextEditor = null;
        return null;
      }
      return current;
    });
  }, []);

  const preventClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setCanClose(false);
  }, []);

  const allowClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      setCanClose(true);
      closeTimeoutRef.current = null;
    }, CLOSE_DELAY_MS);
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

export const useTextEditorContext = (): TextEditorContextValue => {
  const context = useContext(TextEditorContext);
  
  if (!context) {
    return {
      activeEditor: (window as any).__currentTextEditor || null,
      registerEditor: (api: TextEditorAPI) => {
        (window as any).__currentTextEditor = api;
      },
      unregisterEditor: (elementId: string) => {
        const current = (window as any).__currentTextEditor;
        if (current?.elementId === elementId) {
          (window as any).__currentTextEditor = null;
        }
      },
      isEditorActive: !!(window as any).__currentTextEditor,
      preventClose: () => {},
      allowClose: () => {},
      canClose: true,
    };
  }
  
  return context;
};

export const useActiveTextEditor = (): TextEditorAPI | null => {
  const { activeEditor } = useTextEditorContext();
  return activeEditor || ((window as any).__currentTextEditor ?? null);
};

interface UseTextEditorRegistrationOptions {
  elementId: string;
  editorRef: React.RefObject<HTMLDivElement>;
  applyFormat: (command: string, value?: string) => void;
  toggleList: (listType: 'ul' | 'ol') => void;
  removeFormatting: () => void;
}

export const useTextEditorRegistration = (options: UseTextEditorRegistrationOptions) => {
  const { elementId, editorRef, applyFormat, toggleList, removeFormatting } = options;
  const { registerEditor, unregisterEditor, preventClose, allowClose, canClose } = useTextEditorContext();
  const isRegistered = useRef(false);

  const restoreFocus = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [editorRef]);

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
      (window as any).__currentTextEditor = api;
      isRegistered.current = true;
    }

    return () => {
      if (isRegistered.current) {
        unregisterEditor(elementId);
        const current = (window as any).__currentTextEditor;
        if (current?.elementId === elementId) {
          (window as any).__currentTextEditor = null;
        }
        isRegistered.current = false;
      }
    };
  }, [elementId, registerEditor, unregisterEditor, applyFormat, toggleList, removeFormatting, restoreFocus, editorRef]);

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
      (window as any).__currentTextEditor = api;
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
