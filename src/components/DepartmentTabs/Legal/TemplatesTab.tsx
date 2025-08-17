import React, { useState } from 'react';
import { FileText, Download, Plus, Search, Edit, Eye } from 'lucide-react';
const mockTemplates = [{
  id: 'TPL-001',
  name: 'عقد خدمات استشارية',
  category: 'contract',
  type: 'خدمات',
  description: 'نموذج عقد للخدمات الاستشارية والتطوير',
  lastModified: '2024-06-15',
  createdBy: 'فريق الشؤون القانونية',
  usage: 25,
  status: 'active'
}, {
  id: 'TPL-002',
  name: 'اتفاقية سرية',
  category: 'agreement',
  type: 'سرية',
  description: 'اتفاقية عدم إفشاء المعلومات السرية',
  lastModified: '2024-06-10',
  createdBy: 'المستشار القانوني',
  usage: 42,
  status: 'active'
}];
export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">النماذج والقوالب</h3>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black/90 transition-colors">
          <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          نموذج جديد
        </button>
      </div>

      {/* أدوات البحث */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-4 h-4 text-black" />
              </div>
              <input type="text" placeholder="البحث في النماذج..." className="w-full pl-4 pr-12 py-3 bg-transparent border border-black/10 rounded-full focus:ring-2 focus:ring-black/20 text-black font-arabic" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* شبكة النماذج */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => <div key={template.id} className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
                  <FileText className="w-4 h-4 text-black" />
                </div>
                <span className="px-3 py-1 text-xs rounded-full bg-[#a4e2f6] text-black font-arabic">
                  {template.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <Eye className="w-4 h-4 text-black" />
                </div>
                <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <Download className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
            
            <h4 className="text-xl font-semibold text-black font-arabic mb-2">{template.name}</h4>
            <p className="text-sm font-normal text-black font-arabic mb-4">{template.description}</p>
            
            <div className="space-y-2 text-sm font-normal text-black font-arabic">
              <div className="flex justify-between">
                <span>مرات الاستخدام:</span>
                <span className="text-sm font-bold text-black font-arabic">{template.usage}</span>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};