
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Plus,
  Filter,
  Brain,
  RefreshCw
} from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedType, setSelectedType] = useState('all');

  const reports = [
    {
      id: 'REP-001',
      title: 'تقرير الأداء الشهري - أبريل 2024',
      type: 'performance',
      period: 'monthly',
      generatedAt: '2024-04-30',
      size: '2.3 MB',
      downloads: 45,
      status: 'ready'
    },
    {
      id: 'REP-002',
      title: 'تحليل الاقتباسات والأثر - الربع الأول 2024',
      type: 'impact',
      period: 'quarterly',
      generatedAt: '2024-03-31',
      size: '1.8 MB',
      downloads: 32,
      status: 'ready'
    },
    {
      id: 'REP-003',
      title: 'تقرير استخدام مقاييس سوبرا - مارس 2024',
      type: 'metrics',
      period: 'monthly',
      generatedAt: '2024-03-30',
      size: '1.2 MB',
      downloads: 28,
      status: 'ready'
    }
  ];

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'performance': return 'تقرير الأداء';
      case 'impact': return 'تقرير التأثير';
      case 'metrics': return 'تقرير المقاييس';
      case 'usage': return 'تقرير الاستخدام';
      default: return type;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'text-blue-600';
      case 'impact': return 'text-green-600';
      case 'metrics': return 'text-purple-600';
      case 'usage': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const reportTemplates = [
    {
      id: 'TEMP-001',
      name: 'تقرير الأداء الشهري',
      description: 'تقرير شامل عن أداء المحتوى والمقاييس',
      frequency: 'شهري',
      sections: ['نظرة عامة', 'إحصائيات الأداء', 'التحليلات', 'التوصيات']
    },
    {
      id: 'TEMP-002',
      name: 'تقرير التأثير والاقتباسات',
      description: 'تحليل مفصل للأثر العلمي والاقتباسات',
      frequency: 'ربع سنوي',
      sections: ['الاقتباسات', 'مؤشر H', 'التوزيع الجغرافي', 'تحليل الأثر']
    },
    {
      id: 'TEMP-003',
      name: 'تقرير استخدام المقاييس',
      description: 'إحصائيات تفصيلية حول استخدام مقاييس سوبرا',
      frequency: 'شهري',
      sections: ['المقاييس الأكثر استخداماً', 'الاتجاهات', 'التحليل', 'التوصيات']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">التقارير</h3>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            تقرير ذكي
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إنشاء تقرير
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reports" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">التقارير المتاحة</TabsTrigger>
          <TabsTrigger value="templates">قوالب التقارير</TabsTrigger>
          <TabsTrigger value="scheduled">التقارير المجدولة</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">تصفية:</span>
                </div>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="performance">تقارير الأداء</option>
                  <option value="impact">تقارير التأثير</option>
                  <option value="metrics">تقارير المقاييس</option>
                  <option value="usage">تقارير الاستخدام</option>
                </select>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">جميع الفترات</option>
                  <option value="monthly">شهري</option>
                  <option value="quarterly">ربع سنوي</option>
                  <option value="yearly">سنوي</option>
                </select>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <FileText className={`h-6 w-6 ${getReportTypeColor(report.type)}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-lg mb-1">{report.title}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <BaseBadge variant="outline">{getReportTypeLabel(report.type)}</BaseBadge>
                          <BaseBadge variant="secondary">{report.period === 'monthly' ? 'شهري' : report.period === 'quarterly' ? 'ربع سنوي' : 'سنوي'}</BaseBadge>
                          <BaseBadge variant={report.status === 'ready' ? 'default' : 'secondary'}>
                            {report.status === 'ready' ? 'جاهز' : 'قيد المعالجة'}
                          </BaseBadge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.generatedAt).toLocaleDateString('ar-SA')}
                          </span>
                          <span>{report.size}</span>
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {report.downloads} تحميل
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        معاينة
                      </Button>
                      <Button size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        تحميل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>قوالب التقارير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex items-center gap-2">
                          <BaseBadge variant="outline">{template.frequency}</BaseBadge>
                          <span className="text-xs text-gray-500">
                            {template.sections.length} أقسام
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        معاينة
                      </Button>
                      <Button size="sm">
                        استخدام
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التقارير المجدولة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">تقرير الأداء الشهري</h4>
                      <p className="text-sm text-gray-600">يُولد تلقائياً في نهاية كل شهر</p>
                      <div className="flex items-center gap-2 mt-1">
                        <BaseBadge variant="default">نشط</BaseBadge>
                        <span className="text-xs text-gray-500">التقرير القادم: 31 مايو 2024</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">تحرير</Button>
                    <Button size="sm" variant="outline">إيقاف</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">تقرير التأثير الربع سنوي</h4>
                      <p className="text-sm text-gray-600">يُولد تلقائياً في نهاية كل ربع</p>
                      <div className="flex items-center gap-2 mt-1">
                        <BaseBadge variant="default">نشط</BaseBadge>
                        <span className="text-xs text-gray-500">التقرير القادم: 30 يونيو 2024</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">تحرير</Button>
                    <Button size="sm" variant="outline">إيقاف</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إنشاء تقرير مجدول جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">نوع التقرير</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>اختر نوع التقرير</option>
                    <option>تقرير الأداء</option>
                    <option>تقرير التأثير</option>
                    <option>تقرير المقاييس</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">التكرار</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>اختر التكرار</option>
                    <option>أسبوعي</option>
                    <option>شهري</option>
                    <option>ربع سنوي</option>
                    <option>سنوي</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">المستلمون</label>
                  <input 
                    type="email" 
                    className="w-full mt-1 p-2 border rounded-md"
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
                <Button className="w-full">إنشاء التقرير المجدول</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
