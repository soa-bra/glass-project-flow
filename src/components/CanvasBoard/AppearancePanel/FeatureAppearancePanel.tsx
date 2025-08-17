import React, { useState, useEffect } from 'react';
import { toNumber } from '@/utils/canvasUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { 
  Palette, 
  Square, 
  Star, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Layers,
  Brush,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

import { FeatureColorPicker } from './ColorPicker/FeatureColorPicker';
import { FeatureBorderControls } from './BorderControls/FeatureBorderControls';
import { StylePresetsManager } from './StylePresets/StylePresetsManager';
import { SelectedElement, BorderStyle, StylePreset } from '@/types/canvas';


interface AppearancePanelProps {
  selectedElements?: SelectedElement[];
  onStyleUpdate?: (elementId: string, style: Record<string, any>) => void;
  onBulkStyleUpdate?: (elementIds: string[], style: Record<string, any>) => void;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export const FeatureAppearancePanel: React.FC<AppearancePanelProps> = ({
  selectedElements = [],
  onStyleUpdate,
  onBulkStyleUpdate,
  isVisible = true,
  onToggleVisibility
}) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [currentStyle, setCurrentStyle] = useState<any>({});
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [isApplyingToAll, setIsApplyingToAll] = useState(false);
  
  // Get common style properties from selected elements
  const getCommonStyle = () => {
    if (selectedElements.length === 0) return {};
    if (selectedElements.length === 1) return selectedElements[0].style || {};
    
    // Find common properties across all selected elements
    const commonStyle: Record<string, any> = {};
    const firstElementStyle = selectedElements[0].style || {};
    
    Object.keys(firstElementStyle).forEach(key => {
      const value = firstElementStyle[key];
      const isCommon = selectedElements.every(
        element => element.style?.[key] === value
      );
      
      if (isCommon) {
        commonStyle[key] = value;
      }
    });
    
    return commonStyle;
  };

  // Update current style when selected elements change
  useEffect(() => {
    setCurrentStyle(getCommonStyle());
  }, [selectedElements]);

  const handleStyleChange = (property: string, value: unknown) => {
    const newStyle = { ...currentStyle, [property]: value };
    setCurrentStyle(newStyle);
    
    if (selectedElements.length > 0) {
      if (isApplyingToAll && selectedElements.length > 1) {
        onBulkStyleUpdate?.(
          selectedElements.map(el => el.id),
          { [property]: value }
        );
      } else if (selectedElements.length === 1) {
        onStyleUpdate?.(selectedElements[0].id, { [property]: value });
      }
    }
  };

  const handleColorChange = (color: string) => {
    handleStyleChange('fill', color);
  };

  const handleBorderChange = (border: BorderStyle) => {
    handleStyleChange('stroke', border.color);
    handleStyleChange('strokeWidth', border.width);
    handleStyleChange('borderRadius', border.radius);
    handleStyleChange('opacity', toNumber(border.opacity, 100) / 100);
  };

  const handlePresetApply = (preset: StylePreset) => {
    const presetStyle = preset.style;
    setCurrentStyle(prev => ({ ...prev, ...presetStyle }));
    
    if (selectedElements.length > 0) {
      if (isApplyingToAll && selectedElements.length > 1) {
        onBulkStyleUpdate?.(
          selectedElements.map(el => el.id),
          presetStyle
        );
      } else if (selectedElements.length === 1) {
        onStyleUpdate?.(selectedElements[0].id, presetStyle);
      }
    }
  };

  const saveColorToPresets = (color: string) => {
    setSavedColors(prev => {
      const newColors = [color, ...prev.filter(c => c !== color)];
      return newColors.slice(0, 12);
    });
  };

  const toggleElementVisibility = (elementId: string) => {
    const element = selectedElements.find(el => el.id === elementId);
    if (element && onStyleUpdate) {
      onStyleUpdate(elementId, { 
        ...element.style, 
        opacity: element.isVisible ? 0 : 1 
      });
    }
  };

  const toggleElementLock = (elementId: string) => {
    // This would typically update the element's lock state in the parent component
    toast.info(`تم ${selectedElements.find(el => el.id === elementId)?.isLocked ? 'إلغاء قفل' : 'قفل'} العنصر`);
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleVisibility}
        className="fixed top-4 right-4 z-50"
      >
        <Palette className="w-4 h-4 mr-2" />
        لوحة المظهر
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-sm bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="w-5 h-5" />
            لوحة المظهر
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleVisibility}
              className="h-8 w-8 p-0"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Selected Elements Info */}
        {selectedElements.length > 0 && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {selectedElements.length === 1 
                  ? 'عنصر محدد' 
                  : `${selectedElements.length} عناصر محددة`
                }
              </span>
              
              {selectedElements.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsApplyingToAll(!isApplyingToAll)}
                  className={`h-6 text-xs ${isApplyingToAll ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  تطبيق على الكل
                </Button>
              )}
            </div>
            
            {/* Selected Elements List */}
            <div className="max-h-24 overflow-y-auto space-y-1">
              {selectedElements.map((element) => (
                <div key={element.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BaseBadge variant="secondary" className="text-xs">
                      {element.type}
                    </BaseBadge>
                    <span className="text-xs truncate max-w-20">
                      {element.name || element.id}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleElementVisibility(element.id)}
                      className="h-6 w-6 p-0"
                    >
                      {element.isVisible !== false ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleElementLock(element.id)}
                      className="h-6 w-6 p-0"
                    >
                      {element.isLocked ? (
                        <Lock className="w-3 h-3 text-red-500" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {selectedElements.length === 0 ? (
          // No Elements Selected State
          <div className="text-center py-8 text-gray-500">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">لا توجد عناصر محددة</p>
            <p className="text-xs">اختر عنصر لتعديل مظهره</p>
          </div>
        ) : (
          // Elements Selected - Show Controls
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="colors" className="flex items-center gap-1">
                <Brush className="w-4 h-4" />
                ألوان
              </TabsTrigger>
              <TabsTrigger value="borders" className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                حدود
              </TabsTrigger>
              <TabsTrigger value="presets" className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                أنماط
              </TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-4 mt-4">
              <FeatureColorPicker
                color={currentStyle.fill || '#000000'}
                onChange={handleColorChange}
                onSave={saveColorToPresets}
                savedColors={savedColors}
              />
            </TabsContent>

            {/* Borders Tab */}
            <TabsContent value="borders" className="space-y-4 mt-4">
              <FeatureBorderControls
                border={{
                  width: currentStyle.strokeWidth || 1,
                  color: currentStyle.stroke || '#000000',
                  style: 'solid',
                  radius: currentStyle.borderRadius || 0,
                  opacity: (currentStyle.opacity || 1) * 100
                }}
                onChange={handleBorderChange}
              />
            </TabsContent>

            {/* Presets Tab */}
            <TabsContent value="presets" className="space-y-4 mt-4">
              <StylePresetsManager
                currentStyle={currentStyle}
                onApplyPreset={handlePresetApply}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Quick Actions */}
        {selectedElements.length > 0 && (
          <div className="pt-4 border-t space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => {
                  // Copy style functionality
                  navigator.clipboard.writeText(JSON.stringify(currentStyle));
                  toast.success('تم نسخ النمط');
                }}
              >
                <Sparkles className="w-4 h-4" />
                نسخ النمط
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Reset style functionality
                  const resetStyle = {
                    fill: '#000000',
                    stroke: '#000000',
                    strokeWidth: 1,
                    borderRadius: 0,
                    opacity: 1
                  };
                  setCurrentStyle(resetStyle);
                  
                  if (selectedElements.length > 0) {
                    if (isApplyingToAll && selectedElements.length > 1) {
                      onBulkStyleUpdate?.(
                        selectedElements.map(el => el.id),
                        resetStyle
                      );
                    } else if (selectedElements.length === 1) {
                      onStyleUpdate?.(selectedElements[0].id, resetStyle);
                    }
                  }
                  
                  toast.success('تم إعادة تعيين النمط');
                }}
              >
                إعادة تعيين
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};