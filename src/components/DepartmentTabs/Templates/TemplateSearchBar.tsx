
import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { BaseBox } from '@/components/ui/BaseBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const TemplateSearchBar: React.FC = () => {
  return (
    <BaseBox variant="operations" className="p-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="البحث في النماذج والقوالب..." 
            className="pr-10 font-arabic"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 ml-2" />
          فلترة
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4 ml-2" />
          إضافة نموذج
        </Button>
      </div>
    </BaseBox>
  );
};
