
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Progress } from '@/components/ui/progress';
import { Heart } from 'lucide-react';

export const CulturalHealthCard: React.FC = () => {
  return (
    <BaseCard variant="operations" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-black" />
        <h3 className="text-lg font-semibold text-black font-arabic">صحة الهوية الثقافية</h3>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-black font-arabic">التوافق مع القيم الجوهرية</span>
            <span className="text-sm font-bold text-black">95%</span>
          </div>
          <Progress value={95} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-black font-arabic">الاتساق في الرسائل</span>
            <span className="text-sm font-bold text-black">88%</span>
          </div>
          <Progress value={88} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-black font-arabic">تطبيق الهوية البصرية</span>
            <span className="text-sm font-bold text-black">92%</span>
          </div>
          <Progress value={92} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-black font-arabic">التفاعل الثقافي</span>
            <span className="text-sm font-bold text-black">85%</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>
      </div>
    </BaseCard>
  );
};
