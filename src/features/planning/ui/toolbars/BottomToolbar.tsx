import React from 'react';
import { 
  MousePointer2, 
  Pen, 
  StickyNote,
  Type,
  Upload, 
  Shapes,
  Network,
  Lightbulb,
  Search
} from 'lucide-react';
import { useCanvasStore, type ToolId } from '@/stores/canvasStore';
import Dock from '@/components/ui/dock';

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
    id: 'sticky_tool', 
    name: 'ستيكي', 
    icon: StickyNote, 
    shortcut: 'N',
    ariaLabel: 'ملاحظة لاصقة - اضغط N للتفعيل'
  },
  { 
    id: 'text_tool', 
    name: 'نص', 
    icon: Type, 
    shortcut: 'T',
    ariaLabel: 'أداة النص - اضغط T للتفعيل'
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
    shortcut: 'R',
    ariaLabel: 'أداة الأشكال الهندسية - اضغط R للتفعيل'
  },
  { 
    id: 'mindmap_tool', 
    name: 'مايندماب', 
    icon: Network, 
    shortcut: 'M',
    ariaLabel: 'الخريطة الذهنية - اضغط M للتفعيل'
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
    name: 'ريسيرش', 
    icon: Search, 
    shortcut: 'Q',
    ariaLabel: 'أداة البحث والريسيرش - اضغط Q للتفعيل'
  },
];

const BottomToolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useCanvasStore();

  const dockItems = tools.map((tool) => ({
    icon: tool.icon,
    label: `${tool.name} • ${tool.shortcut}`,
    onClick: () => setActiveTool(tool.id),
    isActive: activeTool === tool.id,
    ariaLabel: tool.ariaLabel,
    ariaKeyshortcuts: tool.shortcut,
  }));

  return (
    <nav 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
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
      </div>
    </nav>
  );
};

export default BottomToolbar;
