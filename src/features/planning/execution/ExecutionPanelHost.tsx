import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getExecutionAdapter, type ExecutionEntityType, type ExecutionTarget } from './executionAdapters';

interface ExecutionPanelHostProps {
  currentUserId: string;
}

const isExecutionEntityType = (value: unknown): value is ExecutionEntityType =>
  typeof value === 'string' && Boolean(getExecutionAdapter(value as ExecutionEntityType));

const normalizeExecutionTarget = (detail: unknown): ExecutionTarget | null => {
  if (!detail || typeof detail !== 'object') return null;
  const target = detail as Partial<ExecutionTarget>;
  if (!isExecutionEntityType(target.entityType)) return null;

  return {
    ...target,
    entityType: target.entityType,
    data: target.data,
  };
};

export const ExecutionPanelHost: React.FC<ExecutionPanelHostProps> = ({ currentUserId }) => {
  const [target, setTarget] = useState<ExecutionTarget | null>(null);

  useEffect(() => {
    const handleOpenExecution = (event: Event) => {
      const nextTarget = normalizeExecutionTarget((event as CustomEvent<ExecutionTarget>).detail);
      if (!nextTarget) return;
      setTarget(nextTarget);
    };

    window.addEventListener('planning:open-execution', handleOpenExecution);
    return () => window.removeEventListener('planning:open-execution', handleOpenExecution);
  }, []);

  const adapter = useMemo(() => (target ? getExecutionAdapter(target.entityType) : null), [target]);
  const close = () => setTarget(null);

  if (!target || !adapter) return null;

  const title = target.title ?? adapter.title;
  const description = adapter.description;
  const AdapterComponent = adapter.Component;

  if (adapter.presentation === 'standalone') {
    return <AdapterComponent target={target} currentUserId={currentUserId} onClose={close} />;
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) close(); }}>
      <DialogContent className="flex h-[100dvh] w-screen max-w-none flex-col overflow-hidden rounded-none p-0 md:inset-y-4 md:left-4 md:right-auto md:top-4 md:h-[calc(100dvh-2rem)] md:w-[min(1120px,calc(100vw-2rem))] md:translate-x-0 md:translate-y-0 md:rounded-3xl">
        <DialogHeader className="border-b border-border px-5 py-4 text-right" dir="rtl">
          <div>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="إغلاق لوحة التنفيذ"
            onClick={close}
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-hidden">
          <AdapterComponent target={target} currentUserId={currentUserId} onClose={close} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExecutionPanelHost;
