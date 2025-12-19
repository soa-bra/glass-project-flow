/**
 * WorkflowInspectorPanel - لوحة خصائص العقدة/الخط
 * Sprint 2: Workflow Design Layer
 */

import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Settings,
  Users,
  Calendar,
  Clock,
  FileText,
  Link2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type {
  WorkflowNodeData,
  WorkflowEdgeData,
  WorkflowCondition,
  WorkflowAction,
  WorkflowNodeType
} from '@/types/workflow';
import { getDefaultNodeLabel } from '@/types/workflow';

// ============= Props =============

interface WorkflowInspectorPanelProps {
  selectedNode?: WorkflowNodeData | null;
  selectedEdge?: WorkflowEdgeData | null;
  isOpen: boolean;
  onClose: () => void;
  onNodeUpdate?: (nodeId: string, updates: Partial<WorkflowNodeData>) => void;
  onEdgeUpdate?: (edgeId: string, updates: Partial<WorkflowEdgeData>) => void;
  onNodeDelete?: (nodeId: string) => void;
  onEdgeDelete?: (edgeId: string) => void;
}

// ============= Main Component =============

export const WorkflowInspectorPanel = memo(function WorkflowInspectorPanel({
  selectedNode,
  selectedEdge,
  isOpen,
  onClose,
  onNodeUpdate,
  onEdgeUpdate,
  onNodeDelete,
  onEdgeDelete
}: WorkflowInspectorPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['basic', 'conditions', 'actions'])
  );

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (selectedNode || selectedEdge) && (
        <motion.div
          className="fixed left-4 top-20 bottom-4 w-80 bg-background border rounded-xl shadow-xl z-50 flex flex-col overflow-hidden"
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">
                {selectedNode ? 'خصائص العقدة' : 'خصائص الرابط'}
              </h3>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {selectedNode && (
                <NodeInspector
                  node={selectedNode}
                  expandedSections={expandedSections}
                  onToggleSection={toggleSection}
                  onUpdate={(updates) => onNodeUpdate?.(selectedNode.id, updates)}
                  onDelete={() => onNodeDelete?.(selectedNode.id)}
                />
              )}

              {selectedEdge && (
                <EdgeInspector
                  edge={selectedEdge}
                  expandedSections={expandedSections}
                  onToggleSection={toggleSection}
                  onUpdate={(updates) => onEdgeUpdate?.(selectedEdge.id, updates)}
                  onDelete={() => onEdgeDelete?.(selectedEdge.id)}
                />
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ============= Node Inspector =============

interface NodeInspectorProps {
  node: WorkflowNodeData;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  onUpdate: (updates: Partial<WorkflowNodeData>) => void;
  onDelete: () => void;
}

const NodeInspector = memo(function NodeInspector({
  node,
  expandedSections,
  onToggleSection,
  onUpdate,
  onDelete
}: NodeInspectorProps) {
  return (
    <>
      {/* Basic Info */}
      <CollapsibleSection
        title="المعلومات الأساسية"
        icon={<FileText className="w-4 h-4" />}
        isExpanded={expandedSections.has('basic')}
        onToggle={() => onToggleSection('basic')}
      >
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">النوع</Label>
            <Badge variant="secondary" className="mt-1">
              {getDefaultNodeLabel(node.type)}
            </Badge>
          </div>

          <div>
            <Label htmlFor="label" className="text-xs text-muted-foreground">
              الاسم
            </Label>
            <Input
              id="label"
              value={node.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="mt-1 h-8 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-xs text-muted-foreground">
              الوصف
            </Label>
            <Textarea
              id="description"
              value={node.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="mt-1 text-sm resize-none"
              rows={2}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Assignment */}
      {node.type !== 'start' && node.type !== 'end' && (
        <CollapsibleSection
          title="التعيين والمواعيد"
          icon={<Users className="w-4 h-4" />}
          isExpanded={expandedSections.has('assignment')}
          onToggle={() => onToggleSection('assignment')}
        >
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">نوع التعيين</Label>
              <Select
                value={node.assigneeType || 'user'}
                onValueChange={(value) => onUpdate({ assigneeType: value as any })}
              >
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">مستخدم محدد</SelectItem>
                  <SelectItem value="role">دور وظيفي</SelectItem>
                  <SelectItem value="department">قسم</SelectItem>
                  <SelectItem value="dynamic">ديناميكي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">الأولوية</Label>
              <Select
                value={node.priority || 'medium'}
                onValueChange={(value) => onUpdate({ priority: value as any })}
              >
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفضة</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="urgent">عاجلة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">المدة (دقائق)</Label>
              <Input
                type="number"
                value={node.dueDuration || ''}
                onChange={(e) => onUpdate({ dueDuration: parseInt(e.target.value) || undefined })}
                className="mt-1 h-8 text-sm"
                placeholder="مثال: 60"
              />
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Conditions */}
      <CollapsibleSection
        title="شروط الدخول"
        icon={<AlertCircle className="w-4 h-4" />}
        isExpanded={expandedSections.has('conditions')}
        onToggle={() => onToggleSection('conditions')}
        badge={node.entryConditions?.length}
      >
        <ConditionsList
          conditions={node.entryConditions || []}
          onUpdate={(conditions) => onUpdate({ entryConditions: conditions })}
        />
      </CollapsibleSection>

      {/* Actions */}
      <CollapsibleSection
        title="إجراءات الدخول"
        icon={<Play className="w-4 h-4" />}
        isExpanded={expandedSections.has('actions')}
        onToggle={() => onToggleSection('actions')}
        badge={node.onEnterActions?.length}
      >
        <ActionsList
          actions={node.onEnterActions || []}
          onUpdate={(actions) => onUpdate({ onEnterActions: actions })}
        />
      </CollapsibleSection>

      {/* Links */}
      <CollapsibleSection
        title="الروابط"
        icon={<Link2 className="w-4 h-4" />}
        isExpanded={expandedSections.has('links')}
        onToggle={() => onToggleSection('links')}
      >
        <div className="text-xs text-muted-foreground text-center py-4">
          اسحب عناصر من اللوحة لربطها
        </div>
      </CollapsibleSection>

      <Separator />

      {/* Delete */}
      <Button
        variant="destructive"
        size="sm"
        className="w-full"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4 ml-2" />
        حذف العقدة
      </Button>
    </>
  );
});

// ============= Edge Inspector =============

interface EdgeInspectorProps {
  edge: WorkflowEdgeData;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  onUpdate: (updates: Partial<WorkflowEdgeData>) => void;
  onDelete: () => void;
}

const EdgeInspector = memo(function EdgeInspector({
  edge,
  expandedSections,
  onToggleSection,
  onUpdate,
  onDelete
}: EdgeInspectorProps) {
  return (
    <>
      {/* Basic Info */}
      <CollapsibleSection
        title="المعلومات الأساسية"
        icon={<FileText className="w-4 h-4" />}
        isExpanded={expandedSections.has('basic')}
        onToggle={() => onToggleSection('basic')}
      >
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">النوع</Label>
            <Select
              value={edge.type}
              onValueChange={(value) => onUpdate({ type: value as any })}
            >
              <SelectTrigger className="mt-1 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sequence">تسلسلي</SelectItem>
                <SelectItem value="conditional">مشروط</SelectItem>
                <SelectItem value="default">افتراضي</SelectItem>
                <SelectItem value="exception">استثناء</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edge-label" className="text-xs text-muted-foreground">
              التسمية
            </Label>
            <Input
              id="edge-label"
              value={edge.label || ''}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="mt-1 h-8 text-sm"
              placeholder="مثال: نعم / لا"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">الأولوية</Label>
            <Input
              type="number"
              value={edge.priority || 0}
              onChange={(e) => onUpdate({ priority: parseInt(e.target.value) || 0 })}
              className="mt-1 h-8 text-sm"
              min={0}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Style */}
      <CollapsibleSection
        title="النمط"
        icon={<Settings className="w-4 h-4" />}
        isExpanded={expandedSections.has('style')}
        onToggle={() => onToggleSection('style')}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">سهم البداية</Label>
            <Switch
              checked={edge.style?.arrowStart || false}
              onCheckedChange={(checked) =>
                onUpdate({ style: { ...edge.style, arrowStart: checked } })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">سهم النهاية</Label>
            <Switch
              checked={edge.style?.arrowEnd !== false}
              onCheckedChange={(checked) =>
                onUpdate({ style: { ...edge.style, arrowEnd: checked } })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">متحرك</Label>
            <Switch
              checked={edge.style?.animated || false}
              onCheckedChange={(checked) =>
                onUpdate({ style: { ...edge.style, animated: checked } })
              }
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Conditions */}
      {edge.type === 'conditional' && (
        <CollapsibleSection
          title="الشروط"
          icon={<AlertCircle className="w-4 h-4" />}
          isExpanded={expandedSections.has('conditions')}
          onToggle={() => onToggleSection('conditions')}
          badge={edge.conditions?.length}
        >
          <ConditionsList
            conditions={edge.conditions || []}
            onUpdate={(conditions) => onUpdate({ conditions })}
          />
        </CollapsibleSection>
      )}

      {/* Actions */}
      <CollapsibleSection
        title="الإجراءات"
        icon={<Play className="w-4 h-4" />}
        isExpanded={expandedSections.has('actions')}
        onToggle={() => onToggleSection('actions')}
        badge={edge.actions?.length}
      >
        <ActionsList
          actions={edge.actions || []}
          onUpdate={(actions) => onUpdate({ actions })}
        />
      </CollapsibleSection>

      <Separator />

      {/* Delete */}
      <Button
        variant="destructive"
        size="sm"
        className="w-full"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4 ml-2" />
        حذف الرابط
      </Button>
    </>
  );
});

// ============= Collapsible Section =============

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  badge?: number;
  children: React.ReactNode;
}

const CollapsibleSection = memo(function CollapsibleSection({
  title,
  icon,
  isExpanded,
  onToggle,
  badge,
  children
}: CollapsibleSectionProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
          {badge !== undefined && badge > 0 && (
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
              {badge}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 border-t">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ============= Conditions List =============

interface ConditionsListProps {
  conditions: WorkflowCondition[];
  onUpdate: (conditions: WorkflowCondition[]) => void;
}

const ConditionsList = memo(function ConditionsList({
  conditions,
  onUpdate
}: ConditionsListProps) {
  const handleAdd = () => {
    const newCondition: WorkflowCondition = {
      id: `cond-${Date.now()}`,
      type: 'field',
      field: '',
      operator: 'eq',
      value: ''
    };
    onUpdate([...conditions, newCondition]);
  };

  const handleRemove = (id: string) => {
    onUpdate(conditions.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-2">
      {conditions.map((condition, index) => (
        <div key={condition.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
          <span className="text-xs text-muted-foreground w-16 truncate">
            {condition.field || 'حقل'}
          </span>
          <Badge variant="outline" className="text-[10px]">
            {condition.operator}
          </Badge>
          <span className="text-xs flex-1 truncate">
            {String(condition.value) || '—'}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => handleRemove(condition.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={handleAdd}
      >
        <Plus className="w-3 h-3 ml-1" />
        إضافة شرط
      </Button>
    </div>
  );
});

// ============= Actions List =============

interface ActionsListProps {
  actions: WorkflowAction[];
  onUpdate: (actions: WorkflowAction[]) => void;
}

const ActionsList = memo(function ActionsList({
  actions,
  onUpdate
}: ActionsListProps) {
  const handleAdd = () => {
    const newAction: WorkflowAction = {
      id: `action-${Date.now()}`,
      type: 'notify',
      config: {}
    };
    onUpdate([...actions, newAction]);
  };

  const handleRemove = (id: string) => {
    onUpdate(actions.filter(a => a.id !== id));
  };

  const getActionLabel = (type: string): string => {
    const labels: Record<string, string> = {
      notify: 'إشعار',
      assign: 'تعيين',
      update_field: 'تحديث حقل',
      create_task: 'إنشاء مهمة',
      send_email: 'إرسال بريد',
      delay: 'تأخير',
      log: 'تسجيل'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <div key={action.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span className="text-xs flex-1">{getActionLabel(action.type)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => handleRemove(action.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={handleAdd}
      >
        <Plus className="w-3 h-3 ml-1" />
        إضافة إجراء
      </Button>
    </div>
  );
});

export default WorkflowInspectorPanel;
