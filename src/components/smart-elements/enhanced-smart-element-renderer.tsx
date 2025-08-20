import React, { useEffect, useState } from 'react';
import { SmartElementCanvasRenderer } from './smart-element-canvas-renderer';
import { DragAndDropProvider, useDraggable, useDropZone } from './drag-and-drop-provider';
import { CanvasNode } from '../../lib/canvas/types';
import { smartElementsRegistry } from '@/apps/brain/plugins/smart-elements/smart-elements-registry';

interface EnhancedSmartElementRendererProps {
  node: CanvasNode;
  isSelected?: boolean;
  isHovered?: boolean;
  zoom?: number;
  isEditing?: boolean;
  onUpdate?: (nodeId: string, updates: Partial<CanvasNode>) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  className?: string;
}

export function EnhancedSmartElementRenderer({
  node,
  isSelected = false,
  isHovered = false,
  zoom = 1,
  isEditing = false,
  onUpdate,
  onDoubleClick,
  onContextMenu,
  className = ''
}: EnhancedSmartElementRendererProps) {
  const [realtimeData, setRealtimeData] = useState(node.metadata || {});

  // Listen for realtime updates
  useEffect(() => {
    const handleRealtimeUpdate = (event: CustomEvent) => {
      const { elementId, ...updates } = event.detail;
      
      if (elementId === node.id) {
        setRealtimeData(prev => ({ ...prev, ...updates }));
        
        // Update the actual node if onUpdate is provided
        if (onUpdate) {
          onUpdate(node.id, {
            metadata: { ...node.metadata, ...updates }
          });
        }
      }
    };

    // Listen for different types of realtime updates
    const eventTypes = [
      'kanban-update',
      'voting-update', 
      'brainstorming-mode-change',
      'thinking-board-update'
    ];

    eventTypes.forEach(eventType => {
      window.addEventListener(eventType, handleRealtimeUpdate as EventListener);
    });

    return () => {
      eventTypes.forEach(eventType => {
        window.removeEventListener(eventType, handleRealtimeUpdate as EventListener);
      });
    };
  }, [node.id, onUpdate]);

  // Create enhanced node with realtime data
  const enhancedNode: CanvasNode = {
    ...node,
    metadata: { ...node.metadata, ...realtimeData }
  };

  // Check if this is a draggable smart element (like Kanban cards)
  const smartElementType = node.metadata?.smartElementType;
  const definition = smartElementType ? smartElementsRegistry.getSmartElement(smartElementType) : null;

  // Drag and drop support for Kanban boards
  if (smartElementType === 'kanban_board') {
    return (
      <DragAndDropProvider>
        <KanbanBoardWithDnD 
          node={enhancedNode}
          isSelected={isSelected}
          isHovered={isHovered}
          zoom={zoom}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onDoubleClick={onDoubleClick}
          onContextMenu={onContextMenu}
          className={className}
        />
      </DragAndDropProvider>
    );
  }

  // Enhanced voting element with animations
  if (smartElementType === 'voting_poll') {
    return (
      <VotingWithAnimations
        node={enhancedNode}
        isSelected={isSelected}
        isHovered={isHovered}
        zoom={zoom}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        className={className}
      />
    );
  }

  // Enhanced brainstorming with mode switching
  if (smartElementType === 'brainstorming_board') {
    return (
      <BrainstormingWithModes
        node={enhancedNode}
        isSelected={isSelected}
        isHovered={isHovered}
        zoom={zoom}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        className={className}
      />
    );
  }

  // Default renderer for other smart elements
  return (
    <SmartElementCanvasRenderer
      node={enhancedNode}
      isSelected={isSelected}
      isHovered={isHovered}
      zoom={zoom}
      isEditing={isEditing}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className={className}
    />
  );
}

// Kanban Board with Drag and Drop
function KanbanBoardWithDnD(props: EnhancedSmartElementRendererProps) {
  const [localColumns, setLocalColumns] = useState(props.node.metadata?.columns || []);

  // Update local state when node changes
  useEffect(() => {
    setLocalColumns(props.node.metadata?.columns || []);
  }, [props.node.metadata?.columns]);

  // Enhanced Kanban column component with drop zones
  const KanbanColumn = ({ column, onCardMove }: any) => {
    const { dropHandlers, isHovered } = useDropZone(
      column.id,
      (draggedItem) => {
        if (draggedItem.type === 'kanban-card') {
          onCardMove(draggedItem.data, draggedItem.sourceId, column.id);
        }
      },
      (item) => item.type === 'kanban-card' && item.sourceId !== column.id
    );

    return (
      <div 
        className={`kanban-column ${dropHandlers.className} ${isHovered ? 'drop-zone-active' : ''}`}
        {...dropHandlers}
      >
        {/* Column content with draggable cards */}
        {(column.cards || []).map((card: any) => (
          <KanbanCard 
            key={card.id} 
            card={card} 
            columnId={column.id}
            onMove={onCardMove}
          />
        ))}
      </div>
    );
  };

  // Draggable Kanban card
  const KanbanCard = ({ card, columnId, onMove }: any) => {
    const { dragHandlers, isDragging } = useDraggable({
      id: card.id,
      type: 'kanban-card',
      data: card,
      sourceId: columnId
    });

    return (
      <div 
        className={`kanban-card ${dragHandlers.className} ${isDragging ? 'dragging' : ''}`}
        {...dragHandlers}
      >
        <div className="card-title">{card.title}</div>
        {card.description && (
          <div className="card-description">{card.description}</div>
        )}
      </div>
    );
  };

  const handleCardMove = (card: any, fromColumn: string, toColumn: string) => {
    const updatedColumns = localColumns.map((col: any) => {
      if (col.id === fromColumn) {
        return { ...col, cards: col.cards.filter((c: any) => c.id !== card.id) };
      }
      if (col.id === toColumn) {
        return { ...col, cards: [...col.cards, card] };
      }
      return col;
    });

    setLocalColumns(updatedColumns);

    // Broadcast update
    if (props.onUpdate) {
      props.onUpdate(props.node.id, {
        metadata: { ...props.node.metadata, columns: updatedColumns }
      });
    }

    // Emit realtime event
    window.dispatchEvent(new CustomEvent('kanban-card-moved', {
      detail: { elementId: props.node.id, card, fromColumn, toColumn }
    }));
  };

  return (
    <SmartElementCanvasRenderer
      {...props}
      node={{ ...props.node, metadata: { ...props.node.metadata, columns: localColumns } }}
    />
  );
}

// Voting with Real-time Animations
function VotingWithAnimations(props: EnhancedSmartElementRendererProps) {
  const [animatingOptions, setAnimatingOptions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleVotingUpdate = (event: CustomEvent) => {
      const { elementId, options } = event.detail;
      
      if (elementId === props.node.id && options) {
        // Animate vote count changes
        const previousOptions = props.node.metadata?.options || [];
        options.forEach((option: any, index: number) => {
          const previousOption = previousOptions[index];
          if (previousOption && option.votes?.length > previousOption.votes?.length) {
            setAnimatingOptions(prev => new Set([...prev, option.id]));
            
            // Remove animation after delay
            setTimeout(() => {
              setAnimatingOptions(prev => {
                const next = new Set(prev);
                next.delete(option.id);
                return next;
              });
            }, 500);
          }
        });
      }
    };

    window.addEventListener('voting-update', handleVotingUpdate as EventListener);
    return () => window.removeEventListener('voting-update', handleVotingUpdate as EventListener);
  }, [props.node.id, props.node.metadata?.options]);

  // Add animation classes to the node metadata
  const enhancedNode = {
    ...props.node,
    metadata: {
      ...props.node.metadata,
      animatingOptions: Array.from(animatingOptions)
    }
  };

  return (
    <SmartElementCanvasRenderer
      {...props}
      node={enhancedNode}
    />
  );
}

// Brainstorming with Mode Switching Animations
function BrainstormingWithModes(props: EnhancedSmartElementRendererProps) {
  const [modeTransition, setModeTransition] = useState(false);

  useEffect(() => {
    const handleModeChange = (event: CustomEvent) => {
      const { elementId, mode } = event.detail;
      
      if (elementId === props.node.id) {
        setModeTransition(true);
        
        // Remove transition animation after delay
        setTimeout(() => {
          setModeTransition(false);
        }, 300);
      }
    };

    window.addEventListener('brainstorming-mode-change', handleModeChange as EventListener);
    return () => window.removeEventListener('brainstorming-mode-change', handleModeChange as EventListener);
  }, [props.node.id]);

  return (
    <div className={`brainstorming-wrapper ${modeTransition ? 'mode-transition' : ''}`}>
      <SmartElementCanvasRenderer {...props} />
    </div>
  );
}