import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  color?: string;
  tags?: string[];
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

interface KanbanBoardProps {
  initialColumns?: KanbanColumn[];
  onUpdate?: (columns: KanbanColumn[]) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  initialColumns = [
    { id: 'todo', title: 'المهام', cards: [] },
    { id: 'in-progress', title: 'قيد التنفيذ', cards: [] },
    { id: 'done', title: 'منجز', cards: [] },
  ],
  onUpdate,
}) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'column') {
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);
      setColumns(newColumns);
      onUpdate?.(newColumns);
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    if (source.droppableId === destination.droppableId) {
      const newCards = Array.from(sourceColumn.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const newColumns = columns.map(col =>
        col.id === sourceColumn.id ? { ...col, cards: newCards } : col
      );
      setColumns(newColumns);
      onUpdate?.(newColumns);
    } else {
      const sourceCards = Array.from(sourceColumn.cards);
      const destCards = Array.from(destColumn.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, movedCard);

      const newColumns = columns.map(col => {
        if (col.id === sourceColumn.id) return { ...col, cards: sourceCards };
        if (col.id === destColumn.id) return { ...col, cards: destCards };
        return col;
      });
      setColumns(newColumns);
      onUpdate?.(newColumns);
    }
  };

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newColumn: KanbanColumn = {
      id: `col-${Date.now()}`,
      title: newColumnTitle,
      cards: [],
    };
    setColumns([...columns, newColumn]);
    setNewColumnTitle('');
    setIsAddingColumn(false);
    onUpdate?.([...columns, newColumn]);
  };

  const deleteColumn = (columnId: string) => {
    const newColumns = columns.filter(col => col.id !== columnId);
    setColumns(newColumns);
    onUpdate?.(newColumns);
  };

  const addCard = (columnId: string) => {
    const newCard: KanbanCard = {
      id: `card-${Date.now()}`,
      title: 'بطاقة جديدة',
      description: '',
      color: 'hsl(var(--accent))',
    };
    const newColumns = columns.map(col =>
      col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
    );
    setColumns(newColumns);
    onUpdate?.(newColumns);
  };

  const deleteCard = (columnId: string, cardId: string) => {
    const newColumns = columns.map(col =>
      col.id === columnId ? { ...col, cards: col.cards.filter(c => c.id !== cardId) } : col
    );
    setColumns(newColumns);
    onUpdate?.(newColumns);
  };

  return (
    <div className="w-full h-full bg-background p-4 overflow-auto" dir="rtl">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-4 min-h-full"
            >
              {columns.map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex-shrink-0 w-80 bg-surface rounded-lg border border-border"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between p-3 border-b border-border"
                      >
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{column.title}</h3>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {column.cards.length}
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => deleteColumn(column.id)}>
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف العمود
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <Droppable droppableId={column.id} type="card">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`p-3 min-h-[200px] ${
                              snapshot.isDraggingOver ? 'bg-accent/5' : ''
                            }`}
                          >
                            {(column.cards || []).map((card, cardIndex) => (
                              <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-2 p-3 bg-card rounded border border-border ${
                                      snapshot.isDragging ? 'shadow-lg' : ''
                                    }`}
                                    style={{
                                      ...provided.draggableProps.style,
                                      borderRight: `3px solid ${card.color || 'hsl(var(--primary))'}`,
                                    }}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <p className="text-sm font-medium flex-1">{card.title}</p>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                            <MoreVertical className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem>
                                            <Edit2 className="h-4 w-4 ml-2" />
                                            تعديل
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => deleteCard(column.id, card.id)}
                                          >
                                            <Trash2 className="h-4 w-4 ml-2" />
                                            حذف
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                    {card.description && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {card.description}
                                      </p>
                                    )}
                                    {card.tags && card.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {card.tags.map((tag, i) => (
                                          <span
                                            key={i}
                                            className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <div className="p-3 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addCard(column.id)}
                          className="w-full justify-start text-xs"
                        >
                          <Plus className="h-4 w-4 ml-2" />
                          إضافة بطاقة
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {isAddingColumn ? (
                <div className="flex-shrink-0 w-80 bg-surface rounded-lg border border-border p-3">
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addColumn()}
                    placeholder="اسم العمود"
                    className="w-full px-3 py-2 text-sm border border-border rounded mb-2 bg-background"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addColumn} className="flex-1">
                      إضافة
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsAddingColumn(false);
                        setNewColumnTitle('');
                      }}
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingColumn(true)}
                    className="w-80 h-12"
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة عمود
                  </Button>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
