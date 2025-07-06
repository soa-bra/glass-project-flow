import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Settings, Grid, Zap, Users, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AdvancedCanvasSettingsProps {
  selectedTool: string;
  settings: {
    gridSize: number;
    snapEnabled: boolean;
    autoSave: boolean;
    collaborationMode: boolean;
    showElementBounds: boolean;
    enableAnimations: boolean;
    maxHistory: number;
    backgroundType: 'grid' | 'dots' | 'lines' | 'blank';
  };
  onSettingsChange: (settings: any) => void;
}

export const AdvancedCanvasSettings: React.FC<AdvancedCanvasSettingsProps> = ({ 
  selectedTool, 
  settings,
  onSettingsChange 
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  if (selectedTool !== 'canvas-settings') return null;

  const backgroundTypes = [
    { value: 'grid', label: 'شبكة', description: 'خطوط شبكة منتظمة' },
    { value: 'dots', label: 'نقاط', description: 'نقاط موزعة بانتظام' },
    { value: 'lines', label: 'خطوط', description: 'خطوط أفقية وعمودية' },
    { value: 'blank', label: 'فارغ', description: 'خلفية بيضاء فقط' }
  ];

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
  };

  const saveSettings = () => {
    onSettingsChange(localSettings);
    toast.success('تم حفظ الإعدادات');
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      gridSize: 20,
      snapEnabled: true,
      autoSave: true,
      collaborationMode: true,
      showElementBounds: false,
      enableAnimations: true,
      maxHistory: 50,
      backgroundType: 'grid' as 'grid' | 'dots' | 'lines' | 'blank'
    };
    setLocalSettings(defaultSettings);
    toast.info('تم إعادة تعيين الإعدادات للقيم الافتراضية');
  };

  return (
    <ToolPanelContainer title="إعدادات الكانفس المتقدمة">
      <div className="space-y-4">
        {/* إعدادات الشبكة */}
        <div className="space-y-3">
          <h4 className="flex items-center text-sm font-medium font-arabic">
            <Grid className="w-4 h-4 mr-2" />
            إعدادات الشبكة
          </h4>
          
          <div className="space-y-3 pl-4">
            <div>
              <label className="text-sm font-arabic mb-1 block">حجم الشبكة (بكسل)</label>
              <Input
                type="number"
                value={localSettings.gridSize}
                onChange={(e) => handleSettingChange('gridSize', Number(e.target.value))}
                min={10}
                max={50}
                className="font-mono"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-arabic">تفعيل الجذب للشبكة</label>
              <Switch
                checked={localSettings.snapEnabled}
                onCheckedChange={(checked) => handleSettingChange('snapEnabled', checked)}
              />
            </div>

            <div>
              <label className="text-sm font-arabic mb-1 block">نوع الخلفية</label>
              <Select
                value={localSettings.backgroundType}
                onValueChange={(value) => handleSettingChange('backgroundType', value)}
              >
                <SelectTrigger className="font-arabic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {backgroundTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="text-right">
                        <div className="font-arabic">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* إعدادات التعاون */}
        <div className="space-y-3">
          <h4 className="flex items-center text-sm font-medium font-arabic">
            <Users className="w-4 h-4 mr-2" />
            إعدادات التعاون
          </h4>
          
          <div className="space-y-3 pl-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-arabic">وضع التعاون المباشر</label>
              <Switch
                checked={localSettings.collaborationMode}
                onCheckedChange={(checked) => handleSettingChange('collaborationMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-arabic">الحفظ التلقائي</label>
              <Switch
                checked={localSettings.autoSave}
                onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
              />
            </div>
          </div>
        </div>

        {/* إعدادات العرض */}
        <div className="space-y-3">
          <h4 className="flex items-center text-sm font-medium font-arabic">
            <Zap className="w-4 h-4 mr-2" />
            إعدادات العرض
          </h4>
          
          <div className="space-y-3 pl-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-arabic">إظهار حدود العناصر</label>
              <Switch
                checked={localSettings.showElementBounds}
                onCheckedChange={(checked) => handleSettingChange('showElementBounds', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-arabic">تفعيل الحركات المتحركة</label>
              <Switch
                checked={localSettings.enableAnimations}
                onCheckedChange={(checked) => handleSettingChange('enableAnimations', checked)}
              />
            </div>

            <div>
              <label className="text-sm font-arabic mb-1 block">حد أقصى للتاريخ</label>
              <Input
                type="number"
                value={localSettings.maxHistory}
                onChange={(e) => handleSettingChange('maxHistory', Number(e.target.value))}
                min={10}
                max={100}
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1 font-arabic">
                عدد العمليات التي يمكن التراجع عنها
              </p>
            </div>
          </div>
        </div>

        {/* معاينة الإعدادات */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h4 className="text-sm font-medium font-arabic mb-2">📋 ملخص الإعدادات</h4>
          <div className="text-xs font-arabic space-y-1 text-gray-600">
            <div>حجم الشبكة: {localSettings.gridSize} بكسل</div>
            <div>الجذب: {localSettings.snapEnabled ? 'مفعل' : 'معطل'}</div>
            <div>التعاون: {localSettings.collaborationMode ? 'مفعل' : 'معطل'}</div>
            <div>الحفظ التلقائي: {localSettings.autoSave ? 'مفعل' : 'معطل'}</div>
            <div>نوع الخلفية: {backgroundTypes.find(t => t.value === localSettings.backgroundType)?.label}</div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex gap-2">
          <Button 
            onClick={saveSettings}
            className="flex-1 rounded-full"
          >
            <Save className="w-4 h-4 mr-2" />
            حفظ
          </Button>
          
          <Button 
            onClick={resetToDefaults}
            variant="outline"
            className="flex-1 rounded-full"
          >
            <Settings className="w-4 h-4 mr-2" />
            إعادة تعيين
          </Button>
        </div>
      </div>
    </ToolPanelContainer>
  );
};