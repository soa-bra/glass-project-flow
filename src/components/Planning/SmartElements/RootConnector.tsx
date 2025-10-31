import React, { useState } from 'react';
import { Link2, Sparkles, X, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ConnectorPoint {
  elementId: string;
  x: number;
  y: number;
  anchorPoint: 'top' | 'right' | 'bottom' | 'left' | 'center';
}

interface RootConnectorData {
  id: string;
  startPoint: ConnectorPoint;
  endPoint: ConnectorPoint;
  title?: string;
  description?: string;
  color?: string;
  strokeWidth?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  aiSuggestion?: string;
}

interface RootConnectorProps {
  data: RootConnectorData;
  onUpdate?: (data: RootConnectorData) => void;
  onDelete?: () => void;
  onAISuggest?: (connector: RootConnectorData) => Promise<string>;
}

export const RootConnector: React.FC<RootConnectorProps> = ({
  data,
  onUpdate,
  onDelete,
  onAISuggest,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(data.title || '');
  const [editedDescription, setEditedDescription] = useState(data.description || '');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleSave = () => {
    onUpdate?.({
      ...data,
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleAISuggest = async () => {
    if (!onAISuggest) return;
    setIsLoadingAI(true);
    try {
      const suggestion = await onAISuggest(data);
      onUpdate?.({ ...data, aiSuggestion: suggestion });
    } catch (error) {
      console.error('AI suggestion failed:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // حساب موقع خط الربط
  const { startPoint, endPoint } = data;
  const startX = startPoint.x;
  const startY = startPoint.y;
  const endX = endPoint.x;
  const endY = endPoint.y;

  // حساب نقطة المنتصف لعرض المعلومات
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // حساب زاوية الخط
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  const strokeColor = data.color || 'hsl(var(--primary))';
  const strokeWidth = data.strokeWidth || 2;
  const strokeStyle = data.style || 'solid';

  const getStrokeDasharray = () => {
    switch (strokeStyle) {
      case 'dashed':
        return '10,5';
      case 'dotted':
        return '2,3';
      default:
        return 'none';
    }
  };

  return (
    <g className="root-connector">
      {/* خط الربط */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={getStrokeDasharray()}
        markerEnd="url(#arrowhead)"
        className="transition-all"
      />

      {/* رأس السهم */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill={strokeColor} />
        </marker>
      </defs>

      {/* نقطة البداية */}
      <circle
        cx={startX}
        cy={startY}
        r="6"
        fill={strokeColor}
        className="cursor-move hover:r-8 transition-all"
      />

      {/* نقطة النهاية */}
      <circle
        cx={endX}
        cy={endY}
        r="6"
        fill={strokeColor}
        className="cursor-move hover:r-8 transition-all"
      />

      {/* بطاقة المعلومات في المنتصف */}
      <foreignObject
        x={midX - 150}
        y={midY - 60}
        width="300"
        height="120"
        className="overflow-visible"
      >
        <div className="relative">
          {!isEditing ? (
            <div
              className="bg-card border border-border rounded-lg shadow-lg p-3"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  {data.title && (
                    <h4 className="font-semibold text-sm mb-1">{data.title}</h4>
                  )}
                  {data.description && (
                    <p className="text-xs text-muted-foreground">{data.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDelete}
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {data.aiSuggestion && (
                <div className="mt-2 p-2 bg-accent/10 rounded text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles className="h-3 w-3 text-accent" />
                    <span className="font-medium text-accent">اقتراح ذكي</span>
                  </div>
                  <p className="text-muted-foreground">{data.aiSuggestion}</p>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAISuggest}
                  disabled={isLoadingAI}
                  className="flex-1 text-xs h-7"
                >
                  <Sparkles className="h-3 w-3 ml-1" />
                  {isLoadingAI ? 'جاري التحليل...' : 'اقتراحات ذكية'}
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="bg-card border border-border rounded-lg shadow-lg p-3"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="space-y-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="عنوان الربط"
                  className="text-xs h-7"
                />
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="وصف توضيحي"
                  className="text-xs min-h-[50px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="flex-1 h-7 text-xs">
                    <Save className="h-3 w-3 ml-1" />
                    حفظ
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedTitle(data.title || '');
                      setEditedDescription(data.description || '');
                    }}
                    className="flex-1 h-7 text-xs"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
};

// مكون مساعد لإنشاء روابط جديدة
interface RootConnectorCreatorProps {
  onCreateConnector?: (startPoint: ConnectorPoint, endPoint: ConnectorPoint) => void;
}

export const RootConnectorCreator: React.FC<RootConnectorCreatorProps> = ({
  onCreateConnector,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [startPoint, setStartPoint] = useState<ConnectorPoint | null>(null);

  const handleCanvasClick = (e: React.MouseEvent<SVGElement>) => {
    if (!isCreating) return;

    const point: ConnectorPoint = {
      elementId: `temp-${Date.now()}`,
      x: e.clientX,
      y: e.clientY,
      anchorPoint: 'center',
    };

    if (!startPoint) {
      setStartPoint(point);
    } else {
      onCreateConnector?.(startPoint, point);
      setStartPoint(null);
      setIsCreating(false);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      <Button
        size="sm"
        variant={isCreating ? 'default' : 'outline'}
        onClick={() => {
          setIsCreating(!isCreating);
          setStartPoint(null);
        }}
      >
        <Link2 className="h-4 w-4 ml-2" />
        {isCreating ? 'جاري الربط...' : 'إنشاء رابط ذكي'}
      </Button>
      {isCreating && (
        <p className="text-xs text-muted-foreground mt-2">
          {!startPoint ? 'انقر على نقطة البداية' : 'انقر على نقطة النهاية'}
        </p>
      )}
      {isCreating && (
        <svg
          className="absolute inset-0 pointer-events-auto"
          onClick={handleCanvasClick}
          style={{ width: '100vw', height: '100vh' }}
        />
      )}
    </div>
  );
};
