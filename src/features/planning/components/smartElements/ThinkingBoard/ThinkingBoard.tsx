import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/BaseBadge';
import { ThinkingBoard as ThinkingBoardType } from '../../../types/smartElements.types';
import { Edit3, Plus, Tag, Settings } from 'lucide-react';

interface ThinkingBoardProps {
  element: ThinkingBoardType;
  isSelected?: boolean;
  onUpdate?: (updates: Partial<ThinkingBoardType>) => void;
}

export const ThinkingBoard: React.FC<ThinkingBoardProps> = ({
  element,
  isSelected = false,
  onUpdate
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(element.data.concept);

  const handleTitleSave = () => {
    if (onUpdate) {
      onUpdate({
        data: {
          ...element.data,
          concept: editTitle
        }
      });
    }
    setIsEditingTitle(false);
  };

  const handleAddTag = () => {
    const newTag = prompt('إضافة وسم جديد:');
    if (newTag && onUpdate) {
      onUpdate({
        data: {
          ...element.data,
          tags: [...element.data.tags, newTag]
        }
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (onUpdate) {
      onUpdate({
        data: {
          ...element.data,
          tags: element.data.tags.filter(tag => tag !== tagToRemove)
        }
      });
    }
  };

  return (
    <Card 
      className={`w-full h-full ${isSelected ? 'ring-2 ring-primary' : ''} transition-all duration-200`}
      style={{ 
        backgroundColor: element.data.backgroundColor,
        minWidth: element.size.width,
        minHeight: element.size.height
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyPress={(e) => e.key === 'Enter' && handleTitleSave()}
              className="text-lg font-bold bg-transparent border-none p-0 h-auto"
              autoFocus
            />
          ) : (
            <CardTitle 
              className="text-lg cursor-pointer hover:text-primary flex items-center gap-2"
              onClick={() => setIsEditingTitle(true)}
            >
              {element.data.concept}
              <Edit3 className="h-4 w-4 opacity-50" />
            </CardTitle>
          )}
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {element.data.tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleRemoveTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
            onClick={handleAddTag}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {/* Drop Zone for Elements */}
        <div 
          className="min-h-32 border-2 border-dashed border-muted-foreground/30 rounded-md p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors"
        >
          {element.data.elements.length === 0 ? (
            <>
              <div className="text-muted-foreground text-sm">
                اسحب العناصر هنا لتجميعها
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                أو انقر لإضافة عناصر جديدة
              </div>
            </>
          ) : (
            <div className="w-full">
              <div className="text-sm text-muted-foreground mb-2">
                العناصر المجمعة ({element.data.elements.length})
              </div>
              <div className="grid grid-cols-2 gap-2">
                {element.data.elements.slice(0, 4).map((elementId, index) => (
                  <div 
                    key={elementId}
                    className="bg-muted/50 rounded p-2 text-xs text-center"
                  >
                    عنصر {index + 1}
                  </div>
                ))}
                {element.data.elements.length > 4 && (
                  <div className="bg-muted/30 rounded p-2 text-xs text-center text-muted-foreground">
                    +{element.data.elements.length - 4} أخرى
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};