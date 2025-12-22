import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import type { ToolId } from '@/types/canvas';
import { useCanvasStore } from '@/stores/canvasStore';
import FileUploadPanel from './FileUploadToolZone';
import TextPanel from './TextPanel';
import ShapesPanel from './ShapesToolZone';
import SmartElementsPanel from './SmartElementsToolZone';
import ResearchToolZone from './ResearchToolZone';

interface ToolZoneProps {
  activeTool: ToolId;
  onClose?: () => void;
}

const panelTitles: Record<ToolId, string> = {
  selection_tool: 'أدوات التحديد',
  smart_pen: 'القلم الذكي',
  sticky_tool: 'ستيكي نوت',
  text_tool: 'النص',
  file_uploader: 'رفع الملفات',
  shapes_tool: 'الأشكال',
  mindmap_tool: 'الخريطة الذهنية',
  smart_element_tool: 'العناصر الذكية',
  research_tool: 'أداة الريسيرش',
  frame_tool: 'الإطار',
};

// الأدوات التي لا تحتوي على لوحة خاصة
const toolsWithoutPanel: ToolId[] = [
  'selection_tool',
  'smart_pen',
  'sticky_tool',
  'mindmap_tool',
  'frame_tool',
];

const ToolZone: React.FC<ToolZoneProps> = ({ activeTool, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // الحصول على حالة التحرير
  const editingTextId = useCanvasStore(state => state.editingTextId);
  
  // طي تلقائي للأدوات بدون panel
  useEffect(() => {
    if (toolsWithoutPanel.includes(activeTool) && !editingTextId) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [activeTool, editingTextId]);
  
  const renderPanel = () => {
    // أولوية لعرض TextPanel إذا كان هناك نص قيد التحرير
    if (editingTextId) {
      return <TextPanel />;
    }
    
    // الاستمرار بالمنطق الطبيعي
    switch (activeTool) {
      case 'file_uploader':
        return <FileUploadPanel />;
      case 'text_tool':
        return <TextPanel />;
      case 'shapes_tool':
        return <ShapesPanel />;
      case 'smart_element_tool':
        return <SmartElementsPanel />;
      case 'research_tool':
        return <ResearchToolZone />;
      // الأدوات بدون panel
      case 'selection_tool':
      case 'smart_pen':
      case 'sticky_tool':
      case 'mindmap_tool':
      case 'frame_tool':
        return (
          <div className="p-4 text-center text-[hsl(var(--ink-60))] text-[13px]">
            <p>استخدم الأداة مباشرة على الكانفس</p>
            <p className="text-[11px] mt-2">أو حدد عنصرًا لعرض خصائصه</p>
          </div>
        );
      default:
        return null;
    }
  };
  
  // تحديث العنوان ديناميكياً
  const panelTitle = editingTextId 
    ? 'النص' 
    : panelTitles[activeTool];

  // إذا كان مطوياً بالكامل، عرض شريط صغير فقط
  if (isCollapsed) {
    return (
      <div 
        className="fixed top-24 right-4 z-40 bg-white/95 backdrop-blur-[12px] 
          border border-[hsl(var(--border))] rounded-[18px] shadow-[0_4px_24px_rgba(0,0,0,0.12)]
          p-2 cursor-pointer hover:bg-white transition-all"
        onClick={() => setIsCollapsed(false)}
      >
        <ChevronLeft size={20} className="text-[hsl(var(--ink-60))]" />
      </div>
    );
  }

  return (
    <div className="fixed top-24 right-4 z-40 w-[320px] max-h-[calc(100vh-120px)] 
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
            <ChevronRight size={18} className="text-[hsl(var(--ink-60))]" />
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
