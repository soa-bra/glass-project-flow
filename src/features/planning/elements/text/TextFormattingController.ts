import type { TextEditorAPI } from './types';
import type { CanvasElement } from '@/types/canvas';

export type TextFormatCommand = 'bold' | 'italic' | 'underline' | 'strikeThrough';

function normalizeTextDecoration(value?: string): string {
  return (value || '').trim().toLowerCase();
}

export function applyInlineFormat(editor: TextEditorAPI | null, command: TextFormatCommand): boolean {
  if (!editor) return false;
  editor.restoreFocus();
  editor.applyFormat(command);
  return true;
}

export function toggleListFormat(editor: TextEditorAPI | null, listType: 'ul' | 'ol'): boolean {
  if (!editor) return false;
  editor.restoreFocus();
  editor.toggleList(listType);
  return true;
}

export function clearEditorFormatting(editor: TextEditorAPI | null): boolean {
  if (!editor) return false;
  editor.restoreFocus();
  editor.removeFormatting();
  return true;
}

export function toggleTextStyleFromElement(
  element: CanvasElement | null,
  command: TextFormatCommand
): Record<string, any> | null {
  if (!element) return null;

  const style = element.style || {};
  const currentTextDecoration = normalizeTextDecoration(style.textDecoration);

  switch (command) {
    case 'bold': {
      const currentWeight = String(style.fontWeight || 'normal').toLowerCase();
      const isBold = currentWeight === 'bold' || Number(currentWeight) >= 600;
      return { fontWeight: isBold ? 'normal' : 'bold' };
    }
    case 'italic': {
      const isItalic = String(style.fontStyle || 'normal').toLowerCase() === 'italic';
      return { fontStyle: isItalic ? 'normal' : 'italic' };
    }
    case 'underline': {
      const hasUnderline = currentTextDecoration.includes('underline');
      return { textDecoration: hasUnderline ? 'none' : 'underline' };
    }
    case 'strikeThrough': {
      const hasStrike = currentTextDecoration.includes('line-through');
      return { textDecoration: hasStrike ? 'none' : 'line-through' };
    }
    default:
      return null;
  }
}

export function getActiveTextFormats(editorActive: boolean, style?: Record<string, any>) {
  if (editorActive && typeof document !== 'undefined' && typeof document.queryCommandState === 'function') {
    return {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    };
  }

  const textDecoration = normalizeTextDecoration(style?.textDecoration);
  const currentWeight = String(style?.fontWeight || 'normal').toLowerCase();

  return {
    bold: currentWeight === 'bold' || Number(currentWeight) >= 600,
    italic: String(style?.fontStyle || 'normal').toLowerCase() === 'italic',
    underline: textDecoration.includes('underline'),
    strikeThrough: textDecoration.includes('line-through'),
    insertUnorderedList: false,
    insertOrderedList: false,
  };
}
