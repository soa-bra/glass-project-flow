
import React, { useState } from 'react';
import { mockCRMTemplates } from './data';
import {
  TemplateSearchControls,
  TemplateUploadForm,
  TemplateStatsCards,
  TemplateGrid,
  TemplateVariablesReference
} from './Templates';

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadForm, setShowUploadForm] = useState(false);

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
    // Handle create new template
  };

  const handleUploadSubmit = () => {
    // Handle upload submit
    setShowUploadForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <TemplateSearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onUploadToggle={() => setShowUploadForm(!showUploadForm)}
        onCreateNew={handleCreateNew}
      />

      {/* Upload Form */}
      {showUploadForm && (
        <TemplateUploadForm
          onCancel={() => setShowUploadForm(false)}
          onSubmit={handleUploadSubmit}
        />
      )}

      {/* Statistics Cards */}
      <TemplateStatsCards
        stats={templateStats}
        filteredCount={filteredTemplates.length}
      />

      {/* Templates Grid */}
      <TemplateGrid
        templates={filteredTemplates}
        getCategoryText={getCategoryText}
        getCategoryColor={getCategoryColor}
      />

      {/* Variables Reference */}
      <TemplateVariablesReference />
    </div>
  );
};
