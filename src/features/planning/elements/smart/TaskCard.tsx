import React from 'react';
import { CheckSquare, AlertTriangle, Calendar, DollarSign, Users, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TaskCardData } from '@/features/planning/domain/types/smart.types';

interface TaskCardProps {
  data: TaskCardData;
  onUpdate: (data: Partial<TaskCardData>) => void;
}

const FIELD_LABELS: Partial<Record<TaskCardData['displayFields'][number], string>> = {
  name: 'الاسم',
  state: 'الحالة',
  priority: 'الأولوية',
  complexity: 'التعقيد',
  estimatedDuration: 'المدة المتوقعة',
  estimatedCost: 'التكلفة المتوقعة',
  requiredTeamSize: 'حجم الفريق',
  owner: 'المالك',
  assignee: 'المكلّف',
  startDate: 'تاريخ البدء',
  dueDate: 'تاريخ الاستحقاق',
  actualDuration: 'المدة الفعلية',
  actualCost: 'التكلفة الفعلية',
};

export const TaskCard: React.FC<TaskCardProps> = ({ data, onUpdate: _onUpdate }) => {
  const displayFields = data.displayFields ?? [];
  const dueSoonHours = data.alertThresholds?.dueSoonHours ?? 24;
  const overdueHours = data.alertThresholds?.overdueHours ?? 1;
  const costWarning = data.alertThresholds?.costWarning ?? 80;

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      <div className="flex items-center justify-between p-3 border-b border-border bg-panel">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckSquare className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">بطاقة مهمة</h3>
            <p className="text-xs text-muted-foreground">{data.taskId ? `Task: ${data.taskId.slice(0, 8)}...` : 'بدون ربط بمهمة بعد'}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-muted text-foreground">
          {data.compactMode ? 'عرض مضغوط' : 'عرض كامل'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 text-xs">
        <div className="p-2 rounded-md bg-muted/30 flex items-center gap-2">
          <Gauge className="h-3.5 w-3.5 text-blue-500" />
          <span>حقول العرض: {displayFields.length}</span>
        </div>
        <div className="p-2 rounded-md bg-muted/30 flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-purple-500" />
          <span>التنبيهات: {data.showAlerts ? 'مفعلة' : 'معطلة'}</span>
        </div>
        <div className="p-2 rounded-md bg-muted/30 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-amber-500" />
          <span>تنبيه قرب الاستحقاق: {dueSoonHours}س</span>
        </div>
        <div className="p-2 rounded-md bg-muted/30 flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5 text-green-500" />
          <span>تنبيه التكلفة: {costWarning}%</span>
        </div>
      </div>

      <div className="px-3 pb-3 mt-auto">
        <div className="text-xs text-muted-foreground mb-1">الحقول المختارة:</div>
        <div className="flex flex-wrap gap-1">
          {displayFields.length > 0 ? (
            displayFields.map((field) => (
              <span key={field} className={cn('text-[11px] px-2 py-0.5 rounded bg-muted text-foreground')}>
                {FIELD_LABELS[field] ?? field}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-muted-foreground">لا توجد حقول محددة</span>
          )}
        </div>
        {data.showAlerts && overdueHours <= 1 && (
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-amber-600">
            <AlertTriangle className="h-3 w-3" />
            عتبة التأخير منخفضة جدًا ({overdueHours}س)
          </div>
        )}
      </div>
    </div>
  );
};
