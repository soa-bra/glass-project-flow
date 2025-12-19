/**
 * WorkflowNode Component - عقدة Workflow في الكانفس
 * Sprint 2: Workflow Design Layer
 */

import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Square,
  Cog,
  CheckSquare,
  HelpCircle,
  GitBranch,
  GitMerge,
  Clock,
  Bell,
  ThumbsUp,
  Layers,
  GripVertical,
  Plus,
  MoreHorizontal,
  Users,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorkflowNodeData, WorkflowNodeType, WorkflowTask } from '@/types/workflow';
import { getDefaultNodeStyle } from '@/types/workflow';

// ============= Icon Map =============

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Play,
  Square,
  Cog,
  CheckSquare,
  HelpCircle,
  GitBranch,
  GitMerge,
  Clock,
  Bell,
  ThumbsUp,
  Layers
};

// ============= Props =============

interface WorkflowNodeProps {
  node: WorkflowNodeData;
  isSelected?: boolean;
  isHovered?: boolean;
  isDragging?: boolean;
  scale?: number;
  onSelect?: (nodeId: string, multiSelect?: boolean) => void;
  onDoubleClick?: (nodeId: string) => void;
  onTaskAdd?: (nodeId: string) => void;
  onTaskUpdate?: (nodeId: string, taskId: string, updates: Partial<WorkflowTask>) => void;
  onNodeUpdate?: (nodeId: string, updates: Partial<WorkflowNodeData>) => void;
  onConnectionStart?: (nodeId: string, anchor: 'top' | 'bottom' | 'left' | 'right') => void;
}

// ============= WorkflowNode Component =============

export const WorkflowNode = memo(function WorkflowNode({
  node,
  isSelected = false,
  isHovered = false,
  isDragging = false,
  scale = 1,
  onSelect,
  onDoubleClick,
  onTaskAdd,
  onTaskUpdate,
  onNodeUpdate,
  onConnectionStart
}: WorkflowNodeProps) {
  const [showAnchors, setShowAnchors] = useState(false);
  
  const style = node.style || getDefaultNodeStyle(node.type);
  const IconComponent = iconMap[style.iconName || 'Cog'];
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(node.id, e.shiftKey || e.metaKey);
  }, [node.id, onSelect]);
  
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick?.(node.id);
  }, [node.id, onDoubleClick]);
  
  const handleAnchorClick = useCallback((anchor: 'top' | 'bottom' | 'left' | 'right') => (e: React.MouseEvent) => {
    e.stopPropagation();
    onConnectionStart?.(node.id, anchor);
  }, [node.id, onConnectionStart]);

  // ============= Render Based on Type =============

  const renderNodeContent = () => {
    switch (node.type) {
      case 'start':
      case 'end':
        return <CircleNode node={node} style={style} IconComponent={IconComponent} />;
      
      case 'decision':
        return <DiamondNode node={node} style={style} IconComponent={IconComponent} />;
      
      case 'task_stage':
        return (
          <TaskStageNode 
            node={node} 
            style={style} 
            onTaskAdd={onTaskAdd}
            onTaskUpdate={onTaskUpdate}
          />
        );
      
      default:
        return <RectangleNode node={node} style={style} IconComponent={IconComponent} />;
    }
  };

  return (
    <motion.div
      className={cn(
        'absolute cursor-pointer transition-shadow',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isDragging && 'opacity-80'
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.size?.width || 180,
        height: node.size?.height || 80,
        zIndex: isSelected ? 100 : 10
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setShowAnchors(true)}
      onMouseLeave={() => setShowAnchors(false)}
    >
      {renderNodeContent()}
      
      {/* Connection Anchors */}
      {(showAnchors || isSelected) && (
        <ConnectionAnchors 
          nodeSize={node.size || { width: 180, height: 80 }}
          nodeType={node.type}
          onAnchorClick={handleAnchorClick}
        />
      )}
      
      {/* Status Badge */}
      {node.assignees && node.assignees.length > 0 && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-background border rounded-full px-2 py-0.5 text-xs shadow-sm">
          <Users className="w-3 h-3" />
          <span>{node.assignees.length}</span>
        </div>
      )}
      
      {/* Due Date Badge */}
      {node.dueDate && (
        <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-background border rounded-full px-2 py-0.5 text-xs shadow-sm">
          <Calendar className="w-3 h-3" />
          <span>{new Date(node.dueDate).toLocaleDateString('ar-SA')}</span>
        </div>
      )}
    </motion.div>
  );
});

// ============= Sub Components =============

interface NodeStyleProps {
  node: WorkflowNodeData;
  style: ReturnType<typeof getDefaultNodeStyle>;
  IconComponent?: React.ComponentType<{ className?: string }>;
}

const CircleNode = memo(function CircleNode({ node, style, IconComponent }: NodeStyleProps) {
  return (
    <div
      className="w-full h-full rounded-full flex items-center justify-center shadow-md"
      style={{
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        borderWidth: style.borderWidth || 2,
        borderStyle: 'solid',
        color: style.textColor || '#FFFFFF'
      }}
    >
      {IconComponent && (
        <IconComponent className="w-6 h-6" />
      )}
    </div>
  );
});

const DiamondNode = memo(function DiamondNode({ node, style, IconComponent }: NodeStyleProps) {
  return (
    <div
      className="w-full h-full flex items-center justify-center shadow-md"
      style={{
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        borderWidth: style.borderWidth || 2,
        borderStyle: 'solid',
        transform: 'rotate(45deg)'
      }}
    >
    <div style={{ transform: 'rotate(-45deg)', color: style.textColor || '#FFFFFF' }} className="flex flex-col items-center gap-1">
        {IconComponent && (
          <IconComponent className="w-5 h-5" />
        )}
        <span className="text-xs font-medium text-center px-1">
          {node.label}
        </span>
      </div>
    </div>
  );
});

const RectangleNode = memo(function RectangleNode({ node, style, IconComponent }: NodeStyleProps) {
  return (
    <div
      className="w-full h-full flex items-center gap-3 px-4 shadow-md"
      style={{
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        borderWidth: style.borderWidth || 2,
        borderStyle: 'solid',
        borderRadius: style.borderRadius || 8
      }}
    >
      {IconComponent && (
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: style.textColor || '#FFFFFF' }}
        >
          <IconComponent className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0" style={{ color: style.textColor || '#FFFFFF' }}>
        <h4 className="font-semibold text-sm truncate">
        >
          {node.label}
        </h4>
        {node.description && (
          <p 
            className="text-xs opacity-80 truncate"
            style={{ color: style.textColor || '#FFFFFF' }}
          >
            {node.description}
          </p>
        )}
      </div>
      <MoreHorizontal 
        className="w-4 h-4 opacity-60 cursor-pointer hover:opacity-100" 
        style={{ color: style.textColor || '#FFFFFF' }}
      />
    </div>
  );
});

interface TaskStageNodeProps extends NodeStyleProps {
  onTaskAdd?: (nodeId: string) => void;
  onTaskUpdate?: (nodeId: string, taskId: string, updates: Partial<WorkflowTask>) => void;
}

const TaskStageNode = memo(function TaskStageNode({ 
  node, 
  style,
  onTaskAdd,
  onTaskUpdate
}: TaskStageNodeProps) {
  const tasks = node.tasks || [];
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  return (
    <div
      className="w-full h-full flex flex-col shadow-md overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: style.borderColor,
        borderWidth: style.borderWidth || 2,
        borderStyle: 'solid',
        borderRadius: style.borderRadius || 12
      }}
    >
      {/* Header */}
      <div 
        className="px-3 py-2 flex items-center justify-between"
        style={{ backgroundColor: style.backgroundColor }}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 opacity-60" style={{ color: style.textColor }} />
          <h4 className="font-semibold text-sm" style={{ color: style.textColor }}>
            {node.label}
          </h4>
        </div>
        <span className="text-xs opacity-80" style={{ color: style.textColor }}>
          {completedTasks}/{tasks.length}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <div 
          className="h-full transition-all duration-300"
          style={{ 
            width: `${progress}%`,
            backgroundColor: style.backgroundColor 
          }}
        />
      </div>
      
      {/* Tasks List */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {tasks.slice(0, 4).map((task) => (
          <div 
            key={task.id}
            className={cn(
              'flex items-center gap-2 p-2 rounded-md text-sm cursor-pointer',
              'hover:bg-muted/50 transition-colors',
              task.status === 'done' && 'opacity-60'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onTaskUpdate?.(node.id, task.id, {
                status: task.status === 'done' ? 'todo' : 'done'
              });
            }}
          >
            <div className={cn(
              'w-4 h-4 rounded border-2 flex items-center justify-center',
              task.status === 'done' 
                ? 'bg-primary border-primary' 
                : 'border-muted-foreground/30'
            )}>
              {task.status === 'done' && (
                <CheckSquare className="w-3 h-3 text-primary-foreground" />
              )}
            </div>
            <span className={cn(
              'flex-1 truncate',
              task.status === 'done' && 'line-through'
            )}>
              {task.title}
            </span>
            {task.priority === 'high' || task.priority === 'urgent' ? (
              <span className="w-2 h-2 rounded-full bg-destructive" />
            ) : null}
          </div>
        ))}
        
        {tasks.length > 4 && (
          <div className="text-xs text-muted-foreground text-center py-1">
            +{tasks.length - 4} مهام أخرى
          </div>
        )}
      </div>
      
      {/* Add Task Button */}
      <div 
        className="px-3 py-2 border-t flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:bg-muted/50"
        onClick={(e) => {
          e.stopPropagation();
          onTaskAdd?.(node.id);
        }}
      >
        <Plus className="w-3 h-3" />
        <span>إضافة مهمة</span>
      </div>
    </div>
  );
});

// ============= Connection Anchors =============

interface ConnectionAnchorsProps {
  nodeSize: { width: number; height: number };
  nodeType: WorkflowNodeType;
  onAnchorClick: (anchor: 'top' | 'bottom' | 'left' | 'right') => (e: React.MouseEvent) => void;
}

const ConnectionAnchors = memo(function ConnectionAnchors({
  nodeSize,
  nodeType,
  onAnchorClick
}: ConnectionAnchorsProps) {
  const anchors: Array<{ id: 'top' | 'bottom' | 'left' | 'right'; x: number; y: number }> = [
    { id: 'top', x: nodeSize.width / 2, y: 0 },
    { id: 'bottom', x: nodeSize.width / 2, y: nodeSize.height },
    { id: 'left', x: 0, y: nodeSize.height / 2 },
    { id: 'right', x: nodeSize.width, y: nodeSize.height / 2 }
  ];

  // للـ decision (المعين) نعدل المواقع
  if (nodeType === 'decision') {
    return (
      <>
        {anchors.map(anchor => (
          <motion.div
            key={anchor.id}
            className="absolute w-4 h-4 rounded-full bg-primary border-2 border-background cursor-crosshair z-50"
            style={{
              left: anchor.x - 8,
              top: anchor.y - 8,
              transform: 'rotate(-45deg)'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.3 }}
            onClick={onAnchorClick(anchor.id)}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {anchors.map(anchor => (
        <motion.div
          key={anchor.id}
          className="absolute w-3 h-3 rounded-full bg-primary border-2 border-background cursor-crosshair z-50 hover:w-4 hover:h-4 transition-all"
          style={{
            left: anchor.x - 6,
            top: anchor.y - 6
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.3 }}
          onClick={onAnchorClick(anchor.id)}
        />
      ))}
    </>
  );
});

export default WorkflowNode;
