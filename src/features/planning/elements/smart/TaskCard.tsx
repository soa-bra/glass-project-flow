import React from 'react';
import { CheckSquare, AlertTriangle, Calendar, DollarSign, Users, Gauge, Maximize2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskCardData {
  taskName?: string;
  state?: 'draft' | 'planned' | 'active' | 'blocked' | 'paused' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  complexity?: 'trivial' | 'simple' | 'moderate' | 'complex' | 'critical';
  estimatedDuration?: number;
  estimatedCost?: number;
  requiredTeamSize?: number;
  dueDate?: string;
  actualDuration?: number;
  actualCost?: number;
}

interface TaskCardProps {
  data: TaskCardData;
  onUpdate: (data: Partial<TaskCardData>) => void;
  onExpand?: () => void;
  onConvert?: () => void;
}

const STATE_LABELS: Record<NonNullable<TaskCardData['state']>, string> = {
  draft: 'مسودة',
  planned: 'مخطط',
  active: 'نشطة',
  blocked: 'متوقفة',
  paused: 'معلقة',
  completed: 'مكتملة',
  cancelled: 'ملغية',
};

const PRIORITY_LABELS: Record<NonNullable<TaskCardData['priority']>, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'مرتفعة',
  critical: 'حرجة',
};

export const TaskCard: React.FC<TaskCardProps> = ({ data, onExpand, onConvert }) => {
  const taskName = data.taskName || 'مهمة جديدة';
  const state = data.state || 'draft';
  const priority = data.priority || 'medium';
  const complexity = data.complexity || 'moderate';
  const estimatedDuration = data.estimatedDuration ?? 0;
  const estimatedCost = data.estimatedCost ?? 0;
  const requiredTeamSize = data.requiredTeamSize ?? 1;
  const actualCost = data.actualCost ?? 0;
  const costUsage = estimatedCost > 0 ? (actualCost / estimatedCost) * 100 : 0;

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      <div className="flex items-center justify-between p-3 border-b border-border bg-panel">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <CheckSquare className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-sm truncate">{taskName}</h3>
            <p className="text-xs text-muted-foreground">الحالة: {STATE_LABELS[state]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-foreground">{PRIORITY_LABELS[priority]}</span>
          {onExpand && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="توسيع المهمة"
              aria-label="توسيع المهمة"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onExpand();
              }}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
          {onConvert && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 gap-1 px-2 text-xs"
              title="اعتماد وتحويل المهمة"
              aria-label="اعتماد وتحويل المهمة"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onConvert();
              }}
            >
              <Wand2 className="h-3.5 w-3.5" />
              اعتماد
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 text-xs">
        <div className="p-2 rounded-md bg-muted/30 flex items-center gap-2">
          <Gauge className="h-3.5 w-3.5 text-blue-500" />
          <span>التعقيد: {complexity}</span>
        </div>
        <div className="p-2 rounded-md bg-muted/30 flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-purple-500" />
          <span>الفريق: {requiredTeamSize}</span>
        </div>
        <div className="p-2 rounded-md bg-muted/30 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-amber-500" />
          <span>المدة: {estimatedDuration} س</span>
        </div>
        <div className="p-2 rounded-md bg-muted/30 flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5 text-green-500" />
          <span>التكلفة: {estimatedCost.toLocaleString('ar-SA')}</span>
        </div>
      </div>

      <div className="px-3 pb-3 mt-auto">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>استهلاك التكلفة</span>
          <span>{costUsage.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all', costUsage > 100 ? 'bg-red-500' : 'bg-primary')}
            style={{ width: `${Math.min(costUsage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
          <span>الموعد: {data.dueDate || '-'}</span>
          {costUsage > 100 && (
            <span className="inline-flex items-center gap-1 text-red-600">
              <AlertTriangle className="h-3 w-3" />
              تجاوز
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

