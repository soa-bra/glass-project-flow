
import React from 'react';
import { Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DocumentsArchiveHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-6 py-6">
      <h2 className="text-display-m font-bold text-soabra-ink font-arabic">
        الوثائق والمستندات
      </h2>
      <div className="flex items-center gap-3">
        <Button className="bg-soabra-ink text-soabra-white rounded-full">
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
