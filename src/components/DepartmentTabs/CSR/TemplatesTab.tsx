
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Copy, 
  Upload,
  Eye,
  Calendar,
  User
} from 'lucide-react';
import { mockCSRTemplates } from './data';

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadForm, setShowUploadForm] = useState(false);

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'proposal': return 'مقترح';
      case 'agreement': return 'اتفاقية';
      case 'report': return 'تقرير';
      case 'evaluation': return 'تقييم';
      case 'contract': return 'عقد';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'proposal': return 'bg-blue-100 text-blue-800';
      case 'agreement': return 'bg-green-100 text-green-800';
      case 'report': return 'bg-orange-100 text-orange-800';
      case 'evaluation': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = mockCSRTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory && template.isActive;
  });

  const templateStats = {
    total: mockCSRTemplates.length,
    mostUsed: mockCSRTemplates.reduce((prev, current) => (prev.usageCount > current.usageCount) ? prev : current),
    categories: [...new Set(mockCSRTemplates.map(t => t.category))].length
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في النماذج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="all">جميع الفئات</option>
            <option value="proposal">مقترح</option>
            <option value="agreement">اتفاقية</option>
            <option value="report">تقرير</option>
            <option value="evaluation">تقييم</option>
            <option value="contract">عقد</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="font-arabic"
          >
            <Upload className="ml-2 h-4 w-4" />
            رفع قالب
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
            <Plus className="ml-2 h-4 w-4" />
            إنشاء قالب جديد
          </Button>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4">رفع قالب جديد</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold font-arabic mb-2">اسم القالب</label>
              <Input placeholder="اسم وصفي للقالب" />
            </div>
            <div>
              <label className="block text-sm font-semibold font-arabic mb-2">الفئة</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
                <option value="proposal">مقترح</option>
                <option value="agreement">اتفاقية</option>
                <option value="report">تقرير</option>
                <option value="evaluation">تقييم</option>
                <option value="contract">عقد</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold font-arabic mb-2">الوصف</label>
            <Input placeholder="وصف مختصر للقالب واستخداماته" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold font-arabic mb-2">الملف</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-arabic">اسحب الملف هنا أو انقر للتحديد</p>
              <p className="text-sm text-gray-500 font-arabic">يدعم: PDF, DOCX, XLSX</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-arabic">
              رفع القالب
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowUploadForm(false)}
              className="font-arabic"
            >
              إلغاء
            </Button>
          </div>
        </GenericCard>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">{templateStats.total}</h3>
          <p className="text-gray-600 font-arabic">إجمالي القوالب</p>
          <div className="mt-2 text-sm text-blue-600 font-arabic">
            {filteredTemplates.length} نشط
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Download className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">{templateStats.mostUsed.usageCount}</h3>
          <p className="text-gray-600 font-arabic">أكثر استخداماً</p>
          <div className="mt-2 text-sm text-green-600 font-arabic">
            {templateStats.mostUsed.name}
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Copy className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">{templateStats.categories}</h3>
          <p className="text-gray-600 font-arabic">الفئات المتاحة</p>
          <div className="mt-2 text-sm text-purple-600 font-arabic">
            متنوعة
          </div>
        </GenericCard>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <GenericCard key={template.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold font-arabic text-gray-900">{template.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                    {getCategoryText(template.category)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-arabic mb-3">{template.description}</p>
              </div>
            </div>

            {/* Template Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 font-arabic mb-4">
              <div className="flex items-center">
                <User className="h-3 w-3 ml-1" />
                <span>{template.createdBy}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 ml-1" />
                <span>{new Date(template.lastModified).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 font-arabic mb-4">
              <div>استخدم {template.usageCount} مرة</div>
              <div>{template.variables.length} متغير</div>
            </div>

            {/* Tags */}
            {template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-arabic">
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-arabic">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 font-arabic">
                <Eye className="h-3 w-3 ml-1" />
                معاينة
              </Button>
              <Button size="sm" variant="outline" className="font-arabic">
                <Download className="h-3 w-3 ml-1" />
                تحميل
              </Button>
              <Button size="sm" variant="outline" className="font-arabic">
                <Copy className="h-3 w-3 ml-1" />
                نسخ
              </Button>
              <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700 font-arabic">
                <Edit className="h-3 w-3 ml-1" />
                تعديل
              </Button>
            </div>
          </GenericCard>
        ))}
      </div>

      {/* Variables Reference */}
      <GenericCard>
        <h3 className="text-lg font-bold font-arabic mb-4">دليل المتغيرات المتاحة للمبادرات الاجتماعية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold font-arabic text-gray-900 mb-2">معلومات المبادرة</h4>
            <div className="space-y-1 text-sm font-arabic">
              <div className="flex justify-between">
                <span className="text-gray-600">اسم المبادرة:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{initiative_name}}"}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الفئة:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{category}}"}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الميزانية:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{budget}}"}</code>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold font-arabic text-gray-900 mb-2">معلومات الشراكة</h4>
            <div className="space-y-1 text-sm font-arabic">
              <div className="flex justify-between">
                <span className="text-gray-600">اسم الشريك:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{partner_name}}"}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">نوع الشراكة:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{partnership_type}}"}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المدة:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{duration}}"}</code>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold font-arabic text-gray-900 mb-2">مؤشرات الأداء</h4>
            <div className="space-y-1 text-sm font-arabic">
              <div className="flex justify-between">
                <span className="text-gray-600">المستفيدين:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{beneficiaries}}"}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">مؤشر الأثر:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{impact_index}}"}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SROI:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{sroi_value}}"}</code>
              </div>
            </div>
          </div>
        </div>
      </GenericCard>
    </div>
  );
};
