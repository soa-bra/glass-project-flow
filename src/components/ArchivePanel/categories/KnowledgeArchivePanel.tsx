import React, { useState } from 'react';
import { BookOpen, Brain, Lightbulb, Download, Eye, Filter, Search, Calendar, User, Badge as BadgeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
export const KnowledgeArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const mockKnowledgeData = [{
    id: '1',
    title: 'دليل أفضل الممارسات في إدارة المشاريع',
    type: 'PDF',
    size: '4.2 MB',
    date: '2024-01-20',
    author: 'مكتب إدارة المشاريع',
    department: 'إدارة المشاريع',
    version: 'v3.1',
    category: 'أفضل الممارسات',
    tags: ['مشاريع', 'إدارة', 'ممارسات']
  }, {
    id: '2',
    title: 'قاعدة بيانات الحلول التقنية',
    type: 'Database',
    size: '156 سجل',
    date: '2024-01-18',
    author: 'فريق التكنولوجيا',
    department: 'تقنية المعلومات',
    version: 'v2.5',
    category: 'حلول تقنية',
    tags: ['تقنية', 'حلول', 'برمجة']
  }, {
    id: '3',
    title: 'مكتبة المعرفة الاستراتيجية',
    type: 'Collection',
    size: '89 مادة',
    date: '2024-01-15',
    author: 'الإدارة الاستراتيجية',
    department: 'التخطيط الاستراتيجي',
    version: 'v4.0',
    category: 'استراتيجية',
    tags: ['استراتيجية', 'تخطيط', 'رؤية']
  }, {
    id: '4',
    title: 'دروس مستفادة من المشاريع السابقة',
    type: 'DOCX',
    size: '2.8 MB',
    date: '2024-01-12',
    author: 'مراجعة المشاريع',
    department: 'الجودة والتطوير',
    version: 'v1.9',
    category: 'دروس مستفادة',
    tags: ['دروس', 'تجارب', 'تحسين']
  }];
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'أفضل الممارسات':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'حلول تقنية':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'استراتيجية':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'دروس مستفادة':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  return <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h2 className="font-medium text-white font-arabic text-3xl bg-transparent mx-0">
          قاعدة المعرفة
        </h2>
        <div className="flex items-center gap-2">
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
        <div className="bg-[#f2ffff] p-4 rounded-3xl border border-black/10">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="البحث في قاعدة المعرفة..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pr-12 pl-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic" />
            </div>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-4">
          {mockKnowledgeData.map(item => <div key={item.id} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-black font-arabic text-lg">{item.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                      <Brain className="w-3 h-3 inline mr-1" />
                      {item.category}
                    </div>
                    <Badge variant="secondary" className="font-arabic">
                      {item.version}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <BadgeIcon className="w-4 h-4" />
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
                    <span className="flex items-center gap-1 font-arabic">
                      {item.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BadgeIcon className="w-4 h-4 text-gray-400" />
                    {item.tags.map((tag, index) => <Badge key={index} variant="outline" className="font-arabic">
                        {tag}
                      </Badge>)}
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
            </div>)}
        </div>
      </div>
    </div>;
};