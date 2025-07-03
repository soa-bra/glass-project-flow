import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Users, Clock, Target } from 'lucide-react';

interface UtilizationGaugeProps {
  value: number; // قيمة بين 0 و 100
}

export const UtilizationGauge: React.FC<UtilizationGaugeProps> = ({ value = 75 }) => {
  const getUtilizationLevel = () => {
    if (value >= 90) return {
      text: 'استخدام مفرط',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: TrendingUp,
      recommendation: 'يُنصح بإعادة توزيع المهام لتجنب الإرهاق'
    };
    if (value >= 80) return {
      text: 'استخدام عالي',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: TrendingUp,
      recommendation: 'معدل استخدام جيد مع مراقبة الأحمال'
    };
    if (value >= 60) return {
      text: 'استخدام مثالي',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: Target,
      recommendation: 'معدل استخدام متوازن ومثالي'
    };
    if (value >= 40) return {
      text: 'استخدام متوسط',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: Minus,
      recommendation: 'يمكن زيادة الأحمال قليلاً'
    };
    return {
      text: 'استخدام منخفض',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: TrendingDown,
      recommendation: 'يُنصح بزيادة المهام المخصصة للفريق'
    };
  };

  const level = getUtilizationLevel();
  const Icon = level.icon;

  const getProgressColor = () => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 80) return 'bg-yellow-500';
    if (value >= 60) return 'bg-green-500';
    if (value >= 40) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  // حساب الإحصائيات المشتقة
  const getStats = () => {
    const totalCapacity = 100;
    const usedCapacity = value;
    const availableCapacity = totalCapacity - usedCapacity;
    const efficiency = value > 85 ? Math.max(60, 100 - (value - 85) * 2) : Math.min(100, value + 15);
    
    return {
      totalCapacity,
      usedCapacity,
      availableCapacity,
      efficiency: Math.round(efficiency)
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* المقياس الرئيسي */}
      <div className="relative">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold mb-2">{value}%</div>
          <Badge className={`${level.bgColor} ${level.color}`}>
            <Icon className="w-3 h-3 mr-1" />
            {level.text}
          </Badge>
        </div>

        {/* الدائرة المرئية */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* الخلفية */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* المقياس */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={value >= 90 ? '#ef4444' : value >= 80 ? '#eab308' : value >= 60 ? '#22c55e' : value >= 40 ? '#3b82f6' : '#6b7280'}
              strokeWidth="8"
              strokeDasharray={`${(value / 100) * 251.2} 251.2`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-500">معدل الفريق</p>
            </div>
          </div>
        </div>
      </div>

      {/* الإحصائيات التفصيلية */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/20 rounded-xl p-3 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-blue-500" />
          <p className="text-lg font-bold">{stats.usedCapacity}%</p>
          <p className="text-xs text-gray-600">الطاقة المستخدمة</p>
        </div>
        <div className="bg-white/20 rounded-xl p-3 text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-green-500" />
          <p className="text-lg font-bold">{stats.availableCapacity}%</p>
          <p className="text-xs text-gray-600">الطاقة المتاحة</p>
        </div>
      </div>

      {/* شريط التقدم التفصيلي */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>الكفاءة العامة</span>
          <span className="font-bold">{stats.efficiency}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
            style={{ width: `${stats.efficiency}%` }}
          />
        </div>
      </div>

      {/* التوصيات */}
      <div className="bg-white/20 rounded-xl p-4">
        <h4 className="font-medium text-sm mb-2 text-right flex items-center gap-2">
          <Icon className="w-4 h-4" />
          توصية الذكاء الاصطناعي
        </h4>
        <p className="text-xs text-gray-700 leading-relaxed text-right">
          {level.recommendation}
        </p>
      </div>

      {/* معلومات إضافية */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>آخر تحديث: منذ 5 دقائق</p>
        <p>مبني على بيانات الـ 30 يوم الماضية</p>
      </div>
    </div>
  );
};