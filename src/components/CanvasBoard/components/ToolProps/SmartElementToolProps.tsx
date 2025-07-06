import React from 'react';
import { Button } from '@/components/ui/button';
import { SMART_ELEMENTS } from '../../constants';
import { toast } from 'sonner';

interface SmartElementToolPropsProps {
  onSmartElementSelect: (elementId: string) => void;
}

const SmartElementToolProps: React.FC<SmartElementToolPropsProps> = ({ 
  onSmartElementSelect 
}) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium font-arabic">العناصر الذكية</h4>
      <div className="grid grid-cols-1 gap-2">
        {SMART_ELEMENTS.map((element) => {
          const Icon = element.icon;
          return (
            <Button
              key={element.id}
              variant="outline"
              size="sm"
              className="justify-start hover:bg-blue-50"
              onClick={() => {
                onSmartElementSelect(element.id);
                toast.success(`تم اختيار ${element.label}`);
              }}
            >
              <Icon className="w-4 h-4 mr-2" />
              {element.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SmartElementToolProps;