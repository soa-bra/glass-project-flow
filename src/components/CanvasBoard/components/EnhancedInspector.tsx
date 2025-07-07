import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Settings,
  Type,
  Palette,
  Link,
  Calendar,
  Tag,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface EnhancedInspectorProps {
  selectedElement?: any;
  onElementUpdate?: (updates: any) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const EnhancedInspector: React.FC<EnhancedInspectorProps> = ({
  selectedElement,
  onElementUpdate,
  isExpanded = true,
  onToggle
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'style' | 'data'>('general');

  const renderGeneralTab = () => (
    <div className="space-y-4">
      {/* Content */}
      <div>
        <Label className="text-xs">المحتوى</Label>
        <Textarea
          value={selectedElement?.content || ''}
          onChange={(e) => onElementUpdate?.({ content: e.target.value })}
          className="mt-1 text-sm"
          rows={3}
        />
      </div>

      {/* Position */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">X</Label>
          <Input
            type="number"
            value={selectedElement?.position?.x || 0}
            onChange={(e) => onElementUpdate?.({
              position: { ...selectedElement?.position, x: parseInt(e.target.value) }
            })}
            className="mt-1 h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Y</Label>
          <Input
            type="number"
            value={selectedElement?.position?.y || 0}
            onChange={(e) => onElementUpdate?.({
              position: { ...selectedElement?.position, y: parseInt(e.target.value) }
            })}
            className="mt-1 h-8 text-xs"
          />
        </div>
      </div>

      {/* Size */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">العرض</Label>
          <Input
            type="number"
            value={selectedElement?.size?.width || 0}
            onChange={(e) => onElementUpdate?.({
              size: { ...selectedElement?.size, width: parseInt(e.target.value) }
            })}
            className="mt-1 h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">الارتفاع</Label>
          <Input
            type="number"
            value={selectedElement?.size?.height || 0}
            onChange={(e) => onElementUpdate?.({
              size: { ...selectedElement?.size, height: parseInt(e.target.value) }
            })}
            className="mt-1 h-8 text-xs"
          />
        </div>
      </div>

      {/* Rotation */}
      <div>
        <Label className="text-xs">الدوران (درجة)</Label>
        <Slider
          value={[selectedElement?.style?.rotation || 0]}
          onValueChange={([value]) => onElementUpdate?.({
            style: { ...selectedElement?.style, rotation: value }
          })}
          max={360}
          step={1}
          className="mt-2"
        />
      </div>
    </div>
  );

  const renderStyleTab = () => (
    <div className="space-y-4">
      {/* Colors */}
      <div>
        <Label className="text-xs">لون الخلفية</Label>
        <div className="flex gap-2 mt-1">
          {['#FFFFFF', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(color => (
            <div
              key={color}
              className="w-6 h-6 rounded border-2 border-gray-300 cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => onElementUpdate?.({
                style: { ...selectedElement?.style, backgroundColor: color }
              })}
            />
          ))}
        </div>
      </div>

      {/* Text Style */}
      {selectedElement?.type === 'text' && (
        <>
          <div>
            <Label className="text-xs">حجم الخط</Label>
            <Select
              value={selectedElement?.style?.fontSize || '16px'}
              onValueChange={(value) => onElementUpdate?.({
                style: { ...selectedElement?.style, fontSize: value }
              })}
            >
              <SelectTrigger className="mt-1 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12px">12px</SelectItem>
                <SelectItem value="14px">14px</SelectItem>
                <SelectItem value="16px">16px</SelectItem>
                <SelectItem value="18px">18px</SelectItem>
                <SelectItem value="20px">20px</SelectItem>
                <SelectItem value="24px">24px</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">لون النص</Label>
            <div className="flex gap-2 mt-1">
              {['#000000', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(color => (
                <div
                  key={color}
                  className="w-6 h-6 rounded border-2 border-gray-300 cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => onElementUpdate?.({
                    style: { ...selectedElement?.style, color: color }
                  })}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Border */}
      <div>
        <Label className="text-xs">عرض الحدود</Label>
        <Slider
          value={[selectedElement?.style?.borderWidth || 0]}
          onValueChange={([value]) => onElementUpdate?.({
            style: { ...selectedElement?.style, borderWidth: value }
          })}
          max={10}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Opacity */}
      <div>
        <Label className="text-xs">الشفافية</Label>
        <Slider
          value={[selectedElement?.style?.opacity || 100]}
          onValueChange={([value]) => onElementUpdate?.({
            style: { ...selectedElement?.style, opacity: value }
          })}
          max={100}
          step={1}
          className="mt-2"
        />
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-4">
      {/* Tags */}
      <div>
        <Label className="text-xs">العلامات</Label>
        <Input
          placeholder="أضف علامات مفصولة بفواصل"
          className="mt-1 text-sm"
        />
      </div>

      {/* Links */}
      <div>
        <Label className="text-xs">الروابط</Label>
        <Input
          placeholder="رابط خارجي"
          className="mt-1 text-sm"
        />
      </div>

      {/* Date */}
      <div>
        <Label className="text-xs">التاريخ</Label>
        <Input
          type="date"
          className="mt-1 text-sm"
        />
      </div>

      {/* Lock Element */}
      <div className="flex items-center justify-between">
        <Label className="text-xs">قفل العنصر</Label>
        <Switch
          checked={selectedElement?.locked || false}
          onCheckedChange={(checked) => onElementUpdate?.({ locked: checked })}
        />
      </div>

      {/* Visibility */}
      <div className="flex items-center justify-between">
        <Label className="text-xs">مرئي</Label>
        <Switch
          checked={selectedElement?.visible !== false}
          onCheckedChange={(checked) => onElementUpdate?.({ visible: checked })}
        />
      </div>
    </div>
  );

  if (!selectedElement) {
    return (
      <div className="fixed right-4 top-4 z-40 w-80">
        <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-300 rounded-[20px]">
          <CardContent className="p-6">
            <div className="text-center text-gray-500 py-8">
              <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <div className="text-sm">حدد عنصراً لعرض خصائصه</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-300 rounded-[20px] max-h-[calc(75vh-80px)] overflow-hidden">
        <CardHeader className="pb-3 cursor-pointer" onClick={onToggle}>
          <CardTitle className="text-base font-arabic flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              المفتش
            </div>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Element Info */}
            <div className="text-sm">
              <div className="font-medium text-gray-700">
                {selectedElement.type === 'text' ? 'عنصر نص' :
                 selectedElement.type === 'shape' ? 'شكل' :
                 selectedElement.type === 'sticky' ? 'ملاحظة لاصقة' :
                 'عنصر'}
              </div>
              <div className="text-xs text-gray-500">ID: {selectedElement.id}</div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                className={`flex-1 pb-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('general')}
              >
                عام
              </button>
              <button
                className={`flex-1 pb-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'style'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('style')}
              >
                التصميم
              </button>
              <button
                className={`flex-1 pb-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'data'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('data')}
              >
                البيانات
              </button>
            </div>

            {/* Tab Content */}
            <div className="overflow-y-auto max-h-80">
              {activeTab === 'general' && renderGeneralTab()}
              {activeTab === 'style' && renderStyleTab()}
              {activeTab === 'data' && renderDataTab()}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};