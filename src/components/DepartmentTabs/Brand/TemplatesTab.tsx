
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Image, 
  Presentation, 
  Layout,
  Download,
  Eye,
  Edit,
  Upload,
  Search,
  Filter,
  Star,
  Calendar
} from 'lucide-react';

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templateCategories = [
    { id: 'all', name: 'جميع القوالب', count: 87, icon: FileText },
    { id: 'presentations', name: 'العروض التقديمية', count: 23, icon: Presentation },
    { id: 'documents', name: 'المستندات', count: 31, icon: FileText },
    { id: 'social', name: 'وسائل التواصل', count: 19, icon: Image },
    { id: 'reports', name: 'التقارير', count: 14, icon: Layout }
  ];

  const templates = [
    {
      id: 1,
      name: 'قالب العرض التقديمي الرسمي',
      category: 'presentations',
      type: 'PPTX',
      description: 'قالب موحد للعروض التقديمية مع الهوية البصرية لسوبرا',
      downloads: 234,
      rating: 4.8,
      lastUpdated: '2024-01-15',
      culturalCompliance: 96,
      thumbnail: '/api/placeholder/200/150',
      tags: ['رسمي', 'عروض', 'هوية']
    },
    {
      id: 2,
      name: 'نموذج التقرير الشهري',
      category: 'reports',
      type: 'DOCX',
      description: 'نموذج موحد للتقارير الشهرية مع المؤشرات الثقافية',
      downloads: 189,
      rating: 4.6,
      lastUpdated: '2024-01-12',
      culturalCompliance: 92,
      thumbnail: '/api/placeholder/200/150',
      tags: ['تقارير', 'شهري', 'مؤشرات']
    },
    {
      id: 3,
      name: 'قالب منشورات وسائل التواصل',
      category: 'social',
      type: 'PSD',
      description: 'مجموعة قوالب لمنشورات وسائل التواصل الاجتماعي',
      downloads: 356,
      rating: 4.9,
      lastUpdated: '2024-01-10',
      culturalCompliance: 98,
      thumbnail: '/api/placeholder/200/150',
      tags: ['سوشيال', 'منشورات', 'تفاعل']
    },
    {
      id: 4,
      name: 'نموذج دراسة الحالة',
      category: 'documents',
      type: 'DOCX',
      description: 'نموذج لكتابة دراسات الحالة بالمعايير الأكاديمية',
      downloads: 127,
      rating: 4.5,
      lastUpdated: '2024-01-08',
      culturalCompliance: 94,
      thumbnail: '/api/placeholder/200/150',
      tags: ['دراسة', 'أكاديمي', 'بحث']
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = templateCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : FileText;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث في القوالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            تصفية
          </Button>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          رفع قالب جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#FFFFFF] rounded-[40px] ring-1 ring-[#DADCE0]">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-black">فئات القوالب</h3>
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-2">
                {templateCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-[40px] text-right transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-transparent ring-1 ring-[#DADCE0]'
                          : 'hover:bg-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary">
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Template Stats */}
          <div className="bg-[#FFFFFF] rounded-[40px] ring-1 ring-[#DADCE0] mt-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-black">إحصائيات القوالب</h3>
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2,847</div>
                  <div className="text-sm text-gray-600">إجمالي التحميلات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">4.7</div>
                  <div className="text-sm text-gray-600">متوسط التقييم</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <div className="text-sm text-gray-600">التوافق الثقافي</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-[#FFFFFF] rounded-[40px] ring-1 ring-[#DADCE0] hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{template.type}</Badge>
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{template.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    {/* Template Preview */}
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Image className="h-12 w-12 mx-auto mb-2" />
                        <div className="text-sm">معاينة القالب</div>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">التحميلات:</span>
                        <span className="font-medium ml-2">{template.downloads}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">التوافق الثقافي:</span>
                        <span className="font-medium ml-2">{template.culturalCompliance}%</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        معاينة
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        تحميل
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Last Updated */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>آخر تحديث: {template.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="bg-[#FFFFFF] rounded-[40px] ring-1 ring-[#DADCE0]">
              <div className="text-center py-12 px-6">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد قوالب</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'لم يتم العثور على قوالب تطابق البحث' : 'لم يتم إنشاء أي قوالب بعد'}
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  إضافة قالب جديد
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
