import React from 'react';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Target,
  LucideIcon
} from 'lucide-react';
import { BaseBox } from '@/components/ui/BaseBox';

export interface AISuggestedBoxProps {
  type: 'kpi' | 'reports' | 'alerts' | 'analytics' | 'team' | 'goals';
  title: string;
  className?: string;
}

interface WidgetConfigItem {
  icon: LucideIcon;
  content: {
    main: string;
    sub: string;
    trend: string;
  };
}

const widgetConfig: Record<AISuggestedBoxProps['type'], WidgetConfigItem> = {
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

export const AISuggestedBox: React.FC<AISuggestedBoxProps> = ({
  type,
  title,
  className = ''
}) => {
  const config = widgetConfig[type];
  const Icon = config.icon;

  return (
    <BaseBox 
      variant="glass"
      size="sm"
      rounded="lg"
      className={`flex flex-col justify-between ${className}`}
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-arabic font-bold text-[hsl(var(--ink))]">
            {title}
          </h3>
          <Icon size={20} className="text-[hsl(var(--ink-60))]" />
        </div>
      }
    >
      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-2xl font-bold mb-2 text-[hsl(var(--ink))]">
          {config.content.main}
        </div>
        
        <div className="text-sm text-[hsl(var(--ink-60))] mb-3">
          {config.content.sub}
        </div>
        
        <div className="text-xs text-[hsl(var(--ink-30))]">
          {config.content.trend}
        </div>
      </div>

      {/* مؤشر التفاعل */}
      <div className="mt-4 pt-3 border-t border-[hsl(var(--ink))]/10">
        <button className="text-xs text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] transition-colors">
          عرض التفاصيل ←
        </button>
      </div>
    </BaseBox>
  );
};
