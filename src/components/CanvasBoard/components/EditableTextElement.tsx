import React, { useState, useEffect, useRef } from 'react';
import { CanvasElement } from '@/types/canvas';

interface EditableTextElementProps {
  element: CanvasElement;
  isEditing: boolean;
  onTextUpdate: (content: string) => void;
  onEditEnd: () => void;
}

export const EditableTextElement: React.FC<EditableTextElementProps> = ({
  element,
  isEditing,
  onTextUpdate,
  onEditEnd
}) => {
  const [content, setContent] = useState(element.content || '');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(element.content || '');
  }, [element.content]);

  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.select();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setContent(element.content || '');
      onEditEnd();
    }
  };

  const handleSave = () => {
    onTextUpdate(content);
    onEditEnd();
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <div className="absolute" style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        zIndex: 1002
      }}>
        <textarea
          ref={textAreaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full h-full p-2 border-2 border-blue-500 rounded resize-none focus:outline-none"
          style={{
            fontSize: element.style?.fontSize || '14px',
            fontFamily: element.style?.fontFamily || 'inherit',
            fontWeight: element.style?.fontWeight || 'normal',
            textAlign: element.style?.textAlign || 'left',
            backgroundColor: element.style?.backgroundColor || '#ffffff'
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height
      }}
      onDoubleClick={() => {
        // This would trigger edit mode
      }}
    >
      <div
        className="w-full h-full p-2 bg-white border border-gray-300 rounded"
        style={{
          ...element.style,
          whiteSpace: 'pre-wrap',
          overflow: 'hidden'
        }}
      >
        {content || 'نص جديد'}
      </div>
    </div>
  );
};