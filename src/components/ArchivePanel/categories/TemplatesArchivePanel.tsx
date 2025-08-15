import React, { useState } from 'react';
import { Database, Copy, FileText, Download, Eye, Filter, Search, Calendar, User, Badge as BadgeIcon } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
export const TemplatesArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const mockTemplatesData = [{
    id: '1',
    title: 'نموذج تقرير المشروع الشهري',
    type: 'Template',
    usageCount: '245 استخدام',
    date: '2024-01-20',
    author: 'إدارة المشاريع',
    department: 'إدارة المشاريع',
    version: 'v2.4',
    category: 'تقارير',
    tags: ['تقرير', 'مشروع', 'شهري']
  }, {
    id: '2',
    title: 'قالب العرض التقديمي المؤسسي',
    type: 'PowerPoint',
    usageCount: '189 استخدام',
    date: '2024-01-18',
    author: 'فريق التصميم',
    department: 'العلامة التجارية',
    version: 'v3.1',
    category: 'عروض تقديمية',
    tags: ['عرض', 'مؤسسي', 'تصميم']
  }, {
    id: '3',
    title: 'نموذج طلب الإجازة والغياب',
    type: 'Form',
    usageCount: '412 استخدام',
    date: '2024-01-15',
    author: 'الموارد البشرية',
    department: 'الموارد البشرية',
    version: 'v1.8',
    category: 'نماذج إدارية',
    tags: ['إجازة', 'غياب', 'طلب']
  }, {
    id: '4',
    title: 'قالب اتفاقية التعاون',
    type: 'Legal Template',
    usageCount: '67 استخدام',
    date: '2024-01-12',
    author: 'الشؤون القانونية',
    department: 'الشؤون القانونية',
    version: 'v2.0',
    category: 'قانونية',
    tags: ['اتفاقية', 'تعاون', 'قانوني']
  }];
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'تقارير':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'عروض تقديمية':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'نماذج إدارية':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'قانونية':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  return <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="font-medium text-black font-arabic text-3xl">
          النماذج والقوالب
        </h2>
        <div className="flex items-center gap-3">
          <Button className="bg-black text-white rounded-full">
            <Download className="w-4 h-4 mr-2" />
            تصدير شامل
          </Button>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            تصفية متقدمة
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="bg-[#FFFFFF] p-4 rounded-[40px] ring-1 ring-[#DADCE0]">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="البحث في النماذج والقوالب..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pr-12 pl-4 py-3 rounded-full bg-transparent ring-1 ring-[#DADCE0] focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic" />
            </div>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-4">
          {mockTemplatesData.map(item => <div key={item.id} className="bg-[#FFFFFF] p-6 rounded-[40px] ring-1 ring-[#DADCE0]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-black font-arabic text-lg">{item.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                      <FileText className="w-3 h-3 inline mr-1" />
                      {item.category}
                    </div>
                    <BaseBadge variant="secondary" size="sm">
                      {item.version}
                    </BaseBadge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <BadgeIcon className="w-4 h-4" />
                      {item.type} • {item.usageCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {item.author}
                    </span>
                    <span className="flex items-center gap-1 font-arabic">
                      {item.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BadgeIcon className="w-4 h-4 text-gray-400" />
                    {item.tags.map((tag, index) => <BaseBadge key={index} variant="outline" size="sm">
                        {tag}
                      </BaseBadge>)}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4 mx-0 py-0 my-0">
                  <Button size="sm" className="bg-black text-white rounded-full">
                    <Eye className="w-4 h-4 mr-1" />
                    عرض
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <Copy className="w-4 h-4 mr-1" />
                    نسخ
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <Download className="w-4 h-4 mr-1" />
                    تحميل
                  </Button>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};