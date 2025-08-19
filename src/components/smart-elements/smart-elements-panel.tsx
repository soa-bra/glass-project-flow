import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { smartElementsRegistry, SmartElementDefinition } from '../../lib/smart-elements/smart-elements-registry';
import { useDirection } from '../../contexts/direction-context';
import { DirectionalIcon } from '../ui/directional-icon';
import { Layers } from 'lucide-react';

export type SmartElementType = string;

export interface SmartElementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onElementSelect: (type: string, initialState?: any) => void;
  'data-test-id'?: string;
}

export function SmartElementsPanel({ 
  isOpen,
  onClose,
  onElementSelect,
  'data-test-id': testId
}: SmartElementsPanelProps) {
  const { direction } = useDirection();
  const [availableElements, setAvailableElements] = useState<SmartElementDefinition[]>([]);
  const [selectedElement, setSelectedElement] = useState<SmartElementDefinition | null>(null);

  // Load available smart elements
  useEffect(() => {
    const elements = smartElementsRegistry.getAllSmartElements();
    setAvailableElements(elements);
  }, []);

  // Update selected element when clicking
  const handleElementClick = (elementType: string) => {
    const element = smartElementsRegistry.getSmartElement(elementType);
    if (element) {
      setSelectedElement(element);
      onElementSelect(elementType);
    }
  };

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

  if (!isOpen) return null;

  return (
    <Card className="h-full flex flex-col" data-test-id={testId}>
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
        <div className="flex-1 overflow-hidden">
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
        </div>
      </CardContent>
    </Card>
  );
}