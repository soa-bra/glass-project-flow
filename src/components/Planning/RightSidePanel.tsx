import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import type { ToolId } from '@/types/canvas';
import SelectionPanel from './panels/SelectionPanel';
import SmartPenPanel from './panels/SmartPenPanel';
import FramePanel from './panels/FramePanel';
import FileUploadPanel from './panels/FileUploadPanel';
import ShapesPanel from './panels/ShapesPanel';
import SmartElementsPanel from './panels/SmartElementsPanel';
import { DocumentInspector } from './Document';
import { FramesNavigator } from './Frames';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasDocumentElement } from '@/types/canvas-elements';

interface RightSidePanelProps {
  activeTool: ToolId;
  onClose?: () => void;
}

const panelTitles: Record<ToolId, string> = {
  selection_tool: 'أدوات التحديد',
  smart_pen: 'القلم الذكي',
  frame_tool: 'الإطار',
  file_uploader: 'رفع الملفات',
  text_tool: 'النص',
  shapes_tool: 'الأشكال',
  smart_element_tool: 'العناصر الذكية',
};

const RightSidePanel: React.FC<RightSidePanelProps> = ({ activeTool, onClose }) => {
  const { elements, selectedElementIds, updateElement } = useCanvasStore();

  // Check if a document element is selected
  const selectedDocument = useMemo(() => {
    if (selectedElementIds.length !== 1) return null;
    const element = elements.find(el => el.id === selectedElementIds[0]);
    if (element?.type === 'document') {
      return element as CanvasDocumentElement;
    }
    return null;
  }, [elements, selectedElementIds]);

  // Check if a frame is selected
  const selectedFrame = useMemo(() => {
    if (selectedElementIds.length !== 1) return null;
    const element = elements.find(el => el.id === selectedElementIds[0]);
    if (element?.type === 'frame') {
      return element;
    }
    return null;
  }, [elements, selectedElementIds]);

  // Get workflow nodes for linking
  const workflowNodes = useMemo(() => {
    return elements
      .filter(el => el.type === 'smart' && (el as any).metadata?.smartType === 'workflow_node')
      .map(el => ({
        id: el.id,
        label: el.content || (el as any).metadata?.workflowNodeData?.label || 'عقدة'
      }));
  }, [elements]);

  // Handle document update
  const handleDocumentUpdate = (updates: Partial<CanvasDocumentElement['documentData']>) => {
    if (selectedDocument) {
      updateElement(selectedDocument.id, {
        documentData: {
          ...selectedDocument.documentData,
          ...updates,
          updatedAt: new Date().toISOString()
        }
      } as any);
    }
  };
  
  const renderPanel = () => {
    // Show DocumentInspector when a document is selected
    if (selectedDocument && selectedDocument.documentData) {
      return (
        <DocumentInspector
          document={selectedDocument.documentData}
          onUpdate={handleDocumentUpdate}
          workflowNodes={workflowNodes}
        />
      );
    }

    // Show FramesNavigator when frame tool is active or frame is selected
    if (activeTool === 'frame_tool' || selectedFrame) {
      return (
        <div className="space-y-4">
          <FramePanel />
          <div className="border-t border-[hsl(var(--border))] pt-4">
            <FramesNavigator />
          </div>
        </div>
      );
    }

    // الاستمرار بالمنطق الطبيعي
    switch (activeTool) {
      case 'selection_tool':
        return <SelectionPanel />;
      case 'smart_pen':
        return <SmartPenPanel />;
      case 'file_uploader':
        return <FileUploadPanel />;
      case 'shapes_tool':
        return <ShapesPanel />;
      case 'smart_element_tool':
        return <SmartElementsPanel />;
      default:
        return null;
    }
  };

  // Dynamic panel title
  const getPanelTitle = () => {
    if (selectedDocument) return 'خصائص المستند';
    if (selectedFrame) return 'خصائص الإطار';
    return panelTitles[activeTool];
  };

  return (
    <div className="w-[320px] h-[calc(100%-32px)] my-4 ml-4 rounded-[18px] bg-white/65 backdrop-blur-[18px] border border-white/60 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.10)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(var(--border))]">
        <h3 className="text-[16px] font-semibold text-[hsl(var(--ink))]">
          {getPanelTitle()}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[hsl(var(--ink-30))] rounded-full transition-colors"
          >
            <X size={18} className="text-[hsl(var(--ink-60))]" />
          </button>
        )}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {renderPanel()}
      </div>
    </div>
  );
};

export default RightSidePanel;
