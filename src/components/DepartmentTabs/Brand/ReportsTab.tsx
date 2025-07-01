
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  FileText,
  PieChart,
  Activity,
  Target,
  Users,
  Heart,
  Eye,
  Filter
} from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const reportCategories = [
    { id: 'all', name: 'جميع التقارير', count: 24 },
    { id: 'cultural', name: 'التقارير الثقافية', count: 8 },
    { id: 'performance', name: 'تقارير الأداء', count: 6 },
    { id: 'engagement', name: 'تقارير التفاعل', count: 5 },
    { id: 'impact', name: 'تقارير الأثر', count: 5 }
  ];

  const availableReports = [
    {
      id: 1,
      title: 'تقرير الهوية الثقافية الشهري',
      type: 'cultural',
      period: 'يناير 2024',
      status: 'جاهز',
      format: 'PDF',
      pages: 24,
      generatedAt: '2024-01-31',
      culturalScore: 92,
      insights: 8,
      charts: 12
    },
    {
      id: 2,
      title: 'تحليل أداء العلامة التجارية',
      type: 'performance',
      period: 'الربع الأول 2024',
      status: 'قيد التحضير',
      format: 'PDF',
      pages: 36,
      generatedAt: '2024-02-01',
      culturalScore: 88,
      insights: 12,
      charts: 18
    },
    {
      id: 3,
      title: 'تقرير التفاعل والمشاركة',
      type: 'engagement',
      period: 'يناير 2024',
      status: 'جاهز',
      format: 'Excel',
      pages: 15,
      generatedAt: '2024-01-30',
      culturalScore: 85,
      insights: 6,
      charts: 8
    },
    {
      id: 4,
      title: 'تقييم الأثر الثقافي للمشاريع',
      type: 'impact',
      period: '2023',
      status: 'جاهز',
      format: 'PDF',
      pages: 45,
      generatedAt: '2024-01-15',
      culturalScore: 94,
      insights: 15,
      charts: 22
    }
  ];

  const kpiData = [
    { metric: 'مؤشر الانسجام الثقافي', current: 87, target: 90, trend: '+3%' },
    { metric: 'صحة الهوية', current: 92, target: 95, trend: '+5%' },
    { metric: 'الوعي بالعلامة', current: 78, target: 85, trend: '+2%' },
    { metric: 'التفاعل الثقافي', current: 85, target: 88, trend: '+7%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'جاهز': return 'bg-green-100 text-green-800';
      case 'قيد التحضير': return 'bg-yellow-100 text-yellow-800';
      case 'مؤرشف': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'engagement': return 'bg-green-100 text-green-800';
      case 'impact': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cultural': return <Heart className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'engagement': return <Users className="h-4 w-4" />;
      case 'impact': return <Target className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            مؤشرات الأداء الرئيسية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{kpi.metric}</span>
                  <span className="text-xs text-green-600">{kpi.trend}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold">{kpi.current}%</span>
                  <span className="text-sm text-gray-600">/ {kpi.target}%</span>
                </div>
                <Progress value={kpi.current} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            جميع التقارير
          </Button>
          <Button 
            variant={selectedCategory === 'cultural' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('cultural')}
          >
            الثقافية
          </Button>
          <Button 
            variant={selectedCategory === 'performance' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('performance')}
          >
            الأداء
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            تصفية
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            جدولة تقرير
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            إنشاء تقرير
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2 space-y-4">
          {availableReports
            .filter(report => selectedCategory === 'all' || report.type === selectedCategory)
            .map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(report.type)}>
                        {getTypeIcon(report.type)}
                        <span className="mr-1">
                          {report.type === 'cultural' ? 'ثقافي' :
                           report.type === 'performance' ? 'أداء' :
                           report.type === 'engagement' ? 'تفاعل' : 'أثر'}
                        </span>
                      </Badge>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      الفترة: {report.period}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{report.culturalScore}%</div>
                    <div className="text-xs text-gray-600">النقاط الثقافية</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{report.pages}</div>
                    <div className="text-xs text-gray-600">صفحة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{report.insights}</div>
                    <div className="text-xs text-gray-600">رؤى</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{report.charts}</div>
                    <div className="text-xs text-gray-600">مخطط</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    تم الإنشاء: {report.generatedAt}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      تحميل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Report Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">فئات التقارير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reportCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-right transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold">24</div>
                    <div className="text-sm text-gray-600">تقرير هذا العام</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold">1,247</div>
                    <div className="text-sm text-gray-600">إجمالي المشاهدات</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Download className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold">589</div>
                    <div className="text-sm text-gray-600">تحميل</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automated Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">التقارير المجدولة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">التقرير الشهري</span>
                  <Badge variant="outline">نشط</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">التقرير الربعي</span>
                  <Badge variant="outline">نشط</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">التقرير السنوي</span>
                  <Badge variant="outline">مجدول</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
