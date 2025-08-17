
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Eye, Calendar, TrendingUp, Users, Target, DollarSign } from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('performance');

  // Mock report data
  const performanceReports = [
    {
      id: 1,
      title: 'تقرير الأداء الشهري - مارس 2024',
      type: 'performance',
      period: 'monthly',
      generated_date: '2024-03-31',
      status: 'completed',
      metrics: {
        enrollments: 89,
        completions: 67,
        satisfaction: 4.3
      }
    },
    {
      id: 2,
      title: 'تقرير الأداء الربع سنوي - Q1 2024',
      type: 'performance',
      period: 'quarterly',
      generated_date: '2024-03-31',
      status: 'completed',
      metrics: {
        enrollments: 234,
        completions: 187,
        satisfaction: 4.4
      }
    }
  ];

  const roiReports = [
    {
      id: 1,
      title: 'تقرير العائد على الاستثمار - Q1 2024',
      investment: 450000,
      benefits: 675000,
      roi: 50,
      generated_date: '2024-03-31'
    },
    {
      id: 2,
      title: 'تحليل التكلفة والفائدة السنوي - 2023',
      investment: 1800000,
      benefits: 2700000,
      roi: 75,
      generated_date: '2024-01-15'
    }
  ];

  const skillGapReports = [
    {
      id: 1,
      title: 'تقرير فجوات المهارات - مارس 2024',
      critical_gaps: 3,
      departments_affected: 5,
      recommended_training: 12,
      generated_date: '2024-03-25'
    }
  ];

  // Chart data
  const monthlyData = [
    { month: 'يناير', enrollments: 67, completions: 52, satisfaction: 4.2 },
    { month: 'فبراير', enrollments: 73, completions: 58, satisfaction: 4.3 },
    { month: 'مارس', enrollments: 89, completions: 67, satisfaction: 4.5 },
    { month: 'أبريل', enrollments: 84, completions: 63, satisfaction: 4.4 },
    { month: 'مايو', enrollments: 95, completions: 71, satisfaction: 4.6 },
    { month: 'يونيو', enrollments: 98, completions: 74, satisfaction: 4.7 }
  ];

  const departmentData = [
    { name: 'التسويق', value: 35, color: '#3B82F6' },
    { name: 'المبيعات', value: 28, color: '#10B981' },
    { name: 'الموارد البشرية', value: 22, color: '#F59E0B' },
    { name: 'التقنية', value: 15, color: '#8B5CF6' }
  ];

  const PerformanceReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">تقارير الأداء</h3>
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          إنشاء تقرير جديد
        </Button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">289</div>
            <div className="text-sm text-gray-600">إجمالي التسجيلات</div>
            <div className="text-xs text-green-600 mt-1">+12% من الشهر الماضي</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">78%</div>
            <div className="text-sm text-gray-600">معدل الإنجاز</div>
            <div className="text-xs text-green-600 mt-1">+5% من الشهر الماضي</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">4.5</div>
            <div className="text-sm text-gray-600">متوسط الرضا</div>
            <div className="text-xs text-green-600 mt-1">+0.2 من الشهر الماضي</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">1,280</div>
            <div className="text-sm text-gray-600">ساعات تدريبية</div>
            <div className="text-xs text-green-600 mt-1">+18% من الشهر الماضي</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>الأداء الشهري</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="enrollments" stroke="#3B82F6" name="التسجيلات" />
              <Line type="monotone" dataKey="completions" stroke="#10B981" name="الإكمالات" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>التقارير المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{report.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>تاريخ الإنشاء: {new Date(report.generated_date).toLocaleDateString('ar-SA')}</span>
                    <Badge variant={report.status === 'completed' ? 'default' : 'outline'}>
                      {report.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 mt-2 text-sm">
                    <span>التسجيلات: {report.metrics.enrollments}</span>
                    <span>الإكمالات: {report.metrics.completions}</span>
                    <span>الرضا: {report.metrics.satisfaction}/5</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    عرض
                  </Button>
                  <Button size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    تحميل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ROIReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">تقارير العائد على الاستثمار</h3>
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          حساب ROI جديد
        </Button>
      </div>

      {/* ROI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">1.8M</div>
            <div className="text-sm text-gray-600">إجمالي الاستثمار (ر.س)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">2.7M</div>
            <div className="text-sm text-gray-600">إجمالي الفوائد (ر.س)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">75%</div>
            <div className="text-sm text-gray-600">عائد الاستثمار</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">18</div>
            <div className="text-sm text-gray-600">فترة الاسترداد (شهر)</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>اتجاه العائد على الاستثمار</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { quarter: 'Q1 2023', roi: 45 },
                { quarter: 'Q2 2023', roi: 52 },
                { quarter: 'Q3 2023', roi: 68 },
                { quarter: 'Q4 2023', roi: 75 },
                { quarter: 'Q1 2024', roi: 80 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="roi" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department ROI Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع العائد حسب القسم</CardTitle>
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

      {/* ROI Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>تقارير العائد على الاستثمار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roiReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{report.title}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">الاستثمار:</span>
                      <div className="font-medium">{report.investment.toLocaleString()} ر.س</div>
                    </div>
                    <div>
                      <span className="text-gray-500">الفوائد:</span>
                      <div className="font-medium">{report.benefits.toLocaleString()} ر.س</div>
                    </div>
                    <div>
                      <span className="text-gray-500">العائد:</span>
                      <div className="font-medium text-green-600">{report.roi}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500">التاريخ:</span>
                      <div className="font-medium">{new Date(report.generated_date).toLocaleDateString('ar-SA')}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    عرض
                  </Button>
                  <Button size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    تحميل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SkillGapReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">تقارير فجوات المهارات</h3>
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          تحليل فجوات جديد
        </Button>
      </div>

      {/* Skill Gap Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-gray-600">فجوات حرجة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-gray-600">أقسام متأثرة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-600">تدريبات موصى بها</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">6</div>
            <div className="text-sm text-gray-600">أشهر للمعالجة</div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Gap Analysis Chart */}
      <Card>
        <CardHeader>
          <CardTitle>تحليل فجوات المهارات حسب القسم</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={[
              { department: 'التسويق', critical: 2, high: 4, medium: 6, low: 3 },
              { department: 'المبيعات', critical: 1, high: 3, medium: 5, low: 4 },
              { department: 'التقنية', critical: 3, high: 6, medium: 8, low: 2 },
              { department: 'الموارد البشرية', critical: 0, high: 2, medium: 4, low: 5 },
              { department: 'المالية', critical: 1, high: 2, medium: 3, low: 6 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="critical" stackId="a" fill="#EF4444" name="حرج" />
              <Bar dataKey="high" stackId="a" fill="#F97316" name="عالي" />
              <Bar dataKey="medium" stackId="a" fill="#EAB308" name="متوسط" />
              <Bar dataKey="low" stackId="a" fill="#22C55E" name="منخفض" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skill Gap Reports */}
      <Card>
        <CardHeader>
          <CardTitle>تقارير تحليل فجوات المهارات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillGapReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{report.title}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">فجوات حرجة:</span>
                      <div className="font-medium text-red-600">{report.critical_gaps}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">أقسام متأثرة:</span>
                      <div className="font-medium">{report.departments_affected}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">تدريبات موصى بها:</span>
                      <div className="font-medium">{report.recommended_training}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">تاريخ التحليل:</span>
                      <div className="font-medium">{new Date(report.generated_date).toLocaleDateString('ar-SA')}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    عرض
                  </Button>
                  <Button size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    تحميل
                  </Button>
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
          <h3 className="text-2xl font-semibold">التقارير</h3>
          <p className="text-gray-600">تقارير الأداء وتحليلات العائد على الاستثمار وتقارير فجوات المهارات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">جدولة تقرير</Button>
          <Button>إعدادات التقارير</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">تقارير الأداء</TabsTrigger>
          <TabsTrigger value="roi">العائد على الاستثمار</TabsTrigger>
          <TabsTrigger value="skillgap">فجوات المهارات</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceReports />
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <ROIReports />
        </TabsContent>

        <TabsContent value="skillgap" className="space-y-6">
          <SkillGapReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};
