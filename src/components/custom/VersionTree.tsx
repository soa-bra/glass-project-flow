import React from 'react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  GitBranch, 
  Clock, 
  User, 
  Download, 
  Eye, 
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Version {
  id: string;
  version: string;
  fileName: string;
  changes: string;
  author: string;
  date: string;
  size: string;
  status: 'current' | 'approved' | 'draft' | 'archived';
  isBreaking: boolean;
}

interface Document {
  id: string;
  name: string;
  versions?: Version[];
}

interface VersionTreeProps {
  documents: Document[];
}

export const VersionTree: React.FC<VersionTreeProps> = ({ documents = [] }) => {
  // بيانات وهمية للإصدارات
  const defaultVersions: Version[] = [
    {
      id: '1',
      version: 'v3.0',
      fileName: 'وثيقة المتطلبات الفنية.pdf',
      changes: 'إضافة متطلبات الأمان الجديدة وتحديث المواصفات التقنية',
      author: 'أحمد محمد',
      date: '2024-01-15 14:30',
      size: '2.4 MB',
      status: 'current',
      isBreaking: true
    },
    {
      id: '2',
      version: 'v2.1',
      fileName: 'وثيقة المتطلبات الفنية.pdf',
      changes: 'تصحيح أخطاء طباعية وتحديث الجداول',
      author: 'فاطمة أحمد',
      date: '2024-01-12 09:15',
      size: '2.3 MB',
      status: 'approved',
      isBreaking: false
    },
    {
      id: '3',
      version: 'v2.0',
      fileName: 'وثيقة المتطلبات الفنية.pdf',
      changes: 'إعادة هيكلة كاملة للوثيقة وإضافة أقسام جديدة',
      author: 'خالد عبدالرحمن',
      date: '2024-01-08 16:45',
      size: '2.1 MB',
      status: 'approved',
      isBreaking: true
    },
    {
      id: '4',
      version: 'v1.5',
      fileName: 'وثيقة المتطلبات الفنية.pdf',
      changes: 'تحديث معايير الجودة وإضافة متطلبات الاختبار',
      author: 'نورا سعد',
      date: '2024-01-05 11:20',
      size: '1.9 MB',
      status: 'archived',
      isBreaking: false
    },
    {
      id: '5',
      version: 'v1.0',
      fileName: 'وثيقة المتطلبات الفنية.pdf',
      changes: 'الإصدار الأولي للوثيقة',
      author: 'أحمد محمد',
      date: '2024-01-01 10:00',
      size: '1.5 MB',
      status: 'archived',
      isBreaking: false
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'current':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'الحالي',
          icon: CheckCircle
        };
      case 'approved':
        return {
          color: 'bg-blue-100 text-blue-800',
          text: 'معتمد',
          icon: CheckCircle
        };
      case 'draft':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          text: 'مسودة',
          icon: AlertCircle
        };
      case 'archived':
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'مؤرشف',
          icon: Clock
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'غير محدد',
          icon: AlertCircle
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* رأس القسم */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1">
            <GitBranch className="w-4 h-4" />
            مقارنة الإصدارات
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <Download className="w-4 h-4" />
            تصدير السجل
          </Button>
        </div>
        <h3 className="font-medium text-right">سجل إصدارات الوثائق</h3>
      </div>

      {/* شجرة الإصدارات */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-4">
          {defaultVersions.map((version, index) => {
            const statusConfig = getStatusConfig(version.status);
            const StatusIcon = statusConfig.icon;
            const isLatest = index === 0;
            const isFirst = index === defaultVersions.length - 1;

            return (
              <div key={version.id} className="relative">
                {/* خط الاتصال */}
                {!isFirst && (
                  <div className="absolute right-6 top-12 w-0.5 h-8 bg-gray-300" />
                )}

                <div className="flex items-start gap-4">
                  {/* أيقونة الإصدار */}
                  <div className={`
                    relative z-10 w-12 h-12 rounded-full border-4 flex items-center justify-center
                    ${isLatest ? 'bg-green-500 border-green-200' : 'bg-white border-gray-300'}
                  `}>
                    <GitBranch className={`w-5 h-5 ${isLatest ? 'text-white' : 'text-gray-500'}`} />
                    {version.isBreaking && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">!</span>
                      </div>
                    )}
                  </div>

                  {/* محتوى الإصدار */}
                  <div className="flex-1 bg-white/20 rounded-xl p-4 hover:bg-white/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <BaseBadge variant="secondary" className={statusConfig.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.text}
                        </BaseBadge>
                        {version.isBreaking && (
                          <BaseBadge variant="error" className="bg-red-100 text-red-800">
                            تغيير جذري
                          </BaseBadge>
                        )}
                      </div>
                      <div className="text-right">
                        <h4 className="font-bold text-lg">{version.version}</h4>
                        <p className="text-sm text-gray-600">{version.fileName}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed text-right">
                        {version.changes}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {version.date}
                          </span>
                          <span>الحجم: {version.size}</span>
                        </div>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {version.author}
                        </span>
                      </div>

                      {/* أزرار الإجراءات */}
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Eye className="w-3 h-3" />
                          عرض
                        </Button>
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Download className="w-3 h-3" />
                          تحميل
                        </Button>
                        {!isLatest && (
                          <Button size="sm" variant="ghost" className="gap-1">
                            <RotateCcw className="w-3 h-3" />
                            استرجاع
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* إحصائيات الإصدارات */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <p className="font-bold">{defaultVersions.length}</p>
            <p className="text-gray-600">إجمالي الإصدارات</p>
          </div>
          <div>
            <p className="font-bold text-red-600">
              {defaultVersions.filter(v => v.isBreaking).length}
            </p>
            <p className="text-gray-600">تغييرات جذرية</p>
          </div>
          <div>
            <p className="font-bold text-green-600">
              {defaultVersions.filter(v => v.status === 'approved' || v.status === 'current').length}
            </p>
            <p className="text-gray-600">معتمدة</p>
          </div>
          <div>
            <p className="font-bold">14</p>
            <p className="text-gray-600">يوم منذ آخر تحديث</p>
          </div>
        </div>
      </div>
    </div>
  );
};