// Whiteboard Topbar Component
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointer2, 
  Hand, 
  Square, 
  Circle, 
  Minus, 
  ArrowRight,
  Type,
  StickyNote,
  Brain,
  Link,
  Workflow,
  Save,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

interface WhiteboardTopbarProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  onSmartToolClick: () => void;
  onConnectorClick: () => void;
  onWF01Click?: () => void;
  onSaveClick?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onGridToggle?: () => void;
  zoom: number;
  'data-test-id'?: string;
}

const WhiteboardTopbar: React.FC<WhiteboardTopbarProps> = ({
  selectedTool,
  onToolChange,
  onSmartToolClick,
  onConnectorClick,
  onWF01Click,
  onSaveClick,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  zoom,
  'data-test-id': testId
}) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'تحديد', shortcut: 'S' },
    { id: 'pan', icon: Hand, label: 'سحب', shortcut: 'H' },
    { id: 'rectangle', icon: Square, label: 'مستطيل', shortcut: 'R' },
    { id: 'ellipse', icon: Circle, label: 'دائرة', shortcut: 'E' },
    { id: 'line', icon: Minus, label: 'خط', shortcut: 'L' },
    { id: 'arrow', icon: ArrowRight, label: 'سهم', shortcut: 'A' },
    { id: 'text', icon: Type, label: 'نص', shortcut: 'T' },
    { id: 'sticky', icon: StickyNote, label: 'ملاحظة', shortcut: 'Y' },
  ];

  return (
    <div 
      className="flex items-center gap-2 p-3 bg-background/95 backdrop-blur-sm border-b"
      data-test-id={testId}
    >
      {/* Selection Tools */}
      <div className="flex items-center gap-1">
        {tools.slice(0, 2).map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "outline"}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className="flex items-center gap-2"
            title={`${tool.label} (${tool.shortcut})`}
            data-test-id={`btn-tool-${tool.id}`}
          >
            <tool.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tool.label}</span>
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Drawing Tools */}
      <div className="flex items-center gap-1">
        {tools.slice(2).map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "outline"}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className="flex items-center gap-2"
            title={`${tool.label} (${tool.shortcut})`}
            data-test-id={`btn-tool-${tool.id}`}
          >
            <tool.icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Smart Elements */}
      <Button
        variant={selectedTool === 'smart' ? "default" : "outline"}
        size="sm"
        onClick={onSmartToolClick}
        className="flex items-center gap-2"
        title="العناصر الذكية (S)"
        data-test-id="btn-smart-tool"
      >
        <Brain className="w-4 h-4" />
        <span className="hidden sm:inline">عناصر ذكية</span>
      </Button>

      {/* Connector */}
      <Button
        variant={selectedTool === 'connector' ? "default" : "outline"}
        size="sm"
        onClick={onConnectorClick}
        className="flex items-center gap-2"
        title="الموصل (C)"
        data-test-id="btn-connector"
      >
        <Link className="w-4 h-4" />
        <span className="hidden sm:inline">موصل</span>
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* WF-01 */}
      <Button
        variant="outline"
        size="sm"
        onClick={onWF01Click}
        className="flex items-center gap-2 text-primary border-primary hover:bg-primary hover:text-primary-foreground"
        title="تحويل إلى مشروع"
        data-test-id="btn-wf01"
      >
        <Workflow className="w-4 h-4" />
        <span className="hidden sm:inline">WF-01</span>
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          title="تصغير"
          data-test-id="btn-zoom-out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <Badge variant="outline" className="px-2 py-1 font-mono">
          {Math.round(zoom * 100)}%
        </Badge>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          title="تكبير"
          data-test-id="btn-zoom-in"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomReset}
          title="إعادة تعيين التكبير"
          data-test-id="btn-zoom-reset"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Actions */}
      <div className="mr-auto flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveClick}
          className="flex items-center gap-2"
          title="حفظ (Ctrl+S)"
          data-test-id="btn-save"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">حفظ</span>
        </Button>
      </div>
    </div>
  );
};

export default WhiteboardTopbar;