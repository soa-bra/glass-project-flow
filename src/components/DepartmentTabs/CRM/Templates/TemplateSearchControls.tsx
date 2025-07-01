
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Upload, Plus } from 'lucide-react';

interface TemplateSearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onUploadToggle: () => void;
  onCreateNew: () => void;
}

export const TemplateSearchControls: React.FC<TemplateSearchControlsProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onUploadToggle,
  onCreateNew
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <div className="relative flex-1 lg:w-96">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="البحث في النماذج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
        >
          <option value="all">جميع الفئات</option>
          <option value="proposal">عرض تجاري</option>
          <option value="contract">عقد</option>
          <option value="email">رسالة إلكترونية</option>
          <option value="report">تقرير</option>
          <option value="survey">استطلاع</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onUploadToggle}
          className="font-arabic"
        >
          <Upload className="ml-2 h-4 w-4" />
          رفع قالب
        </Button>
        <Button 
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-arabic"
        >
          <Plus className="ml-2 h-4 w-4" />
          إنشاء قالب جديد
        </Button>
      </div>
    </div>
  );
};
