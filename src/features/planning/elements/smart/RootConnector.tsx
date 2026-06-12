import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  UNIFIED_RELATIONSHIP_TYPES,
  getRelationshipTypeLabel,
  type UnifiedRelationshipType,
} from '@/features/planning/integration/connectors/relationshipTypes';
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

export type ConnectorStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'active' | 'archived' | 'visual_only';
export type ConnectorDirection = 'source_to_target' | 'target_to_source' | 'bidirectional' | 'undirected';
export type ConnectorMode = 'visual' | 'semantic' | 'operational';
export type ConnectorPointType = 'element' | 'anchor' | 'sub_anchor' | 'free_point';
export type ConnectorBranchMode = 'single' | 'branch' | 'merge' | 'multi_target' | 'multi_source';
export type ConnectorPermissionScope = 'owner' | 'team' | 'board' | 'workspace' | 'public';
export type ConnectorSource = 'user' | 'ai' | 'system' | 'import';

export interface SmartConnectorAction {
  id: string;
  label: string;
  actionType: 'review' | 'approve' | 'convert' | 'navigate' | 'automate' | 'custom';
  payload?: Record<string, unknown>;
}

export interface UnifiedConnectorData {
  status?: ConnectorStatus;
  direction?: ConnectorDirection;
  connectorMode?: ConnectorMode;
  connectorPointType?: ConnectorPointType;
  branchMode?: ConnectorBranchMode;
  sourceSubAnchor?: string | null;
  targetSubAnchor?: string | null;
  permissionScope?: ConnectorPermissionScope;
  source?: ConnectorSource;
  reason?: string;
  aiConfidence?: number;
  requiresReview?: boolean;
  isAIGenerated?: boolean;
  approvedByUser?: boolean;
  smartActions?: SmartConnectorAction[];
}

export interface RootConnectorData extends UnifiedConnectorData {
  id: string;
  startPoint: ConnectorPoint;
  endPoint: ConnectorPoint;
  title?: string;
  description?: string;
  color?: string;
  strokeWidth?: number;
  style?: 'solid' | 'dashed' | 'dotted' | 'animated';
  connectionType?: UnifiedRelationshipType;
  relationshipType?: UnifiedRelationshipType;
  status?: 'draft' | 'suggested' | 'approved';
  source?: 'user' | 'ai' | 'system';
  aiConfidence?: number;
  requiresReview?: boolean;
  approvedByUser?: boolean;
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
  onCreateWorkflow?: (connector: RootConnectorData) => void;
  onCreateElement?: (connector: RootConnectorData) => void;
  onSelect?: () => void;
}

// ============= Connection Anchors Component =============
interface ConnectionAnchorsProps {
  elementId: string;
  bounds: { x: number; y: number; width: number; height: number };
  onStartDrag: (point: ConnectorPoint) => void;
  isConnecting?: boolean;
}

export const ConnectionAnchors: React.FC<ConnectionAnchorsProps> = ({
  elementId,
  bounds,
  onStartDrag,
  isConnecting,
}) => {
  const HIT_RADIUS = 16;
  const ARROW_SIZE = 6;
  const CONNECTOR_OFFSET = 16;
  const [isHovered, setIsHovered] = useState(false);
  const anchor = {
    anchorPoint: 'top' as const,
    x: bounds.x + bounds.width / 2,
    y: bounds.y - CONNECTOR_OFFSET,
  };

  const handlePointerDown = (
    anchor: { anchorPoint: AnchorPosition; x: number; y: number },
    event: React.PointerEvent<SVGElement> | React.MouseEvent<SVGElement>,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    onStartDrag({ elementId, x: anchor.x, y: anchor.y, anchorPoint: anchor.anchorPoint });
  };

  const active = isHovered || isConnecting;

  return (
    <g
      className="connection-anchors"
      data-anchor-element-id={elementId}
      data-anchor-position={anchor.anchorPoint}
      style={{ pointerEvents: 'auto' }}
    >
      <circle
        cx={anchor.x}
        cy={anchor.y}
        r={HIT_RADIUS}
        fill="transparent"
        className="cursor-crosshair connection-anchor-hit"
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onPointerDown={(event) => handlePointerDown(anchor, event)}
        onMouseDown={(event) => handlePointerDown(anchor, event)}
      />
      <path
        d={`M ${anchor.x} ${anchor.y + ARROW_SIZE} L ${anchor.x - ARROW_SIZE} ${anchor.y - ARROW_SIZE} L ${anchor.x + ARROW_SIZE} ${anchor.y - ARROW_SIZE} Z`}
        fill="#0B0F12"
        stroke="#FFFFFF"
        strokeWidth={1.5}
        className="connection-anchor-dot drop-shadow-sm"
        pointerEvents="none"
        style={{
          transform: active ? 'scale(1.3)' : 'scale(1)',
          transformBox: 'fill-box',
          transformOrigin: 'center',
          transition: 'transform 120ms ease',
        }}
      />
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
  onCreateWorkflow?: () => void;
  onCreateElement?: () => void;
  onPatch: (patch: Partial<RootConnectorData>) => void;
  isLoadingAI: boolean;
}

const COLOR_SWATCHES = ['#9CA3AF', '#0B0F12', '#3DA8F5', '#3DBE8B', '#F6C445', '#E5564D'];
const STYLE_OPTIONS: Array<{ value: NonNullable<RootConnectorData['style']>; label: string }> = [
  { value: 'solid', label: 'متصل' },
  { value: 'dashed', label: 'متقطع' },
  { value: 'dotted', label: 'منقّط' },
  { value: 'animated', label: 'متحرك' },
];
const WIDTH_OPTIONS = [0.25, 0.5, 0.75, 1];
const STATUS_OPTIONS: Array<{ value: ConnectorRelationshipStatus; label: string }> = [
  { value: 'suggested', label: 'مقترحة' },
  { value: 'confirmed', label: 'مؤكدة' },
  { value: 'operational', label: 'تشغيلية' },
  { value: 'broken', label: 'مكسورة' },
];
const DIRECTION_OPTIONS: Array<{ value: ConnectorDirection; label: string }> = [
  { value: 'forward', label: 'من البداية للنهاية' },
  { value: 'reverse', label: 'من النهاية للبداية' },
  { value: 'bidirectional', label: 'ثنائي الاتجاه' },
];
const PURPOSE_OPTIONS: Array<{ value: ConnectorPurpose; label: string }> = [
  { value: 'visual-only', label: 'مرئي فقط' },
  { value: 'semantic', label: 'دلالي' },
  { value: 'operational', label: 'تشغيلي' },
];
const PERMISSION_OPTIONS: Array<{ value: ConnectorPermissionScope; label: string }> = [
  { value: 'allowed', label: 'مسموح' },
  { value: 'restricted', label: 'مقيد' },
  { value: 'blocked', label: 'محظور' },
];

const getConnectorActionDisabledReason = (
  data: RootConnectorData,
  action: 'workflow' | 'element',
  hasHandler: boolean,
) => {
  if (!hasHandler) return 'لا يوجد سياق تنفيذ متصل بهذه اللوحة.';
  if (!data.startPoint?.elementId || !data.endPoint?.elementId) return 'لا يمكن الإنشاء قبل ربط طرفي العلاقة.';
  if (data.permissionScope === 'blocked') return 'الصلاحية محظورة لهذه العلاقة.';
  if (data.permissionScope === 'restricted') return 'الصلاحية مقيدة وتحتاج تفويضًا أعلى.';
  if (data.requiresReview) return 'العلاقة بانتظار الاعتماد قبل الإنشاء.';
  if ((data.status || 'suggested') === 'suggested') return 'العلاقة المقترحة لا تنشئ عناصر قبل الاعتماد.';
  if (data.status === 'broken') return 'أصلح العلاقة المكسورة قبل الإنشاء.';
  if ((data.purpose || 'semantic') === 'visual-only') return 'العلاقة مرئية فقط ولا تملك معنى تنفيذيًا.';
  if (action === 'workflow' && (data.status !== 'operational' || data.purpose !== 'operational')) {
    return 'إنشاء Workflow يتطلب علاقة تشغيلية معتمدة.';
  }

  return null;
};

interface ConnectorInspectorProps {
  data: RootConnectorData;
  onPatch: (patch: Partial<RootConnectorData>) => void;
}

export const ConnectorInspector: React.FC<ConnectorInspectorProps> = ({ data, onPatch }) => {
  const relationshipType = data.relationshipType || data.connectionType || 'reference';

  const handleRelationshipTypeChange = (value: UnifiedRelationshipType) => {
    onPatch({
      connectionType: value,
      relationshipType: value,
      status: isSuggested ? 'approved' : data.status,
      requiresReview: false,
      approvedByUser: true,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-2 p-3 rounded-lg border border-border/60 bg-muted/30">
      <div className="flex items-center gap-2">
        <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium">خصائص الموصل</span>
        <span className={`mr-auto rounded-full border px-2 py-0.5 text-[10px] font-medium ${visualState.badgeClassName}`}>
          {visualState.label}
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] text-muted-foreground">التسمية</span>
        <Input
          value={data.title || ''}
          onChange={(event) => onPatch({ title: event.target.value })}
          placeholder="تسمية العلاقة"
          className="h-7 text-xs"
          dir="auto"
        />
      </div>

      <div className="space-y-1">
        <span className="text-[10px] text-muted-foreground">اللون</span>
        <div className="flex gap-1.5">
          {COLOR_SWATCHES.map((color) => {
            const active = (data.color || '#9CA3AF') === color;
            return (
              <button
                key={color}
                onClick={() => onPatch({ color })}
                className={`h-5 w-5 rounded-full border transition-all ${active ? 'ring-2 ring-offset-1 ring-foreground/40 scale-110' : 'border-border'}`}
                style={{ backgroundColor: color }}
                aria-label={`لون ${color}`}
              />
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">حالة العلاقة</span>
          <Select value={data.status || 'suggested'} onValueChange={(value) => onPatch({ status: value as ConnectorRelationshipStatus })}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">الاتجاه</span>
          <Select value={data.direction || 'forward'} onValueChange={(value) => onPatch({ direction: value as ConnectorDirection, bidirectional: value === 'bidirectional' } as Partial<RootConnectorData>)}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DIRECTION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">النمط</span>
          <Select value={data.style || 'solid'} onValueChange={(value) => onPatch({ style: value as RootConnectorData['style'] })}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STYLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">السماكة</span>
          <Select value={String(data.strokeWidth ?? 0.25)} onValueChange={(value) => onPatch({ strokeWidth: parseFloat(value) })}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {WIDTH_OPTIONS.map((width) => (
                <SelectItem key={width} value={String(width)} className="text-xs">{width}px</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isSuggested && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] text-amber-800">
          اقتراح AI بانتظار اعتمادك قبل إنشاء أي علاقة تشغيلية.
        </div>
      )}

      <div className="space-y-1">
        <span className="text-[10px] text-muted-foreground">نوع العلاقة</span>
        <Select value={relationshipType} onValueChange={(value) => handleRelationshipTypeChange(value as UnifiedRelationshipType)}>
          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {UNIFIED_RELATIONSHIP_TYPES.map((type) => (
              <SelectItem key={type} value={type} className="text-xs">{getRelationshipTypeLabel(type)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">تمييز العلاقة</span>
          <Select value={data.purpose || 'semantic'} onValueChange={(value) => onPatch({ purpose: value as ConnectorPurpose })}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PURPOSE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">نطاق الصلاحية</span>
          <Select value={data.permissionScope || 'allowed'} onValueChange={(value) => onPatch({ permissionScope: value as ConnectorPermissionScope })}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PERMISSION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-center gap-2 rounded-md border border-border/60 bg-background/70 px-2 py-1.5 text-[11px] text-muted-foreground">
        <input
          type="checkbox"
          checked={Boolean(data.requiresReview)}
          onChange={(event) => onPatch({ requiresReview: event.target.checked })}
          className="h-3.5 w-3.5 accent-primary"
        />
        يتطلب اعتمادًا قبل التحويل لعلاقة تشغيلية
      </label>

      <Button
        size="sm"
        variant="outline"
        onClick={() => onPatch({ startPoint: data.endPoint, endPoint: data.startPoint })}
        className="w-full h-7 text-xs gap-1.5"
      >
        <ArrowRight className="h-3 w-3" />
        عكس الاتجاه
      </Button>
    </div>
  );
};

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
  onCreateWorkflow,
  onCreateElement,
  onPatch,
  isLoadingAI,
}) => {
  const [editedTitle, setEditedTitle] = useState(data.title || '');
  const [editedDescription, setEditedDescription] = useState(data.description || '');
  const visualState = getConnectorVisualState(data);
  const workflowDisabledReason = getConnectorActionDisabledReason(data, 'workflow', Boolean(onCreateWorkflow));
  const elementDisabledReason = getConnectorActionDisabledReason(data, 'element', Boolean(onCreateElement));

  useEffect(() => {
    setEditedTitle(data.title || '');
    setEditedDescription(data.description || '');
  }, [data.title, data.description]);

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
                    {getRelationshipTypeLabel(data.relationshipType || data.connectionType)}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${visualState.badgeClassName}`}>
                      {visualState.label}
                    </span>
                    <span className="rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                      {visualState.tag}
                    </span>
                  </div>
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

            <ConnectorInspector data={data} onPatch={onPatch} />

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
                        variant="outline"
                        onClick={() => onInsertSuggestion(suggestion)}
                        className="h-6 px-2 text-[10px] text-primary hover:text-primary"
                      >
                        اعتماد
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/60 bg-muted/20 p-2">
              <div className="space-y-1">
                <Button
                  size="sm"
                  onClick={onCreateWorkflow}
                  disabled={Boolean(workflowDisabledReason)}
                  className="w-full text-xs h-8 gap-1.5"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  إنشاء Workflow
                </Button>
                {workflowDisabledReason && (
                  <p className="text-[10px] leading-relaxed text-muted-foreground">{workflowDisabledReason}</p>
                )}
              </div>
              <div className="space-y-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCreateElement}
                  disabled={Boolean(elementDisabledReason)}
                  className="w-full text-xs h-8 gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  إنشاء عنصر
                </Button>
                {elementDisabledReason && (
                  <p className="text-[10px] leading-relaxed text-muted-foreground">{elementDisabledReason}</p>
                )}
              </div>
            </div>

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
                  variant="secondary"
                  onClick={() => onInsertSuggestion(data.aiSuggestions![0])}
                  className="flex-1 text-xs h-8 gap-1.5"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  اعتماد المقترح
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
  onCreateWorkflow,
  onCreateElement,
  onSelect,
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
      const connectorSuggestion = suggestions.find((suggestion) => suggestion.type === 'connector');
      onUpdate?.({
        ...data,
        ...(connectorSuggestion?.data?.connectorPatch ?? {}),
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
    if (suggestion.type === 'connector') return;
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

  // ===== Orthogonal routing with rounded corners (Qlik / n8n style) =====
  // Build a polyline of waypoints based on each endpoint's anchor edge.
  const STUB = 16; // initial perpendicular stub length
  const CORNER_R = 4; // rounded corner radius

  const stubFor = (p: ConnectorPoint): { x: number; y: number } => {
    switch (p.anchorPoint) {
      case 'right':  return { x: p.x + STUB, y: p.y };
      case 'left':   return { x: p.x - STUB, y: p.y };
      case 'top':    return { x: p.x, y: p.y - STUB };
      case 'bottom': return { x: p.x, y: p.y + STUB };
      default:       return { x: p.x, y: p.y };
    }
  };

  const isHorizontal = (a?: AnchorPosition) => a === 'left' || a === 'right';

  const s0 = { x: startX, y: startY };
  const sStub = stubFor(startPoint);
  const eStub = stubFor(endPoint);
  const e0 = { x: endX, y: endY };

  // Build intermediate waypoints between the two stubs so segments stay axis-aligned.
  const points: Array<{ x: number; y: number }> = [s0, sStub];
  const srcH = isHorizontal(startPoint.anchorPoint);
  const tgtH = isHorizontal(endPoint.anchorPoint);

  if (srcH && tgtH) {
    const mx = (sStub.x + eStub.x) / 2;
    points.push({ x: mx, y: sStub.y });
    points.push({ x: mx, y: eStub.y });
  } else if (!srcH && !tgtH) {
    const my = (sStub.y + eStub.y) / 2;
    points.push({ x: sStub.x, y: my });
    points.push({ x: eStub.x, y: my });
  } else if (srcH && !tgtH) {
    points.push({ x: eStub.x, y: sStub.y });
  } else {
    points.push({ x: sStub.x, y: eStub.y });
  }
  points.push(eStub, e0);

  // Build SVG path with rounded corners at each waypoint between two segments.
  const buildRoundedPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const prev = pts[i - 1];
      const cur = pts[i];
      const next = pts[i + 1];
      const inDx = Math.sign(cur.x - prev.x);
      const inDy = Math.sign(cur.y - prev.y);
      const outDx = Math.sign(next.x - cur.x);
      const outDy = Math.sign(next.y - cur.y);
      const r = Math.min(
        CORNER_R,
        Math.hypot(cur.x - prev.x, cur.y - prev.y) / 2,
        Math.hypot(next.x - cur.x, next.y - cur.y) / 2,
      );
      if (r > 0 && (inDx !== outDx || inDy !== outDy) && (inDx !== 0 || inDy !== 0) && (outDx !== 0 || outDy !== 0)) {
        const p1 = { x: cur.x - inDx * r, y: cur.y - inDy * r };
        const p2 = { x: cur.x + outDx * r, y: cur.y + outDy * r };
        d += ` L ${p1.x} ${p1.y} Q ${cur.x} ${cur.y} ${p2.x} ${p2.y}`;
      } else {
        d += ` L ${cur.x} ${cur.y}`;
      }
    }
    const last = pts[pts.length - 1];
    d += ` L ${last.x} ${last.y}`;
    return d;
  };

  const pathD = buildRoundedPath(points);

  // ===== Visual style — state-aware, with explicit suggested/confirmed/operational gating =====
  const connectorVisualState = getConnectorVisualState(data);
  const baseStroke = connectorVisualState.color;
  const activeStroke = connectorVisualState.activeColor;
  const strokeColor = isSelected || isHovered ? activeStroke : baseStroke;
  // Clamp legacy values: any stored width > 1 is treated as legacy and forced thin
  const storedWidth = data.strokeWidth ?? 0.25;
  const baseWidth = storedWidth > 1 ? 0.25 : storedWidth;
  const strokeWidth = isSelected ? Math.max(0.5, baseWidth) : baseWidth;
  const strokeStyle = data.style || 'solid';

  const getStrokeDasharray = () => {
    if (connectorVisualState.dasharray !== 'none') return connectorVisualState.dasharray;

    switch (strokeStyle) {
      case 'dashed': return '8,4';
      case 'dotted': return '2,4';
      case 'animated': return '8,4';
      default: return 'none';
    }
  };

  return (
    <g
      className="root-connector"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(event) => {
        event.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Invisible thicker hit area for easier selection */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        className="cursor-pointer"
        pointerEvents="stroke"
      />

      {/* Main connector path — thin, orthogonal, neutral */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={getStrokeDasharray()}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{
          strokeDashoffset: strokeStyle === 'animated' ? [0, -24] : 0,
        }}
        transition={{
          strokeDashoffset: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      />

      {/* Endpoint dots — only visible when selected/hovered */}
      {(isSelected || isHovered) && (
        <>
          <circle cx={startX} cy={startY} r={2.5} fill={strokeColor} pointerEvents="none" />
          <circle cx={endX} cy={endY} r={2.5} fill={strokeColor} pointerEvents="none" />
        </>
      )}

      {/* Floating info panel — only when selected or editing */}
      <AnimatePresence>
        {(isSelected || isEditing) && (
          <FloatingPanel
            x={midX}
            y={midY + 24}
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
            onCreateWorkflow={onCreateWorkflow ? () => onCreateWorkflow(data) : undefined}
            onCreateElement={onCreateElement ? () => onCreateElement(data) : undefined}
            onPatch={(patch) => onUpdate?.({ ...data, ...patch, updatedAt: new Date().toISOString() })}
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
  const [connectionType, setConnectionType] = useState<RootConnectorData['connectionType']>('reference');
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
              {UNIFIED_RELATIONSHIP_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{getRelationshipTypeLabel(type)}</SelectItem>
              ))}
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
