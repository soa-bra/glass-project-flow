// Properties Panel Component
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SceneGraph } from '@/lib/canvas/utils/scene-graph';
import { Palette, Settings, Lock, Unlock, Copy, Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedElements: string[];
  sceneGraph: SceneGraph;
  onUpdate: (elementId: string, updates: any) => void;
  'data-test-id'?: string;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElements,
  sceneGraph,
  onUpdate,
  'data-test-id': testId
}) => {
  const selectedNode = selectedElements.length === 1 
    ? sceneGraph.getAllNodes().find(node => node.id === selectedElements[0])
    : null;

  if (selectedElements.length === 0) {
    return (
      <div className="p-4" data-test-id={testId}>
        <p className="text-muted-foreground text-center">
          لا توجد عناصر محددة
        </p>
      </div>
    );
  }

  if (selectedElements.length > 1) {
    return (
      <Card className="m-4" data-test-id={testId}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            عناصر متعددة ({selectedElements.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              نسخ
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              حذف
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedNode) return null;

  return (
    <div className="h-full overflow-y-auto" data-test-id={testId}>
      {/* Element Info */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4" />
            {selectedNode.metadata?.smartElementType || selectedNode.type}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Position */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">الموضع</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">X</Label>
                <Input
                  type="number"
                  value={selectedNode.transform.position.x}
                  onChange={(e) => onUpdate(selectedNode.id, {
                    transform: {
                      ...selectedNode.transform,
                      position: {
                        ...selectedNode.transform.position,
                        x: parseInt(e.target.value) || 0
                      }
                    }
                  })}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Y</Label>
                <Input
                  type="number"
                  value={selectedNode.transform.position.y}
                  onChange={(e) => onUpdate(selectedNode.id, {
                    transform: {
                      ...selectedNode.transform,
                      position: {
                        ...selectedNode.transform.position,
                        y: parseInt(e.target.value) || 0
                      }
                    }
                  })}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">الحجم</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">العرض</Label>
                <Input
                  type="number"
                  value={selectedNode.size.width}
                  onChange={(e) => onUpdate(selectedNode.id, {
                    size: {
                      ...selectedNode.size,
                      width: parseInt(e.target.value) || 100
                    }
                  })}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">الارتفاع</Label>
                <Input
                  type="number"
                  value={selectedNode.size.height}
                  onChange={(e) => onUpdate(selectedNode.id, {
                    size: {
                      ...selectedNode.size,
                      height: parseInt(e.target.value) || 100
                    }
                  })}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Styling */}
          <div className="space-y-2">
            <Label className="text-xs font-medium flex items-center gap-2">
              <Palette className="w-3 h-3" />
              التنسيق
            </Label>
            
            <div>
              <Label className="text-xs text-muted-foreground">لون التعبئة</Label>
              <Input
                type="color"
                value={selectedNode.style?.fill || '#ffffff'}
                onChange={(e) => onUpdate(selectedNode.id, {
                  style: {
                    ...selectedNode.style,
                    fill: e.target.value
                  }
                })}
                className="h-8 w-full"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">لون الحدود</Label>
              <Input
                type="color"
                value={selectedNode.style?.stroke || '#cccccc'}
                onChange={(e) => onUpdate(selectedNode.id, {
                  style: {
                    ...selectedNode.style,
                    stroke: e.target.value
                  }
                })}
                className="h-8 w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Content */}
          {(selectedNode.type === 'text' || selectedNode.type === 'sticky') && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">المحتوى</Label>
              <Input
                value={(selectedNode as any).content || ''}
                onChange={(e) => onUpdate(selectedNode.id, {
                  content: e.target.value
                })}
                placeholder="أدخل النص..."
                className="h-8 text-xs"
              />
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">إجراءات</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdate(selectedNode.id, {
                  metadata: {
                    ...selectedNode.metadata,
                    locked: !selectedNode.metadata?.locked
                  }
                })}
                className="h-8 text-xs"
              >
                {selectedNode.metadata?.locked ? (
                  <>
                    <Unlock className="w-3 h-3 mr-1" />
                    إلغاء القفل
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    قفل
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                نسخ
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full h-8 text-xs"
              onClick={() => {
                sceneGraph.removeNode?.(selectedNode.id);
              }}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              حذف العنصر
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesPanel;