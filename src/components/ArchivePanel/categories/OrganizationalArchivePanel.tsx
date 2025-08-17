import React, { useState } from 'react';
import { Building2, Users, TrendingUp, Download, Eye, Filter, Search, Calendar, User, Badge as BadgeIcon } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';

export const OrganizationalArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockOrganizationalData = [
    {
      id: '1',
      title: 'الهيكل التنظيمي للشركة 2024',
      type: 'PDF',
      size: '2.1 MB',
      date: '2024-01-15',
      author: 'إدارة الموارد البشرية',
      department: 'الإدارة العليا',
      version: 'v4.0',
      category: 'هيكل تنظيمي',
      tags: ['هيكل', 'تنظيم', 'إدارة']
    },
    {
      id: '2',
      title: 'توصيف الوظائف والمسؤوليات',
      type: 'DOCX',
      size: '1.8 MB',
      date: '2024-01-10',
      author: 'قسم التطوير التنظيمي',
      department: 'الموارد البشرية',
      version: 'v2.3',
      category: 'وصف وظيفي',
      tags: ['وظائف', 'مسؤوليات', 'اختصاصات']
    },
    {
      id: '3',
      title: 'خريطة العمليات التشغيلية',
      type: 'PDF',
      size: '5.4 MB',
      date: '2024-01-08',
      author: 'فريق تطوير العمليات',
      department: 'العمليات',
      version: 'v1.7',
      category: 'عمليات',
      tags: ['عمليات', 'إجراءات', 'تدفق']
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'هيكل تنظيمي': return 'bg-[#a4e2f6] text-[#000000] border-[#a4e2f6]';
      case 'وصف وظيفي': return 'bg-[#bdeed3] text-[#000000] border-[#bdeed3]';
      case 'عمليات': return 'bg-[#d9d2fd] text-[#000000] border-[#d9d2fd]';
      default: return 'bg-[#f1f5f9] text-[#000000] border-[#e2e8f0]';
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="font-medium text-black font-arabic text-3xl">
          الهيكل التنظيمي
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
              <input
                type="text"
                placeholder="البحث في الهيكل التنظيمي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-full ring-1 ring-[#DADCE0] focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-4">
          {mockOrganizationalData.map((item) => (
            <div key={item.id} className="bg-[#FFFFFF] p-6 rounded-[40px] ring-1 ring-[#DADCE0]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-black font-arabic text-lg">{item.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                      <Building2 className="w-3 h-3 inline mr-1" />
                      {item.category}
                    </div>
                    <BaseBadge variant="secondary" size="sm">
                      {item.version}
                    </BaseBadge>
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
                    {item.tags.map((tag, index) => (
                      <BaseBadge key={index} variant="outline" size="sm">
                        {tag}
                      </BaseBadge>
                    ))}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};