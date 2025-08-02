import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { UnifiedBadge } from '@/components/ui/UnifiedBadge';
import { Input } from '@/components/ui/input';
import { 
  Palette, 
  Upload, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Trash2,
  Image,
  FileText,
  Type
} from 'lucide-react';

export const VisualAssetsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const assetCategories = [
    { id: 'all', name: 'جميع الأصول', count: 245 },
    { id: 'logos', name: 'الشعارات', count: 28 },
    { id: 'fonts', name: 'الخطوط', count: 15 },
    { id: 'colors', name: 'الألوان', count: 12 },
    { id: 'templates', name: 'القوالب', count: 89 },
    { id: 'icons', name: 'الأيقونات', count: 101 }
  ];

  const recentAssets = [
    {
      id: 1,
      name: 'شعار سوبرا الرئيسي',
      type: 'logo',
      format: 'SVG',
      size: '2.4 MB',
      lastUsed: '2024-01-15',
      downloads: 127,
      status: 'approved'
    },
    {
      id: 2,
      name: 'قالب العرض التقديمي',
      type: 'template',
      format: 'PPTX',
      size: '5.8 MB',
      lastUsed: '2024-01-14',
      downloads: 89,
      status: 'approved'
    },
    {
      id: 3,
      name: 'مجموعة الألوان الرسمية',
      type: 'color',
      format: 'ASE',
      size: '124 KB',
      lastUsed: '2024-01-13',
      downloads: 203,
      status: 'approved'
    }
  ];

  return (
    <div className="font-arabic px-[15px] py-0">
      {/* Header Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث في الأصول..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <UnifiedButton variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              تصفية
            </UnifiedButton>
          </div>
          <UnifiedButton variant="primary" size="md">
            <Upload className="h-4 w-4 mr-2" />
            رفع أصل جديد
          </UnifiedButton>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="xl:col-span-1">
            <BaseCard
              variant="operations"
              size="md"
              className="w-full"
              header={
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black font-arabic">فئات الأصول</h3>
                </div>
              }
            >
              <div className="space-y-2">
                {assetCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-3xl text-right transition-colors font-arabic ${
                      selectedCategory === category.id
                        ? 'bg-black/5 text-black border border-black/10'
                        : 'hover:bg-black/5'
                    }`}
                  >
                    <span className="font-medium text-black">{category.name}</span>
                    <UnifiedBadge variant="default" size="sm">
                      {category.count}
                    </UnifiedBadge>
                  </button>
                ))}
              </div>
            </BaseCard>
          </div>

          {/* Assets Grid */}
          <div className="xl:col-span-3 space-y-6">
            {/* Assets Grid */}
            <BaseCard
              variant="operations"
              size="md"
              className="w-full"
              header={
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black font-arabic flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                      <Palette className="h-4 w-4 text-white" />
                    </div>
                    الأصول البصرية
                  </h3>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentAssets.map((asset) => (
                  <div key={asset.id} className="border border-black/10 rounded-3xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {asset.type === 'logo' && <Image className="h-4 w-4 text-black" />}
                        {asset.type === 'template' && <FileText className="h-4 w-4 text-black" />}
                        {asset.type === 'color' && <Palette className="h-4 w-4 text-black" />}
                      </div>
                      <UnifiedBadge variant={asset.status === 'approved' ? 'success' : 'warning'} size="sm">
                        {asset.status === 'approved' ? 'معتمد' : 'قيد المراجعة'}
                      </UnifiedBadge>
                    </div>
                    
                    <h3 className="font-medium mb-2 text-black font-arabic">{asset.name}</h3>
                    
                    <div className="space-y-1 text-sm text-black/70 mb-3">
                      <div className="flex justify-between">
                        <span className="font-arabic">الصيغة:</span>
                        <span>{asset.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-arabic">الحجم:</span>
                        <span>{asset.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-arabic">التحميلات:</span>
                        <span>{asset.downloads}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <UnifiedButton size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        عرض
                      </UnifiedButton>
                      <UnifiedButton size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </UnifiedButton>
                      <UnifiedButton size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </UnifiedButton>
                    </div>
                  </div>
                ))}
              </div>
            </BaseCard>

            {/* Usage Statistics */}
            <BaseCard
              variant="operations"
              size="md"
              className="w-full"
              header={
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black font-arabic">إحصائيات الاستخدام</h3>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-black font-arabic">1,247</div>
                  <div className="text-sm text-black font-arabic">إجمالي التحميلات</div>
                  <div className="text-xs text-black font-arabic">+15% هذا الشهر</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-black font-arabic">89%</div>
                  <div className="text-sm text-black font-arabic">معدل الاستخدام</div>
                  <div className="text-xs text-black font-arabic">+3% هذا الشهر</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-black font-arabic">245</div>
                  <div className="text-sm text-black font-arabic">إجمالي الأصول</div>
                  <div className="text-xs text-black font-arabic">+12 أصل جديد</div>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  );
};