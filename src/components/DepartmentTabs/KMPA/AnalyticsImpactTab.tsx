
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Eye, 
  Download, 
  Quote, 
  Globe, 
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Brain,
  Target,
  Award
} from 'lucide-react';
import { mockContentAnalytics, mockKnowledgeDocuments } from './data/mockData';

export const AnalyticsImpactTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDocument, setSelectedDocument] = useState('all');
  
  const analytics = mockContentAnalytics[0];
  const documents = mockKnowledgeDocuments;

  const impactMetrics = {
    totalCitations: 234,
    hIndex: 12,
    avgCitationsPerDoc: 3.2,
    reachScore: 87,
    influenceScore: 92,
    collaborationIndex: 15
  };

  const contentSaturation = [
    { topic: 'علم اجتماع العلامة التجارية', saturation: 85, trend: 'up' },
    { topic: 'التسويق الرقمي الثقافي', saturation: 35, trend: 'up' },
    { topic: 'قياس الأثر الثقافي', saturation: 60, trend: 'stable' },
    { topic: 'المسؤولية الاجتماعية', saturation: 78, trend: 'down' }
  ];

  const topPerformingContent = [
    {
      title: 'دليل علم اجتماع العلامة التجارية',
      views: 1247,
      downloads: 456,
      citations: 23,
      engagement: 4.3
    },
    {
      title: 'مقاييس الهوية الثقافية',
      views: 892,
      downloads: 234,
      citations: 15,
      engagement: 4.1
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">التحليلات والتأثير</h3>
        <div className="flex gap-2">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="week">أسبوع</option>
            <option value="month">شهر</option>
            <option value="quarter">ربع سنة</option>
            <option value="year">سنة</option>
          </select>
          <Button variant="outline">
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Quote className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{impactMetrics.totalCitations}</div>
            <div className="text-sm text-gray-600">إجمالي الاقتباسات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{impactMetrics.hIndex}</div>
            <div className="text-sm text-gray-600">مؤشر H</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{impactMetrics.reachScore}</div>
            <div className="text-sm text-gray-600">نقاط الوصول</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              أداء المحتوى
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="views" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="views">المشاهدات</TabsTrigger>
                <TabsTrigger value="downloads">التحميلات</TabsTrigger>
                <TabsTrigger value="citations">الاقتباسات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="views" className="space-y-4">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">رسم بياني للمشاهدات</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analytics.views}</div>
                    <div className="text-sm text-gray-600">إجمالي المشاهدات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+15%</div>
                    <div className="text-sm text-gray-600">نمو شهري</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="downloads" className="space-y-4">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">رسم بياني للتحميلات</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analytics.downloads}</div>
                    <div className="text-sm text-gray-600">إجمالي التحميلات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">23%</div>
                    <div className="text-sm text-gray-600">معدل التحويل</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="citations" className="space-y-4">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">توزيع الاقتباسات</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{analytics.citations}</div>
                    <div className="text-sm text-gray-600">إجمالي الاقتباسات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">3.2</div>
                    <div className="text-sm text-gray-600">متوسط لكل وثيقة</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              التوزيع الجغرافي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.geography.map((country, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{country.country}</span>
                    <span className="text-sm text-gray-600">{country.views} مشاهدة</span>
                  </div>
                  <Progress 
                    value={(country.views / analytics.views) * 100} 
                    className="h-2" 
                  />
                  <div className="text-xs text-gray-500">
                    {Math.round((country.views / analytics.views) * 100)}% من إجمالي المشاهدات
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Saturation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            تحليل تشبع المحتوى
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentSaturation.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.saturation}%</span>
                    <Badge variant={
                      item.trend === 'up' ? 'default' : 
                      item.trend === 'down' ? 'destructive' : 'secondary'
                    }>
                      {item.trend === 'up' ? '↗️ صاعد' : 
                       item.trend === 'down' ? '↘️ هابط' : '→ مستقر'}
                    </Badge>
                  </div>
                </div>
                <Progress value={item.saturation} className="h-3" />
                <div className="text-xs text-gray-500">
                  {item.saturation < 50 ? 'يحتاج لمزيد من المحتوى' : 
                   item.saturation < 80 ? 'مستوى متوسط من المحتوى' : 'مستوى مرتفع من المحتوى'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <CardTitle>المحتوى الأكثر أداءً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">{content.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {content.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {content.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Quote className="h-4 w-4" />
                      {content.citations}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{content.engagement}</div>
                  <div className="text-xs text-gray-600">معدل التفاعل</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            توصيات تحسين الأداء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg bg-blue-50">
              <h4 className="font-medium mb-1">زيادة المحتوى في التسويق الرقمي الثقافي</h4>
              <p className="text-sm text-gray-600">
                مستوى التشبع منخفض (35%) مع زيادة الطلب على هذا المحتوى
              </p>
            </div>
            <div className="p-3 border rounded-lg bg-green-50">
              <h4 className="font-medium mb-1">تحسين توزيع المحتوى</h4>
              <p className="text-sm text-gray-600">
                يمكن زيادة الوصول بنسبة 25% من خلال تحسين استراتيجية التوزيع
              </p>
            </div>
            <div className="p-3 border rounded-lg bg-yellow-50">
              <h4 className="font-medium mb-1">تطوير المحتوى التفاعلي</h4>
              <p className="text-sm text-gray-600">
                المحتوى التفاعلي يحقق معدل تفاعل أعلى بـ 40% من المحتوى التقليدي
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
