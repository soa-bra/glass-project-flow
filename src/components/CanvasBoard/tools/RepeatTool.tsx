import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Copy, Grid, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface RepeatToolProps {
  elementId: string | null;
  selectedTool: string;
  onRepeat: (options: { 
    elementId: string;
    type: 'linear' | 'radial' | 'grid';
    count: number;
    spacing: number;
    direction?: 'horizontal' | 'vertical' | 'diagonal';
  }) => void;
}

export const RepeatTool: React.FC<RepeatToolProps> = ({ 
  elementId, 
  selectedTool, 
  onRepeat 
}) => {
  const [type, setType] = useState<'linear' | 'radial' | 'grid'>('linear');
  const [count, setCount] = useState<number>(3);
  const [spacing, setSpacing] = useState<number>(40);
  const [direction, setDirection] = useState<'horizontal' | 'vertical' | 'diagonal'>('horizontal');

  if (selectedTool !== 'repeat') return null;

  const repeatTypes = [
    {
      value: 'linear',
      label: 'خطي',
      description: 'نسخ في خط مستقيم',
      icon: Copy
    },
    {
      value: 'radial',
      label: 'دائري',
      description: 'نسخ في شكل دائري',
      icon: RotateCcw
    },
    {
      value: 'grid',
      label: 'شبكي',
      description: 'نسخ في شكل شبكة',
      icon: Grid
    }
  ];

  const directions = [
    { value: 'horizontal', label: 'أفقي' },
    { value: 'vertical', label: 'عمودي' },
    { value: 'diagonal', label: 'قطري' }
  ];

  const handleRepeat = () => {
    if (!elementId) {
      toast.error('يرجى تحديد عنصر أولاً');
      return;
    }

    if (count <= 1) {
      toast.error('يجب أن يكون عدد النسخ أكثر من 1');
      return;
    }

    if (spacing < 0) {
      toast.error('يجب أن تكون المسافة موجبة');
      return;
    }

    onRepeat({
      elementId,
      type,
      count,
      spacing,
      direction: type === 'linear' ? direction : undefined
    });

    toast.success(`تم إنشاء ${count} نسخة من العنصر`);
  };

  const getPreviewText = () => {
    switch (type) {
      case 'linear':
        return `${count} نسخة في اتجاه ${directions.find(d => d.value === direction)?.label} بمسافة ${spacing} بكسل`;
      case 'radial':
        return `${count} نسخة موزعة دائرياً بنصف قطر ${spacing} بكسل`;
      case 'grid':
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        return `${count} نسخة في شبكة ${rows}×${cols} بمسافة ${spacing} بكسل`;
      default:
        return '';
    }
  };

  return (
    <ToolPanelContainer title="تكرار العنصر">
      <div className="space-y-4">
        {!elementId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm font-arabic text-yellow-800">
              يرجى تحديد عنصر لتتمكن من تكراره
            </p>
          </div>
        )}

        {/* نوع التكرار */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">نوع التكرار</label>
          <div className="grid gap-2">
            {repeatTypes.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  onClick={() => setType(t.value as any)}
                  disabled={!elementId}
                  className={`p-3 rounded-lg border text-sm text-right font-arabic transition-colors disabled:opacity-50 ${
                    type === t.value 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t.label}</div>
                      <div className="text-xs opacity-80">{t.description}</div>
                    </div>
                    <Icon className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* الاتجاه للتكرار الخطي */}
        {type === 'linear' && (
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">الاتجاه</label>
            <div className="grid grid-cols-3 gap-2">
              {directions.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDirection(d.value as any)}
                  disabled={!elementId}
                  className={`p-2 rounded border text-xs font-arabic disabled:opacity-50 ${
                    direction === d.value 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* عدد النسخ */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">عدد النسخ</label>
          <Input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(2, Math.min(20, Number(e.target.value))))}
            min={2}
            max={20}
            disabled={!elementId}
            className="font-mono"
          />
          <p className="text-xs text-gray-500 mt-1 font-arabic">
            (من 2 إلى 20 نسخة)
          </p>
        </div>

        {/* المسافة */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">
            المسافة {type === 'radial' ? '(نصف القطر)' : '(بين النسخ)'}
          </label>
          <Input
            type="number"
            value={spacing}
            onChange={(e) => setSpacing(Math.max(0, Number(e.target.value)))}
            min={0}
            max={500}
            disabled={!elementId}
            className="font-mono"
          />
          <p className="text-xs text-gray-500 mt-1 font-arabic">
            بالبكسل (0-500)
          </p>
        </div>

        {/* معاينة */}
        {elementId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium font-arabic mb-1">معاينة:</h4>
            <p className="text-xs font-arabic text-blue-800">{getPreviewText()}</p>
          </div>
        )}

        {/* زر التنفيذ */}
        <Button 
          variant="default" 
          onClick={handleRepeat} 
          disabled={!elementId || count <= 1}
          className="w-full rounded-full"
        >
          <Copy className="w-4 h-4 mr-2" />
          تنفيذ التكرار
        </Button>
      </div>
    </ToolPanelContainer>
  );
};