
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { NumericStatCard, RingMetricCard } from '@/components/shared/visual-data';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { 
  MessageSquare, 
  PenTool, 
  Calendar, 
  Eye,
  Share2,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export const ContentMessagingTab: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const contentPillars = [
    { name: 'التراث الثقافي', percentage: 35, color: '#3DA8F5' },
    { name: 'الابتكار الأكاديمي', percentage: 28, color: '#3DBE8B' },
    { name: 'المسؤولية المجتمعية', percentage: 22, color: '#F6C445' },
    { name: 'التطوير المهني', percentage: 15, color: '#E5564D' }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'منشور': return <CheckCircle className="h-4 w-4" />;
      case 'قيد المراجعة': return <Clock className="h-4 w-4" />;
      case 'مجدول': return <Calendar className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'منشور': return 'success';
      case 'قيد المراجعة': return 'warning';
      case 'مجدول': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Strategy Overview */}
      <AppDashboardGrid columns={12}>
        <AppGridItem colSpan={6} tabletSpan={6}>
          <RingMetricCard
            title="ركائز المحتوى الثقافي"
            centerValue="100%"
            centerUnit="توزيع"
            layers={contentPillars.map(p => ({
              value: p.percentage,
              color: p.color,
              label: p.name,
            }))}
          />
        </AppGridItem>

        <AppGridItem colSpan={6} tabletSpan={6}>
          <DataCardFrame title="أداء المحتوى">
            <div className="grid grid-cols-2 gap-3">
              <NumericStatCard title="إجمالي المشاهدات" value="15.2K" accentColor="#3DA8F5" size="sm" />
              <NumericStatCard title="معدل التفاعل" value="8.7%" accentColor="#3DBE8B" size="sm" />
              <NumericStatCard title="النقاط الثقافية" value="89%" size="sm" />
              <NumericStatCard title="محتوى هذا الشهر" value={24} accentColor="#F6C445" size="sm" />
            </div>
            <div className="mt-4">
              <UnifiedButton variant="outline">
                <PenTool className="h-4 w-4 mr-2" />
                إنشاء محتوى جديد
              </UnifiedButton>
            </div>
          </DataCardFrame>
        </AppGridItem>
      </AppDashboardGrid>

      {/* Content Library */}
      <DataCardFrame title="مكتبة المحتوى" icon={<Eye className="h-5 w-5" />}>
        <div className="flex gap-2 mb-4">
          <UnifiedButton variant="outline" size="sm">تصفية</UnifiedButton>
          <UnifiedButton size="sm">
            <PenTool className="h-4 w-4 mr-2" />
            محتوى جديد
          </UnifiedButton>
        </div>
        <div className="space-y-3">
          {recentContent.map((content) => (
            <div key={content.id} className="p-4 rounded-[18px] border border-[#DADCE0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-[#0B0F12] font-arabic mb-1">{content.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">
                    <span>النوع: {content.type}</span>
                    <span>الكاتب: {content.author}</span>
                    <span>التاريخ: {content.publishDate}</span>
                  </div>
                </div>
                <UnifiedBadge variant={getStatusVariant(content.status)}>
                  {getStatusIcon(content.status)}
                  <span className="mr-1">{content.status}</span>
                </UnifiedBadge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <NumericStatCard title="مشاهدات" value={content.views.toLocaleString()} accentColor="#3DA8F5" size="sm" />
                <NumericStatCard title="تفاعل" value={`${content.engagement}%`} accentColor="#3DBE8B" size="sm" />
                <NumericStatCard title="نقاط ثقافية" value={`${content.culturalScore}%`} accentColor="#9B59B6" size="sm" />
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
      </DataCardFrame>

      {/* Content Calendar Preview */}
      <DataCardFrame title="جدول المحتوى القادم" icon={<Calendar className="h-5 w-5" />}>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
            <div className="w-10 h-10 rounded-full border border-[#DADCE0] flex items-center justify-center">
              <Calendar className="h-4 w-4 text-[#0B0F12]" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-[#0B0F12] font-arabic">ندوة التراث الرقمي</h4>
              <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">مجدولة لـ 25 يناير 2024</p>
            </div>
            <UnifiedBadge variant="info">فيديو</UnifiedBadge>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
            <div className="w-10 h-10 rounded-full border border-[#DADCE0] flex items-center justify-center">
              <PenTool className="h-4 w-4 text-[#0B0F12]" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-[#0B0F12] font-arabic">دليل الممارسات الثقافية</h4>
              <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">مجدول لـ 28 يناير 2024</p>
            </div>
            <UnifiedBadge variant="info">دليل</UnifiedBadge>
          </div>
        </div>
      </DataCardFrame>
    </div>
  );
};
