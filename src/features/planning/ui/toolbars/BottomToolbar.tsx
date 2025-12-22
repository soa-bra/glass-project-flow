import React from 'react';
import { 
  MousePointer2, 
  Pen, 
  Square, 
  Upload, 
  Type, 
  Star, 
  Lightbulb 
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
    id: 'frame_tool', 
    name: 'إطار', 
    icon: Square, 
    shortcut: 'F',
    ariaLabel: 'أداة الإطار - اضغط F للتفعيل'
  },
  { 
    id: 'file_uploader', 
    name: 'رفع', 
    icon: Upload, 
    shortcut: 'U',
    ariaLabel: 'رفع ملف أو صورة - اضغط U للتفعيل'
  },
  { 
    id: 'text_tool', 
    name: 'نص', 
    icon: Type, 
    shortcut: 'T',
    ariaLabel: 'أداة النص - اضغط T للتفعيل'
  },
  { 
    id: 'shapes_tool', 
    name: 'أشكال', 
    icon: Star, 
    shortcut: 'R',
    ariaLabel: 'أداة الأشكال الهندسية - اضغط R للتفعيل'
  },
  { 
    id: 'smart_element_tool', 
    name: 'عنصر ذكي', 
    icon: Lightbulb, 
    shortcut: 'S',
    ariaLabel: 'العناصر الذكية المتقدمة - اضغط S للتفعيل'
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
