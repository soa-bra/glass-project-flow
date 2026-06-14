import React, { useEffect } from 'react';
import { 
  MousePointer2, 
  Pen, 
  StickyNote,
  Type,
  Upload, 
  Shapes,
  Network,
  Lightbulb,
  Search,
  Frame,
  FileText
} from 'lucide-react';
import { useCanvasStore, type ToolId } from '@/stores/canvasStore';
import Dock from '@/components/ui/dock';
import { getBottomToolbarLayoutStyle } from './bottomToolbarLayout';

interface Tool {
  id: ToolId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
  ariaLabel: string;
}

const tools: Tool[] = [
  { 
    id: 'selection_tool', 
    name: 'تحديد', 
    icon: MousePointer2, 
    shortcut: 'V',
    ariaLabel: 'أداة التحديد - اضغط V للتفعيل'
  },
  { 
    id: 'smart_pen', 
    name: 'قلم ذكي', 
    icon: Pen, 
    shortcut: 'P',
    ariaLabel: 'القلم الذكي للرسم الحر - اضغط P للتفعيل'
  },
  { 
    id: 'frame_tool', 
    name: 'إطار', 
    icon: Frame, 
    shortcut: 'F',
    ariaLabel: 'أداة الإطار - اضغط F للتفعيل'
  },
  { 
    id: 'text_tool', 
    name: 'نص', 
    icon: Type, 
    shortcut: 'T',
    ariaLabel: 'أداة النص - اضغط T للتفعيل'
  },
  { 
    id: 'sticky_tool', 
    name: 'ستيكي', 
    icon: StickyNote, 
    shortcut: 'N',
    ariaLabel: 'ملاحظة لاصقة - اضغط N للتفعيل'
  },
  { 
    id: 'file_uploader', 
    name: 'رفع', 
    icon: Upload, 
    shortcut: 'U',
    ariaLabel: 'رفع ملف أو صورة - اضغط U للتفعيل'
  },
  { 
    id: 'shapes_tool', 
    name: 'شكل', 
    icon: Shapes, 
    shortcut: 'E',
    ariaLabel: 'أداة الأشكال الهندسية - اضغط E للتفعيل'
  },
  { 
    id: 'mindmap_tool', 
    name: 'خارطة ذهنية', 
    icon: Network, 
    shortcut: 'M',
    ariaLabel: 'الخارطة الذهنية - اضغط M للتفعيل'
  },
  { 
    id: 'smart_element_tool', 
    name: 'عنصر ذكي', 
    icon: Lightbulb, 
    shortcut: 'S',
    ariaLabel: 'العناصر الذكية المتقدمة - اضغط S للتفعيل'
  },
  { 
    id: 'research_tool', 
    name: 'بحث علمي', 
    icon: Search, 
    shortcut: 'R',
    ariaLabel: 'أداة البحث العلمي - اضغط R للتفعيل'
  },
  { 
    id: 'smart_doc_tool', 
    name: 'مستند ذكي', 
    icon: FileText, 
    shortcut: 'D',
    ariaLabel: 'المستندات الذكية - اضغط D للتفعيل'
  },
];

const READONLY_TOOL_ID: ToolId = 'selection_tool';

const BottomToolbar: React.FC<{ canEdit?: boolean }> = ({ canEdit = true }) => {
  const { activeTool, setActiveTool } = useCanvasStore();

  useEffect(() => {
    if (!canEdit && activeTool !== READONLY_TOOL_ID) {
      setActiveTool(READONLY_TOOL_ID);
    }
  }, [activeTool, canEdit, setActiveTool]);

  const dockItems = tools.map((tool) => {
    const disabled = !canEdit && tool.id !== READONLY_TOOL_ID;

    return {
      icon: tool.icon,
      label: disabled ? `${tool.name} • ${tool.shortcut} • قراءة فقط` : `${tool.name} • ${tool.shortcut}`,
      onClick: () => {
        if (disabled) return;
        setActiveTool(tool.id);
      },
      isActive: activeTool === tool.id,
      disabled,
      ariaLabel: disabled ? `${tool.ariaLabel} - غير متاح في وضع القراءة فقط` : tool.ariaLabel,
      ariaKeyshortcuts: disabled ? undefined : tool.shortcut,
    };
  });

  const toolbarLayoutStyle = getBottomToolbarLayoutStyle(dockItems.length);

  return (
    <nav
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50"
      style={toolbarLayoutStyle}
      role="toolbar"
      aria-label="أدوات الرسم والتصميم"
      aria-orientation="horizontal"
    >
      <Dock 
        items={dockItems} 
        aria-label="شريط الأدوات الرئيسي"
      />
      
      {/* Screen reader instructions */}
      <div className="sr-only" aria-live="polite">
        الأداة المفعلة حالياً: {tools.find(t => t.id === activeTool)?.name}
        {!canEdit ? ' - وضع القراءة فقط، أدوات التحرير غير متاحة' : ''}
      </div>
    </nav>
  );
};

export default BottomToolbar;
