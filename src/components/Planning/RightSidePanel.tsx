import React from 'react';
import { X } from 'lucide-react';
import type { ToolId } from '@/types/canvas';
import SelectionPanel from './panels/SelectionPanel';
import SmartPenPanel from './panels/SmartPenPanel';
import FramePanel from './panels/FramePanel';
import FileUploadPanel from './panels/FileUploadPanel';
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
  
  const renderPanel = () => {
    // الاستمرار بالمنطق الطبيعي - بدون text_tool لأنه يملك شريط عائم خاص
    switch (activeTool) {
      case 'selection_tool':
        return <SelectionPanel />;
      case 'smart_pen':
        return <SmartPenPanel />;
      case 'frame_tool':
        return <FramePanel />;
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
  
  const panelTitle = panelTitles[activeTool];

  return (
    <div className="w-[320px] h-[calc(100%-32px)] my-4 ml-4 rounded-[18px] bg-white/65 backdrop-blur-[18px] border border-white/60 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.10)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(var(--border))]">
        <h3 className="text-[16px] font-semibold text-[hsl(var(--ink))]">
          {panelTitle}
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
