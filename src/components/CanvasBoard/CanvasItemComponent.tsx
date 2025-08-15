import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2 } from 'lucide-react';
import { CanvasItem } from './types';

interface CanvasItemComponentProps {
  item: CanvasItem;
  onUpdate: (id: string, updates: Partial<CanvasItem>) => void;
  onDelete: (id: string) => void;
}

const CanvasItemComponent: React.FC<CanvasItemComponentProps> = ({
  item,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content);

  const handleSave = () => {
    onUpdate(item.id, { title: editTitle, content: editContent });
    setIsEditing(false);
  };

  return (
    <div
      className={`absolute ${item.color} p-3 rounded-lg shadow-md border border-black/10 min-w-48 max-w-64 cursor-move animate-fade-in`}
      style={{ left: item.position.x, top: item.position.y }}
    >
      <div className="flex items-center justify-between mb-2">
        <BaseBadge variant="secondary" className="text-xs">
          {item.type}
        </BaseBadge>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-6 w-6"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-6 w-6 text-red-600"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-sm"
          />
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="text-sm resize-none"
            rows={2}
          />
          <Button size="sm" onClick={handleSave} className="w-full">
            حفظ
          </Button>
        </div>
      ) : (
        <div>
          <h4 className="font-medium text-black text-sm mb-1">{item.title}</h4>
          <p className="text-xs text-black/70">{item.content}</p>
          {item.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {item.tags.map((tag, index) => (
                <BaseBadge key={index} variant="outline" className="text-xs">
                  {tag}
                </BaseBadge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CanvasItemComponent;