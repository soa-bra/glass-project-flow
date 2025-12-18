import React, { useState } from 'react';
import { Plus, Tag, Lock, Unlock, Trash2, Edit2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/BaseBadge';
import type { ThinkingBoardData } from '@/types/smart-elements';

interface ThinkingBoardProps {
  data?: Partial<ThinkingBoardData>;
  onUpdate?: (data: ThinkingBoardData) => void;
}

const DEFAULT_TAGS = [
  { id: 'idea', label: 'فكرة', color: '#3DBE8B' },
  { id: 'question', label: 'سؤال', color: '#3DA8F5' },
  { id: 'concern', label: 'ملاحظة', color: '#F6C445' },
  { id: 'action', label: 'إجراء', color: '#E5564D' },
];

interface Note {
  id: string;
  content: string;
  tagId?: string;
  x: number;
  y: number;
}

export const ThinkingBoard: React.FC<ThinkingBoardProps> = ({
  data = {},
  onUpdate,
}) => {
  const [label, setLabel] = useState(data.label || 'لوحة التفكير');
  const [isLocked, setIsLocked] = useState(data.isLocked || false);
  const [tags, setTags] = useState(data.tags || DEFAULT_TAGS);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);

  const updateData = () => {
    onUpdate?.({
      label,
      backgroundColor: data.backgroundColor || '#FFFFFF',
      tags,
      childElements: notes.map(n => n.id),
      isLocked,
      showBordersOnHover: data.showBordersOnHover ?? true,
      expandable: data.expandable ?? true,
    });
  };

  const addNote = () => {
    if (isLocked) return;
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content: '',
      tagId: selectedTag || undefined,
      x: 50 + Math.random() * 200,
      y: 80 + Math.random() * 150,
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, content } : n));
  };

  const deleteNote = (id: string) => {
    if (isLocked) return;
    setNotes(notes.filter(n => n.id !== id));
  };

  const addTag = () => {
    if (!newTagLabel.trim()) return;
    const colors = ['#3DBE8B', '#3DA8F5', '#F6C445', '#E5564D', '#9B59B6', '#1ABC9C'];
    const newTag = {
      id: `tag-${Date.now()}`,
      label: newTagLabel,
      color: colors[tags.length % colors.length],
    };
    setTags([...tags, newTag]);
    setNewTagLabel('');
    setIsAddingTag(false);
  };

  const handleNoteDrag = (e: React.MouseEvent, noteId: string) => {
    if (isLocked) return;
    e.preventDefault();
    setDraggedNote(noteId);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const startNoteX = note.x;
    const startNoteY = note.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setNotes(prev => prev.map(n => 
        n.id === noteId 
          ? { ...n, x: startNoteX + deltaX, y: startNoteY + deltaY }
          : n
      ));
    };

    const handleMouseUp = () => {
      setDraggedNote(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getTagById = (tagId?: string) => tags.find(t => t.id === tagId);

  return (
    <div 
      className="w-full h-full bg-background rounded-lg border border-border overflow-hidden flex flex-col"
      dir="rtl"
      style={{ backgroundColor: data.backgroundColor || '#FFFFFF' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface/50">
        <div className="flex items-center gap-2">
          {isEditingLabel ? (
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={() => { setIsEditingLabel(false); updateData(); }}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingLabel(false)}
              className="h-8 w-48 text-sm"
              autoFocus
            />
          ) : (
            <h3 
              className="font-semibold text-foreground cursor-pointer hover:text-primary"
              onClick={() => !isLocked && setIsEditingLabel(true)}
            >
              {label}
            </h3>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setIsLocked(!isLocked); updateData(); }}
            className="h-8 w-8 p-0"
          >
            {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={addNote}
            disabled={isLocked}
            className="h-8"
          >
            <Plus className="h-4 w-4 ml-1" />
            ملاحظة
          </Button>
        </div>
      </div>

      {/* Tags Bar */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30 flex-wrap">
        <Tag className="h-4 w-4 text-muted-foreground" />
        {tags.map(tag => (
          <Badge
            key={tag.id}
            variant={selectedTag === tag.id ? "default" : "outline"}
            className="cursor-pointer transition-all"
            style={{ 
              backgroundColor: selectedTag === tag.id ? tag.color : 'transparent',
              borderColor: tag.color,
              color: selectedTag === tag.id ? '#fff' : tag.color,
            }}
            onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
          >
            {tag.label}
          </Badge>
        ))}
        {isAddingTag ? (
          <div className="flex items-center gap-1">
            <Input
              value={newTagLabel}
              onChange={(e) => setNewTagLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              placeholder="اسم التصنيف"
              className="h-6 w-24 text-xs"
              autoFocus
            />
            <Button size="sm" onClick={addTag} className="h-6 px-2 text-xs">
              إضافة
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => !isLocked && setIsAddingTag(true)}
            disabled={isLocked}
            className="h-6 px-2"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Board Area */}
      <div className="flex-1 relative overflow-hidden min-h-[300px]">
        {notes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">اضغط على "ملاحظة" لإضافة أفكارك</p>
              <p className="text-xs mt-1">يمكنك تصنيفها باستخدام الوسوم أعلاه</p>
            </div>
          </div>
        ) : null}

        {notes.map(note => {
          const tag = getTagById(note.tagId);
          return (
            <div
              key={note.id}
              className={`absolute w-48 bg-card rounded-lg border shadow-sm transition-shadow ${
                draggedNote === note.id ? 'shadow-lg z-10' : 'hover:shadow-md'
              }`}
              style={{
                left: note.x,
                top: note.y,
                borderColor: tag?.color || 'hsl(var(--border))',
                borderTopWidth: '3px',
              }}
            >
              <div 
                className="flex items-center justify-between p-2 cursor-move border-b border-border"
                onMouseDown={(e) => handleNoteDrag(e, note.id)}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                {tag && (
                  <Badge 
                    className="text-xs"
                    style={{ backgroundColor: tag.color, color: '#fff' }}
                  >
                    {tag.label}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNote(note.id)}
                  disabled={isLocked}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <textarea
                value={note.content}
                onChange={(e) => updateNote(note.id, e.target.value)}
                placeholder="اكتب ملاحظتك..."
                disabled={isLocked}
                className="w-full p-2 text-sm bg-transparent resize-none focus:outline-none min-h-[80px]"
                dir="rtl"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
