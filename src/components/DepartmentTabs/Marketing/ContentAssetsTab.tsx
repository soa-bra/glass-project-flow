
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Image, 
  FileText, 
  Settings, 
  Plus, 
  Upload,
  Search,
  Filter,
  Eye,
  Download
} from 'lucide-react';

export const ContentAssetsTab: React.FC = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'assets' | 'dam'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');

  const contentCalendar = [
    {
      id: '1',
      title: 'منشور العودة للمدارس - فيسبوك',
      content: 'محتوى ترويجي للعودة للمدارس مع عروض خاصة',
      type: 'post',
      platform: ['Facebook', 'Instagram'],
      scheduledDate: '2024-08-15T10:00:00',
      status: 'scheduled',
      campaign: 'حملة العودة للمدارس 2024',
      approvalStatus: 'approved',
      assets: ['img1', 'img2']
    },
    {
      id: '2',
      title: 'قصة إنستقرام - نصائح دراسية',
      content: 'نصائح وإرشادات للطلاب',
      type: 'story',
      platform: ['Instagram'],
      scheduledDate: '2024-08-16T14:30:00',
      status: 'draft',
      campaign: 'حملة العودة للمدارس 2024',
      approvalStatus: 'pending',
      assets: ['video1']
    },
    {
      id: '3',
      title: 'إعلان لينكد إن - خدمات الاستشارات',
      content: 'إعلان مدفوع للخدمات الاستشارية',
      type: 'ad',
      platform: ['LinkedIn'],
      scheduledDate: '2024-08-17T09:00:00',
      status: 'scheduled',
      campaign: 'حملة الخدمات المهنية',
      approvalStatus: 'approved',
      assets: ['design1', 'copy1']
    }
  ];

  const marketingAssets = [
    {
      id: 'img1',
      name: 'صورة العودة للمدراس - رئيسية',
      type: 'image',
      category: 'social_media',
      fileSize: 2.5,
      dimensions: { width: 1200, height: 630 },
      createdBy: 'أحمد المصمم',
      createdAt: '2024-08-01',
      status: 'approved',
      brandCompliant: true,
      tags: ['عودة_للمدارس', 'تعليم', 'طلاب']
    },
    {
      id: 'video1',
      name: 'فيديو نصائح دراسية',
      type: 'video',
      category: 'social_media',
      fileSize: 45.2,
      createdBy: 'سارة المنتجة',
      createdAt: '2024-08-03',
      status: 'review',
      brandCompliant: false,
      tags: ['نصائح', 'دراسة', 'تعليم']
    },
    {
      id: 'design1',
      name: 'تصميم إعلان لينكد إن',
      type: 'image',
      category: 'digital_ads',
      fileSize: 1.8,
      dimensions: { width: 1200, height: 627 },
      createdBy: 'محمد المبدع',
      createdAt: '2024-08-05',
      status: 'approved',
      brandCompliant: true,
      tags: ['استشارات', 'مهني', 'خدمات']
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'scheduled': { label: 'مجدول', variant: 'info' },
      'published': { label: 'منشور', variant: 'success' },
      'draft': { label: 'مسودة', variant: 'default' },
      'cancelled': { label: 'ملغي', variant: 'error' },
      'approved': { label: 'معتمد', variant: 'success' },
      'review': { label: 'قيد المراجعة', variant: 'warning' },
      'rejected': { label: 'مرفوض', variant: 'error' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <UnifiedBadge variant={statusInfo.variant as any}>{statusInfo.label}</UnifiedBadge>;
  };

  const formatFileSize = (sizeInMB: number) => {
    return sizeInMB < 1 ? `${(sizeInMB * 1024).toFixed(0)} KB` : `${sizeInMB.toFixed(1)} MB`;
  };

  return (
    <div className="mb-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <UnifiedButton 
            onClick={() => setActiveView('calendar')}
            variant={activeView === 'calendar' ? 'primary' : 'outline'}
          >
            <Calendar className="w-4 h-4" />
            تقويم المحتوى
          </UnifiedButton>
          <UnifiedButton 
            onClick={() => setActiveView('assets')}
            variant={activeView === 'assets' ? 'primary' : 'outline'}
          >
            <Image className="w-4 h-4" />
            الأصول التسويقية
          </UnifiedButton>
          <UnifiedButton 
            onClick={() => setActiveView('dam')}
            variant={activeView === 'dam' ? 'primary' : 'outline'}
          >
            <FileText className="w-4 h-4" />
            نظام DAM
          </UnifiedButton>
        </div>
        
        <div className="flex gap-2">
          <UnifiedButton variant="primary">
            <Plus className="w-4 h-4" />
            إضافة محتوى
          </UnifiedButton>
          <UnifiedButton variant="outline">
            <Upload className="w-4 h-4" />
            رفع أصول
          </UnifiedButton>
        </div>
      </div>

      {/* Content Calendar View */}
      {activeView === 'calendar' && (
        <div className="space-y-4">
          <BaseBox variant="operations">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-black font-arabic mb-2">تقويم المحتوى التفاعلي</h3>
              <p className="text-black font-arabic">إدارة وجدولة المحتوى عبر جميع المنصات</p>
            </div>
            
            <div className="space-y-4">
              {contentCalendar.map((content) => (
                <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 font-arabic mb-1">{content.title}</h4>
                      <p className="text-sm text-gray-600 font-arabic mb-2">{content.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-arabic">
                          📅 {new Date(content.scheduledDate).toLocaleDateString('ar-SA')} 
                          في {new Date(content.scheduledDate).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="font-arabic">🎯 {content.campaign}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      {getStatusBadge(content.status)}
                      {getStatusBadge(content.approvalStatus)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {content.platform.map((platform, index) => (
                        <UnifiedBadge key={index} variant="default" size="sm">
                          {platform}
                        </UnifiedBadge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <UnifiedButton size="sm" variant="outline">
                        <Eye className="w-4 h-4 ml-1" />
                        معاينة
                      </UnifiedButton>
                      <UnifiedButton size="sm" variant="outline">
                        <Settings className="w-4 h-4 ml-1" />
                        تعديل
                      </UnifiedButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BaseBox>
        </div>
      )}

      {/* Assets View */}
      {activeView === 'assets' && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <BaseBox variant="operations">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في الأصول..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 font-arabic"
                />
              </div>
              <UnifiedButton variant="outline">
                <Filter className="w-4 h-4 ml-2" />
                فلترة
              </UnifiedButton>
            </div>
          </BaseBox>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketingAssets
              .filter(asset => 
                searchTerm === '' || 
                asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asset.tags.some(tag => tag.includes(searchTerm))
              )
              .map((asset) => (
                <BaseBox key={asset.id} variant="operations" className="transition-all duration-300">
                  <div className="space-y-4">
                    {/* Asset Preview */}
                    <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      {asset.type === 'image' ? (
                        <Image className="w-12 h-12 text-blue-600" />
                      ) : (
                        <FileText className="w-12 h-12 text-purple-600" />
                      )}
                    </div>

                    {/* Asset Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 font-arabic mb-2">{asset.name}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span className="font-arabic">النوع:</span>
                          <span>{asset.type === 'image' ? 'صورة' : 'فيديو'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-arabic">الحجم:</span>
                          <span>{formatFileSize(asset.fileSize)}</span>
                        </div>
                        {asset.dimensions && (
                          <div className="flex justify-between">
                            <span className="font-arabic">الأبعاد:</span>
                            <span>{asset.dimensions.width}×{asset.dimensions.height}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="font-arabic">المنشئ:</span>
                          <span className="font-arabic">{asset.createdBy}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.map((tag, index) => (
                        <UnifiedBadge key={index} variant="default" size="sm">
                          {tag}
                        </UnifiedBadge>
                      ))}
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex gap-2">
                        {getStatusBadge(asset.status)}
                        {asset.brandCompliant && (
                          <UnifiedBadge variant="success" size="sm">متوافق مع العلامة</UnifiedBadge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <UnifiedButton size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </UnifiedButton>
                        <UnifiedButton size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </UnifiedButton>
                        <UnifiedButton size="sm" variant="outline">
                          <Settings className="w-3 h-3" />
                        </UnifiedButton>
                      </div>
                    </div>
                  </div>
                </BaseBox>
              ))}
          </div>
        </div>
      )}

      {/* DAM System View */}
      {activeView === 'dam' && (
        <BaseBox variant="operations">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 font-arabic mb-2">نظام إدارة الأصول الرقمية (DAM)</h3>
            <p className="text-gray-600 font-arabic mb-6">
              نظام متكامل لإدارة وتنظيم جميع الأصول الرقمية مع صلاحيات متقدمة
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold font-arabic mb-2">رفع الأصول</h4>
                <p className="text-sm text-gray-600 font-arabic">رفع وتصنيف الأصول تلقائياً</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold font-arabic mb-2">إدارة الصلاحيات</h4>
                <p className="text-sm text-gray-600 font-arabic">تحكم دقيق في صلاحيات الوصول</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold font-arabic mb-2">مراجعة الجودة</h4>
                <p className="text-sm text-gray-600 font-arabic">مراجعة وضمان جودة المحتوى</p>
              </div>
            </div>
            <UnifiedButton variant="primary" size="lg" className="mt-6">قريباً - واجهة نظام DAM المتكاملة</UnifiedButton>
          </div>
        </BaseBox>
      )}
    </div>
  );
};
