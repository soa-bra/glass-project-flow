import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Download, 
  Eye, 
  FileText, 
  Brain,
  Target
} from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { mockKnowledgeMetrics, mockAIRecommendations, mockKnowledgeGaps } from './data/mockData';

export const OverviewTab: React.FC = () => {
  const metrics = mockKnowledgeMetrics;

  const kpiStats = [
    {
      title: 'إجمالي الوثائق',
      value: metrics.totalDocuments,
      unit: 'وثيقة',
      description: 'المحتوى المعرفي المتاح'
    },
    {
      title: 'إجمالي القراءات',
      value: metrics.totalReads.toLocaleString(),
      unit: 'قراءة',
      description: 'مرات الوصول للمحتوى'
    },
    {
      title: 'المستخدمون النشطون',
      value: metrics.activeUsers,
      unit: 'مستخدم',
      description: 'النشاط الشهري للمستخدمين'
    }
  ];

  const recommendations = mockAIRecommendations.slice(0, 3);
  const gaps = mockKnowledgeGaps.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metrics.totalDocuments}</div>
            <div className="text-sm text-gray-600">إجمالي الوثائق</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metrics.totalReads.toLocaleString()}</div>
            <div className="text-sm text-gray-600">إجمالي القراءات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <div className="text-sm text-gray-600">المستخدمون النشطون</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">+{metrics.monthlyGrowth}%</div>
            <div className="text-sm text-gray-600">النمو الشهري</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              الفئات الأكثر نشاطاً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-600">{category.count} وثيقة</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <div className="text-xs text-gray-500">{category.percentage}% من إجمالي المحتوى</div>
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
              توصيات الذكاء الاصطناعي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                      {rec.priority === 'high' ? 'عالي' : rec.priority === 'medium' ? 'متوسط' : 'منخفض'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">الثقة: {Math.round(rec.confidence * 100)}%</span>
                    <Badge variant="outline" className="text-xs">
                      {rec.type === 'gap_analysis' ? 'تحليل الفجوات' : 
                       rec.type === 'content_suggestion' ? 'اقتراح محتوى' : 'موضوع بحث'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            فجوات المعرفة المكتشفة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gaps.map((gap) => (
              <div key={gap.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{gap.topic}</h4>
                  <Badge variant={gap.priority === 'high' ? 'destructive' : 'default'}>
                    {gap.priority === 'high' ? 'عالي' : 'متوسط'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{gap.description}</p>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">
                    استعلامات البحث المتكررة:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {gap.searchQueries.map((query, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {query}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
              <Download className="h-4 w-4 text-blue-600" />
              <span className="text-sm">تم تحميل "مقاييس سوبرا للهوية الثقافية" 15 مرة اليوم</span>
              <span className="text-xs text-gray-500 mr-auto">منذ ساعتين</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm">تم اكتشاف فجوة معرفية جديدة في "التسويق الرقمي الثقافي"</span>
              <span className="text-xs text-gray-500 mr-auto">منذ 4 ساعات</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
              <FileText className="h-4 w-4 text-green-600" />
              <span className="text-sm">تم نشر وثيقة جديدة: "دليل قياس الأثر الثقافي"</span>
              <span className="text-xs text-gray-500 mr-auto">أمس</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
