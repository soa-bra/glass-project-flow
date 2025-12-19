import React from 'react';
import { X } from 'lucide-react';
import type { ToolId } from '@/types/canvas';
import { useCanvasStore } from '@/stores/canvasStore';
import SelectionPanel from './panels/SelectionPanel';
import SmartPenPanel from './panels/SmartPenPanel';
import FramePanel from './panels/FramePanel';
import FileUploadPanel from './panels/FileUploadPanel';
import TextPanel from './panels/TextPanel';
import ShapesPanel from './panels/ShapesPanel';
import SmartElementsPanel from './panels/SmartElementsPanel';

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
  // الحصول على حالة التحرير
  const editingTextId = useCanvasStore(state => state.editingTextId);
  
  const renderPanel = () => {
    // أولوية لعرض TextPanel إذا كان هناك نص قيد التحرير
    if (editingTextId) {
      return <TextPanel />;
    }
    
    // الاستمرار بالمنطق الطبيعي
    switch (activeTool) {
      case 'selection_tool':
        return <SelectionPanel />;
      case 'smart_pen':
        return <SmartPenPanel />;
      case 'frame_tool':
        return <FramePanel />;
      case 'file_uploader':
        return <FileUploadPanel />;
      case 'text_tool':
        return <TextPanel />;
      case 'shapes_tool':
        return <ShapesPanel />;
      case 'smart_element_tool':
        return <SmartElementsPanel />;
      default:
        return null;
    }
  };
  
  // تحديث العنوان ديناميكياً
  const panelTitle = editingTextId 
    ? 'النص' 
    : panelTitles[activeTool];

  return (
    <div className="w-[320px] h-full bg-white border-l border-[#DADCE0] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#DADCE0]">
        <h3 className="text-[16px] font-semibold text-[hsl(var(--ink))]">
          {panelTitle}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
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
