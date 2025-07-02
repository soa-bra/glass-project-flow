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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              صحة الهوية الثقافية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">التوافق مع القيم الجوهرية</span>
                  <span className="text-sm font-bold text-green-600">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">الاتساق في الرسائل</span>
                  <span className="text-sm font-bold text-blue-600">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">تطبيق الهوية البصرية</span>
                  <span className="text-sm font-bold text-purple-600">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">التفاعل الثقافي</span>
                  <span className="text-sm font-bold text-orange-600">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              النشاطات الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <Palette className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <span className="text-sm font-medium">تم تحديث دليل الهوية البصرية</span>
                  <div className="text-xs text-gray-500">منذ ساعتين</div>
                </div>
                <Badge variant="secondary">جديد</Badge>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <span className="text-sm font-medium">مراجعة محتوى حملة "التراث الثقافي"</span>
                  <div className="text-xs text-gray-500">منذ 4 ساعات</div>
                </div>
                <Badge variant="outline">قيد المراجعة</Badge>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <Calendar className="h-4 w-4 text-purple-600" />
                <div className="flex-1">
                  <span className="text-sm font-medium">تم جدولة فعالية "ندوة علم اجتماع العلامة"</span>
                  <div className="text-xs text-gray-500">أمس</div>
                </div>
                <Badge variant="default">مجدولة</Badge>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <Award className="h-4 w-4 text-orange-600" />
                <div className="flex-1">
                  <span className="text-sm font-medium">نشر بحث "الهوية الثقافية للعلامات السعودية"</span>
                  <div className="text-xs text-gray-500">منذ يومين</div>
                </div>
                <Badge variant="secondary">منشور</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            رؤى الأداء الثقافي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">15.2K</div>
              <div className="text-sm text-gray-600">التفاعل الشهري</div>
              <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% عن الشهر الماضي
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">89%</div>
              <div className="text-sm text-gray-600">رضا العملاء الثقافي</div>
              <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +5% عن الربع الماضي
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-600">94%</div>
              <div className="text-sm text-gray-600">التزام الموظفين بالقيم</div>
              <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8% عن العام الماضي
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            رؤى الذكاء الاصطناعي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-blue-900">فرصة تحسين المحتوى الثقافي</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    يُظهر التحليل زيادة في الاهتمام بمواضيع "التراث الرقمي" بنسبة 23%. يُنصح بإنتاج محتوى متخصص في هذا المجال.
                  </p>
                  <Badge variant="outline" className="mt-2 text-blue-600 border-blue-300">
                    ثقة: 87%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-green-900">تحسن في الانسجام الثقافي</h4>
                  <p className="text-sm text-green-700 mt-1">
                    مستوى الانسجام الثقافي في المشاريع الأخيرة أعلى بـ 15% من المتوسط السنوي، مما يشير لفعالية الاستراتيجية الحالية.
                  </p>
                  <Badge variant="outline" className="mt-2 text-green-600 border-green-300">
                    ثقة: 92%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
