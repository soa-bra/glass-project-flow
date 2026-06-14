import React from 'react';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CanvasSmartElement } from '@/types/canvas-elements';
import type { ExecutionEntityType, ExecutionTarget } from '@/features/planning/execution/executionAdapters';

interface ExpandableExecutionCardProps {
  entityType: ExecutionEntityType;
  entityId?: string;
  title?: string;
  data?: Record<string, unknown>;
  element?: CanvasSmartElement;
  onUpdate?: (data: any) => void;
  children: React.ReactNode;
  className?: string;
}

export const openExecutionPanel = (target: ExecutionTarget) => {
  window.dispatchEvent(new CustomEvent<ExecutionTarget>('planning:open-execution', { detail: target }));
};

export const ExpandableExecutionCard: React.FC<ExpandableExecutionCardProps> = ({
  entityType,
  entityId,
  title,
  data,
  element,
  onUpdate,
  children,
  className,
}) => {
  const resolvedEntityId = entityId ?? element?.id;

  return (
    <div className={className ?? 'relative h-full w-full'}>
      {children}
      <Button
        data-interactive-control
        type="button"
        variant="secondary"
        size="icon"
        className="absolute left-2 top-2 z-10 h-8 w-8 shadow-sm"
        title="فتح لوحة التنفيذ"
        aria-label="فتح لوحة التنفيذ"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          openExecutionPanel({ entityType, entityId: resolvedEntityId, title, data, element, onUpdate });
        }}
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ExpandableExecutionCard;
