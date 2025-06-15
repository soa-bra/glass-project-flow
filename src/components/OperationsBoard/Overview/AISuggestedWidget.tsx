
import React from 'react';
import { 
  TrendingUp, 
  FileText, 
  AlertCircle, 
  BarChart3, 
  Users, 
  Target 
} from 'lucide-react';
import { GenericCard } from '@/components/ui/GenericCard';

interface AISuggestedWidgetProps {
  type: 'kpi' | 'reports' | 'alerts' | 'analytics' | 'team' | 'goals';
  title: string;
  className?: string;
}

const widgetConfig = {
  kpi: {
    icon: TrendingUp,
    content: {
      main: '94%',
      sub: 'معدل الإنجاز الشهري',
      trend: '+12% من الشهر السابق'
    }
  },
  reports: {
    icon: FileText,
    content: {
      main: '8',
      sub: 'تقارير جاهزة للمراجعة',
      trend: '3 تقارير جديدة اليوم'
    }
  },
  alerts: {
    icon: AlertCircle,
    content: {
      main: '5',
      sub: 'تنبيهات تحتاج متابعة',
      trend: '2 تنبيهات عاجلة'
    }
  },
  analytics: {
    icon: BarChart3,
    content: {
      main: '↗️',
      sub: 'الأداء في تحسن مستمر',
      trend: 'زيادة 18% هذا الأسبوع'
    }
  },
  team: {
    icon: Users,
    content: {
      main: '23',
      sub: 'عضو فريق نشط',
      trend: '5 أعضاء جدد هذا الشهر'
    }
  },
  goals: {
    icon: Target,
    content: {
      main: '7/10',
      sub: 'أهداف محققة',
      trend: '3 أهداف متبقية'
    }
  }
};

export const AISuggestedWidget: React.FC<AISuggestedWidgetProps> = ({
  type,
  title,
  className = ''
}) => {
  const config = widgetConfig[type];
  const Icon = config.icon;

  return (
    <GenericCard
      adminBoardStyle
      hover
      padding="md"
      className={`
        ${className}
        flex flex-col justify-between h-full rounded-3xl transition-all
        min-h-[180px]
      `}
    >
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-bold text-[#23272f] text-right w-full leading-tight">
          {title}
        </h3>
        <Icon size={22} className="text-[#23272f] opacity-70" />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col items-end justify-end w-full mt-1">
        <div className="text-2xl font-bold mb-2 text-[#23272f] text-right w-full">{config.content.main}</div>
        <div className="text-sm text-soabra-text-secondary mb-2 w-full text-right">{config.content.sub}</div>
        <div className="text-xs text-gray-500 w-full text-right">{config.content.trend}</div>
      </div>

      {/* مؤشر التفاعل */}
      <div className="mt-4 pt-2 border-t border-gray-100/60 w-full">
        <button
          type="button"
          className="text-xs text-gray-500 hover:text-[#23272f] transition-colors underline-offset-2"
          style={{
            fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
            direction: 'rtl'
          }}
        >
          عرض التفاصيل ←
        </button>
      </div>
    </GenericCard>
  );
};
