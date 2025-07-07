import React from 'react';
import { CanvasElement } from '../types';
import { cn } from '@/lib/utils';

interface MiroStyleElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

const getElementColors = (type: string) => {
  switch (type) {
    case 'sticky':
      return {
        bg: 'bg-yellow-200',
        border: 'border-yellow-300',
        text: 'text-gray-800'
      };
    case 'comment':
      return {
        bg: 'bg-pink-100',
        border: 'border-pink-200',
        text: 'text-gray-700'
      };
    case 'text':
      return {
        bg: 'bg-transparent',
        border: 'border-transparent',
        text: 'text-gray-900'
      };
    case 'rectangle':
      return {
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        text: 'text-blue-800'
      };
    case 'circle':
      return {
        bg: 'bg-green-100',
        border: 'border-green-300',
        text: 'text-green-800'
      };
    default:
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        text: 'text-gray-700'
      };
  }
};

export const MiroStyleElement: React.FC<MiroStyleElementProps> = ({
  element,
  isSelected,
  onSelect,
  onMouseDown
}) => {
  const colors = getElementColors(element.type);
  
  const renderContent = () => {
    switch (element.type) {
      case 'sticky':
        return (
          <div className={cn(
            "w-full h-full p-3 rounded-lg shadow-sm",
            colors.bg,
            `border-2 ${colors.border}`,
            colors.text,
            "font-medium text-sm leading-relaxed"
          )}>
            {element.content || 'ملاحظة جديدة'}
          </div>
        );
        
      case 'text':
        return (
          <div className={cn(
            "w-full h-full flex items-center justify-center",
            colors.text,
            "font-medium text-base"
          )}>
            {element.content || 'نص جديد'}
          </div>
        );
        
      case 'comment':
        return (
          <div className={cn(
            "w-full h-full p-2 rounded-lg",
            colors.bg,
            `border ${colors.border}`,
            colors.text,
            "text-xs"
          )}>
            <div className="flex items-start space-x-2 rtl:space-x-reverse">
              <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-white text-xs">
                م
              </div>
              <div className="flex-1">
                {element.content || 'تعليق جديد'}
              </div>
            </div>
          </div>
        );
        
      case 'rectangle':
        return (
          <div className={cn(
            "w-full h-full rounded-lg flex items-center justify-center",
            colors.bg,
            `border-2 ${colors.border}`,
            colors.text,
            "font-medium"
          )}>
            {element.content || 'مستطيل'}
          </div>
        );
        
      case 'circle':
        return (
          <div className={cn(
            "w-full h-full rounded-full flex items-center justify-center",
            colors.bg,
            `border-2 ${colors.border}`,
            colors.text,
            "font-medium"
          )}>
            {element.content || 'دائرة'}
          </div>
        );
        
      default:
        return (
          <div className={cn(
            "w-full h-full rounded flex items-center justify-center",
            colors.bg,
            `border ${colors.border}`,
            colors.text
          )}>
            {element.content || 'عنصر'}
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "absolute cursor-pointer group",
        isSelected && "ring-2 ring-blue-400 ring-offset-2"
      )}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        transform: isSelected ? 'none' : undefined
      }}
      onClick={onSelect}
      onMouseDown={onMouseDown}
    >
      {renderContent()}
      
      {/* Selection Handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize" />
          
          {/* Edge handles */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-n-resize" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-s-resize" />
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-w-resize" />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-e-resize" />
        </>
      )}
    </div>
  );
};