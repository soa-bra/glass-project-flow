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
        <Input placeholder="الموقع X" type="number" />
        <Input placeholder="الموقع Y" type="number" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="العرض" type="number" />
        <Input placeholder="الارتفاع" type="number" />
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCut}
          disabled={!selectedElementId}
          title="قص"
        >
          <Scissors className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCopy}
          disabled={!selectedElementId}
          title="نسخ"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPaste}
          title="لصق"
        >
          <Clipboard className="w-4 h-4" />
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onDelete}
          disabled={!selectedElementId}
          title="حذف"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SelectToolProps;