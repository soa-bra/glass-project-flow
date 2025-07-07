import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Palette, Type, Box, Eye } from 'lucide-react';

interface PropertiesPanelProps {
  selectedElementId: string | null;
  element: any;
  onUpdate: (elementId: string, properties: any) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElementId,
  element,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'style' | 'position'>('general');

  if (!selectedElementId || !element) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-lg font-arabic flex items-center gap-2">
            <Settings className="w-5 h-5" />
            خصائص العنصر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 font-arabic py-8">
            حدد عنصراً لعرض خصائصه
          </div>
        </CardContent>
      </Card>
    );
  }

  const tabs = [
    { id: 'general', label: 'عام', icon: Settings },
    { id: 'style', label: 'التنسيق', icon: Palette },
    { id: 'position', label: 'الموضع', icon: Box }
  ];

  const handlePropertyChange = (property: string, value: any) => {
    onUpdate(selectedElementId, { [property]: value });
  };

  const renderGeneralTab = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium font-arabic mb-2 block">نوع العنصر</label>  
        <div className="bg-gray-50 p-2 rounded border text-sm font-arabic">
          {element.type}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium font-arabic mb-2 block">معرف العنصر</label>
        <Input
          value={element.id}
          readOnly
          className="font-mono text-xs"
        />
      </div>

      {element.content !== undefined && (
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">المحتوى</label>
          <Textarea
            value={element.content || ''}
            onChange={(e) => handlePropertyChange('content', e.target.value)}
            placeholder="محتوى العنصر..."
            className="font-arabic resize-none"
            rows={3}
          />
        </div>
      )}

      <div>
        <label className="text-sm font-medium font-arabic mb-2 block">اسم العنصر</label>
        <Input
          value={element.name || ''}
          onChange={(e) => handlePropertyChange('name', e.target.value)}
          placeholder="اسم العنصر..."
          className="font-arabic"
        />
      </div>
    </div>
  );

  const renderStyleTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">لون الخط</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={element.style?.color || '#000000'}
              onChange={(e) => handlePropertyChange('style', { ...element.style, color: e.target.value })}
              className="w-8 h-8 rounded border cursor-pointer"
            />
            <Input
              value={element.style?.color || '#000000'}
              onChange={(e) => handlePropertyChange('style', { ...element.style, color: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">لون الخلفية</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={element.style?.backgroundColor || '#ffffff'}
              onChange={(e) => handlePropertyChange('style', { ...element.style, backgroundColor: e.target.value })}
              className="w-8 h-8 rounded border cursor-pointer"
            />
            <Input
              value={element.style?.backgroundColor || '#ffffff'}
              onChange={(e) => handlePropertyChange('style', { ...element.style, backgroundColor: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium font-arabic mb-2 block">حجم الخط</label>
        <Select
          value={element.style?.fontSize || '14'}
          onValueChange={(value) => handlePropertyChange('style', { ...element.style, fontSize: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12px</SelectItem>
            <SelectItem value="14">14px</SelectItem>
            <SelectItem value="16">16px</SelectItem>
            <SelectItem value="18">18px</SelectItem>
            <SelectItem value="20">20px</SelectItem>
            <SelectItem value="24">24px</SelectItem>
            <SelectItem value="32">32px</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium font-arabic mb-2 block">وزن الخط</label>
        <Select
          value={element.style?.fontWeight || 'normal'}
          onValueChange={(value) => handlePropertyChange('style', { ...element.style, fontWeight: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">عادي</SelectItem>
            <SelectItem value="bold">عريض</SelectItem>
            <SelectItem value="lighter">خفيف</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium font-arabic mb-2 block">الشفافية</label>
        <Input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={element.style?.opacity || 1}
          onChange={(e) => handlePropertyChange('style', { ...element.style, opacity: Number(e.target.value) })}
        />
        <div className="text-xs text-gray-500 text-center mt-1">
          {Math.round((element.style?.opacity || 1) * 100)}%
        </div>
      </div>
    </div>
  );

  const renderPositionTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">الموضع X</label>
          <Input
            type="number"
            value={element.position?.x || 0}
            onChange={(e) => handlePropertyChange('position', { ...element.position, x: Number(e.target.value) })}
            className="font-mono"
          />
        </div>
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">الموضع Y</label>
          <Input
            type="number"
            value={element.position?.y || 0}
            onChange={(e) => handlePropertyChange('position', { ...element.position, y: Number(e.target.value) })}
            className="font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">العرض</label>
          <Input
            type="number"
            value={element.size?.width || 100}
            onChange={(e) => handlePropertyChange('size', { ...element.size, width: Number(e.target.value) })}
            className="font-mono"
          />
        </div>
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">الارتفاع</label>
          <Input
            type="number"
            value={element.size?.height || 100}
            onChange={(e) => handlePropertyChange('size', { ...element.size, height: Number(e.target.value) })}
            className="font-mono"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium font-arabic mb-2 block">الدوران (درجة)</label>
        <Input
          type="number"
          value={element.rotation || 0}
          onChange={(e) => handlePropertyChange('rotation', Number(e.target.value))}
          min="0"
          max="360"
          className="font-mono"
        />
      </div>

      <div>
        <label className="text-sm font-medium font-arabic mb-2 block">ترتيب الطبقة</label>
        <Input
          type="number"
          value={element.zIndex || 0}
          onChange={(e) => handlePropertyChange('zIndex', Number(e.target.value))}
          className="font-mono"
        />
      </div>
    </div>
  );

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Settings className="w-5 h-5" />
          خصائص العنصر
        </CardTitle>
        
        {/* علامات التبويب */}
        <div className="flex gap-1 mt-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 p-2 rounded text-sm font-arabic transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </CardHeader>
      
      <CardContent>
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'style' && renderStyleTab()}
        {activeTab === 'position' && renderPositionTab()}
      </CardContent>
    </Card>
  );
};