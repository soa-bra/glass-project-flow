/**
 * @fileoverview Tool selector component for canvas tools
 * @author AI Assistant
 * @version 1.0.0
 */

import React from 'react';

interface ToolSelectorProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

const tools = [
  { id: 'select', label: 'تحديد' },
  { id: 'text', label: 'نص' },
  { id: 'shape', label: 'شكل' },
  { id: 'sticky', label: 'ملاحظة' },
  { id: 'smart-element', label: 'عنصر ذكي' },
  { id: 'hand', label: 'يد' },
  { id: 'zoom', label: 'تكبير' }
];

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  selectedTool,
  onToolSelect
}) => {
  return (
    <div className="absolute top-4 left-4 flex gap-2 bg-white rounded-lg shadow-md p-2">
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => onToolSelect(tool.id)}
          className={`px-3 py-2 rounded ${
            selectedTool === tool.id 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title={tool.label}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
};