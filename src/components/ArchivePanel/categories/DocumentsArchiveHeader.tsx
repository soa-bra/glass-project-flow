
import React from 'react';
import { Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DocumentsArchiveHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-6 py-6">
      <h2 className="font-medium text-black font-arabic text-3xl">
        الوثائق والمستندات
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
  );
};
