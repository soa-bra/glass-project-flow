import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DragItem {
  id: string;
  type: string;
  data: any;
  sourceId: string;
}

interface DragAndDropContextType {
  draggedItem: DragItem | null;
  isDragging: boolean;
  startDrag: (item: DragItem) => void;
  endDrag: () => void;
  handleDrop: (targetId: string, onDrop: (item: DragItem) => void) => void;
}

const DragAndDropContext = createContext<DragAndDropContextType | null>(null);

interface DragAndDropProviderProps {
  children: ReactNode;
}

export function DragAndDropProvider({ children }: DragAndDropProviderProps) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = useCallback((item: DragItem) => {
    setDraggedItem(item);
    setIsDragging(true);
    
    // Add global drag cursor
    document.body.style.cursor = 'grabbing';
    
    console.log('🎯 Started dragging:', item.type, item.id);
  }, []);

  const endDrag = useCallback(() => {
    setDraggedItem(null);
    setIsDragging(false);
    
    // Remove global drag cursor
    document.body.style.cursor = '';
    
    console.log('✋ Ended dragging');
  }, []);

  const handleDrop = useCallback((targetId: string, onDrop: (item: DragItem) => void) => {
    if (draggedItem && targetId !== draggedItem.sourceId) {
      console.log('📦 Dropping item:', draggedItem.id, 'on target:', targetId);
      onDrop(draggedItem);
      
      // Emit custom event for smooth animations
      window.dispatchEvent(new CustomEvent('smart-element-drop', {
        detail: { 
          item: draggedItem, 
          targetId,
          timestamp: Date.now()
        }
      }));
    }
    endDrag();
  }, [draggedItem, endDrag]);

  const value: DragAndDropContextType = {
    draggedItem,
    isDragging,
    startDrag,
    endDrag,
    handleDrop
  };

  return (
    <DragAndDropContext.Provider value={value}>
      <div className={isDragging ? 'dragging-active' : ''}>
        {children}
      </div>
    </DragAndDropContext.Provider>
  );
}

export function useDragAndDrop() {
  const context = useContext(DragAndDropContext);
  if (!context) {
    throw new Error('useDragAndDrop must be used within a DragAndDropProvider');
  }
  return context;
}

// Draggable Item Hook
export function useDraggable(item: DragItem) {
  const { startDrag, endDrag, isDragging, draggedItem } = useDragAndDrop();
  
  const isDraggedItem = draggedItem?.id === item.id;

  const dragHandlers = {
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      startDrag(item);
      
      // Set drag image (optional)
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.opacity = '0.8';
      dragImage.style.transform = 'rotate(2deg)';
      e.dataTransfer.setDragImage(dragImage, 0, 0);
    },
    onDragEnd: () => {
      endDrag();
    },
    className: isDraggedItem ? 'opacity-50 scale-95 rotate-2 transition-all' : 'transition-all hover:scale-105'
  };

  return {
    dragHandlers,
    isDragging: isDraggedItem,
    isAnyDragging: isDragging
  };
}

// Drop Zone Hook
export function useDropZone(targetId: string, onDrop: (item: DragItem) => void, canDrop?: (item: DragItem) => boolean) {
  const { handleDrop, draggedItem } = useDragAndDrop();
  const [isHovered, setIsHovered] = useState(false);
  
  const canAcceptDrop = draggedItem && (!canDrop || canDrop(draggedItem));

  const dropHandlers = {
    onDragOver: (e: React.DragEvent) => {
      if (canAcceptDrop) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }
    },
    onDragEnter: (e: React.DragEvent) => {
      if (canAcceptDrop) {
        e.preventDefault();
        setIsHovered(true);
      }
    },
    onDragLeave: (e: React.DragEvent) => {
      // Only leave if actually leaving the element (not entering a child)
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
        setIsHovered(false);
      }
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsHovered(false);
      
      if (canAcceptDrop) {
        handleDrop(targetId, onDrop);
      }
    },
    className: canAcceptDrop && isHovered 
      ? 'ring-2 ring-primary bg-primary/10 transition-all' 
      : canAcceptDrop 
        ? 'ring-1 ring-dashed ring-muted-foreground/30 transition-all'
        : ''
  };

  return {
    dropHandlers,
    isHovered: isHovered && canAcceptDrop,
    canAcceptDrop: !!canAcceptDrop
  };
}