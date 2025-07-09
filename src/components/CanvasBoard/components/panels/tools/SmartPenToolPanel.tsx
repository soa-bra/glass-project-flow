import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { PenTool, Square, Circle, Minus, Link, Eraser } from 'lucide-react';

interface SmartPenToolPanelProps {
  lineWidth: number;
  lineStyle: string;
  selectedPenMode: string;
  onLineWidthChange: (width: number) => void;
  onLineStyleChange: (style: string) => void;
  onPenModeSelect: (mode: string) => void;
}

export const SmartPenToolPanel: React.FC<SmartPenToolPanelProps> = ({
  lineWidth,
  lineStyle,
  selectedPenMode,
  onLineWidthChange,
  onLineStyleChange,
  onPenModeSelect
}) => {
  const penModes = [
    { id: 'smart-draw', icon: Square, label: 'رسم ذكي', description: 'يحول الأشكال إلى أشكال هندسية' },
    { id: 'group', icon: Circle, label: 'تجميع', description: 'رسم دائرة حول العناصر لتجميعها' },
    { id: 'erase', icon: Eraser, label: 'مسح', description: 'الخربشة فوق العناصر لحذفها' },
    { id: 'connect', icon: Link, label: 'ربط', description: 'رسم خط بين العناصر لربطها' },
    { id: 'free-draw', icon: Minus, label: 'رسم حر', description: 'رسم حر بدون تحويل ذكي' }
  ];

  const lineStyles = [
    { value: 'solid', label: 'مصمت' },
    { value: 'dashed', label: 'متقطع' },
    { value: 'dotted', label: 'نقاط' }
  ];

  return (
    <div className="space-y-4">
      {/* Current Mode Info */}
      <div className="bg-[#e9eff4] p-3 rounded-[16px]">
        <div className="flex items-center gap-2 mb-2">
          <PenTool className="w-4 h-4 text-[#96d8d0]" />
          <span className="text-sm font-medium font-arabic text-black">الوضع النشط</span>
        </div>
        <div className="text-sm font-arabic text-black">
          {penModes.find(mode => mode.id === selectedPenMode)?.label || 'رسم ذكي'}
        </div>
        <div className="text-xs text-black/70 mt-1">
          {penModes.find(mode => mode.id === selectedPenMode)?.description}
        </div>
      </div>

      {/* Smart Drawing Modes */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">أوضاع الرسم الذكي</h4>
        <div className="space-y-2">
          {penModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.id}
                onClick={() => onPenModeSelect(mode.id)}
                variant={selectedPenMode === mode.id ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start rounded-[12px] font-arabic ${
                  selectedPenMode === mode.id
                    ? 'bg-[#96d8d0] text-black hover:bg-[#96d8d0]/80 border-none'
                    : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <div className="text-left flex-1">
                  <div className="text-sm">{mode.label}</div>
                  <div className="text-xs opacity-70">{mode.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Line Width */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">سمك الخط</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-arabic text-black">السمك: {lineWidth}px</span>
            <div className="flex gap-2">
              {[1, 2, 4, 8, 12].map((width) => (
                <Button
                  key={width}
                  onClick={() => onLineWidthChange(width)}
                  variant={lineWidth === width ? "default" : "outline"}
                  size="sm"
                  className={`w-8 h-8 rounded-[8px] p-0 ${
                    lineWidth === width
                      ? 'bg-[#a4e2f6] text-black hover:bg-[#a4e2f6]/80 border-none'
                      : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
                  }`}
                >
                  {width}
                </Button>
              ))}
            </div>
          </div>
          <Slider
            value={[lineWidth]}
            onValueChange={(value) => onLineWidthChange(value[0])}
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Line Style */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">نمط الخط</h4>
        <div className="grid grid-cols-3 gap-2">
          {lineStyles.map((style) => (
            <Button
              key={style.value}
              onClick={() => onLineStyleChange(style.value)}
              variant={lineStyle === style.value ? "default" : "outline"}
              size="sm"
              className={`rounded-[12px] text-xs font-arabic ${
                lineStyle === style.value
                  ? 'bg-[#bdeed3] text-black hover:bg-[#bdeed3]/80 border-none'
                  : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
              }`}
            >
              {style.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Tips */}
      <div className="bg-[#fbe2aa]/30 p-3 rounded-[16px] border border-[#fbe2aa]/50">
        <div className="text-xs text-black font-arabic space-y-1">
          <div>🎨 الرسم الذكي يتعرف على الأشكال تلقائياً</div>
          <div>⭕ ارسم دائرة حول العناصر لتجميعها</div>
          <div>🗑️ اخربش فوق العناصر لحذفها</div>
          <div>🔗 ارسم خط بين العناصر لربطها</div>
        </div>
      </div>
    </div>
  );
};