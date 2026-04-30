import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';
import { sanitizeHTML, sanitizeHTMLForDisplay } from '@/utils/sanitize';
import { isTextEmpty } from '@/utils/textDirection';
import { useTextHistory } from './hooks/useTextHistory';
import { useTextEditorContext } from './TextEditorContext';
import type { TextEditorAPI } from './types';
import { measureTextLayout } from './utils/measureTextLayout';
import { getTextPlaceholderVisibility } from './utils/getTextPlaceholderVisibility';

interface TextElementHostProps {
  element: CanvasElement;
  isEditing: boolean;
  onUpdate: (content: string) => void;
  onClose: () => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

const PLACEHOLDER_TEXT = 'اكتب شيئاً...';

export const TextElementHost: React.FC<TextElementHostProps> = ({
  element,
  isEditing,
  onUpdate,
  onClose,
  onDoubleClick,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const originalContentRef = useRef<string>(element.content || '');
  const [isEmpty, setIsEmpty] = useState(isTextEmpty(element.content || ''));

  const { startTyping, stopTyping, updateElement } = useCanvasStore();
  const { registerEditor, unregisterEditor, preventClose, allowClose, canClose } = useTextEditorContext();
  const { pushState, undo, redo } = useTextHistory({
    initialContent: element.content || '',
    maxHistorySize: 50,
  });

  const textType = element.data?.textType || 'line';
  const autoGrow = element.data?.autoGrow !== false;
  const isResizableTextBox = textType === 'box' || !autoGrow;
  const style = element.style || {};
  const justifyContent =
    style.alignItems === 'center'
      ? 'center'
      : style.alignItems === 'flex-end'
        ? 'flex-end'
        : 'flex-start';

  const sharedTextStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: style.fontFamily || 'IBM Plex Sans Arabic',
      fontSize: `${style.fontSize || 16}px`,
      fontWeight: style.fontWeight || 'normal',
      fontStyle: style.fontStyle || 'normal',
      textDecoration: style.textDecoration || 'none',
      color: style.color || '#0B0F12',
      textAlign: style.textAlign || 'right',
      direction: style.direction || 'rtl',
      unicodeBidi: 'plaintext',
      lineHeight: style.lineHeight || 1.35,
      whiteSpace: isResizableTextBox ? 'pre-wrap' : 'pre',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
    }),
    [isResizableTextBox, style.color, style.direction, style.fontFamily, style.fontSize, style.fontStyle, style.fontWeight, style.lineHeight, style.textAlign, style.textDecoration],
  );

  const syncSize = useCallback(
    (htmlContent?: string) => {
      if (!autoGrow) return;

      const nextLayout = measureTextLayout({ element, htmlContent });
      const currentWidth = element.size?.width || 0;
      const currentHeight = element.size?.height || 0;

      if (Math.abs(nextLayout.width - currentWidth) <= 1 && Math.abs(nextLayout.height - currentHeight) <= 1) {
        return;
      }

      updateElement(element.id, {
        size: {
          width: nextLayout.width,
          height: nextLayout.height,
        },
      });
    },
    [autoGrow, element, updateElement],
  );

  const restoreFocus = useCallback(() => {
    if (!editorRef.current || !isEditing) return;
    const editor = editorRef.current;
    editor.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [isEditing]);

  const commitEditorContent = useCallback(() => {
    if (!editorRef.current) return '';
    const nextContent = sanitizeHTML(editorRef.current.innerHTML || '');
    onUpdate(nextContent);
    setIsEmpty(isTextEmpty(nextContent));
    syncSize(nextContent);
    return nextContent;
  }, [onUpdate, syncSize]);

  const applyFormat = useCallback(
    (command: string, value?: string) => {
      if (!editorRef.current || !isEditing) return;
      restoreFocus();
      document.execCommand(command, false, value);
      commitEditorContent();
    },
    [commitEditorContent, isEditing, restoreFocus],
  );

  const toggleList = useCallback(
    (listType: 'ul' | 'ol') => {
      if (!editorRef.current || !isEditing) return;
      restoreFocus();
      document.execCommand(listType === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false);
      commitEditorContent();
    },
    [commitEditorContent, isEditing, restoreFocus],
  );

  const removeFormatting = useCallback(() => {
    if (!editorRef.current || !isEditing) return;
    restoreFocus();
    document.execCommand('removeFormat', false);
    commitEditorContent();
  }, [commitEditorContent, isEditing, restoreFocus]);

  useEffect(() => {
    if (!isEditing || !editorRef.current) return;

    const api: TextEditorAPI = {
      applyFormat,
      toggleList,
      removeFormatting,
      editorRef: editorRef.current,
      elementId: element.id,
      restoreFocus,
    };

    registerEditor(api);
    return () => unregisterEditor(element.id);
  }, [applyFormat, element.id, isEditing, registerEditor, removeFormatting, restoreFocus, toggleList, unregisterEditor]);

  useEffect(() => {
    if (!isEditing) return;
    startTyping();
    return () => stopTyping();
  }, [isEditing, startTyping, stopTyping]);

  useEffect(() => {
    if (!isEditing || !editorRef.current) return;
    const editor = editorRef.current;
    editor.innerHTML = sanitizeHTML(element.content || '');
    setIsEmpty(isTextEmpty(element.content || ''));
    requestAnimationFrame(() => {
      restoreFocus();
      syncSize(element.content || '');
    });
  }, [element.content, isEditing, restoreFocus, syncSize]);

  useEffect(() => {
    if (isEditing) return;
    setIsEmpty(isTextEmpty(element.content || ''));
    syncSize(element.content || '');
  }, [element.content, isEditing, syncSize, style.direction, style.fontFamily, style.fontSize, style.fontStyle, style.fontWeight, style.textAlign, style.textDecoration]);

  const finalizeCloseIfNeeded = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement | null;
    const isStillInsideEditor = !!activeElement && !!wrapperRef.current?.contains(activeElement);
    const isClickingToolbar = !!activeElement?.closest('[data-floating-toolbar]');
    const isClickingFormatButton = !!activeElement?.closest('[data-format-button]');
    if (!canClose || isStillInsideEditor || isClickingToolbar || isClickingFormatButton) {
      return;
    }
    commitEditorContent();
    onClose();
  }, [canClose, commitEditorContent, onClose]);

  const handleDirectionChange = useCallback(
    (direction: 'rtl' | 'ltr') => {
      const nextAlign = direction === 'rtl' ? 'right' : 'left';
      updateElement(element.id, {
        style: {
          ...style,
          direction,
          textAlign: nextAlign,
        },
      });
    },
    [element.id, style, updateElement],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isEditing) return;

      if (e.key === 'Enter' && !e.shiftKey && textType === 'line') {
        const selection = window.getSelection();
        const isInsideList = selection?.anchorNode?.parentElement?.closest('ul, ol');
        if (isInsideList) return;
        e.preventDefault();
        commitEditorContent();
        onClose();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        onUpdate(originalContentRef.current);
        setIsEmpty(isTextEmpty(originalContentRef.current));
        syncSize(originalContentRef.current);
        onClose();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        const previous = undo();
        if (previous !== null && editorRef.current) {
          editorRef.current.innerHTML = sanitizeHTML(previous);
          onUpdate(previous);
          syncSize(previous);
          setIsEmpty(isTextEmpty(previous));
        }
        return;
      }

      if (((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'z') || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        const next = redo();
        if (next !== null && editorRef.current) {
          editorRef.current.innerHTML = sanitizeHTML(next);
          onUpdate(next);
          syncSize(next);
          setIsEmpty(isTextEmpty(next));
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        applyFormat('bold');
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        applyFormat('italic');
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        applyFormat('underline');
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleDirectionChange('rtl');
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleDirectionChange('ltr');
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleDirectionChange((style.direction || 'rtl') === 'rtl' ? 'ltr' : 'rtl');
      }
    },
    [applyFormat, commitEditorContent, handleDirectionChange, isEditing, onClose, onUpdate, redo, style.direction, syncSize, textType, undo],
  );

  const placeholderVisible = getTextPlaceholderVisibility({
    content: isEditing && editorRef.current ? editorRef.current.innerHTML : element.content,
    isEditing,
  });

  const displayMarkup = useMemo(() => {
    if (isEmpty) return '';
    return sanitizeHTMLForDisplay(element.content || '', '');
  }, [element.content, isEmpty]);

  return (
    <div
      ref={wrapperRef}
      data-text-host="true"
      className="relative flex flex-col w-full h-full"
      onDoubleClick={onDoubleClick}
      onMouseEnter={isEditing ? preventClose : undefined}
      onMouseLeave={isEditing ? allowClose : undefined}
      onFocusCapture={isEditing ? preventClose : undefined}
      onBlurCapture={isEditing ? allowClose : undefined}
      onMouseDownCapture={isEditing ? (e) => e.stopPropagation() : undefined}
      style={{ justifyContent }}
    >
      {placeholderVisible && (
        <div
          className="absolute inset-0 pointer-events-none flex flex-col w-full h-full"
          style={{ justifyContent }}
        >
          <span
            style={{
              ...sharedTextStyle,
              color: 'hsl(var(--ink-30))',
              fontStyle: 'italic',
              whiteSpace: isResizableTextBox ? 'pre-wrap' : 'pre',
            }}
          >
            {PLACEHOLDER_TEXT}
          </span>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        dir={style.direction || 'rtl'}
        onInput={(e) => {
          const nextContent = sanitizeHTML(e.currentTarget.innerHTML || '');
          onUpdate(nextContent);
          pushState(nextContent);
          setIsEmpty(isTextEmpty(nextContent));
          syncSize(nextContent);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (isEditing) {
            requestAnimationFrame(finalizeCloseIfNeeded);
          }
        }}
        dangerouslySetInnerHTML={!isEditing ? { __html: displayMarkup } : undefined}
        style={{
          ...sharedTextStyle,
          width: '100%',
          height: isResizableTextBox ? '100%' : undefined,
          minHeight: '1em',
          display: 'block',
          outline: 'none',
          background: 'transparent',
          border: 'none',
          overflow: isResizableTextBox ? 'hidden' : 'visible',
          cursor: isEditing ? 'text' : 'inherit',
          userSelect: isEditing ? 'text' : 'none',
          WebkitUserModify: isEditing ? ('read-write-plaintext-only' as any) : undefined,
        }}
      />
    </div>
  );
};

export default TextElementHost;
