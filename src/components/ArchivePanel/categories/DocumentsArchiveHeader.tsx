import React from 'react';
import { Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DocumentsArchiveHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-6 py-6">
      <h2 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">
        الوثائق والمستندات
      </h2>
      <div className="flex items-center gap-3">
        <Button className="bg-[#0B0F12] text-white rounded-full text-sm">
          <Download className="w-4 h-4 mr-2" />
          تصدير شامل
        </Button>
        <Button variant="outline" className="rounded-full text-sm ring-1 ring-[rgba(11,15,18,0.15)]">
          <Filter className="w-4 h-4 mr-2" />
          تصفية متقدمة
        </Button>
      </div>
    </div>
  );
};
