import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer2, 
  Bot, 
  Wrench, 
  Settings, 
  Repeat,
  Download,
  FileText,
  Lightbulb,
  GitBranch,
  Calendar,
  Link,
  Grid3X3,
  StickyNote,
  Terminal,
  MessageSquare,
  Mic,
  Eye,
  Activity,
  History,
  FileBarChart,
  Quote,
  Minimize2,
  Zap,
  Type,
  Square,
  FileSearch,
  Palette
} from 'lucide-react';

interface CanvasBoardContentsProps {
  projectId: string;
  userId: string;
  userRole: 'manager' | 'team_member' | 'guest';
}

interface CanvasElement {
  id: string;
  type: 'sticky_note' | 'text' | 'shape' | 'mindmap' | 'timeline';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  color: string;
  locked: boolean;
  layerId: string;
}

interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: CanvasElement[];
}

const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = ({
  projectId,
  userId,
  userRole
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [layers, setLayers] = useState<CanvasLayer[]>([
    {
      id: 'layer-1',
      name: 'الطبقة الأساسية',
      visible: true,
      locked: false,
      elements: []
    }
  ]);
  const [activeLayer, setActiveLayer] = useState<string>('layer-1');
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Floating Panel States
  const [showInspector, setShowInspector] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // Canvas interaction handlers
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [selectedTool, pan]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && selectedTool === 'pan') {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, selectedTool, dragStart]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Tool handlers
  const handleToolSelect = useCallback((tool: string) => {
    setSelectedTool(tool);
    setActiveTool(tool);
  }, []);

  const addElement = useCallback((type: CanvasElement['type'], x: number, y: number) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type,
      x,
      y,
      width: type === 'sticky_note' ? 200 : 150,
      height: type === 'sticky_note' ? 150 : 100,
      content: '',
      color: 'hsl(var(--accent))',
      locked: false,
      layerId: activeLayer
    };

    setLayers(prev => prev.map(layer => 
      layer.id === activeLayer 
        ? { ...layer, elements: [...layer.elements, newElement] }
        : layer
    ));
  }, [activeLayer]);

  // Floating Panel Components
  const FloatingPanel: React.FC<{
    position: string;
    children: React.ReactNode;
    className?: string;
  }> = ({ position, children, className = '' }) => {
    const positionClasses = {
      'top-right': 'top-4 right-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
      'bottom-left': 'bottom-4 left-4'
    };

    return (
      <div className={`fixed ${positionClasses[position as keyof typeof positionClasses]} z-50 ${className}`}>
        <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-lg">
          {children}
        </Card>
      </div>
    );
  };

  const MainToolbarComponent: React.FC = () => (
    <FloatingPanel position="bottom-center">
      <div className="flex items-center gap-2 p-3">
        <Button
          variant={selectedTool === 'select' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('select')}
        >
          <MousePointer2 className="w-4 h-4" />
        </Button>
        <Button
          variant={selectedTool === 'sticky_note' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('sticky_note')}
        >
          <StickyNote className="w-4 h-4" />
        </Button>
        <Button
          variant={selectedTool === 'text' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('text')}
        >
          <Type className="w-4 h-4" />
        </Button>
        <Button
          variant={selectedTool === 'shape' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('shape')}
        >
          <Square className="w-4 h-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant={selectedTool === 'mindmap' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('mindmap')}
        >
          <GitBranch className="w-4 h-4" />
        </Button>
        <Button
          variant={selectedTool === 'timeline' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('timeline')}
        >
          <Calendar className="w-4 h-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAIPanel(!showAIPanel)}
        >
          <Bot className="w-4 h-4" />
        </Button>
      </div>
    </FloatingPanel>
  );

  const InspectorPanel: React.FC = () => (
    showInspector && (
      <FloatingPanel position="top-right" className="w-80">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">خصائص العنصر</h3>
          {selectedElement ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">النوع</label>
                <p className="text-sm text-muted-foreground">ملاحظة لاصقة</p>
              </div>
              <div>
                <label className="text-sm font-medium">الموقع</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input 
                    type="number" 
                    placeholder="X" 
                    className="text-sm p-2 border rounded"
                  />
                  <input 
                    type="number" 
                    placeholder="Y" 
                    className="text-sm p-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">الحجم</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input 
                    type="number" 
                    placeholder="العرض" 
                    className="text-sm p-2 border rounded"
                  />
                  <input 
                    type="number" 
                    placeholder="الارتفاع" 
                    className="text-sm p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">اختر عنصر لتحرير خصائصه</p>
          )}
        </div>
      </FloatingPanel>
    )
  );

  const AIPanelComponent: React.FC = () => (
    showAIPanel && (
      <FloatingPanel position="bottom-right" className="w-96">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">مساعد الذكاء الاصطناعي</h3>
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Zap className="w-4 h-4 mr-2" />
              العصف الذهني الذكي
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Palette className="w-4 h-4 mr-2" />
              لوحة المزاج الذكية
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileSearch className="w-4 h-4 mr-2" />
              تحليل الملفات
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              مراجعة ذكية
            </Button>
          </div>
        </div>
      </FloatingPanel>
    )
  );

  const CanvasGrid: React.FC = () => (
    showGrid ? (
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          transform: `translate(${pan.x % (20 * zoom)}px, ${pan.y % (20 * zoom)}px)`
        }}
      />
    ) : null
  );

  const LayerSystem: React.FC = () => (
    <div className="fixed top-4 left-4 z-40">
      <Card className="bg-background/90 backdrop-blur-sm border-border/50 p-4 w-64">
        <h3 className="text-sm font-semibold mb-3">الطبقات</h3>
        <div className="space-y-2">
          {layers.map(layer => (
            <div 
              key={layer.id}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                activeLayer === layer.id ? 'bg-accent' : 'hover:bg-accent/50'
              }`}
              onClick={() => setActiveLayer(layer.id)}
            >
              <span className="text-sm">{layer.name}</span>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  {layer.elements.length}
                </Badge>
                {layer.locked && <Badge variant="outline" className="text-xs">🔒</Badge>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderCanvasElements = () => {
    const currentLayer = layers.find(l => l.id === activeLayer);
    if (!currentLayer || !currentLayer.visible) return null;

    return currentLayer.elements.map(element => (
      <div
        key={element.id}
        className={`absolute border-2 rounded-lg cursor-pointer transition-all ${
          selectedElement === element.id 
            ? 'border-primary shadow-lg' 
            : 'border-border/50 hover:border-border'
        }`}
        style={{
          left: element.x * zoom + pan.x,
          top: element.y * zoom + pan.y,
          width: element.width * zoom,
          height: element.height * zoom,
          backgroundColor: element.color,
          transform: `scale(${zoom})`
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(element.id);
          setShowInspector(true);
        }}
      >
        <div className="p-2 h-full flex items-center justify-center">
          <span className="text-sm text-center">
            {element.content || `${element.type} جديد`}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onClick={(e) => {
          if (selectedTool !== 'select' && selectedTool !== 'pan') {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
              const x = (e.clientX - rect.left - pan.x) / zoom;
              const y = (e.clientY - rect.top - pan.y) / zoom;
              addElement(selectedTool as CanvasElement['type'], x, y);
            }
          } else {
            setSelectedElement(null);
            setShowInspector(false);
          }
        }}
      >
        <CanvasGrid />
        {renderCanvasElements()}
      </div>

      {/* Floating Panels */}
      <LayerSystem />
      <MainToolbarComponent />
      <InspectorPanel />
      <AIPanelComponent />

      {/* Status Bar */}
      <div className="fixed bottom-4 right-4 left-4 z-30 pointer-events-none">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              المشروع: {projectId}
            </Badge>
            <Badge variant="outline">
              المستخدم: {userId}
            </Badge>
            <Badge variant={userRole === 'manager' ? 'default' : 'secondary'}>
              الدور: {userRole === 'manager' ? 'مدير' : userRole === 'team_member' ? 'عضو فريق' : 'ضيف'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              التكبير: {Math.round(zoom * 100)}%
            </Badge>
            <Badge variant="outline">
              العناصر: {layers.reduce((sum, layer) => sum + layer.elements.length, 0)}
            </Badge>
          </div>
        </div>
      </div>

      {/* AI Command Console - Hidden by default, activated by keyboard shortcut */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] hidden">
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-2xl mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">وحدة التحكم الذكية</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="اكتب أمرًا ذكيًا..." 
                className="w-full p-3 border rounded-lg"
              />
              <div className="flex gap-2">
                <Button>تنفيذ</Button>
                <Button variant="outline">إلغاء</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CanvasBoardContents;