import React, { useState, useEffect, useRef } from 'react';
import { CanvasElement } from '@/types/canvas';
import { useCanvasStyles } from '@/hooks/useCanvasStyles';
import { convertCompleteStyle } from '@/utils/styleConverter';

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

  const { elementClasses } = useCanvasStyles({
    position: element.position,
    size: element.size,
    style: element.style,
    isSelected: false
  });

  const editingContainerClasses = `absolute z-[1002] ${elementClasses}`;
  const editingTextareaClasses = `w-full h-full p-2 border-2 border-blue-500 rounded resize-none focus:outline-none`;
  
  if (isEditing) {
    return (
      <div className={editingContainerClasses}>
        <textarea
          ref={textAreaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`${editingTextareaClasses} ${convertCompleteStyle({
            fontSize: element.style?.fontSize || 14,
            fontFamily: element.style?.fontFamily || 'inherit',
            fontWeight: element.style?.fontWeight || 'normal',
            textAlign: element.style?.textAlign || 'left',
            backgroundColor: element.style?.backgroundColor || 'white'
          })}`}
        />
      </div>
    );
  }

  const displayContainerClasses = `absolute cursor-pointer ${elementClasses}`;
  const displayContentClasses = `w-full h-full p-2 bg-white border border-gray-300 rounded whitespace-pre-wrap overflow-hidden ${convertCompleteStyle(element.style || {})}`;

  return (
    <div
      className={displayContainerClasses}
      onDoubleClick={() => {
        // This would trigger edit mode
      }}
    >
      <div className={displayContentClasses}>
        {content || 'نص جديد'}
      </div>
    </div>
  );
};