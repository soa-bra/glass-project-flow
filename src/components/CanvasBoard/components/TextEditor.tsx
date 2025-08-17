import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';
import { DESIGN_TOKENS } from '@/components/shared/design-system/constants';

interface TextEditorProps {
  element: CanvasElement;
  isEditing: boolean;
  onTextChange: (text: string) => void;
  onFinishEditing: () => void;
  zoom: number;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  element,
  isEditing,
  onTextChange,
  onFinishEditing,
  zoom
}) => {
  const [text, setText] = useState(element.content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText);
  }, [onTextChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      onFinishEditing();
    } else if (e.key === 'Escape') {
      onFinishEditing();
    }
  }, [onFinishEditing]);

  const handleBlur = useCallback(() => {
    onFinishEditing();
  }, [onFinishEditing]);

  if (!isEditing) {
    return (
      <div
        style={{
          position: 'absolute',
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          fontSize: (element.style?.fontSize || 14) * zoom,
          fontFamily: element.style?.fontFamily || 'Arial',
          fontWeight: element.style?.fontWeight || 'normal',
          color: element.style?.color || '#000000',
          textAlign: element.style?.textAlign || 'left',
          padding: '8px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflow: 'hidden'
        }}
        onDoubleClick={() => {
          // This will be handled by parent component
        }}
      >
        {element.content || 'انقر مرتين للتحرير'}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        zIndex: 1000
      }}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        style={{
          width: '100%',
          height: '100%',
          border: '2px solid #2563eb',
          borderRadius: '4px',
          fontSize: (element.style?.fontSize || 14) * zoom,
          fontFamily: element.style?.fontFamily || 'Arial',
          fontWeight: element.style?.fontWeight || 'normal',
          color: element.style?.color || '#000000',
          textAlign: element.style?.textAlign || 'left',
          padding: '8px',
          resize: 'none',
          outline: 'none',
          backgroundColor: element.style?.backgroundColor || DESIGN_TOKENS.COLORS.SURFACE
        }}
        placeholder="اكتب النص هنا..."
        dir="rtl"
      />
      
      <div 
        style={{
          position: 'absolute',
          bottom: '-24px',
          left: '0',
          fontSize: '12px',
          color: '#666',
          backgroundColor: DESIGN_TOKENS.COLORS.SURFACE,
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          whiteSpace: 'nowrap'
        }}
      >
        Ctrl+Enter للحفظ • Esc للإلغاء
      </div>
    </div>
  );
};