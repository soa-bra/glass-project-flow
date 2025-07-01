
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, DollarSign, Users, BookOpen, Clock, Award, AlertCircle } from 'lucide-react';
import { mockTrainingMetrics, mockLearningROI } from './data';

export const AnalyticsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('kirkpatrick');
  const metrics = mockTrainingMetrics;
  const roiData = mockLearningROI;

  // Mock performance data for charts
  const monthlyPerformance = [
    { month: 'يناير', completions: 45, enrollments: 67, satisfaction: 4.2 },
    { month: 'فبراير', completions: 52, enrollments: 73, satisfaction: 4.3 },
    { month: 'مارس', completions: 61, enrollments: 89, satisfaction: 4.5 },
    { month: 'أبريل', completions: 58, enrollments: 84, satisfaction: 4.4 },
    { month: 'مايو', completions: 69, enrollments: 95, satisfaction: 4.6 },
    { month: 'يونيو', completions: 73, enrollments: 98, satisfaction: 4.7 }
  ];

  const departmentData = [
    { name: 'التسويق', value: 35, color: '#3B82F6' },
    { name: 'المبيعات', value: 28, color: '#10B981' },
    { name: 'الموارد البشرية', value: 22, color: '#F59E0B' },
    { name: 'التقنية', value: 15, color: '#8B5CF6' }
  ];

  const KirkpatrickAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.kirkpatrickMetrics.reaction}</div>
            <div className="text-sm font-medium mb-1">رد الفعل</div>
            <Progress value={(metrics.kirkpatrickMetrics.reaction / 5) * 100} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">مستوى الرضا</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{metrics.kirkpatrickMetrics.learning}</div>
            <div className="text-sm font-medium mb-1">التعلم</div>
            <Progress value={(metrics.kirkpatrickMetrics.learning / 5) * 100} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">اكتساب المعرفة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{metrics.kirkpatrickMetrics.behavior}</div>
            <div className="text-sm font-medium mb-1">السلوك</div>
            <Progress value={(metrics.kirkpatrickMetrics.behavior / 5) * 100} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">تطبيق المهارات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{metrics.kirkpatrickMetrics.results}</div>
            <div className="text-sm font-medium mb-1">النتائج</div>
            <Progress value={(metrics.kirkpatrickMetrics.results / 5) * 100} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">الأثر التجاري</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الأداء الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completions" stroke="#3B82F6" name="الإكمالات" />
                <Line type="monotone" dataKey="enrollments" stroke="#10B981" name="التسجيلات" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التوزيع حسب القسم</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تحليل تفصيلي لمستويات كيركباتريك</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-blue-600">المستوى الأول: رد الفعل</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>الرضا العام</span>
                    <span>4.5/5</span>
                  </div>
                  <Progress value={90} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>جودة المحتوى</span>
                    <span>4.3/5</span>
                  </div>
                  <Progress value={86} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>فعالية المدرب</span>
                    <span>4.6/5</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-green-600">المستوى الثاني: التعلم</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>اكتساب المعرفة</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>تطوير المهارات</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>تغيير الموقف</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-orange-600">المستوى الثالث: السلوك</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>تطبيق المهارات</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>استمرارية التطبيق</span>
                    <span>64%</span>
                  </div>
                  <Progress value={64} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>نقل المعرفة للزملاء</span>
                    <span>58%</span>
                  </div>
                  <Progress value={58} className="h-2" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-purple-600">المستوى الرابع: النتائج</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>تحسن الأداء</span>
                    <span>62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>تحقيق الأهداف</span>
                    <span>59%</span>
                  </div>
                  <Progress value={59} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>الأثر التجاري</span>
                    <span>55%</span>
                  </div>
                  <Progress value={55} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ROIAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{roiData.totalInvestment.toLocaleString()}</div>
            <div className="text-sm text-gray-600">إجمالي الاستثمار (ر.س)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{roiData.totalBenefits.toLocaleString()}</div>
            <div className="text-sm text-gray-600">إجمالي الفوائد (ر.س)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{roiData.roiPercentage}%</div>
            <div className="text-sm text-gray-600">عائد الاستثمار</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{roiData.paybackPeriod}</div>
            <div className="text-sm text-gray-600">فترة الاسترداد (شهر)</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>تحليل التكاليف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roiData.costBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.amount.toLocaleString()} ر.س</span>
                    <div className="w-16">
                      <Progress value={(item.amount / roiData.totalInvestment) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تحليل الفوائد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roiData.benefitBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.amount.toLocaleString()} ر.س</span>
                    <div className="w-16">
                      <Progress value={(item.amount / roiData.totalBenefits) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>مؤشرات الأداء المالية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold text-green-600">نسبة الفائدة إلى التكلفة</div>
              <div className="text-3xl font-bold mt-2">{(roiData.totalBenefits / roiData.totalInvestment).toFixed(2)}</div>
              <div className="text-sm text-gray-600 mt-1">لكل ريال مستثمر</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold text-blue-600">القيمة الحالية الصافية</div>
              <div className="text-3xl font-bold mt-2">{(roiData.totalBenefits - roiData.totalInvestment).toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">ريال سعودي</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold text-purple-600">معدل العائد الداخلي</div>
              <div className="text-3xl font-bold mt-2">24%</div>
              <div className="text-sm text-gray-600 mt-1">سنوياً</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PerformanceKPIs = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metrics.activeLearners}</div>
            <div className="text-sm text-gray-600">متدربون نشطون</div>
            <div className="text-xs text-green-600 mt-1">+8% من الشهر الماضي</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metrics.completionRate}%</div>
            <div className="text-sm text-gray-600">معدل الإنجاز</div>
            <div className="text-xs text-green-600 mt-1">+5% من الشهر الماضي</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metrics.certificatesIssued}</div>
            <div className="text-sm text-gray-600">شهادات صادرة</div>
            <div className="text-xs text-green-600 mt-1">+15% من الشهر الماضي</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metrics.totalHoursDelivered}</div>
            <div className="text-sm text-gray-600">ساعات تدريبية</div>
            <div className="text-xs text-green-600 mt-1">+12% من الشهر الماضي</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الأداء الشهري المفصل</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completions" fill="#3B82F6" name="الإكمالات" />
              <Bar dataKey="enrollments" fill="#10B981" name="التسجيلات" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>مؤشرات الجودة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">متوسط تقييم الدورات</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">4.5/5</span>
                  <Progress value={90} className="w-20 h-2" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">رضا المتدربين</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">4.3/5</span>
                  <Progress value={86} className="w-20 h-2" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">فعالية المدربين</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">4.6/5</span>
                  <Progress value={92} className="w-20 h-2" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">جودة المحتوى</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">4.4/5</span>
                  <Progress value={88} className="w-20 h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التوصيات والتحسينات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">تحسين معدل الإنجاز</div>
                  <div className="text-xs text-gray-600">إضافة المزيد من التفاعل في الدورات الطويلة</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Target className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">تطوير المحتوى</div>
                  <div className="text-xs text-gray-600">إنتاج محتوى تفاعلي للمهارات التقنية</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">زيادة المشاركة</div>
                  <div className="text-xs text-gray-600">تنظيم المزيد من ورش العمل التفاعلية</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">التحليلات والأداء</h3>
          <p className="text-gray-600">لوحات قياس مؤشرات الأداء مع تحليلات كيركباتريك وحساب العائد على الاستثمار</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">تصدير التقرير</Button>
          <Button>إعدادات التحليلات</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kirkpatrick">تحليلات كيركباتريك</TabsTrigger>
          <TabsTrigger value="roi">عائد الاستثمار</TabsTrigger>
          <TabsTrigger value="kpis">مؤشرات الأداء</TabsTrigger>
        </TabsList>

        <TabsContent value="kirkpatrick" className="space-y-6">
          <KirkpatrickAnalysis />
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <ROIAnalysis />
        </TabsContent>

        <TabsContent value="kpis" className="space-y-6">
          <PerformanceKPIs />
        </TabsContent>
      </Tabs>
    </div>
  );
};
