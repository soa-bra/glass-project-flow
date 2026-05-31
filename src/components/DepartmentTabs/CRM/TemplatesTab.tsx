
import React, { useState } from 'react';
import { mockCRMTemplates } from './data';
import {
  TemplateSearchControls,
  TemplateUploadForm,
  TemplateStatsCards,
  TemplateGrid,
  TemplateVariablesReference
} from './Templates';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { toast } from 'sonner';

const newTemplateFields: FormField[] = [
  { name: 'name', label: 'اسم القالب', type: 'text', required: true, placeholder: 'أدخل اسم القالب' },
  { name: 'category', label: 'التصنيف', type: 'select', required: true, options: [
    { value: 'proposal', label: 'عرض تجاري' },
    { value: 'contract', label: 'عقد' },
    { value: 'email', label: 'رسالة إلكترونية' },
    { value: 'report', label: 'تقرير' },
    { value: 'survey', label: 'استطلاع' },
  ]},
  { name: 'description', label: 'الوصف', type: 'textarea', required: true, placeholder: 'وصف القالب...' },
  { name: 'language', label: 'اللغة', type: 'select', options: [
    { value: 'ar', label: 'العربية' },
    { value: 'en', label: 'الإنجليزية' },
    { value: 'both', label: 'ثنائي اللغة' },
  ]},
];

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'proposal': return 'عرض تجاري';
      case 'contract': return 'عقد';
      case 'email': return 'رسالة إلكترونية';
      case 'report': return 'تقرير';
      case 'survey': return 'استطلاع';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'proposal': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'email': return 'bg-green-100 text-green-800';
      case 'report': return 'bg-orange-100 text-orange-800';
      case 'survey': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = mockCRMTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory && template.isActive;
  });

  const templateStats = {
    total: mockCRMTemplates.length,
    mostUsed: mockCRMTemplates.reduce((prev, current) => (prev.usageCount > current.usageCount) ? prev : current),
    categories: [...new Set(mockCRMTemplates.map(t => t.category))].length
  };

  const handleCreateNew = () => {
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (_data: Record<string, string>) => {
    // Template created via GenericFormModal toast
  };

  const handleUploadSubmit = () => {
    toast.success('تم رفع القالب بنجاح');
    setShowUploadForm(false);
  };

  return (
    <div className="space-y-6">
      <TemplateSearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onUploadToggle={() => setShowUploadForm(!showUploadForm)}
        onCreateNew={handleCreateNew}
      />

      {showUploadForm && (
        <TemplateUploadForm
          onCancel={() => setShowUploadForm(false)}
          onSubmit={handleUploadSubmit}
        />
      )}

      <TemplateStatsCards
        stats={templateStats}
        filteredCount={filteredTemplates.length}
      />

      <TemplateGrid
        templates={filteredTemplates}
        getCategoryText={getCategoryText}
        getCategoryColor={getCategoryColor}
      />

      <TemplateVariablesReference />

      <GenericFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="إنشاء قالب جديد"
        fields={newTemplateFields}
        onSubmit={handleCreateSubmit}
        submitLabel="إنشاء القالب"
        successMessage="تم إنشاء القالب بنجاح"
      />
    </div>
  );
};
