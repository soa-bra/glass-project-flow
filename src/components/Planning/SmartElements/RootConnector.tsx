import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link2, Sparkles, X, Edit2, Save, ArrowRight, Wand2, Plus, Trash2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ============= Types =============
export type AnchorPosition = 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export interface ConnectorPoint {
  elementId: string;
  x: number;
  y: number;
  anchorPoint: AnchorPosition;
}

export interface AISuggestion {
  id: string;
  type: 'component' | 'connector' | 'action';
  title: string;
  description: string;
  confidence: number;
  data?: any;
}

export interface RootConnectorData {
  id: string;
  startPoint: ConnectorPoint;
  endPoint: ConnectorPoint;
  title?: string;
  description?: string;
  color?: string;
  strokeWidth?: number;
  style?: 'solid' | 'dashed' | 'dotted' | 'animated';
  connectionType?: 'component-component' | 'component-frame' | 'frame-frame' | 'part-part';
  aiSuggestions?: AISuggestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RootConnectorProps {
  data: RootConnectorData;
  isSelected?: boolean;
  onUpdate?: (data: RootConnectorData) => void;
  onDelete?: () => void;
  onAISuggest?: (connector: RootConnectorData) => Promise<AISuggestion[]>;
  onInsertSuggestion?: (suggestion: AISuggestion) => void;
}

// ============= Connection Anchors Component =============
interface ConnectionAnchorsProps {
  elementId: string;
  bounds: { x: number; y: number; width: number; height: number };
  onStartDrag: (point: ConnectorPoint) => void;
  onEndDrag: (point: ConnectorPoint) => void;
  isConnecting?: boolean;
  activeAnchor?: AnchorPosition;
}

export const ConnectionAnchors: React.FC<ConnectionAnchorsProps> = ({
  elementId,
  bounds,
  onStartDrag,
  onEndDrag,
  isConnecting,
  activeAnchor,
}) => {
  const anchors: { position: AnchorPosition; x: number; y: number }[] = [
    { position: 'top', x: bounds.x + bounds.width / 2, y: bounds.y },
    { position: 'right', x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 },
    { position: 'bottom', x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height },
    { position: 'left', x: bounds.x, y: bounds.y + bounds.height / 2 },
    { position: 'top-left', x: bounds.x, y: bounds.y },
    { position: 'top-right', x: bounds.x + bounds.width, y: bounds.y },
    { position: 'bottom-left', x: bounds.x, y: bounds.y + bounds.height },
    { position: 'bottom-right', x: bounds.x + bounds.width, y: bounds.y + bounds.height },
    { position: 'center', x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 },
  ];

  return (
    <g className="connection-anchors">
      {anchors.map((anchor) => (
        <motion.circle
          key={anchor.position}
          cx={anchor.x}
          cy={anchor.y}
          r={isConnecting && activeAnchor === anchor.position ? 10 : 6}
          fill={activeAnchor === anchor.position ? 'hsl(var(--primary))' : 'hsl(var(--background))'}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className="cursor-crosshair"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: isConnecting ? 1 : 0.7,
          }}
          whileHover={{ scale: 1.3, opacity: 1 }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartDrag({
              elementId,
              x: anchor.x,
              y: anchor.y,
              anchorPoint: anchor.position,
            });
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            if (isConnecting) {
              onEndDrag({
                elementId,
                x: anchor.x,
                y: anchor.y,
                anchorPoint: anchor.position,
              });
            }
          }}
        />
      ))}
    </g>
  );
};

// ============= Floating Panel Component =============
interface FloatingPanelProps {
  x: number;
  y: number;
  data: RootConnectorData;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (title: string, description: string) => void;
  onCancel: () => void;
  onDelete: () => void;
  onAISuggest: () => void;
  onInsertSuggestion: (suggestion: AISuggestion) => void;
  isLoadingAI: boolean;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  x,
  y,
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onAISuggest,
  onInsertSuggestion,
  isLoadingAI,
}) => {
  const [editedTitle, setEditedTitle] = useState(data.title || '');
  const [editedDescription, setEditedDescription] = useState(data.description || '');

  useEffect(() => {
    setEditedTitle(data.title || '');
    setEditedDescription(data.description || '');
  }, [data.title, data.description]);

  const getConnectionTypeLabel = (type?: string) => {
    switch (type) {
      case 'component-component': return 'مكون ↔ مكون';
      case 'component-frame': return 'مكون ↔ إطار';
      case 'frame-frame': return 'إطار ↔ إطار';
      case 'part-part': return 'جزء ↔ جزء';
      default: return 'رابط';
    }
  };

  return (
    <foreignObject
      x={x - 180}
      y={y - 100}
      width="360"
      height="auto"
      className="overflow-visible"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-xl p-4"
        dir="rtl"
      >
        {!isEditing ? (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Link2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {data.title || 'رابط ذكي'}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {getConnectionTypeLabel(data.connectionType)}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onEdit}
                  className="h-7 w-7 p-0"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Description */}
            {data.description && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {data.description}
              </p>
            )}

            {/* AI Suggestions */}
            {data.aiSuggestions && data.aiSuggestions.length > 0 && (
              <div className="space-y-2 p-3 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm text-primary">اقتراحات ذكية</span>
                </div>
                {data.aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center justify-between gap-2 p-2 bg-background/80 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{suggestion.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {suggestion.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-primary font-medium">
                        {Math.round(suggestion.confidence * 100)}%
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onInsertSuggestion(suggestion)}
                        className="h-6 w-6 p-0 text-primary hover:text-primary"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onAISuggest}
                disabled={isLoadingAI}
                className="flex-1 text-xs h-8 gap-1.5"
              >
                {isLoadingAI ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </motion.div>
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    تحليل AI
                  </>
                )}
              </Button>
              {data.aiSuggestions && data.aiSuggestions.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => data.aiSuggestions?.forEach(onInsertSuggestion)}
                  className="flex-1 text-xs h-8 gap-1.5 bg-gradient-to-r from-primary to-accent"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  تحويل الكل
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">تحرير الرابط</span>
            </div>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="عنوان الرابط"
              className="text-sm h-9"
            />
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="تعليق توضيحي..."
              className="text-sm min-h-[80px] resize-none"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onSave(editedTitle, editedDescription)}
                className="flex-1 h-8 text-xs gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                حفظ
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onCancel}
                className="flex-1 h-8 text-xs"
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </foreignObject>
  );
};

// ============= Main RootConnector Component =============
export const RootConnector: React.FC<RootConnectorProps> = ({
  data,
  isSelected = false,
  onUpdate,
  onDelete,
  onAISuggest,
  onInsertSuggestion,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleSave = (title: string, description: string) => {
    onUpdate?.({
      ...data,
      title,
      description,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleAISuggest = async () => {
    if (!onAISuggest) return;
    setIsLoadingAI(true);
    try {
      const suggestions = await onAISuggest(data);
      onUpdate?.({ 
        ...data, 
        aiSuggestions: suggestions,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('AI suggestion failed:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleInsertSuggestion = (suggestion: AISuggestion) => {
    onInsertSuggestion?.(suggestion);
    // Remove the inserted suggestion from the list
    if (data.aiSuggestions) {
      onUpdate?.({
        ...data,
        aiSuggestions: data.aiSuggestions.filter(s => s.id !== suggestion.id),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Calculate connector path
  const { startPoint, endPoint } = data;
  const startX = startPoint.x;
  const startY = startPoint.y;
  const endX = endPoint.x;
  const endY = endPoint.y;

  // Calculate midpoint for info panel
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // Calculate control points for curved path
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const curvature = Math.min(distance * 0.3, 100);

  // Determine curve direction based on anchor points
  let cp1x = startX, cp1y = startY, cp2x = endX, cp2y = endY;
  
  if (startPoint.anchorPoint === 'right' || startPoint.anchorPoint === 'left') {
    cp1x = startX + (startPoint.anchorPoint === 'right' ? curvature : -curvature);
  } else {
    cp1y = startY + (startPoint.anchorPoint === 'bottom' ? curvature : -curvature);
  }

  if (endPoint.anchorPoint === 'right' || endPoint.anchorPoint === 'left') {
    cp2x = endX + (endPoint.anchorPoint === 'right' ? curvature : -curvature);
  } else {
    cp2y = endY + (endPoint.anchorPoint === 'bottom' ? curvature : -curvature);
  }

  const pathD = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

  const strokeColor = data.color || 'hsl(var(--primary))';
  const strokeWidth = data.strokeWidth || 2;
  const strokeStyle = data.style || 'solid';

  const getStrokeDasharray = () => {
    switch (strokeStyle) {
      case 'dashed': return '10,5';
      case 'dotted': return '2,3';
      case 'animated': return '10,5';
      default: return 'none';
    }
  };

  const markerId = `arrowhead-${data.id}`;

  return (
    <g 
      className="root-connector"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Arrow marker definition */}
      <defs>
        <marker
          id={markerId}
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
        >
          <path d="M0,0 L12,6 L0,12 L3,6 Z" fill={strokeColor} />
        </marker>
        
        {/* Glow filter for selected state */}
        <filter id={`glow-${data.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Invisible hit area for easier selection */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer"
        pointerEvents="stroke"
      />

      {/* Main connector path */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isSelected || isHovered ? strokeWidth + 1 : strokeWidth}
        strokeDasharray={getStrokeDasharray()}
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
        filter={isSelected ? `url(#glow-${data.id})` : undefined}
        initial={false}
        animate={{
          strokeDashoffset: strokeStyle === 'animated' ? [0, -30] : 0,
        }}
        transition={{
          strokeDashoffset: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      />

      {/* Start point */}
      <motion.circle
        cx={startX}
        cy={startY}
        r={isHovered || isSelected ? 8 : 6}
        fill="hsl(var(--background))"
        stroke={strokeColor}
        strokeWidth={2}
        className="cursor-move"
        whileHover={{ scale: 1.2 }}
      />

      {/* End point */}
      <motion.circle
        cx={endX}
        cy={endY}
        r={isHovered || isSelected ? 8 : 6}
        fill={strokeColor}
        stroke="hsl(var(--background))"
        strokeWidth={2}
        className="cursor-move"
        whileHover={{ scale: 1.2 }}
      />

      {/* Connection type indicator at midpoint */}
      {(isHovered || isSelected) && !isEditing && (
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <circle
            cx={midX}
            cy={midY}
            r={14}
            fill="hsl(var(--background))"
            stroke={strokeColor}
            strokeWidth={2}
          />
          <Link2
            x={midX - 7}
            y={midY - 7}
            width={14}
            height={14}
            className="text-primary"
          />
        </motion.g>
      )}

      {/* Floating info panel */}
      <AnimatePresence>
        {(isSelected || isEditing) && (
          <FloatingPanel
            x={midX}
            y={midY + 40}
            data={data}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
            }}
            onDelete={() => onDelete?.()}
            onAISuggest={handleAISuggest}
            onInsertSuggestion={handleInsertSuggestion}
            isLoadingAI={isLoadingAI}
          />
        )}
      </AnimatePresence>
    </g>
  );
};

// ============= Connector Creator Component =============
interface RootConnectorCreatorProps {
  onCreateConnector?: (startPoint: ConnectorPoint, endPoint: ConnectorPoint, connectionType: RootConnectorData['connectionType']) => void;
  isActive?: boolean;
  onToggle?: () => void;
}

export const RootConnectorCreator: React.FC<RootConnectorCreatorProps> = ({
  onCreateConnector,
  isActive = false,
  onToggle,
}) => {
  const [startPoint, setStartPoint] = useState<ConnectorPoint | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);
  const [connectionType, setConnectionType] = useState<RootConnectorData['connectionType']>('component-component');
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isActive && startPoint) {
      setCurrentPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isActive, startPoint]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!isActive) return;

    const point: ConnectorPoint = {
      elementId: `temp-${Date.now()}`,
      x: e.clientX,
      y: e.clientY,
      anchorPoint: 'center',
    };

    if (!startPoint) {
      setStartPoint(point);
    } else {
      onCreateConnector?.(startPoint, point, connectionType);
      setStartPoint(null);
      setCurrentPoint(null);
      onToggle?.();
    }
  }, [isActive, startPoint, onCreateConnector, connectionType, onToggle]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setStartPoint(null);
      setCurrentPoint(null);
      onToggle?.();
    }
  }, [onToggle]);

  useEffect(() => {
    if (isActive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('click', handleClick);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, handleMouseMove, handleClick, handleKeyDown]);

  return (
    <div className="flex items-center gap-2" dir="rtl">
      <Button
        size="sm"
        variant={isActive ? 'default' : 'outline'}
        onClick={onToggle}
        className="gap-2"
      >
        <Link2 className="h-4 w-4" />
        {isActive ? 'جاري الربط...' : 'رابط ذكي'}
      </Button>

      {isActive && (
        <>
          <Select
            value={connectionType}
            onValueChange={(v) => setConnectionType(v as RootConnectorData['connectionType'])}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="component-component">مكون ↔ مكون</SelectItem>
              <SelectItem value="component-frame">مكون ↔ إطار</SelectItem>
              <SelectItem value="frame-frame">إطار ↔ إطار</SelectItem>
              <SelectItem value="part-part">جزء ↔ جزء</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-xs text-muted-foreground">
            {!startPoint ? 'انقر على نقطة البداية' : 'انقر على نقطة النهاية'}
          </span>
        </>
      )}

      {/* Preview line while creating */}
      {isActive && startPoint && currentPoint && (
        <svg
          ref={svgRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{ width: '100vw', height: '100vh' }}
        >
          <line
            x1={startPoint.x}
            y1={startPoint.y}
            x2={currentPoint.x}
            y2={currentPoint.y}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            strokeDasharray="5,5"
            opacity={0.7}
          />
          <circle
            cx={startPoint.x}
            cy={startPoint.y}
            r={6}
            fill="hsl(var(--primary))"
          />
          <circle
            cx={currentPoint.x}
            cy={currentPoint.y}
            r={6}
            fill="hsl(var(--primary))"
            opacity={0.5}
          />
        </svg>
      )}
    </div>
  );
};

// ============= Export All =============
export default RootConnector;
