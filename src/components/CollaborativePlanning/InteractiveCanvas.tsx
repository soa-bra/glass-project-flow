
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Move,
  Square,
  Circle,
  Type,
  Palette,
  Trash2,
  Copy,
  Link,
  Zap
} from 'lucide-react';
import { CanvasElement, PlanningSession } from './CollaborativePlanningModule';

interface InteractiveCanvasProps {
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
  session: PlanningSession;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  elements,
  onElementsChange,
  session
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedTool, setSelectedTool] = useState<'select' | 'idea' | 'task' | 'note' | 'connection'>('select');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const tools = [
    { id: 'select', icon: Move, name: 'تحديد', color: 'bg-gray-100' },
    { id: 'idea', icon: Circle, name: 'فكرة', color: 'bg-yellow-100' },
    { id: 'task', icon: Square, name: 'مهمة', color: 'bg-blue-100' },
    { id: 'note', icon: Type, name: 'ملاحظة', color: 'bg-green-100' },
    { id: 'connection', icon: Link, name: 'ربط', color: 'bg-purple-100' }
  ];

  const priorityColors = {
    low: 'bg-gray-200 border-gray-300',
    medium: 'bg-yellow-200 border-yellow-300',
    high: 'bg-orange-200 border-orange-300',
    critical: 'bg-red-200 border-red-300'
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (selectedTool === 'select') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: selectedTool as 'idea' | 'task' | 'note',
      position: { x, y },
      content: selectedTool === 'idea' ? 'فكرة جديدة' : 
               selectedTool === 'task' ? 'مهمة جديدة' : 'ملاحظة جديدة',
      color: selectedTool === 'idea' ? '#fef3c7' : 
             selectedTool === 'task' ? '#dbeafe' : '#dcfce7',
      priority: 'medium',
      tags: [],
      culturalAlignment: 75
    };

    onElementsChange([...elements, newElement]);
  };

  const handleElementClick = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedElement(elementId);
  };

  const handleElementDelete = (elementId: string) => {
    onElementsChange(elements.filter(el => el.id !== elementId));
    setSelectedElement(null);
  };

  const handleElementDuplicate = (elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      const newElement = {
        ...element,
        id: Date.now().toString(),
        position: { x: element.position.x + 20, y: element.position.y + 20 }
      };
      onElementsChange([...elements, newElement]);
    }
  };

  const updateElementContent = (elementId: string, content: string) => {
    onElementsChange(elements.map(el => 
      el.id === elementId ? { ...el, content } : el
    ));
  };

  const updateElementPriority = (elementId: string, priority: CanvasElement['priority']) => {
    onElementsChange(elements.map(el => 
      el.id === elementId ? { ...el, priority } : el
    ));
  };

  return (
    <div className="space-y-4">
      {/* Floating Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg border shadow-sm">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool(tool.id as any)}
            className="flex items-center gap-2"
          >
            <tool.icon className="h-4 w-4" />
            <span className="hidden md:inline">{tool.name}</span>
          </Button>
        ))}
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <Button variant="outline" size="sm">
          <Palette className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm">
          <Zap className="h-4 w-4" />
          <span className="hidden md:inline">AI مساعد</span>
        </Button>
      </div>

      {/* Canvas */}
      <div className="relative">
        <div
          ref={canvasRef}
          className="w-full h-96 bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200 rounded-lg relative overflow-hidden cursor-crosshair"
          onClick={handleCanvasClick}
          style={{ minHeight: '500px' }}
        >
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Canvas Elements */}
          {elements.map((element) => (
            <div
              key={element.id}
              className={`
                absolute p-3 rounded-lg border-2 cursor-pointer transform transition-all duration-200 hover:scale-105 min-w-24 min-h-16
                ${priorityColors[element.priority]}
                ${selectedElement === element.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              `}
              style={{
                left: element.position.x,
                top: element.position.y,
                backgroundColor: element.color
              }}
              onClick={(e) => handleElementClick(element.id, e)}
            >
              <div className="text-sm font-medium text-gray-800 mb-1">
                {element.content}
              </div>
              
              {element.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {element.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {selectedElement === element.id && (
                <div className="absolute -top-2 -right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-6 h-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleElementDuplicate(element.id);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-6 h-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleElementDelete(element.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Empty State */}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Plus className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">ابدأ بإضافة عناصر للكانفاس</p>
                <p className="text-sm">اختر أداة من الشريط أعلاه واضغط على الكانفاس</p>
              </div>
            </div>
          )}
        </div>

        {/* Element Inspector */}
        {selectedElement && (
          <Card className="absolute top-4 right-4 w-64 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">تحرير العنصر</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    المحتوى
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md text-sm"
                    value={elements.find(el => el.id === selectedElement)?.content || ''}
                    onChange={(e) => updateElementContent(selectedElement, e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    الأولوية
                  </label>
                  <select
                    className="w-full p-2 border rounded-md text-sm"
                    value={elements.find(el => el.id === selectedElement)?.priority || 'medium'}
                    onChange={(e) => updateElementPriority(selectedElement, e.target.value as any)}
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                    <option value="critical">حرجة</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
