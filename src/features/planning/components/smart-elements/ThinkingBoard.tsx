import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Lightbulb, Plus, X } from 'lucide-react';

interface ThinkingBoardProps {
  title?: string;
  onTitleChange?: (title: string) => void;
  backgroundColor?: string;
  onBackgroundChange?: (color: string) => void;
}

interface Idea {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export const ThinkingBoard: React.FC<ThinkingBoardProps> = ({
  title = "لوحة التفكير",
  onTitleChange,
  backgroundColor = "#f8fafc",
  onBackgroundChange
}) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);

  const addIdea = (x: number, y: number) => {
    const newIdea: Idea = {
      id: `idea_${Date.now()}`,
      text: "فكرة جديدة",
      x,
      y,
      color: "#fbbf24"
    };
    setIdeas([...ideas, newIdea]);
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, ...updates } : idea
    ));
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  const handleTitleSubmit = () => {
    setIsEditing(false);
    onTitleChange?.(editingTitle);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addIdea(x, y);
    }
  };

  return (
    <div 
      className="relative min-h-96 w-full border-2 border-dashed border-sb-border rounded-2xl p-4"
      style={{ backgroundColor }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-yellow-500" size={20} />
          {isEditing ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="bg-transparent border-b border-sb-border font-semibold text-lg focus:outline-none"
              autoFocus
            />
          ) : (
            <h3 
              className="font-semibold text-lg cursor-pointer hover:text-primary"
              onClick={() => setIsEditing(true)}
            >
              {title}
            </h3>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onBackgroundChange?.(backgroundColor === "#f8fafc" ? "#fef3c7" : "#f8fafc")}
            className="p-1 rounded hover:bg-sb-panel-bg/50"
            title="تغيير لون الخلفية"
          >
            <div className="w-4 h-4 rounded border border-sb-border bg-yellow-100" />
          </button>
          <span className="text-xs text-sb-color-text-light">
            {ideas.length} فكرة
          </span>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        className="relative min-h-80 rounded-lg cursor-pointer"
        onClick={handleCanvasClick}
      >
        {/* Ideas */}
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="absolute p-2 rounded-lg shadow-sm border border-sb-border bg-white min-w-24 max-w-48"
            style={{ 
              left: idea.x, 
              top: idea.y,
              backgroundColor: idea.color 
            }}
          >
            <textarea
              value={idea.text}
              onChange={(e) => updateIdea(idea.id, { text: e.target.value })}
              className="w-full bg-transparent resize-none border-none outline-none text-sm"
              rows={2}
              placeholder="اكتب فكرتك..."
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteIdea(idea.id);
              }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Empty State */}
        {ideas.length === 0 && (
          <div className="flex items-center justify-center h-80 text-sb-color-text-light">
            <div className="text-center">
              <Plus className="mx-auto mb-2 text-sb-color-text-light" size={32} />
              <p>انقر في أي مكان لإضافة فكرة جديدة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};