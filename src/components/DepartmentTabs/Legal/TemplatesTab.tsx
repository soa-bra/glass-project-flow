
import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { FileText, Download, Plus, Search, Filter, Edit, Eye } from 'lucide-react';

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
  },
  {
    id: 'TPL-003',
    name: 'سياسة الخصوصية',
    category: 'policy',
    type: 'سياسة',
    description: 'سياسة حماية البيانات الشخصية',
    lastModified: '2024-05-20',
    createdBy: 'مسؤول حماية البيانات',
    usage: 15,
    status: 'active'
  },
  {
    id: 'TPL-004',
    name: 'نموذج طلب استشارة قانونية',
    category: 'form',
    type: 'نموذج',
    description: 'نموذج لطلب الاستشارات القانونية الداخلية',
    lastModified: '2024-06-01',
    createdBy: 'إدارة الشؤون القانونية',
    usage: 18,
    status: 'active'
  }
];

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const templateStats = {
    total: mockTemplates.length,
    contracts: mockTemplates.filter(t => t.category === 'contract').length,
    agreements: mockTemplates.filter(t => t.category === 'agreement').length,
    policies: mockTemplates.filter(t => t.category === 'policy').length,
    forms: mockTemplates.filter(t => t.category === 'form').length,
  };

  return (
    <div className="h-full overflow-auto">
      {/* Header with Search and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في النماذج..."
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">جميع الفئات</option>
            <option value="contract">عقود</option>
            <option value="agreement">اتفاقيات</option>
            <option value="policy">سياسات</option>
            <option value="form">نماذج</option>
          </select>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" />
          نموذج جديد
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <BaseCard className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{templateStats.total}</div>
          <div className="text-sm text-gray-600">إجمالي النماذج</div>
        </BaseCard>
        <BaseCard className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{templateStats.contracts}</div>
          <div className="text-sm text-gray-600">عقود</div>
        </BaseCard>
        <BaseCard className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{templateStats.agreements}</div>
          <div className="text-sm text-gray-600">اتفاقيات</div>
        </BaseCard>
        <BaseCard className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{templateStats.policies}</div>
          <div className="text-sm text-gray-600">سياسات</div>
        </BaseCard>
        <BaseCard className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{templateStats.forms}</div>
          <div className="text-sm text-gray-600">نماذج</div>
        </BaseCard>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <BaseCard key={template.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {template.type}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-green-600 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-purple-600 rounded">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-800 mb-2">{template.name}</h4>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>تم الإنشاء بواسطة:</span>
                <span>{template.createdBy}</span>
              </div>
              <div className="flex justify-between">
                <span>آخر تعديل:</span>
                <span>{new Date(template.lastModified).toLocaleDateString('ar-SA')}</span>
              </div>
              <div className="flex justify-between">
                <span>مرات الاستخدام:</span>
                <span className="font-medium">{template.usage}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{template.id}</span>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                  استخدام النموذج
                </button>
              </div>
            </div>
          </BaseCard>
        ))}
      </div>
    </div>
  );
};
