import React from 'react';
import { Users, UserPlus, Target, TrendingUp, Mail, Phone, Calendar, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface CrmActivity {
  id: string;
  title: string;
  type: 'call' | 'email' | 'meeting' | 'task';
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  clientName?: string;
}

interface CrmCardData {
  title?: string;
  totalClients?: number;
  newClients?: number;
  activeDeals?: number;
  dealsValue?: number;
  conversionRate?: number;
  activities?: CrmActivity[];
  targetClients?: number;
  targetDeals?: number;
  monthlyGrowth?: number;
}

interface CrmCardProps {
  data: CrmCardData;
  onUpdate: (data: Partial<CrmCardData>) => void;
}

const ACTIVITY_ICONS = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  task: Target,
};

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-red-100 text-red-700',
};

const STATUS_COLORS = {
  pending: 'text-yellow-600',
  completed: 'text-green-600',
  overdue: 'text-red-600',
};

export const CrmCard: React.FC<CrmCardProps> = ({ data }) => {
  const title = data.title || 'إدارة العملاء';
  const totalClients = data.totalClients || 0;
  const newClients = data.newClients || 0;
  const activeDeals = data.activeDeals || 0;
  const dealsValue = data.dealsValue || 0;
  const conversionRate = data.conversionRate || 0;
  const targetClients = data.targetClients || 100;
  const targetDeals = data.targetDeals || 50;
  const monthlyGrowth = data.monthlyGrowth || 0;

  const clientProgress = (totalClients / targetClients) * 100;
  const dealsProgress = (activeDeals / targetDeals) * 100;

  const defaultActivities: CrmActivity[] = [
    { id: '1', title: 'اتصال متابعة', type: 'call', status: 'pending', priority: 'high', clientName: 'شركة النور', dueDate: 'اليوم' },
    { id: '2', title: 'اجتماع عرض الخدمات', type: 'meeting', status: 'pending', priority: 'medium', clientName: 'مؤسسة الرياض', dueDate: 'غداً' },
    { id: '3', title: 'إرسال عرض سعر', type: 'email', status: 'completed', priority: 'low', clientName: 'شركة البناء' },
  ];

  const activities = data.activities || defaultActivities;

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-panel">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        
        {monthlyGrowth !== 0 && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            monthlyGrowth > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            <TrendingUp className={cn("h-3 w-3", monthlyGrowth < 0 && "rotate-180")} />
            {Math.abs(monthlyGrowth)}%
          </div>
        )}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3 p-3 border-b border-border">
        {/* Clients */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">العملاء</span>
            </div>
            {newClients > 0 && (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <UserPlus className="h-3 w-3" />
                +{newClients}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-blue-700">{totalClients}</p>
          <Progress value={Math.min(clientProgress, 100)} className="h-1 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {clientProgress.toFixed(0)}% من الهدف ({targetClients})
          </p>
        </div>

        {/* Deals */}
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-xs text-muted-foreground">الصفقات</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{activeDeals}</p>
          <Progress value={Math.min(dealsProgress, 100)} className="h-1 mt-2 [&>div]:bg-green-500" />
          <p className="text-xs text-muted-foreground mt-1">
            {dealsProgress.toFixed(0)}% من الهدف ({targetDeals})
          </p>
        </div>
      </div>

      {/* Value & Conversion */}
      <div className="grid grid-cols-2 gap-3 p-3 border-b border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">قيمة الصفقات</p>
          <p className="font-bold text-lg">{dealsValue.toLocaleString('ar-SA')} ﷼</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">معدل التحويل</p>
          <div className="flex items-center justify-center gap-1">
            <Star className={cn("h-4 w-4", conversionRate >= 50 ? "text-yellow-500" : "text-gray-300")} />
            <p className="font-bold text-lg">{conversionRate}%</p>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="flex-1 overflow-auto p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">الأنشطة القادمة</p>
        <div className="space-y-2">
          {activities.slice(0, 4).map((activity) => {
            const ActivityIcon = ACTIVITY_ICONS[activity.type];
            
            return (
              <div 
                key={activity.id}
                className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  activity.status === 'completed' ? "bg-green-100" : 
                  activity.status === 'overdue' ? "bg-red-100" : "bg-blue-100"
                )}>
                  <ActivityIcon className={cn("h-4 w-4", STATUS_COLORS[activity.status])} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.clientName} {activity.dueDate && `• ${activity.dueDate}`}
                  </p>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs shrink-0",
                  PRIORITY_COLORS[activity.priority]
                )}>
                  {activity.priority === 'high' ? 'عالي' : activity.priority === 'medium' ? 'متوسط' : 'منخفض'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
