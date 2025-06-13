

import React from 'react';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Target
} from 'lucide-react';

interface AISuggestedWidgetProps {
  type: 'kpi' | 'reports' | 'alerts' | 'analytics' | 'team' | 'goals';
  title: string;
  className?: string;
}

const widgetConfig = {
  kpi: {
    icon: TrendingUp,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-400/20 via-pink-300/20 to-purple-400/20',
    content: {
      main: '94%',
      sub: 'معدل الإنجاز الشهري',
      trend: '+12% من الشهر السابق'
    }
  },
  reports: {
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-400/20 via-cyan-300/20 to-blue-400/20',
    content: {
      main: '8',
      sub: 'تقارير جاهزة للمراجعة',
      trend: '3 تقارير جديدة اليوم'
    }
  },
  alerts: {
    icon: AlertCircle,
    gradient: 'from-red-500 to-orange-500',
    bgGradient: 'from-red-400/20 via-orange-300/20 to-red-400/20',
    content: {
      main: '5',
      sub: 'تنبيهات تحتاج متابعة',
      trend: '2 تنبيهات عاجلة'
    }
  },
  analytics: {
    icon: BarChart3,
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-400/20 via-emerald-300/20 to-green-400/20',
    content: {
      main: '↗️',
      sub: 'الأداء في تحسن مستمر',
      trend: 'زيادة 18% هذا الأسبوع'
    }
  },
  team: {
    icon: Users,
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-400/20 via-purple-300/20 to-indigo-400/20',
    content: {
      main: '23',
      sub: 'عضو فريق نشط',
      trend: '5 أعضاء جدد هذا الشهر'
    }
  },
  goals: {
    icon: Target,
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-400/20 via-teal-300/20 to-emerald-400/20',
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
    <div className={`
      ${className}
      rounded-3xl p-6 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      cursor-pointer group
    `}>
      
      {/* خلفية متدرجة */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} rounded-3xl`}></div>
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between mb-6">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center`}>
            <Icon size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#2A3437] font-arabic">
            {title}
          </h3>
        </div>

        {/* الرقم الرئيسي */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-[#2A3437] mb-2">
            {config.content.main}
          </div>
          <div className="text-sm text-gray-600 font-arabic">
            {config.content.sub}
          </div>
        </div>

        {/* مؤشر التقدم أو المعلومات الإضافية */}
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-xs text-gray-600 font-arabic mb-1">الاتجاه</div>
              <div className="text-sm font-medium text-[#2A3437]">
                {config.content.trend}
              </div>
            </div>
          </div>
        </div>

        {/* مؤشر التفاعل */}
        <div className="mt-4 pt-3 border-t border-white/20">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 group-hover:text-gray-700 transition-colors font-arabic">
            <span>عرض التفاصيل</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

