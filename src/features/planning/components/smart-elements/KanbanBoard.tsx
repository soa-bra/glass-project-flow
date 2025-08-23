import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus, MoreVertical } from 'lucide-react';

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  assignee?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color: string;
}

interface KanbanBoardProps {
  onColumnChange?: (columns: KanbanColumn[]) => void;
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onColumnChange,
  onCardMove
}) => {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'للعمل عليها',
      cards: [],
      color: '#ef4444'
    },
    {
      id: 'inprogress', 
      title: 'قيد التنفيذ',
      cards: [],
      color: '#f59e0b'
    },
    {
      id: 'done',
      title: 'مكتملة',
      cards: [],
      color: '#10b981'
    }
  ]);

  const [draggedCard, setDraggedCard] = useState<{
    card: KanbanCard;
    fromColumnId: string;
  } | null>(null);

  const addCard = (columnId: string) => {
    const newCard: KanbanCard = {
      id: `card_${Date.now()}`,
      title: 'مهمة جديدة',
      description: '',
      priority: 'medium'
    };

    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, cards: [...col.cards, newCard] }
        : col
    ));
  };

  const updateCard = (columnId: string, cardId: string, updates: Partial<KanbanCard>) => {
    setColumns(columns.map(col => 
      col.id === columnId
        ? {
            ...col,
            cards: col.cards.map(card => 
              card.id === cardId ? { ...card, ...updates } : card
            )
          }
        : col
    ));
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setColumns(columns.map(col => 
      col.id === columnId
        ? { ...col, cards: col.cards.filter(card => card.id !== cardId) }
        : col
    ));
  };

  const moveCard = (cardId: string, fromColumnId: string, toColumnId: string) => {
    if (fromColumnId === toColumnId) return;

    const fromColumn = columns.find(col => col.id === fromColumnId);
    const card = fromColumn?.cards.find(c => c.id === cardId);
    
    if (!card) return;

    setColumns(columns.map(col => {
      if (col.id === fromColumnId) {
        return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
      }
      if (col.id === toColumnId) {
        return { ...col, cards: [...col.cards, card] };
      }
      return col;
    }));

    onCardMove?.(cardId, fromColumnId, toColumnId);
  };

  const handleDragStart = (card: KanbanCard, fromColumnId: string) => {
    setDraggedCard({ card, fromColumnId });
  };

  const handleDrop = (toColumnId: string) => {
    if (draggedCard) {
      moveCard(draggedCard.card.id, draggedCard.fromColumnId, toColumnId);
      setDraggedCard(null);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="w-full min-h-96 bg-sb-panel-bg/30 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">لوحة كانبان</h3>
        <span className="text-xs text-sb-color-text-light">
          {columns.reduce((total, col) => total + col.cards.length, 0)} مهمة
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-72 bg-white rounded-lg border border-sb-border p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <h4 className="font-medium text-sm">{column.title}</h4>
                <span className="text-xs text-sb-color-text-light bg-sb-panel-bg px-2 py-1 rounded">
                  {column.cards.length}
                </span>
              </div>
              <button
                onClick={() => addCard(column.id)}
                className="p-1 hover:bg-sb-panel-bg/50 rounded"
                title="إضافة مهمة"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Cards */}
            <div className="space-y-2 min-h-32">
              {column.cards.map((card) => (
                <div
                  key={card.id}
                  className={cn(
                    "p-3 bg-white border border-sb-border rounded-lg cursor-grab shadow-sm hover:shadow-md transition-shadow",
                    draggedCard?.card.id === card.id && "opacity-50"
                  )}
                  draggable
                  onDragStart={() => handleDragStart(card, column.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateCard(column.id, card.id, { title: e.target.value })}
                      className="font-medium text-sm bg-transparent border-none outline-none w-full"
                    />
                    <button
                      onClick={() => deleteCard(column.id, card.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-500"
                    >
                      <MoreVertical size={12} />
                    </button>
                  </div>
                  
                  <textarea
                    value={card.description || ''}
                    onChange={(e) => updateCard(column.id, card.id, { description: e.target.value })}
                    placeholder="أضف وصفاً..."
                    className="text-xs text-sb-color-text-light bg-transparent border-none outline-none w-full resize-none"
                    rows={2}
                  />
                  
                  {card.priority && (
                    <div className="mt-2">
                      <select
                        value={card.priority}
                        onChange={(e) => updateCard(column.id, card.id, { priority: e.target.value as any })}
                        className={cn(
                          "text-xs px-2 py-1 rounded border text-center",
                          getPriorityColor(card.priority)
                        )}
                      >
                        <option value="high">عالية</option>
                        <option value="medium">متوسطة</option>
                        <option value="low">منخفضة</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};