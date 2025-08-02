import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { UnifiedBadge } from '@/components/ui/UnifiedBadge';
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'منشور': return 'success';
      case 'قيد المراجعة': return 'warning';
      case 'مجدول': return 'info';
      default: return 'default';
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
    <div className="font-arabic px-[15px] py-0">
      {/* Content Strategy Overview */}
      <div className="mb-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <BaseCard
            variant="operations"
            size="md"
            className="w-full"
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black font-arabic flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  ركائز المحتوى الثقافي
                </h3>
              </div>
            }
          >
            <div className="space-y-4">
              {contentPillars.map((pillar, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-black font-arabic">{pillar.name}</span>
                    <span className="text-sm font-bold text-black">{pillar.percentage}%</span>
                  </div>
                  <div className="w-full bg-black/10 rounded-full h-2">
                    <div 
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${pillar.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-transparent border border-black/10 rounded-3xl">
              <h4 className="font-medium text-black mb-2 font-arabic">التوزيع المتوازن</h4>
              <p className="text-sm text-black font-arabic">
                استراتيجية المحتوى تحقق توازناً ممتازاً بين الركائز الثقافية المختلفة، مع التركيز على التراث والابتكار.
              </p>
            </div>
          </BaseCard>

          <BaseCard
            variant="operations"
            size="md"
            className="w-full"
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black font-arabic flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  أداء المحتوى
                </h3>
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-black font-arabic">15.2K</div>
                <div className="text-sm text-black font-arabic">إجمالي المشاهدات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black font-arabic">8.7%</div>
                <div className="text-sm text-black font-arabic">معدل التفاعل</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black font-arabic">89%</div>
                <div className="text-sm text-black font-arabic">النقاط الثقافية</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black font-arabic">24</div>
                <div className="text-sm text-black font-arabic">محتوى هذا الشهر</div>
              </div>
            </div>
            <UnifiedButton variant="outline" size="md" className="w-full">
              <PenTool className="h-4 w-4 mr-2" />
              إنشاء محتوى جديد
            </UnifiedButton>
          </BaseCard>
        </div>
      </div>

      {/* Content Library */}
      <div className="mb-6">
        <BaseCard
          variant="operations"
          size="md"
          className="w-full"
          header={
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black font-arabic flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <Eye className="h-4 w-4 text-white" />
                </div>
                مكتبة المحتوى
              </h3>
              <div className="flex gap-2">
                <UnifiedButton variant="outline" size="sm">تصفية</UnifiedButton>
                <UnifiedButton variant="primary" size="sm">
                  <PenTool className="h-4 w-4 mr-2" />
                  محتوى جديد
                </UnifiedButton>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {recentContent.map((content) => (
              <div key={content.id} className="border border-black/10 rounded-3xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1 text-black font-arabic">{content.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-black/60">
                      <span className="font-arabic">النوع: {content.type}</span>
                      <span className="font-arabic">الكاتب: {content.author}</span>
                      <span className="font-arabic">التاريخ: {content.publishDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UnifiedBadge variant={getStatusVariant(content.status)} size="sm">
                      {getStatusIcon(content.status)}
                      <span className="mr-1">{content.status}</span>
                    </UnifiedBadge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-black font-arabic">{content.views.toLocaleString()}</div>
                    <div className="text-xs text-black/60 font-arabic">مشاهدات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-black font-arabic">{content.engagement}%</div>
                    <div className="text-xs text-black/60 font-arabic">تفاعل</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-black font-arabic">{content.culturalScore}%</div>
                    <div className="text-xs text-black/60 font-arabic">نقاط ثقافية</div>
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
        </BaseCard>
      </div>

      {/* Content Calendar Preview */}
      <div className="mb-6">
        <BaseCard
          variant="operations"
          size="md"
          className="w-full"
          header={
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black font-arabic flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                جدول المحتوى القادم
              </h3>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-black/5 rounded-3xl">
              <div className="w-12 h-12 bg-black/10 rounded-3xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-black" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-black font-arabic">ندوة التراث الرقمي</h4>
                <p className="text-sm text-black/60 font-arabic">مجدولة لـ 25 يناير 2024</p>
              </div>
              <UnifiedBadge variant="info" size="sm">فيديو</UnifiedBadge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-black/5 rounded-3xl">
              <div className="w-12 h-12 bg-black/10 rounded-3xl flex items-center justify-center">
                <PenTool className="h-5 w-5 text-black" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-black font-arabic">دليل الممارسات الثقافية</h4>
                <p className="text-sm text-black/60 font-arabic">مجدول لـ 28 يناير 2024</p>
              </div>
              <UnifiedBadge variant="default" size="sm">دليل</UnifiedBadge>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};