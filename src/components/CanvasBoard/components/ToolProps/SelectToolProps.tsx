import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Scissors, Clipboard, Trash2 } from 'lucide-react';

interface SelectToolPropsProps {
  selectedElementId: string | null;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
}

const SelectToolProps: React.FC<SelectToolPropsProps> = ({
  selectedElementId,
  onCopy,
  onCut,
  onPaste,
  onDelete
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="الموقع X" type="number" className="rounded-full border-gray-300" />
        <Input placeholder="الموقع Y" type="number" className="rounded-full border-gray-300" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="العرض" type="number" className="rounded-full border-gray-300" />
        <Input placeholder="الارتفاع" type="number" className="rounded-full border-gray-300" />
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCut}
          disabled={!selectedElementId}
          title="قص"
          className="rounded-full border-gray-300 hover:bg-soabra-new-secondary-2"
        >
          <Scissors className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCopy}
          disabled={!selectedElementId}
          title="نسخ"
          className="rounded-full border-gray-300 hover:bg-soabra-new-secondary-1"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPaste}
          title="لصق"
          className="rounded-full border-gray-300 hover:bg-soabra-new-secondary-4"
        >
          <Clipboard className="w-4 h-4" />
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onDelete}
          disabled={!selectedElementId}
          title="حذف"
          className="rounded-full"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SelectToolProps;