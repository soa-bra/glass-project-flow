import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { smartElementsRegistry, SmartElementDefinition } from '@/apps/brain/plugins/smart-elements/smart-elements-registry';
import { SmartElementSettingsForm } from './smart-element-settings-form';
import { useDirection } from '../../contexts/direction-context';
import { DirectionalIcon } from '../ui/directional-icon';
import { Settings, Grid, Layers } from 'lucide-react';

export type SmartElementType = string;

export interface SmartElementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onElementSelect: (elementType: SmartElementType, initialState?: any) => void;
  selectedElementType?: SmartElementType;
  selectedElementId?: string | null;
  selectedElementSettings?: Record<string, any>;
  onSettingsChange?: (elementId: string, settings: Record<string, any>) => void;
  registry?: any;
  className?: string;
  'data-test-id'?: string;
}

export function SmartElementsPanel({ 
  isOpen,
  onClose,
  onElementSelect,
  selectedElementType,
  selectedElementId,
  selectedElementSettings = {},
  onSettingsChange,
  registry,
  className,
  'data-test-id': testId
}: SmartElementsPanelProps) {
  const { direction } = useDirection();
  const [availableElements, setAvailableElements] = useState<SmartElementDefinition[]>([]);
  const [selectedElement, setSelectedElement] = useState<SmartElementDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<string>('elements');

  // Load available smart elements
  useEffect(() => {
    const elements = smartElementsRegistry.getAllSmartElements();
    setAvailableElements(elements);
  }, []);

  // Update selected element when selectedElementType changes
  useEffect(() => {
    if (selectedElementType) {
      const element = smartElementsRegistry.getSmartElement(selectedElementType);
      setSelectedElement(element || null);
      setActiveTab('settings');
    } else {
      setSelectedElement(null);
    }
  }, [selectedElementType]);

  // Group elements by category
  const elementsByCategory = availableElements.reduce((acc, element) => {
    if (!acc[element.category]) {
      acc[element.category] = [];
    }
    acc[element.category].push(element);
    return acc;
  }, {} as Record<string, SmartElementDefinition[]>);

  const categoryLabels: Record<string, string> = {
    basic: 'أساسية',
    project: 'إدارة المشاريع',
    data: 'البيانات',
    social: 'التفاعل الاجتماعي',
    finance: 'المالية',
    analytics: 'التحليلات'
  };

  const handleElementClick = (elementType: string) => {
    const element = smartElementsRegistry.getSmartElement(elementType);
    if (element) {
      setSelectedElement(element);
      onElementSelect(elementType);
    }
  };

  // Handle Esc key for closing
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleSettingsSubmit = (settings: Record<string, any>) => {
    if (selectedElementId && onSettingsChange) {
      onSettingsChange(selectedElementId, settings);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className={`h-full flex flex-col ${className}`} data-test-id={testId}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <DirectionalIcon 
            icon={Layers} 
            className="w-5 h-5 text-primary" 
          />
          العناصر الذكية
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="mr-auto w-8 h-8 p-0"
            data-test-id="btn-close-panel"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mx-4 mb-2 grid w-auto grid-cols-2">
            <TabsTrigger value="elements" className="flex items-center gap-2 text-xs">
              <Grid className="w-4 h-4" />
              العناصر
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 text-xs"
              disabled={!selectedElement}
            >
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Elements Grid */}
          <TabsContent value="elements" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4 pb-4">
                {Object.entries(elementsByCategory).map(([category, elements]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        {categoryLabels[category] || category}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {elements.length}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {elements.map((element) => (
                        <Button
                          key={element.type}
                          variant={selectedElement?.type === element.type ? "default" : "outline"}
                          className="h-auto p-3 flex flex-col gap-2 text-xs"
                          onClick={() => handleElementClick(element.type)}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10">
                            {element.icon}
                          </div>
                          <span className="truncate w-full">{element.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
                
                {availableElements.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>لا توجد عناصر ذكية متاحة</p>
                    <p className="text-xs mt-1">تحقق من تسجيل العناصر</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Settings Panel */}
          <TabsContent value="settings" className="flex-1 overflow-hidden mt-0">
            <div className="px-4 h-full">
              {selectedElement ? (
                <div className="space-y-4 h-full flex flex-col">
                  {/* Element Info */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedElement.icon}
                      <span className="font-medium text-sm">{selectedElement.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {categoryLabels[selectedElement.category] || selectedElement.category}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Settings Form */}
                  <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      <SmartElementSettingsForm
                        schema={selectedElement.settingsSchema}
                        values={selectedElementSettings}
                        onSubmit={handleSettingsSubmit}
                        disabled={!selectedElementId}
                      />
                    </ScrollArea>
                  </div>

                  {/* Shortcut Info */}
                  <div className="bg-muted/30 rounded p-2 text-xs text-muted-foreground text-center">
                    اختصار: اضغط <Badge variant="secondary" className="mx-1">S</Badge> للتفعيل
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                  <Settings className="w-12 h-12 mb-2 opacity-50" />
                  <p>اختر عنصراً لعرض إعداداته</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}