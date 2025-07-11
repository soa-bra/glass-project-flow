import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Pencil, Square, Circle, Triangle, Hexagon, 
  Type, AlignLeft, AlignCenter, AlignRight,
  ZoomIn, ZoomOut, Grid3X3, Layers, Plus
} from 'lucide-react';
import { SMART_PEN_MODES, ZOOM_OPTIONS, GRID_SHAPES, GRID_SIZES, SMART_ELEMENTS } from '../constants';

interface ToolPanelsProps {
  toolPanels: {
    panels: any;
    openPanel: (tool: string, position?: { x: number; y: number }) => void;
    closePanel: (tool: string) => void;
    togglePanel: (tool: string, position?: { x: number; y: number }) => void;
    closeAllPanels: () => void;
    getPanelConfig: (tool: string) => any;
  };
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
}

export const ToolPanels: React.FC<ToolPanelsProps> = ({ 
  toolPanels, 
  selectedTool, 
  setSelectedTool 
}) => {
  
  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-tool-panel]')) {
        Object.keys(toolPanels.panels).forEach(tool => toolPanels.closePanel(tool));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [toolPanels]);
  
  const SmartPenPanel = ({ position }: { position: { x: number; y: number } }) => (
    <Card 
      data-tool-panel
      className="absolute bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 rounded-xl z-50"
      style={{ 
        left: position.x - 120, 
        top: position.y - 200,
        minWidth: '240px'
      }}
    >
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">أوضاع القلم الذكي</h3>
        <div className="space-y-2">
          {SMART_PEN_MODES.map((mode) => (
            <Button
              key={mode.id}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-right"
              onClick={() => {
                // Handle pen mode selection
                setSelectedTool('smart-pen');
                toolPanels.closePanel('smart-pen');
              }}
            >
              <Pencil className="w-4 h-4 ml-2" />
              <div>
                <div className="text-sm">{mode.label}</div>
                <div className="text-xs text-gray-500">{mode.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const ZoomPanel = ({ position }: { position: { x: number; y: number } }) => (
    <Card 
      className="absolute bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 rounded-xl z-50"
      style={{ 
        left: position.x - 80, 
        top: position.y - 150,
        minWidth: '160px'
      }}
    >
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">خيارات الزوم</h3>
        <div className="grid grid-cols-2 gap-2">
          {ZOOM_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              className="text-sm"
              onClick={() => {
                // Handle zoom selection
                setSelectedTool('zoom');
                toolPanels.closePanel('zoom');
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const GridPanel = ({ position }: { position: { x: number; y: number } }) => (
    <Card 
      className="absolute bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 rounded-xl z-50"
      style={{ 
        left: position.x - 120, 
        top: position.y - 180,
        minWidth: '240px'
      }}
    >
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">إعدادات الشبكة</h3>
        
        <div className="mb-4">
          <label className="text-xs text-gray-600 mb-2 block">شكل الشبكة</label>
          <div className="grid grid-cols-2 gap-2">
            {GRID_SHAPES.map((shape) => (
              <Button
                key={shape.id}
                variant="ghost"
                size="sm"
                className="text-sm"
              >
                {shape.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-600 mb-2 block">حجم الشبكة</label>
          <div className="grid grid-cols-3 gap-1">
            {GRID_SIZES.map((size) => (
              <Button
                key={size.value}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TextPanel = ({ position }: { position: { x: number; y: number } }) => (
    <Card 
      className="absolute bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 rounded-xl z-50"
      style={{ 
        left: position.x - 120, 
        top: position.y - 120,
        minWidth: '240px'
      }}
    >
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">خيارات النص</h3>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1">
              <AlignRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <AlignLeft className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1 text-xs">
              عنوان كبير
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 text-xs">
              عنوان صغير
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 text-xs">
              نص عادي
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ShapePanel = ({ position }: { position: { x: number; y: number } }) => (
    <Card 
      className="absolute bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 rounded-xl z-50"
      style={{ 
        left: position.x - 120, 
        top: position.y - 120,
        minWidth: '240px'
      }}
    >
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">الأشكال</h3>
        
        <div className="grid grid-cols-4 gap-2">
          <Button variant="ghost" size="sm" className="aspect-square">
            <Square className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="aspect-square">
            <Circle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="aspect-square">
            <Triangle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="aspect-square">
            <Hexagon className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SmartElementPanel = ({ position }: { position: { x: number; y: number } }) => (
    <Card 
      className="absolute bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 rounded-xl z-50"
      style={{ 
        left: position.x - 160, 
        top: position.y - 250,
        minWidth: '320px'
      }}
    >
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">العناصر الذكية</h3>
        <div className="space-y-2">
          {SMART_ELEMENTS.map((element) => {
            const Icon = element.icon;
            return (
              <Button
                key={element.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-right"
                onClick={() => {
                  setSelectedTool('smart-element');
                  toolPanels.closePanel('smart-element');
                }}
              >
                <Icon className="w-4 h-4 ml-2" />
                <div>
                  <div className="text-sm">{element.label}</div>
                  <div className="text-xs text-gray-500">{element.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const LayersPanel = ({ position }: { position: { x: number; y: number } }) => (
    <Card 
      className="absolute bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 rounded-xl z-50"
      style={{ 
        left: position.x - 120, 
        top: position.y - 150,
        minWidth: '240px'
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">الطبقات</h3>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
            <Layers className="w-4 h-4 text-gray-600" />
            <span className="text-sm flex-1">الطبقة الأساسية</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
            <Layers className="w-4 h-4 text-gray-600" />
            <span className="text-sm flex-1">طبقة النص</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
            <Layers className="w-4 h-4 text-gray-600" />
            <span className="text-sm flex-1">طبقة الأشكال</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {toolPanels.getPanelConfig('smart-pen')?.isOpen && (
        <SmartPenPanel position={toolPanels.getPanelConfig('smart-pen').position} />
      )}
      
      {toolPanels.getPanelConfig('zoom')?.isOpen && (
        <ZoomPanel position={toolPanels.getPanelConfig('zoom').position} />
      )}
      
      {toolPanels.getPanelConfig('grid')?.isOpen && (
        <GridPanel position={toolPanels.getPanelConfig('grid').position} />
      )}
      
      {toolPanels.getPanelConfig('text')?.isOpen && (
        <TextPanel position={toolPanels.getPanelConfig('text').position} />
      )}
      
      {toolPanels.getPanelConfig('shape')?.isOpen && (
        <ShapePanel position={toolPanels.getPanelConfig('shape').position} />
      )}
      
      {toolPanels.getPanelConfig('smart-element')?.isOpen && (
        <SmartElementPanel position={toolPanels.getPanelConfig('smart-element').position} />
      )}
      
      {toolPanels.getPanelConfig('layers')?.isOpen && (
        <LayersPanel position={toolPanels.getPanelConfig('layers').position} />
      )}
    </>
  );
};