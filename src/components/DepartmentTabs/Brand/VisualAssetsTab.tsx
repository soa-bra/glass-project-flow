
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-6">
      {/* Header Controls */}
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
        <UnifiedButton>
          <Upload className="h-4 w-4 mr-2" />
          رفع أصل جديد
        </UnifiedButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">فئات الأصول</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assetCategories.map((category) => (
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
                    <UnifiedBadge variant="info">
                      {category.count}
                    </UnifiedBadge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assets Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Assets Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                الأصول البصرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentAssets.map((asset) => (
                  <div key={asset.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {asset.type === 'logo' && <Image className="h-4 w-4 text-blue-600" />}
                        {asset.type === 'template' && <FileText className="h-4 w-4 text-green-600" />}
                        {asset.type === 'color' && <Palette className="h-4 w-4 text-purple-600" />}
                      </div>
                      <UnifiedBadge variant={asset.status === 'approved' ? 'success' : 'warning'}>
                        {asset.status === 'approved' ? 'معتمد' : 'قيد المراجعة'}
                      </UnifiedBadge>
                    </div>
                    
                    <h3 className="font-medium mb-2">{asset.name}</h3>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex justify-between">
                        <span>الصيغة:</span>
                        <span>{asset.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الحجم:</span>
                        <span>{asset.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>التحميلات:</span>
                        <span>{asset.downloads}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <UnifiedButton size="sm" variant="outline">
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
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الاستخدام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-600">إجمالي التحميلات</div>
                  <div className="text-xs text-green-600">+15% هذا الشهر</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-gray-600">معدل الاستخدام</div>
                  <div className="text-xs text-green-600">+3% هذا الشهر</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">245</div>
                  <div className="text-sm text-gray-600">إجمالي الأصول</div>
                  <div className="text-xs text-blue-600">+12 أصل جديد</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
