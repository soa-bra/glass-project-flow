
import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Tag, Calendar, User, FileText, BarChart, Bot, Shield, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ArchiveCategoryPanelProps {
  selectedCategory: string;
}

export const ArchiveCategoryPanel: React.FC<ArchiveCategoryPanelProps> = ({ 
  selectedCategory 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const getCategoryTitle = (category: string) => {
    const titles: { [key: string]: string } = {
      'documents': 'الوثائق والمستندات',
      'projects': 'المشاريع المكتملة',
      'hr': 'أرشيف الموارد البشرية',
      'financial': 'السجلات المالية',
      'legal': 'الوثائق القانونية',
      'organizational': 'الهيكل التنظيمي',
      'knowledge': 'قاعدة المعرفة',
      'templates': 'النماذج والقوالب',
      'policies': 'السياسات والإجراءات'
    };
    return titles[category] || 'الأرشيف';
  };

  const mockStats = [
    { title: 'إجمالي العناصر', value: '1,247', change: 12.5, icon: FileText },
    { title: 'العناصر الجديدة', value: '24', change: 8.3, icon: Calendar },
    { title: 'عمليات الوصول', value: '156', change: -5.2, icon: Eye },
    { title: 'مستوى الأمان', value: '98%', change: 2.1, icon: Shield }
  ];

  const mockItems = [
    {
      id: '1',
      title: 'تقرير المراجعة المالية السنوية 2023',
      type: 'PDF',
      size: '2.4 MB',
      date: '2024-01-15',
      author: 'أحمد محمد',
      tags: ['مالي', 'سنوي', 'مراجعة'],
      classification: 'سري',
      aiSummary: 'تقرير شامل يغطي الأداء المالي للشركة خلال عام 2023 مع تحليل مفصل للإيرادات والمصروفات.'
    },
    {
      id: '2',
      title: 'عقد الشراكة مع شركة التقنية المتقدمة',
      type: 'DOCX',
      size: '856 KB',
      date: '2024-01-10',
      author: 'سارة أحمد',
      tags: ['قانوني', 'شراكة', 'عقد'],
      classification: 'محدود',
      aiSummary: 'عقد شراكة استراتيجية لمدة 3 سنوات يتضمن تطوير حلول تقنية مشتركة.'
    },
    {
      id: '3',
      title: 'دليل السياسات والإجراءات المحدث',
      type: 'PDF',
      size: '4.1 MB',
      date: '2024-01-08',
      author: 'محمد عبدالله',
      tags: ['سياسات', 'إجراءات', 'دليل'],
      classification: 'عام',
      aiSummary: 'النسخة المحدثة من دليل السياسات تتضمن إضافات جديدة حول العمل عن بُعد وأمن المعلومات.'
    }
  ];

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'سري': return 'bg-[#f1b5b9] text-black';
      case 'محدود': return 'bg-[#fbe2aa] text-black';
      case 'عام': return 'bg-[#bdeed3] text-black';
      default: return 'bg-[#a4e2f6] text-black';
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          {getCategoryTitle(selectedCategory)}
        </h2>
        <div className="flex items-center gap-3">
          <Button className="bg-black text-white rounded-full">
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            تصفية
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStats.map((stat, index) => (
            <div key={index} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="h-6 w-6 text-black" />
                <div className={`px-3 py-1 rounded-full text-xs font-normal ${
                  stat.change > 0 ? 'bg-[#bdeed3] text-black' : 'bg-[#f1b5b9] text-black'
                }`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{stat.value}</h3>
              <p className="text-sm font-normal text-black font-arabic">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 mb-6">
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الأرشيف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic"
              />
            </div>
            <Button className="bg-black text-white rounded-full px-6">
              <Bot className="w-4 h-4 mr-2" />
              البحث الذكي
            </Button>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 font-arabic">تصفية سريعة:</span>
            {['الأحدث', 'الأكثر وصولاً', 'سري', 'محدود'].map((filter) => (
              <Badge 
                key={filter}
                variant="secondary"
                className="cursor-pointer hover:bg-black hover:text-white font-arabic"
                onClick={() => {
                  if (selectedFilters.includes(filter)) {
                    setSelectedFilters(selectedFilters.filter(f => f !== filter));
                  } else {
                    setSelectedFilters([...selectedFilters, filter]);
                  }
                }}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Archive Items */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-4">
          {mockItems.map((item) => (
            <div key={item.id} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-black font-arabic text-lg">{item.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-normal ${getClassificationColor(item.classification)}`}>
                      <Shield className="w-3 h-3 inline mr-1" />
                      {item.classification}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {item.type} • {item.size}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {item.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="font-arabic">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* AI Summary */}
                  <div className="bg-[#a4e2f6] p-3 rounded-2xl mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-black" />
                      <span className="text-sm font-medium text-black font-arabic">ملخص ذكي</span>
                    </div>
                    <p className="text-sm text-black font-arabic">{item.aiSummary}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" className="bg-black text-white rounded-full">
                    <Eye className="w-4 h-4 mr-1" />
                    عرض
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <Download className="w-4 h-4 mr-1" />
                    تحميل
                  </Button>
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="border-t border-black/10 pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600 font-arabic">اقتراحات ذكية</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-black hover:text-white font-arabic">
                    إنشاء أسئلة تدريبية
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-black hover:text-white font-arabic">
                    تصنيف تلقائي
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-black hover:text-white font-arabic">
                    البحث عن وثائق مشابهة
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
