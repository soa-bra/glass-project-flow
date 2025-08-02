
import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { FileText, Download, Eye, Edit, Plus, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockHRTemplates } from './data';

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const categories = ['الكل', 'contract', 'evaluation', 'policy', 'form', 'letter'];
  
  const categoryLabels = {
    contract: 'عقود',
    evaluation: 'تقييمات',
    policy: 'سياسات',
    form: 'نماذج',
    letter: 'رسائل'
  };

  const filteredTemplates = mockHRTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const templateStats = {
    totalTemplates: mockHRTemplates.length,
    mostUsed: mockHRTemplates.reduce((prev, current) => (prev.usageCount > current.usageCount) ? prev : current),
    recentlyUpdated: mockHRTemplates.filter(t => {
      const updateDate = new Date(t.lastModified);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return updateDate > thirtyDaysAgo;
    }).length
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      contract: 'bg-blue-600',
      evaluation: 'bg-green-600',
      policy: 'bg-purple-600',
      form: 'bg-orange-600',
      letter: 'bg-gray-600'
    };
    
    return (
      <Badge className={`text-xs text-white ${colors[category as keyof typeof colors] || 'bg-gray-600'}`}>
        {categoryLabels[category as keyof typeof categoryLabels] || category}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 bg-transparent">
      {/* إحصائيات النماذج */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">إجمالي النماذج</p>
              <p className="text-2xl font-bold text-blue-600">{templateStats.totalTemplates}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">الأكثر استخداماً</p>
              <p className="text-lg font-bold text-green-600 font-arabic">{templateStats.mostUsed.name}</p>
              <p className="text-sm text-gray-500">{templateStats.mostUsed.usageCount} مرة</p>
            </div>
            <Download className="h-8 w-8 text-green-600" />
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">محدثة حديثاً</p>
              <p className="text-2xl font-bold text-purple-600">{templateStats.recentlyUpdated}</p>
              <p className="text-sm text-gray-500 font-arabic">خلال 30 يوم</p>
            </div>
            <Edit className="h-8 w-8 text-purple-600" />
          </div>
        </BaseCard>
      </div>

      {/* أدوات البحث والتصفية */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">النماذج والقوالب</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في النماذج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-arabic"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'الكل' ? cat : categoryLabels[cat as keyof typeof categoryLabels] || cat}
                </option>
              ))}
            </select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              <span className="font-arabic">تصفية</span>
            </Button>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              <span className="font-arabic">إضافة نموذج</span>
            </Button>
          </div>
        </div>
      </BaseCard>

      {/* قائمة النماذج */}
      <BaseCard variant="operations" className="p-6">
        <div className="grid gap-4">
          {filteredTemplates.map((template, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-800 font-arabic">{template.name}</h3>
                    {getCategoryBadge(template.category)}
                  </div>
                  <p className="text-gray-600 font-arabic mb-3">{template.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>تم الاستخدام {template.usageCount} مرة</span>
                    <span>•</span>
                    <span>آخر تعديل: {template.lastModified}</span>
                    <span>•</span>
                    <span>بواسطة: {template.createdBy}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    {template.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="font-arabic">معاينة</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="font-arabic">تحميل</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    <span className="font-arabic">تعديل</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 font-arabic mb-2">لا توجد نماذج</h3>
            <p className="text-gray-600 font-arabic">لم يتم العثور على نماذج تطابق معايير البحث الخاصة بك</p>
          </div>
        )}
      </BaseCard>

      {/* إحصائيات الاستخدام */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Download className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">إحصائيات الاستخدام</h3>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-medium font-arabic">أكثر النماذج استخداماً</h4>
          {mockHRTemplates
            .sort((a, b) => b.usageCount - a.usageCount)
            .slice(0, 5)
            .map((template, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-500">{index + 1}</span>
                  <span className="font-arabic">{template.name}</span>
                  {getCategoryBadge(template.category)}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-600 rounded-full" 
                      style={{ width: `${(template.usageCount / templateStats.mostUsed.usageCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold">{template.usageCount}</span>
                </div>
              </div>
            ))}
        </div>
      </BaseCard>
    </div>
  );
};
