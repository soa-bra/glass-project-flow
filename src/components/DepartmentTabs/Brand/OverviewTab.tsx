import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Users, 
  TrendingUp, 
  Eye, 
  Palette, 
  MessageSquare, 
  Calendar,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

export const OverviewTab: React.FC = () => {
  const culturalHarmonyIndex = 87;
  const identityHealthScore = 92;
  const brandAwarenessScore = 78;
  const culturalImpactScore = 85;

  const kpiStats = [
    {
      title: 'مؤشر الانسجام الثقافي',
      value: culturalHarmonyIndex,
      unit: '%',
      description: 'مستوى التوافق مع القيم الجوهرية'
    },
    {
      title: 'صحة الهوية',
      value: identityHealthScore,
      unit: '%',
      description: 'تماسك الهوية البصرية والثقافية'
    },
    {
      title: 'الوعي بالعلامة',
      value: brandAwarenessScore,
      unit: '%',
      description: 'مستوى الإدراك والتميز'
    },
    {
      title: 'الأثر الثقافي',
      value: culturalImpactScore,
      unit: '%',
      description: 'قوة التأثير في المجتمع'
    }
  ];

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cultural Identity Health */}
        <div className="bg-[#FFFFFF] p-9 rounded-[40px] ring-1 ring-[#DADCE0] hover:shadow-md transition-shadow">
          <div className="px-0 pt-0 mb-6">
            <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              صحة الهوية الثقافية
            </h3>
          </div>
          <div className="px-0">
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
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-[#FFFFFF] p-9 rounded-[40px] ring-1 ring-[#DADCE0] hover:shadow-md transition-shadow">
          <div className="px-0 pt-0 mb-6">
            <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              النشاطات الأخيرة
            </h3>
          </div>
          <div className="px-0">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-[40px] bg-[#FFFFFF] ring-1 ring-[#DADCE0]">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <Palette className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-black font-arabic">تم تحديث دليل الهوية البصرية</span>
                  <div className="text-xs text-black">منذ ساعتين</div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-normal bg-[#bdeed3] text-black">جديد</div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-transparent border border-black/10">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <MessageSquare className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-black font-arabic">مراجعة محتوى حملة "التراث الثقافي"</span>
                  <div className="text-xs text-black">منذ 4 ساعات</div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-normal bg-[#fbe2aa] text-black">قيد المراجعة</div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-transparent border border-black/10">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-black font-arabic">تم جدولة فعالية "ندوة علم اجتماع العلامة"</span>
                  <div className="text-xs text-black">أمس</div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-normal bg-[#a4e2f6] text-black">مجدولة</div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-transparent border border-black/10">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <Award className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-black font-arabic">نشر بحث "الهوية الثقافية للعلامات السعودية"</span>
                  <div className="text-xs text-black">منذ يومين</div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-normal bg-[#d9d2fd] text-black">منشور</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Performance Insights */}
      <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 hover:shadow-md transition-shadow">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            رؤى الأداء الثقافي
          </h3>
        </div>
        <div className="px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-black font-arabic">15.2K</div>
              <div className="text-sm text-black font-arabic">التفاعل الشهري</div>
              <div className="text-xs text-black flex items-center justify-center gap-1 font-arabic">
                <TrendingUp className="h-3 w-3" />
                +12% عن الشهر الماضي
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-black font-arabic">89%</div>
              <div className="text-sm text-black font-arabic">رضا العملاء الثقافي</div>
              <div className="text-xs text-black flex items-center justify-center gap-1 font-arabic">
                <TrendingUp className="h-3 w-3" />
                +5% عن الربع الماضي
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-black font-arabic">94%</div>
              <div className="text-sm text-black font-arabic">التزام الموظفين بالقيم</div>
              <div className="text-xs text-black flex items-center justify-center gap-1 font-arabic">
                <TrendingUp className="h-3 w-3" />
                +8% عن العام الماضي
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Insights */}
      <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 hover:shadow-md transition-shadow">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            رؤى الذكاء الاصطناعي
          </h3>
        </div>
        <div className="px-0">
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-transparent border border-black/10">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#bdeed3] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-black">فرصة تحسين المحتوى الثقافي</h4>
                  <p className="text-sm text-black mt-1">
                    يُظهر التحليل زيادة في الاهتمام بمواضيع "التراث الرقمي" بنسبة 23%. يُنصح بإنتاج محتوى متخصص في هذا المجال.
                  </p>
                  <div className="mt-2 px-3 py-1 rounded-full text-xs font-normal bg-[#a4e2f6] text-black">
                    ثقة: 87%
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-3xl bg-transparent border border-black/10">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#bdeed3] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-black">تحسن في الانسجام الثقافي</h4>
                  <p className="text-sm text-black mt-1">
                    مستوى الانسجام الثقافي في المشاريع الأخيرة أعلى بـ 15% من المتوسط السنوي، مما يشير لفعالية الاستراتيجية الحالية.
                  </p>
                  <div className="mt-2 px-3 py-1 rounded-full text-xs font-normal bg-[#bdeed3] text-black">
                    ثقة: 92%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
