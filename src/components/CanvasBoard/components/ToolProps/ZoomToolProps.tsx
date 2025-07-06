import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZOOM_OPTIONS } from '../../constants';
import { toast } from 'sonner';

interface ZoomToolPropsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const ZoomToolProps: React.FC<ZoomToolPropsProps> = ({ zoom, onZoomChange }) => {
  const handleZoomSelect = (value: string) => {
    if (value === 'fit') {
      onZoomChange(100);
      toast.success('تم ضبط الزوم على الملاءمة');
    } else {
      onZoomChange(parseInt(value));
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Input 
          type="number"
          value={zoom} 
          onChange={(e) => onZoomChange(Number(e.target.value))}
          placeholder="نسبة الزوم"
          className="rounded-full border-gray-300"
        />
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onZoomChange(100)}
          className="rounded-full border-gray-300 hover:bg-soabra-new-secondary-4"
        >
          إعادة تعيين
        </Button>
      </div>
      <select 
        className="w-full p-2 border border-gray-300 rounded-full font-arabic"
        onChange={(e) => handleZoomSelect(e.target.value)}
        value={zoom.toString()}
      >
        {ZOOM_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onZoomChange(Math.min(zoom + 25, 200))}
          className="rounded-full border-gray-300 hover:bg-soabra-new-secondary-1"
        >
          تكبير +
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onZoomChange(Math.max(zoom - 25, 25))}
          className="rounded-full border-gray-300 hover:bg-soabra-new-secondary-2"
        >
          تصغير -
        </Button>
      </div>
    </div>
  );
};

export default ZoomToolProps;