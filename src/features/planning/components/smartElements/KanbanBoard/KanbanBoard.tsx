import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/BaseBadge';
import { KanbanBoard as KanbanBoardType, KanbanColumn, KanbanItem } from '../../../types/smartElements.types';
import { Plus, MoreVertical, User, Calendar, Flag } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface KanbanBoardProps {
  element: KanbanBoardType;
  isSelected?: boolean;
  onUpdate?: (updates: Partial<KanbanBoardType>) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  element,
  isSelected = false,
  onUpdate
}) => {
  const [draggedItem, setDraggedItem] = useState<{ item: KanbanItem; columnId: string } | null>(null);

  const handleAddColumn = () => {
    const title = prompt('اسم العمود الجديد:');
    if (title && onUpdate) {
      const newColumn: KanbanColumn = {
        id: `col_${Date.now()}`,
        title,
        items: []
      };
      
      onUpdate({
        data: {
          ...element.data,
          columns: [...element.data.columns, newColumn]
        }
      });
    }
  };

  const handleAddItem = (columnId: string) => {
    const title = prompt('عنوان المهمة الجديدة:');
    if (title && onUpdate) {
      const newItem: KanbanItem = {
        id: `item_${Date.now()}`,
        title,
        priority: 'medium'
      };
      
      const updatedColumns = element.data.columns.map(col => 
        col.id === columnId 
          ? { ...col, items: [...col.items, newItem] }
          : col
      );
      
      onUpdate({
        data: {
          ...element.data,
          columns: updatedColumns
        }
      });
    }
  };

  const handleDragStart = (item: KanbanItem, columnId: string) => {
    if (element.data.allowDragDrop) {
      setDraggedItem({ item, columnId });
    }
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedItem || !onUpdate) return;

    const { item, columnId: sourceColumnId } = draggedItem;
    
    if (sourceColumnId === targetColumnId) return;

    const updatedColumns = element.data.columns.map(col => {
      if (col.id === sourceColumnId) {
        return { ...col, items: col.items.filter(i => i.id !== item.id) };
      }
      if (col.id === targetColumnId) {
        return { ...col, items: [...col.items, item] };
      }
      return col;
    });

    onUpdate({
      data: {
        ...element.data,
        columns: updatedColumns
      }
    });
    
    setDraggedItem(null);
  };

  const getPriorityColor = (priority: KanbanItem['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card 
      className={`w-full h-full ${isSelected ? 'ring-2 ring-primary' : ''} transition-all duration-200`}
      style={{ 
        minWidth: element.size.width,
        minHeight: element.size.height
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">لوحة كانبان</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleAddColumn}>
            <Plus className="h-4 w-4 mr-1" />
            إضافة عمود
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <div className="flex gap-4 p-4 overflow-x-auto h-full">
          {element.data.columns.map((column) => (
            <div 
              key={column.id}
              className="flex-shrink-0 w-64 bg-muted/30 rounded-lg p-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{column.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {column.items.length}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleAddItem(column.id)}>
                      إضافة مهمة
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      حذف العمود
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Column Items */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {column.items.map((item) => (
                  <Card 
                    key={item.id}
                    className="p-3 cursor-move hover:shadow-md transition-shadow bg-background"
                    draggable={element.data.allowDragDrop}
                    onDragStart={() => handleDragStart(item, column.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h5 className="text-sm font-medium leading-tight">{item.title}</h5>
                        <Flag className={`h-3 w-3 ${getPriorityColor(item.priority)}`} />
                      </div>
                      
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {item.assignee && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.assignee}
                          </div>
                        )}
                        {item.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.dueDate).toLocaleDateString('ar-SA')}
                          </div>
                        )}
                      </div>
                      
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
                
                {/* Add Item Button */}
                <Button
                  variant="ghost"
                  className="w-full h-8 text-muted-foreground hover:text-foreground"
                  onClick={() => handleAddItem(column.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة مهمة
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};