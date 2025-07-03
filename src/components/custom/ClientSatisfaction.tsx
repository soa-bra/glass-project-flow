import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ClientSatisfactionProps {
  value: number; // قيمة بين 0 و 1
}

export const ClientSatisfaction: React.FC<ClientSatisfactionProps> = ({ value = 0.75 }) => {
  const percentage = Math.round(value * 100);
  
  const getSatisfactionLevel = () => {
    if (percentage >= 80) return { text: 'ممتاز', color: 'text-green-600', bgColor: 'bg-green-100', icon: TrendingUp };
    if (percentage >= 60) return { text: 'جيد', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: TrendingUp };
    if (percentage >= 40) return { text: 'مقبول', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Minus };
    return { text: 'ضعيف', color: 'text-red-600', bgColor: 'bg-red-100', icon: TrendingDown };
  };

  const satisfactionLevel = getSatisfactionLevel();
  const Icon = satisfactionLevel.icon;

  const getProgressColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      {/* المؤشر الرئيسي */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-pink-500" />
          <span className="text-2xl font-bold">{percentage}%</span>
        </div>
        <Badge className={`${satisfactionLevel.bgColor} ${satisfactionLevel.color}`}>
          <Icon className="w-3 h-3 mr-1" />
          {satisfactionLevel.text}
        </Badge>
      </div>

      {/* شريط التقدم */}
      <div className="space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* تفاصيل إضافية */}
      <div className="bg-white/20 rounded-xl p-3 space-y-2">
        <h4 className="font-medium text-sm text-right">تفاصيل التقييم:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center">
            <p className="font-medium">التواصل</p>
            <p className="text-gray-600">85%</p>
          </div>
          <div className="text-center">
            <p className="font-medium">جودة العمل</p>
            <p className="text-gray-600">92%</p>
          </div>
          <div className="text-center">
            <p className="font-medium">الالتزام بالمواعيد</p>
            <p className="text-gray-600">78%</p>
          </div>
          <div className="text-center">
            <p className="font-medium">الدعم الفني</p>
            <p className="text-gray-600">88%</p>
          </div>
        </div>
      </div>

      {/* ملاحظات */}
      <div className="text-xs text-gray-600 text-center">
        <p>آخر تحديث: منذ 2 ساعة</p>
        <p>مبني على تحليل التفاعلات والملاحظات</p>
      </div>
    </div>
  );
};