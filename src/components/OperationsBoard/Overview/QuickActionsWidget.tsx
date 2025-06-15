
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Plus, FileText, Users, Calendar, Settings, Download } from 'lucide-react';

interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface QuickActionsWidgetProps {
  className?: string;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  className = ''
}) => {
  const quickActions: QuickAction[] = [
    {
      id: 1,
      title: 'مشروع جديد',
      description: 'إنشاء مشروع',
      icon: Plus,
      color: '#3B82F6',
      bgColor: '#EFF6FF'
    },
    {
      id: 2,
      title: 'تقرير شهري',
      description: 'إنشاء تقرير',
      icon: FileText,
      color: '#10B981',
      bgColor: '#F0FDF4'
    },
    {
      id: 3,
      title: 'إضافة عضو',
      description: 'فريق العمل',
      icon: Users,
      color: '#F59E0B',
      bgColor: '#FFFBEB'
    },
    {
      id: 4,
      title: 'جدولة اجتماع',
      description: 'موعد جديد',
      icon: Calendar,
      color: '#8B5CF6',
      bgColor: '#FAF5FF'
    },
    {
      id: 5,
      title: 'الإعدادات',
      description: 'تخصيص النظام',
      icon: Settings,
      color: '#6B7280',
      bgColor: '#F9FAFB'
    },
    {
      id: 6,
      title: 'تصدير البيانات',
      description: 'حفظ التقارير',
      icon: Download,
      color: '#EF4444',
      bgColor: '#FEF2F2'
    }
  ];

  const handleActionClick = (action: QuickAction) => {
    console.log('تم النقر على:', action.title);
  };

  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col`}
    >
      <header className="mb-4">
        <h3 className="text-lg font-arabic font-bold text-[#23272f]">
          الإجراءات السريعة
        </h3>
      </header>
      
      <div className="grid grid-cols-2 gap-3 flex-1">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className="p-3 rounded-2xl border border-white/60 hover:border-white/80 transition-all duration-200 hover:scale-105 active:scale-95 text-right"
              style={{ backgroundColor: action.bgColor }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={18} style={{ color: action.color }} />
                <span className="text-sm font-bold text-[#23272f] truncate">
                  {action.title}
                </span>
              </div>
              <p className="text-xs text-gray-600 truncate">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </GenericCard>
  );
};
