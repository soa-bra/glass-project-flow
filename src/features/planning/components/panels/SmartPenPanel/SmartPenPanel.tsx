import React from 'react';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToolsStore } from '../../../store/tools.store';
import { Pen, Eraser } from 'lucide-react';

export const SmartPenPanel: React.FC = () => {
  const { updateToolOptions, getSmartPenOptions } = useToolsStore();
  const options = getSmartPenOptions();

  const handleStrokeWidthChange = (value: number[]) => {
    updateToolOptions('smart_pen', { strokeWidth: value[0] });
  };

  const handleColorChange = (color: string) => {
    updateToolOptions('smart_pen', { color });
  };

  const handleStyleChange = (style: string) => {
    updateToolOptions('smart_pen', { style });
  };

  const handleSmartConversionToggle = (enabled: boolean) => {
    updateToolOptions('smart_pen', { smartConversion: enabled });
  };

  const handleSensitivityChange = (value: number[]) => {
    updateToolOptions('smart_pen', { conversionSensitivity: value[0] });
  };

  const handleModeChange = (mode: string) => {
    updateToolOptions('smart_pen', { mode });
  };

  const colorOptions = [
    { value: 'hsl(var(--foreground))', label: 'أسود', color: '#000000' },
    { value: 'hsl(220, 14%, 96%)', label: 'رمادي فاتح', color: '#f8f9fa' },
    { value: 'hsl(220, 13%, 69%)', label: 'رمادي', color: '#6c757d' },
    { value: 'hsl(262, 83%, 58%)', label: 'بنفسجي', color: '#8b5cf6' },
    { value: 'hsl(221, 83%, 53%)', label: 'أزرق', color: '#3b82f6' },
    { value: 'hsl(142, 71%, 45%)', label: 'أخضر', color: '#10b981' },
    { value: 'hsl(38, 92%, 50%)', label: 'أصفر', color: '#f59e0b' },
    { value: 'hsl(0, 72%, 51%)', label: 'أحمر', color: '#ef4444' }
  ];

  return (
    <ToolPanelContainer title="القلم الذكي">
      <div className="space-y-4">
        {/* Drawing Mode */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">وضع الرسم</Label>
          <Select value={options.mode} onValueChange={handleModeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draw">رسم عادي</SelectItem>
              <SelectItem value="erase">مسح</SelectItem>
              <SelectItem value="smart">رسم ذكي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Stroke Width */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">سُمك الخط</Label>
            <span className="text-sm text-muted-foreground">{options.strokeWidth}px</span>
          </div>
          <Slider
            value={[options.strokeWidth]}
            onValueChange={handleStrokeWidthChange}
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Color Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">اللون</Label>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((colorOption) => (
              <Button
                key={colorOption.value}
                variant={options.color === colorOption.value ? "default" : "outline"}
                size="sm"
                className="h-8 p-2"
                onClick={() => handleColorChange(colorOption.value)}
                style={{
                  backgroundColor: options.color === colorOption.value ? colorOption.color : 'transparent',
                  borderColor: colorOption.color,
                  color: options.color === colorOption.value ? 'white' : colorOption.color
                }}
              >
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: colorOption.color }}
                />
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Line Style */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">نمط الخط</Label>
          <Select value={options.style} onValueChange={handleStyleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">متصل</SelectItem>
              <SelectItem value="dashed">متقطع</SelectItem>
              <SelectItem value="dotted">منقط</SelectItem>
              <SelectItem value="double">مزدوج</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Smart Conversion */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">التحويل الذكي</Label>
            <Switch
              checked={options.smartConversion}
              onCheckedChange={handleSmartConversionToggle}
            />
          </div>
          
          {options.smartConversion && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">حساسية التحويل</Label>
                <span className="text-xs text-muted-foreground">{options.conversionSensitivity}%</span>
              </div>
              <Slider
                value={[options.conversionSensitivity]}
                onValueChange={handleSensitivityChange}
                max={100}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleModeChange(options.mode === 'draw' ? 'erase' : 'draw')}
            className="flex items-center gap-2"
          >
            {options.mode === 'draw' ? <Eraser className="h-4 w-4" /> : <Pen className="h-4 w-4" />}
            {options.mode === 'draw' ? 'ممحاة' : 'قلم'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSmartConversionToggle(!options.smartConversion)}
            className="flex items-center gap-2"
          >
            ذكي: {options.smartConversion ? 'مُفعل' : 'مُعطل'}
          </Button>
        </div>
      </div>
    </ToolPanelContainer>
  );
};