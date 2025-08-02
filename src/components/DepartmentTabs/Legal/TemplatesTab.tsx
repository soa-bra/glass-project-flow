import React, { useState } from 'react';
import { FileText, Download, Plus, Search, Edit, Eye } from 'lucide-react';

const mockTemplates = [
  {
    id: 'TPL-001',
    name: 'عقد خدمات استشارية',
    category: 'contract',
    type: 'خدمات',
    description: 'نموذج عقد للخدمات الاستشارية والتطوير',
    lastModified: '2024-06-15',
    createdBy: 'فريق الشؤون القانونية',
    usage: 25,
    status: 'active'
  },
  {
    id: 'TPL-002',
    name: 'اتفاقية سرية',
    category: 'agreement',
    type: 'سرية',
    description: 'اتفاقية عدم إفشاء المعلومات السرية',
    lastModified: '2024-06-10',
    createdBy: 'المستشار القانوني',
    usage: 42,
    status: 'active'
  }
];

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-large font-semibold text-black font-arabic mx-[30px]">النماذج والقوالب</h3>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium mx-[25px] flex items-center gap-2 hover:bg-black/90 transition-colors">
          <Plus className="w-4 h-4" />
          نموذج جديد
        </button>
      </div>

      {/* أدوات البحث */}
      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-black" />
              <input
                type="text"
                placeholder="البحث في النماذج..."
                className="w-full pl-4 pr-10 py-3 bg-transparent border border-black/10 rounded-full focus:ring-2 focus:ring-black/20 text-black font-arabic"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* شبكة النماذج */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 hover:bg-white/10 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-black" />
                <span className="px-3 py-1 text-xs rounded-full bg-[#a4e2f6] text-black font-arabic">
                  {template.type}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-black hover:bg-white/20 rounded">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-black hover:bg-white/20 rounded">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h4 className="font-medium text-black font-arabic mb-2">{template.name}</h4>
            <p className="text-sm text-black/70 font-arabic mb-4">{template.description}</p>
            
            <div className="space-y-2 text-sm text-black/70 font-arabic">
              <div className="flex justify-between">
                <span>مرات الاستخدام:</span>
                <span className="font-medium text-black">{template.usage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};