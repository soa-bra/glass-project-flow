import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Share, Download, Upload } from 'lucide-react';

interface CanvasToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-black/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-black">لوحة التخطيط التفاعلية</h2>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-black/50" />
            <Input
              placeholder="البحث في العناصر..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            تصفية
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            مشاركة
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
          <Button size="sm">
            <Upload className="w-4 h-4 mr-2" />
            حفظ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CanvasToolbar;