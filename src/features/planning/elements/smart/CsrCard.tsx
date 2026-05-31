import React from 'react';
import { HeartHandshake, AlertTriangle, Clock, CheckCircle, XCircle, Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface CsrRequest {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  hoursOpen?: number;
  isOverdue?: boolean;
}

interface CsrCardData {
  title?: string;
  totalRequests?: number;
  openRequests?: number;
  resolvedRequests?: number;
  avgResolutionTime?: number;
  satisfactionRate?: number;
  requests?: CsrRequest[];
  urgentCount?: number;
  overdueCount?: number;
}

interface CsrCardProps {
  data: CsrCardData;
  onUpdate: (data: Partial<CsrCardData>) => void;
}

const PRIORITY_CONFIG = {
  low: { label: 'منخفض', color: 'bg-gray-500', bgColor: 'bg-gray-100' },
  medium: { label: 'متوسط', color: 'bg-blue-500', bgColor: 'bg-blue-100' },
  high: { label: 'عالي', color: 'bg-orange-500', bgColor: 'bg-orange-100' },
  urgent: { label: 'عاجل', color: 'bg-red-500', bgColor: 'bg-red-100' },
};

const STATUS_CONFIG = {
  open: { label: 'مفتوح', icon: Clock, color: 'text-blue-600' },
  in_progress: { label: 'قيد المعالجة', icon: Timer, color: 'text-yellow-600' },
  resolved: { label: 'تم الحل', icon: CheckCircle, color: 'text-green-600' },
  closed: { label: 'مغلق', icon: XCircle, color: 'text-gray-600' },
};

export const CsrCard: React.FC<CsrCardProps> = ({ data }) => {
  const title = data.title || 'خدمة العملاء';
  const totalRequests = data.totalRequests || 0;
  const openRequests = data.openRequests || 0;
  const resolvedRequests = data.resolvedRequests || 0;
  const avgResolutionTime = data.avgResolutionTime || 0;
  const satisfactionRate = data.satisfactionRate || 0;
  const urgentCount = data.urgentCount || 0;
  const overdueCount = data.overdueCount || 0;

  const resolutionRate = totalRequests > 0 ? (resolvedRequests / totalRequests) * 100 : 0;

  const defaultRequests: CsrRequest[] = [
    { id: '1', title: 'استفسار عن الفاتورة', status: 'open', priority: 'medium', hoursOpen: 2 },
    { id: '2', title: 'مشكلة تقنية عاجلة', status: 'in_progress', priority: 'urgent', hoursOpen: 5, isOverdue: true },
    { id: '3', title: 'طلب تعديل الخدمة', status: 'resolved', priority: 'low', hoursOpen: 24 },
  ];

  const requests = data.requests || defaultRequests;

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-panel">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <HeartHandshake className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        
        {urgentCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
            <AlertTriangle className="h-3 w-3" />
            {urgentCount} عاجل
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 p-3 border-b border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{totalRequests}</p>
          <p className="text-xs text-muted-foreground">إجمالي</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{openRequests}</p>
          <p className="text-xs text-muted-foreground">مفتوح</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{resolvedRequests}</p>
          <p className="text-xs text-muted-foreground">محلول</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
          <p className="text-xs text-muted-foreground">متأخر</p>
        </div>
      </div>

      {/* Resolution Rate & Satisfaction */}
      <div className="grid grid-cols-2 gap-3 p-3 border-b border-border">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">معدل الحل</span>
            <span className="text-xs font-bold">{resolutionRate.toFixed(0)}%</span>
          </div>
          <Progress value={resolutionRate} className="h-1.5" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">رضا العملاء</span>
            <span className="text-xs font-bold">{satisfactionRate}%</span>
          </div>
          <Progress 
            value={satisfactionRate} 
            className={cn("h-1.5", satisfactionRate < 70 && "[&>div]:bg-orange-500")}
          />
        </div>
      </div>

      {/* Average Resolution Time */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">متوسط وقت الحل</span>
        </div>
        <span className="font-bold">{avgResolutionTime} ساعة</span>
      </div>

      {/* Recent Requests */}
      <div className="flex-1 overflow-auto p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">آخر الطلبات</p>
        <div className="space-y-2">
          {requests.slice(0, 5).map((request) => {
            const statusConfig = STATUS_CONFIG[request.status];
            const priorityConfig = PRIORITY_CONFIG[request.priority];
            const StatusIcon = statusConfig.icon;

            return (
              <div 
                key={request.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border",
                  request.isOverdue ? "border-red-300 bg-red-50" : "border-border"
                )}
              >
                <StatusIcon className={cn("h-4 w-4 shrink-0", statusConfig.color)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{request.title}</p>
                  {request.hoursOpen && (
                    <p className="text-xs text-muted-foreground">
                      منذ {request.hoursOpen} ساعة
                    </p>
                  )}
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  priorityConfig.bgColor,
                  "text-foreground"
                )}>
                  {priorityConfig.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
