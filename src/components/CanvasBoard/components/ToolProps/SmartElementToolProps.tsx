import React from 'react';
import { Button } from '@/components/ui/button';
import { SMART_ELEMENTS } from '../../constants';
import { toast } from 'sonner';

interface SmartElementToolPropsProps {
  selectedSmartElement: string;
  onSmartElementSelect: (elementId: string) => void;
}

const SmartElementToolProps: React.FC<SmartElementToolPropsProps> = ({ 
  selectedSmartElement,
  onSmartElementSelect 
}) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium font-arabic">العناصر الذكية</h4>
      <p className="text-xs text-gray-600 font-arabic">انقر واسحب على الكانفس لإنشاء العنصر</p>
      <div className="grid grid-cols-1 gap-2">
        {SMART_ELEMENTS.map((element) => {
          const Icon = element.icon;
          const isSelected = selectedSmartElement === element.id;
          return (
            <Button
              key={element.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`justify-start rounded-full ${
                isSelected 
                  ? 'bg-black text-white border-black' 
                  : 'border-gray-300 hover:bg-soabra-new-secondary-3'
              }`}
              onClick={() => {
                onSmartElementSelect(element.id);
                toast.success(`تم اختيار ${element.label} - انقر واسحب على الكانفس`);
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