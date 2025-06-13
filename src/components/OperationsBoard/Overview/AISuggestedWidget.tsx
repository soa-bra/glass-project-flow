
import React from 'react';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Target
} from 'lucide-react';
import GlassWidget from '@/components/ui/GlassWidget';

interface AISuggestedWidgetProps {
  type: 'kpi' | 'reports' | 'alerts' | 'analytics' | 'team' | 'goals';
  title: string;
  className?: string;
}

const widgetConfig = {
  kpi: {
    icon: TrendingUp,
    accent: true,
    glowing: true,
    content: {
      main: '94%',
      sub: 'معدل الإنجاز الشهري',
      trend: '+12% من الشهر السابق'
    }
  },
  reports: {
    icon: FileText,
    accent: false,
    glowing: false,
    content: {
      main: '8',
      sub: 'تقارير جاهزة للمراجعة',
      trend: '3 تقارير جديدة اليوم'
    }
  },
  alerts: {
    icon: AlertCircle,
    accent: false,
    glowing: false,
    content: {
      main: '5',
      sub: 'تنبيهات تحتاج متابعة',
      trend: '2 تنبيهات عاجلة'
    }
  },
  analytics: {
    icon: BarChart3,
    accent: false,
    glowing: false,
    content: {
      main: '↗️',
      sub: 'الأداء في تحسن مستمر',
      trend: 'زيادة 18% هذا الأسبوع'
    }
  },
  team: {
    icon: Users,
    accent: false,
    glowing: false,
    content: {
      main: '23',
      sub: 'عضو فريق نشط',
      trend: '5 أعضاء جدد هذا الشهر'
    }
  },
  goals: {
    icon: Target,
    accent: false,
    glowing: false,
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
    <GlassWidget 
      accent={config.accent} 
      glowing={config.glowing}
      className={className}
    >
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-arabic font-semibold text-white/90">
          {title}
        </h3>
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon size={20} className="text-white/80" />
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-3xl font-bold mb-2 text-white">
          {config.content.main}
        </div>
        
        <div className="text-base text-white/80 mb-3">
          {config.content.sub}
        </div>
        
        <div className="text-sm text-white/60">
          {config.content.trend}
        </div>
      </div>

      {/* مؤشر التفاعل */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <button className="text-sm text-white/70 hover:text-white transition-colors">
          عرض التفاصيل ←
        </button>
      </div>
    </GlassWidget>
  );
};
