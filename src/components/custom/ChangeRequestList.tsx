import React from 'react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress';
  priority: 'low' | 'medium' | 'high';
  requestDate: string;
  estimatedCost: number;
  estimatedTime: string;
}

interface ChangeRequestListProps {
  projectId: string;
}

export const ChangeRequestList: React.FC<ChangeRequestListProps> = ({ projectId }) => {
  // بيانات وهمية لطلبات التغيير
  const changeRequests: ChangeRequest[] = [
    {
      id: '1',
      title: 'إضافة ميزة تقارير متقدمة',
      description: 'طلب إضافة نظام تقارير تفاعلي مع مخططات بيانية',
      status: 'pending',
      priority: 'high',
      requestDate: '2024-01-15',
      estimatedCost: 15000,
      estimatedTime: '3 أسابيع'
    },
    {
      id: '2',
      title: 'تعديل واجهة المستخدم',
      description: 'تحديث تصميم الصفحة الرئيسية وفقاً للهوية الجديدة',
      status: 'approved',
      priority: 'medium',
      requestDate: '2024-01-10',
      estimatedCost: 8000,
      estimatedTime: '1.5 أسبوع'
    },
    {
      id: '3',
      title: 'تحسين الأداء',
      description: 'تحسين سرعة تحميل الصفحات وتقليل استهلاك الموارد',
      status: 'in_progress',
      priority: 'high',
      requestDate: '2024-01-05',
      estimatedCost: 12000,
      estimatedTime: '2 أسبوع'
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800',
          text: 'قيد المراجعة'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800',
          text: 'موافق عليه'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800',
          text: 'مرفوض'
        };
      case 'in_progress':
        return {
          icon: AlertCircle,
          color: 'bg-blue-100 text-blue-800',
          text: 'قيد التنفيذ'
        };
      default:
        return {
          icon: FileText,
          color: 'bg-gray-100 text-gray-800',
          text: 'غير محدد'
        };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عالي';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button size="sm" className="gap-1">
          <FileText className="w-4 h-4" />
          طلب تغيير جديد
        </Button>
        <p className="text-sm text-gray-600">
          إجمالي الطلبات: {changeRequests.length}
        </p>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {changeRequests.map((request) => {
            const statusConfig = getStatusConfig(request.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={request.id} className="bg-white/20 hover:bg-white/30 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-2">
                        <BaseBadge variant="secondary" className={statusConfig.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.text}
                        </BaseBadge>
                        <BaseBadge variant="secondary" className={getPriorityColor(request.priority)}>
                          {getPriorityText(request.priority)}
                        </BaseBadge>
                      </div>
                      <div className="text-right flex-1 mr-2">
                        <h4 className="font-medium text-sm">{request.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {request.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">التاريخ:</span>
                        <br />
                        {request.requestDate}
                      </div>
                      <div>
                        <span className="font-medium">التكلفة المقدرة:</span>
                        <br />
                        {request.estimatedCost.toLocaleString()} ر.س
                      </div>
                      <div>
                        <span className="font-medium">المدة المقدرة:</span>
                        <br />
                        {request.estimatedTime}
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          مراجعة
                        </Button>
                        <Button size="sm" className="flex-1">
                          موافقة
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};