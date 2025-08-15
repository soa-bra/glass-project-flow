
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  PenTool, 
  Calendar, 
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export const ContentMessagingTab: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const contentPillars = [
    { name: 'التراث الثقافي', percentage: 35, color: 'bg-blue-500' },
    { name: 'الابتكار الأكاديمي', percentage: 28, color: 'bg-green-500' },
    { name: 'المسؤولية المجتمعية', percentage: 22, color: 'bg-purple-500' },
    { name: 'التطوير المهني', percentage: 15, color: 'bg-orange-500' }
  ];

  const recentContent = [
    {
      id: 1,
      title: 'أهمية الهوية الثقافية في بناء العلامات التجارية',
      type: 'مقال',
      status: 'منشور',
      author: 'د. محمد الأحمد',
      publishDate: '2024-01-15',
      views: 2847,
      engagement: 12.5,
      culturalScore: 94
    },
    {
      id: 2,
      title: 'دليل تطبيق القيم الثقافية في الممارسات التجارية',
      type: 'دليل',
      status: 'قيد المراجعة',
      author: 'سارة الخالد',
      publishDate: '2024-01-20',
      views: 0,
      engagement: 0,
      culturalScore: 89
    },
    {
      id: 3,
      title: 'ندوة: مستقبل علم اجتماع العلامة التجارية',
      type: 'فيديو',
      status: 'مجدول',
      author: 'فريق المحتوى',
      publishDate: '2024-01-25',
      views: 0,
      engagement: 0,
      culturalScore: 92
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'منشور': return 'bg-green-100 text-green-800';
      case 'قيد المراجعة': return 'bg-yellow-100 text-yellow-800';
      case 'مجدول': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'منشور': return <CheckCircle className="h-4 w-4" />;
      case 'قيد المراجعة': return <Clock className="h-4 w-4" />;
      case 'مجدول': return <Calendar className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Strategy Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              ركائز المحتوى الثقافي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentPillars.map((pillar, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{pillar.name}</span>
                    <span className="text-sm font-bold">{pillar.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${pillar.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${pillar.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">التوزيع المتوازن</h4>
              <p className="text-sm text-blue-700">
                استراتيجية المحتوى تحقق توازناً ممتازاً بين الركائز الثقافية المختلفة، مع التركيز على التراث والابتكار.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              أداء المحتوى
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">15.2K</div>
                <div className="text-sm text-gray-600">إجمالي المشاهدات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">8.7%</div>
                <div className="text-sm text-gray-600">معدل التفاعل</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">89%</div>
                <div className="text-sm text-gray-600">النقاط الثقافية</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">24</div>
                <div className="text-sm text-gray-600">محتوى هذا الشهر</div>
              </div>
            </div>
            <UnifiedButton variant="outline">
              <PenTool className="h-4 w-4 mr-2" />
              إنشاء محتوى جديد
            </UnifiedButton>
          </CardContent>
        </Card>
      </div>

      {/* Content Library */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            مكتبة المحتوى
          </CardTitle>
          <div className="flex gap-2">
            <UnifiedButton variant="outline" size="sm">تصفية</UnifiedButton>
            <UnifiedButton size="sm">
              <PenTool className="h-4 w-4 mr-2" />
              محتوى جديد
            </UnifiedButton>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentContent.map((content) => (
              <div key={content.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{content.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>النوع: {content.type}</span>
                      <span>الكاتب: {content.author}</span>
                      <span>التاريخ: {content.publishDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UnifiedBadge variant="info">
                      {getStatusIcon(content.status)}
                      <span className="mr-1">{content.status}</span>
                    </UnifiedBadge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{content.views.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">مشاهدات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{content.engagement}%</div>
                    <div className="text-xs text-gray-600">تفاعل</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{content.culturalScore}%</div>
                    <div className="text-xs text-gray-600">نقاط ثقافية</div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <UnifiedButton size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </UnifiedButton>
                    <UnifiedButton size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </UnifiedButton>
                    <UnifiedButton size="sm" variant="outline">
                      <Share2 className="h-3 w-3" />
                    </UnifiedButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Calendar Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            جدول المحتوى القادم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">ندوة التراث الرقمي</h4>
                <p className="text-sm text-gray-600">مجدولة لـ 25 يناير 2024</p>
              </div>
              <UnifiedBadge variant="info">فيديو</UnifiedBadge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <PenTool className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">دليل الممارسات الثقافية</h4>
                <p className="text-sm text-gray-600">مجدول لـ 28 يناير 2024</p>
              </div>
              <UnifiedBadge variant="info">دليل</UnifiedBadge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
