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
  sceneGraph: SceneGraph;
  selectedId: string;
  onPropertyChange: (id: string, patch: any) => void;
  onClose: () => void;
  'data-test-id'?: string;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  sceneGraph,
  selectedId,
  onPropertyChange,
  onClose,
  'data-test-id': testId
}) => {
  const selectedNode = sceneGraph.getAllNodes().find(node => node.id === selectedId);

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
                  onChange={(e) => onPropertyChange(selectedNode.id, {
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
                  onChange={(e) => onPropertyChange(selectedNode.id, {
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
                  onChange={(e) => onPropertyChange(selectedNode.id, {
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
                  onChange={(e) => onPropertyChange(selectedNode.id, {
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
                onChange={(e) => onPropertyChange(selectedNode.id, {
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
                onChange={(e) => onPropertyChange(selectedNode.id, {
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
                onChange={(e) => onPropertyChange(selectedNode.id, {
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
                onClick={() => onPropertyChange(selectedNode.id, {
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