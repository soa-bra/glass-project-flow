
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, TrendingUp, Users, Clock, Award, DollarSign, Target, BookOpen } from 'lucide-react';
import { mockTrainingMetrics, mockLearningROI, mockSkillGapAlerts } from './data';

export const AnalyticsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const metrics = mockTrainingMetrics;
  const roiData = mockLearningROI;
  const skillGaps = mockSkillGapAlerts;

  // Calculate aggregated ROI metrics
  const totalInvestment = roiData.reduce((acc, roi) => acc + roi.totalCost, 0);
  const totalBenefits = roiData.reduce((acc, roi) => acc + roi.businessImpact, 0);
  const averageROI = roiData.length > 0 ? roiData.reduce((acc, roi) => acc + roi.roi, 0) / roiData.length : 0;

  const OverviewTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">نظرة عامة على الأداء</h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metrics.totalCourses}</div>
            <div className="text-sm text-gray-600">إجمالي الدورات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metrics.activeLearners}</div>
            <div className="text-sm text-gray-600">متدربون نشطون</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metrics.completionRate}%</div>
            <div className="text-sm text-gray-600">معدل الإنجاز</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metrics.certificatesIssued}</div>
            <div className="text-sm text-gray-600">شهادات صادرة</div>
          </CardContent>
        </Card>
      </div>

      {/* Kirkpatrick Model Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>مقياس كيركباتريك للتقييم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {metrics.kirkpatrickMetrics.reaction}
              </div>
              <div className="text-sm text-gray-600">رد الفعل</div>
              <Progress value={metrics.kirkpatrickMetrics.reaction * 20} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {metrics.kirkpatrickMetrics.learning}
              </div>
              <div className="text-sm text-gray-600">التعلم</div>
              <Progress value={metrics.kirkpatrickMetrics.learning * 20} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {metrics.kirkpatrickMetrics.behavior}
              </div>
              <div className="text-sm text-gray-600">السلوك</div>
              <Progress value={metrics.kirkpatrickMetrics.behavior * 20} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {metrics.kirkpatrickMetrics.results}
              </div>
              <div className="text-sm text-gray-600">النتائج</div>
              <Progress value={metrics.kirkpatrickMetrics.results * 20} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Stats */}
      <Card>
        <CardHeader>
          <CardTitle>الإحصائيات الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">{metrics.monthlyStats.newEnrollments}</div>
              <div className="text-sm text-gray-600">تسجيلات جديدة</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">{metrics.monthlyStats.coursesCompleted}</div>
              <div className="text-sm text-gray-600">دورات مكتملة</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">{metrics.monthlyStats.sessionsConducted}</div>
              <div className="text-sm text-gray-600">جلسات منعقدة</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">{(metrics.monthlyStats.revenue / 1000).toFixed(0)}k</div>
              <div className="text-sm text-gray-600">إيرادات (ر.س)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ROIAnalysisTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">تحليل العائد على الاستثمار</h3>
      
      {/* ROI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{(totalInvestment / 1000).toFixed(0)}k</div>
            <div className="text-sm text-gray-600">إجمالي الاستثمار</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{(totalBenefits / 1000).toFixed(0)}k</div>
            <div className="text-sm text-gray-600">إجمالي الفوائد</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{averageROI.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">متوسط العائد</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">8.5</div>
            <div className="text-sm text-gray-600">أشهر الاسترداد</div>
          </CardContent>
        </Card>
      </div>

      {/* ROI Details */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل العائد على الاستثمار بالدورة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roiData.map((roi) => (
              <div key={roi.courseId} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">دورة {roi.courseId}</h4>
                  <Badge variant={roi.roi > 150 ? 'default' : roi.roi > 100 ? 'secondary' : 'outline'}>
                    {roi.roi}% عائد
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">التكلفة:</span>
                    <div className="font-medium">{roi.totalCost.toLocaleString()} ر.س</div>
                  </div>
                  <div>
                    <span className="text-gray-500">المشاركون:</span>
                    <div className="font-medium">{roi.participantCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">التأثير:</span>
                    <div className="font-medium">{roi.businessImpact.toLocaleString()} ر.س</div>
                  </div>
                  <div>
                    <span className="text-gray-500">تحسن الأداء:</span>
                    <div className="font-medium">{roi.performanceImprovement}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SkillGapsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">تحليل فجوات المهارات</h3>
      
      {/* Skill Gaps Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{skillGaps.filter(g => g.severity === 'high').length}</div>
            <div className="text-sm text-gray-600">فجوات حرجة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {skillGaps.reduce((acc, gap) => acc + gap.affectedEmployees.length, 0)}
            </div>
            <div className="text-sm text-gray-600">موظفون متأثرون</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{skillGaps.filter(g => g.status === 'addressing').length}</div>
            <div className="text-sm text-gray-600">قيد المعالجة</div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Gaps List */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل فجوات المهارات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillGaps.map((gap) => (
              <div key={gap.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{gap.area}</h4>
                  <div className="flex gap-2">
                    <Badge variant={
                      gap.severity === 'critical' ? 'error' :
                      gap.severity === 'high' ? 'warning' :
                      gap.severity === 'medium' ? 'secondary' : 'outline'
                    }>
                      {gap.severity === 'critical' ? 'حرجة' :
                       gap.severity === 'high' ? 'عالية' :
                       gap.severity === 'medium' ? 'متوسطة' : 'منخفضة'}
                    </Badge>
                    <Badge variant={gap.status === 'open' ? 'error' : gap.status === 'addressing' ? 'default' : 'secondary'}>
                      {gap.status === 'open' ? 'مفتوح' :
                       gap.status === 'addressing' ? 'قيد المعالجة' : 'محلول'}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{gap.businessImpact}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">الموظفون المتأثرون:</span>
                    <div className="font-medium">{gap.affectedEmployees.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">الدورات المقترحة:</span>
                    <div className="font-medium">{gap.recommendedCourses.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">تاريخ الإنشاء:</span>
                    <div className="font-medium">{new Date(gap.createdAt).toLocaleDateString('ar-SA')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">التحليلات والتقارير</h3>
          <p className="text-gray-600">تحليل شامل لأداء التدريب وتقييم العائد على الاستثمار</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">تصدير التقرير</Button>
          <Button>إعدادات التحليلات</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="roi">العائد على الاستثمار</TabsTrigger>
          <TabsTrigger value="skillgaps">فجوات المهارات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <ROIAnalysisTab />
        </TabsContent>

        <TabsContent value="skillgaps" className="space-y-6">
          <SkillGapsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
