import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Link2, Trash2 } from 'lucide-react';
import type { ToolId } from '@/types/canvas';
import { useCanvasStore } from '@/stores/canvasStore';
import type { RootConnectorData } from '@/features/planning/elements/smart/RootConnector';
import { ConnectorInspector } from '@/features/planning/elements/smart/RootConnector';
import { toPlanningConnectorLogicalRecords } from '@/features/planning/integration/connectors';
import {
  deleteSmartConnectorByElementId,
  upsertSmartConnectors,
} from '@/services/central/smartConnectors.service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FileUploadPanel from './FileUploadToolZone';
import ShapesPanel from './ShapesToolZone';
import SmartElementsPanel from './SmartElementsToolZone';
import ResearchToolZone from './ResearchToolZone';
import SmartDocToolZone from './SmartDocToolZone';

interface ToolZoneProps {
  activeTool: ToolId;
  onClose?: () => void;
  boardId?: string;
}

interface RootConnectorToolPanelProps {
  connector: RootConnectorData;
  onPatch: (patch: Partial<RootConnectorData>) => void;
  onDelete: () => void;
}

const RootConnectorToolPanel: React.FC<RootConnectorToolPanelProps> = ({
  connector,
  onPatch,
  onDelete,
}) => {
  return (
    <div className="space-y-4" dir="rtl">
      <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Link2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-foreground">
              {connector.title || 'رابط ذكي'}
            </h4>
            <p className="text-[11px] text-muted-foreground">
              حرر خصائص الموصل من لوحة الأدوات بدل محرر عائم فوق الكانفس.
            </p>
          </div>
        </div>
      </div>

      <ConnectorInspector data={connector} onPatch={onPatch} />

      <div className="space-y-2">
        <label className="text-[11px] font-medium text-foreground" htmlFor="root-connector-description">
          تعليق توضيحي
        </label>
        <Textarea
          id="root-connector-description"
          value={connector.description ?? ''}
          onChange={(event) => onPatch({ description: event.target.value })}
          placeholder="أضف تعليقاً توضيحياً للموصل..."
          className="min-h-[96px] resize-none text-sm"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="h-8 w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" />
        حذف الموصل
      </Button>
    </div>
  );
};

const panelTitles: Record<ToolId, string> = {
  selection_tool: 'أدوات التحديد',
  smart_pen: 'القلم الذكي',
  sticky_tool: 'ستيكي نوت',
  text_tool: 'النص',
  file_uploader: 'رفع الملفات',
  shapes_tool: 'الأشكال',
  mindmap_tool: 'الخارطة الذهنية',
  smart_element_tool: 'العناصر الذكية',
  research_tool: 'البحث العلمي',
  frame_tool: 'الإطار',
  smart_doc_tool: 'المستندات الذكية',
};

// الأدوات التي لا تحتوي على لوحة خاصة (تستخدم FloatingBar بدلاً)
const toolsWithoutPanel: ToolId[] = [
  'selection_tool',
  'smart_pen',
  'sticky_tool',
  'mindmap_tool',
  'frame_tool',
  'text_tool', // تم نقل أدوات النص إلى FloatingBar
];

const ToolZone: React.FC<ToolZoneProps> = ({ activeTool, onClose, boardId }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // الحصول على حالة التحرير
  const editingTextId = useCanvasStore(state => state.editingTextId);
  const elements = useCanvasStore(state => state.elements);
  const selectedElementIds = useCanvasStore(state => state.selectedElementIds);
  const updateElement = useCanvasStore(state => state.updateElement);
  const deleteElements = useCanvasStore(state => state.deleteElements);

  const selectedRootConnectorElement = elements.find((element) => (
    selectedElementIds.includes(element.id) && element.data?.smartType === 'root_connector'
  ));

  const selectedRootConnector = selectedRootConnectorElement
    ? ({ ...(selectedRootConnectorElement.data as RootConnectorData), id: selectedRootConnectorElement.id })
    : null;
  
  // طي تلقائي للأدوات بدون panel
  useEffect(() => {
    if (selectedRootConnector) {
      setIsCollapsed(false);
    } else if (toolsWithoutPanel.includes(activeTool) && !editingTextId) {
      setIsCollapsed(true);
    } else if (toolsWithoutPanel.includes(activeTool) && editingTextId) {
      // عند تحرير نص، أيضاً نطوي لأن FloatingBar يتولى المهمة
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [activeTool, editingTextId, selectedRootConnector]);

  const syncSelectedRootConnector = (connector: RootConnectorData & { smartType: 'root_connector' }) => {
    if (!selectedRootConnectorElement || !boardId) return;

    const nextElement = {
      ...selectedRootConnectorElement,
      data: connector,
      metadata: {
        ...selectedRootConnectorElement.metadata,
        smartType: 'root_connector',
        relationshipType: connector.relationshipType ?? connector.connectionType,
        connectorMode: connector.connectorMode ?? 'semantic',
        status: connector.status ?? 'approved',
        direction: connector.direction ?? 'source_to_target',
        connectorPointType: connector.connectorPointType ?? 'anchor',
        branchMode: connector.branchMode ?? 'single',
        sourceSubAnchor: connector.sourceSubAnchor ?? connector.startPoint.anchorPoint,
        targetSubAnchor: connector.targetSubAnchor ?? connector.endPoint.anchorPoint,
        permissionScope: connector.permissionScope ?? 'board',
        source: connector.source ?? 'user',
        aiConfidence: connector.aiConfidence,
        requiresReview: connector.requiresReview ?? false,
        isAIGenerated: connector.isAIGenerated ?? false,
        approvedByUser: connector.approvedByUser ?? true,
        smartActions: connector.smartActions ?? [],
        sourceElementId: connector.startPoint.elementId,
        targetElementId: connector.endPoint.elementId,
      },
    };

    const isUnapprovedSuggestion = connector.status === 'suggested' || connector.requiresReview || connector.approvedByUser === false;
    if (isUnapprovedSuggestion) {
      const persistableElement = {
        ...nextElement,
        data: {
          ...connector,
          smartType: 'root_connector',
          connectorMode: connector.connectorMode ?? 'semantic',
          status: 'approved',
          requiresReview: false,
          approvedByUser: true,
        },
        metadata: {
          ...nextElement.metadata,
          connectorMode: connector.connectorMode ?? 'semantic',
          status: 'approved',
          requiresReview: false,
          approvedByUser: true,
        },
      };
      const relatedConnectorElementIds = new Set([
        connector.id,
        ...toPlanningConnectorLogicalRecords(persistableElement, boardId).map(
          (record) => record.connector_element_id,
        ),
      ]);

      void Promise.all(
        [...relatedConnectorElementIds].map((connectorElementId) =>
          deleteSmartConnectorByElementId(connectorElementId),
        ),
      ).catch((err) =>
        console.warn('[smart_connectors] suggested connector cleanup failed', err),
      );
      return;
    }

    const connectorRecords = toPlanningConnectorLogicalRecords(nextElement, boardId);
    if (connectorRecords.length > 0) {
      void upsertSmartConnectors(connectorRecords).catch((err) =>
        console.warn('[smart_connectors] upsert failed', err),
      );
    }
  };

  const patchSelectedRootConnector = (patch: Partial<RootConnectorData>) => {
    if (!selectedRootConnectorElement || !selectedRootConnector) return;

    const updatedAt = new Date().toISOString();
    const nextConnector: RootConnectorData & { smartType: 'root_connector' } = {
      ...selectedRootConnector,
      ...patch,
      connectionType: patch.connectionType ?? patch.relationshipType ?? selectedRootConnector.connectionType ?? selectedRootConnector.relationshipType,
      relationshipType: patch.relationshipType ?? patch.connectionType ?? selectedRootConnector.relationshipType ?? selectedRootConnector.connectionType,
      smartType: 'root_connector',
      updatedAt,
    };

    const nextMetadata = {
      ...selectedRootConnectorElement.metadata,
      smartType: 'root_connector',
      relationshipType: nextConnector.relationshipType ?? nextConnector.connectionType,
      connectorMode: nextConnector.connectorMode ?? 'semantic',
      status: nextConnector.status ?? 'approved',
      direction: nextConnector.direction ?? 'source_to_target',
      connectorPointType: nextConnector.connectorPointType ?? 'anchor',
      branchMode: nextConnector.branchMode ?? 'single',
      sourceSubAnchor: nextConnector.sourceSubAnchor ?? nextConnector.startPoint.anchorPoint,
      targetSubAnchor: nextConnector.targetSubAnchor ?? nextConnector.endPoint.anchorPoint,
      permissionScope: nextConnector.permissionScope ?? 'board',
      source: nextConnector.source ?? 'user',
      aiConfidence: nextConnector.aiConfidence,
      requiresReview: nextConnector.requiresReview ?? false,
      isAIGenerated: nextConnector.isAIGenerated ?? false,
      approvedByUser: nextConnector.approvedByUser ?? true,
      smartActions: nextConnector.smartActions ?? [],
      sourceElementId: nextConnector.startPoint.elementId,
      targetElementId: nextConnector.endPoint.elementId,
    };

    updateElement(selectedRootConnectorElement.id, {
      data: nextConnector,
      metadata: nextMetadata,
    });
    syncSelectedRootConnector(nextConnector);
  };

  const deleteSelectedRootConnector = () => {
    if (!selectedRootConnectorElement) return;
    deleteElements([selectedRootConnectorElement.id]);
    void deleteSmartConnectorByElementId(selectedRootConnectorElement.id).catch((err) =>
      console.warn('[smart_connectors] delete failed', err),
    );
  };
  
  const renderPanel = () => {
    if (selectedRootConnector) {
      return (
        <RootConnectorToolPanel
          connector={selectedRootConnector}
          onPatch={patchSelectedRootConnector}
          onDelete={deleteSelectedRootConnector}
        />
      );
    }

    // لم يعد هناك حاجة لـ TextPanel - يتم التحكم في النص عبر FloatingBar
    switch (activeTool) {
      case 'file_uploader':
        return <FileUploadPanel />;
      case 'shapes_tool':
        return <ShapesPanel />;
      case 'smart_element_tool':
        return <SmartElementsPanel />;
      case 'research_tool':
        return <ResearchToolZone />;
      case 'smart_doc_tool':
        return <SmartDocToolZone boardId={boardId} />;
      // الأدوات بدون panel (تستخدم FloatingBar)
      case 'selection_tool':
      case 'smart_pen':
      case 'sticky_tool':
      case 'mindmap_tool':
      case 'frame_tool':
      case 'text_tool':
        return (
          <div className="p-4 text-center text-[hsl(var(--ink-60))] text-[13px]">
            <p>استخدم الأداة مباشرة على الكانفس</p>
            <p className="text-[11px] mt-2">أو حدد عنصرًا لعرض شريط الأدوات العائم</p>
          </div>
        );
      default:
        return null;
    }
  };
  
  // تحديث العنوان ديناميكياً
  const panelTitle = selectedRootConnector ? 'محرر الموصل الذكي' : panelTitles[activeTool];

  // إذا كان مطوياً بالكامل، عرض شريط صغير فقط
  if (isCollapsed) {
    return (
      <div 
        className="fixed top-24 left-4 z-40 bg-white/95 backdrop-blur-[12px] 
          border border-[hsl(var(--border))] rounded-[18px] shadow-[0_4px_24px_rgba(0,0,0,0.12)]
          p-2 cursor-pointer hover:bg-white transition-all"
        onClick={() => setIsCollapsed(false)}
      >
        <ChevronRight size={20} className="text-[hsl(var(--ink-60))]" />
      </div>
    );
  }

  return (
    <div className="fixed top-24 left-4 z-40 w-[320px] max-h-[calc(100vh-120px)] 
      bg-white/95 backdrop-blur-[12px] border border-[hsl(var(--border))] 
      rounded-[18px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(var(--border))]">
        <h3 className="text-[16px] font-semibold text-[hsl(var(--ink))]">
          {panelTitle}
        </h3>
        <div className="flex items-center gap-1">
          {/* زر الطي */}
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
            title="طي اللوحة"
          >
            <ChevronLeft size={18} className="text-[hsl(var(--ink-60))]" />
          </button>
          {/* زر الإغلاق */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
            >
              <X size={18} className="text-[hsl(var(--ink-60))]" />
            </button>
          )}
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {renderPanel()}
      </div>
    </div>
  );
};

export default ToolZone;
