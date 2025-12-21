import React, { useState } from 'react';
import { X, Search, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlanningStore } from '@/stores/planningStore';

// قوالب مبدئية
const TEMPLATES = [
  {
    id: '1',
    name: 'لوحة جانت',
    description: 'جدول زمني لإدارة المشاريع',
    category: 'project-management',
    thumbnailUrl: '',
  },
  {
    id: '2',
    name: 'لوحة كانبان',
    description: 'إدارة المهام بطريقة مرنة',
    category: 'project-management',
    thumbnailUrl: '',
  },
  {
    id: '3',
    name: 'خريطة ذهنية',
    description: 'تنظيم الأفكار بشكل بصري',
    category: 'brainstorming',
    thumbnailUrl: '',
  },
  {
    id: '4',
    name: 'لوحة عصف ذهني',
    description: 'جمع وتنظيم الأفكار الإبداعية',
    category: 'brainstorming',
    thumbnailUrl: '',
  },
];

const TemplateSelector = ({ onClose }: { onClose: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { createBoard } = usePlanningStore();

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'project-management', label: 'إدارة المشاريع' },
    { id: 'brainstorming', label: 'العصف الذهني' },
    { id: 'analysis', label: 'التحليل' },
  ];

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesSearch = template.name.includes(searchQuery) || 
                          template.description.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || 
                            template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: any) => {
    createBoard('template', { 
      name: template.name,
      templateId: template.id,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[18px] w-[90vw] max-w-6xl max-h-[85vh] overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.10)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
            <h2 className="text-[24px] font-bold text-[hsl(var(--ink))]">
              اختر قالباً
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[hsl(var(--panel))] rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search & Filter */}
          <div className="p-6 border-b border-[hsl(var(--border))]">
            <div className="relative mb-4">
              <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--ink-60))]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن قالب..."
                className="w-full pr-12 pl-4 py-3 rounded-[18px] border border-[hsl(var(--border))] text-[14px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
              />
            </div>

            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-[12px] font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[hsl(var(--ink))] text-white'
                      : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[hsl(var(--ink-30))]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-220px)]">
            <div className="grid grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSelectTemplate(template)}
                  className="group cursor-pointer rounded-[18px] bg-white border border-[hsl(var(--border))] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all"
                >
                  <div className="h-48 bg-[hsl(var(--panel))] flex items-center justify-center overflow-hidden">
                    {template.thumbnailUrl ? (
                      <img src={template.thumbnailUrl} alt={template.name} className="w-full h-full object-cover" />
                    ) : (
                      <Layout size={48} className="text-[hsl(var(--ink-30))]" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-[16px] font-semibold text-[hsl(var(--ink))] mb-2">
                      {template.name}
                    </h3>
                    <p className="text-[12px] text-[hsl(var(--ink-60))]">
                      {template.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplateSelector;
