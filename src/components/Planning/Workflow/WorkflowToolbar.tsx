/**
 * WorkflowToolbar - شريط أدوات Workflow
 * Sprint 3: Connector Tool 2.0
 */

import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Square,
  Circle,
  Diamond,
  ArrowRight,
  GitBranch,
  Users,
  Clock,
  Bell,
  Merge,
  Pause,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import type { WorkflowNodeType } from '@/types/workflow';

// =============================================================================
// Types
// =============================================================================

interface WorkflowToolbarProps {
  onAddNode: (type: WorkflowNodeType) => void;
  onAddEdge: () => void;
  onRunWorkflow?: () => void;
  onPauseWorkflow?: () => void;
  onResetWorkflow?: () => void;
  isRunning?: boolean;
  className?: string;
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
}

// =============================================================================
// Tool Button
// =============================================================================

const ToolButton: React.FC<ToolButtonProps> = memo(({
  icon,
  label,
  onClick,
  variant = 'default',
  disabled = false
}) => {
  const variantClasses = {
    default: 'hover:bg-muted/80 text-foreground',
    success: 'hover:bg-[hsl(var(--accent-green))]/10 text-[hsl(var(--accent-green))]',
    warning: 'hover:bg-[hsl(var(--accent-yellow))]/10 text-[hsl(var(--accent-yellow))]',
    danger: 'hover:bg-[hsl(var(--accent-red))]/10 text-[hsl(var(--accent-red))]'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-9 w-9 rounded-lg transition-all',
              variantClasses[variant],
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={onClick}
            disabled={disabled}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

ToolButton.displayName = 'ToolButton';

// =============================================================================
// Workflow Toolbar
// =============================================================================

export const WorkflowToolbar: React.FC<WorkflowToolbarProps> = memo(({
  onAddNode,
  onAddEdge,
  onRunWorkflow,
  onPauseWorkflow,
  onResetWorkflow,
  isRunning = false,
  className
}) => {
  // أدوات العقد
  const nodeTools: Array<{ type: WorkflowNodeType; icon: React.ReactNode; label: string }> = [
    { type: 'start', icon: <Play className="w-4 h-4" />, label: 'بداية' },
    { type: 'end', icon: <Square className="w-4 h-4" />, label: 'نهاية' },
    { type: 'process_step', icon: <Circle className="w-4 h-4" />, label: 'خطوة' },
    { type: 'decision', icon: <Diamond className="w-4 h-4" />, label: 'قرار' },
    { type: 'task_stage', icon: <GitBranch className="w-4 h-4" />, label: 'مرحلة مهام' },
    { type: 'approval', icon: <Users className="w-4 h-4" />, label: 'موافقة' },
    { type: 'notification', icon: <Bell className="w-4 h-4" />, label: 'إشعار' },
    { type: 'parallel', icon: <GitBranch className="w-4 h-4 rotate-90" />, label: 'تفرع' },
    { type: 'merge', icon: <Merge className="w-4 h-4" />, label: 'دمج' }
  ];

  const handleAddNode = useCallback((type: WorkflowNodeType) => {
    onAddNode(type);
  }, [onAddNode]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-1 p-2 bg-background/95 backdrop-blur-sm border rounded-xl shadow-lg',
        className
      )}
      style={{ direction: 'rtl' }}
    >
      {/* أدوات إضافة العقد */}
      <div className="flex items-center gap-1">
        {nodeTools.slice(0, 4).map(tool => (
          <ToolButton
            key={tool.type}
            icon={tool.icon}
            label={tool.label}
            onClick={() => handleAddNode(tool.type)}
          />
        ))}
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* المزيد من العقد */}
      <div className="flex items-center gap-1">
        {nodeTools.slice(4).map(tool => (
          <ToolButton
            key={tool.type}
            icon={tool.icon}
            label={tool.label}
            onClick={() => handleAddNode(tool.type)}
          />
        ))}
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* أداة الربط */}
      <ToolButton
        icon={<ArrowRight className="w-4 h-4" />}
        label="إضافة رابط"
        onClick={onAddEdge}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* أدوات التشغيل */}
      <div className="flex items-center gap-1">
        {isRunning ? (
          <ToolButton
            icon={<Pause className="w-4 h-4" />}
            label="إيقاف مؤقت"
            onClick={() => onPauseWorkflow?.()}
            variant="warning"
          />
        ) : (
          <ToolButton
            icon={<Play className="w-4 h-4" />}
            label="تشغيل"
            onClick={() => onRunWorkflow?.()}
            variant="success"
          />
        )}
        <ToolButton
          icon={<RotateCcw className="w-4 h-4" />}
          label="إعادة تعيين"
          onClick={() => onResetWorkflow?.()}
          variant="danger"
        />
      </div>
    </motion.div>
  );
});

WorkflowToolbar.displayName = 'WorkflowToolbar';
