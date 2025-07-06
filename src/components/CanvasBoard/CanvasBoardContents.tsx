import React, { useState, useRef, useCallback } from 'react';
import { Eye, Users, Calendar, Target, Lightbulb, MessageSquare, Layout, Building, TrendingUp } from 'lucide-react';
import { CanvasItem, FloatingPanel, Tool, PlanningMode } from './types';
import ToolsPanel from './ToolsPanel';
import AIAssistantPanel from './AIAssistantPanel';
import CanvasItemComponent from './CanvasItemComponent';
import CanvasToolbar from './CanvasToolbar';

const CanvasBoardContents: React.FC = () => {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [floatingPanels, setFloatingPanels] = useState<FloatingPanel[]>([
    {
      id: 'tools',
      title: 'أدوات التخطيط',
      isVisible: true,
      position: { x: 20, y: 20 },
      size: { width: 280, height: 400 }
    },
    {
      id: 'ai-assistant',
      title: 'مساعد الذكاء الاصطناعي',
      isVisible: true,
      position: { x: 320, y: 20 },
      size: { width: 300, height: 350 }
    }
  ]);
  
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedPlanningMode, setSelectedPlanningMode] = useState<string>('collaborative');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const tools: Tool[] = [
    { id: 'select', label: 'تحديد', icon: Layout },
    { id: 'sticky-note', label: 'ملاحظة لاصقة', icon: MessageSquare },
    { id: 'task', label: 'مهمة', icon: Target },
    { id: 'idea', label: 'فكرة', icon: Lightbulb },
    { id: 'timeline', label: 'جدول زمني', icon: Calendar },
    { id: 'team', label: 'فريق', icon: Users }
  ];

  const planningModes: PlanningMode[] = [
    { id: 'collaborative', label: 'التخطيط التشاركي', icon: Users },
    { id: 'strategic', label: 'التخطيط الاستراتيجي', icon: Target },
    { id: 'projects', label: 'تخطيط المشاريع', icon: Building },
    { id: 'performance', label: 'تخطيط الأداء', icon: TrendingUp }
  ];

  const colors = [
    'bg-yellow-200', 'bg-blue-200', 'bg-green-200', 
    'bg-pink-200', 'bg-purple-200', 'bg-orange-200'
  ];

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItem: CanvasItem = {
      id: Date.now().toString(),
      type: selectedTool as any,
      title: `عنصر جديد ${canvasItems.length + 1}`,
      content: 'اضغط للتحرير',
      position: { x, y },
      color: colors[Math.floor(Math.random() * colors.length)],
      tags: [],
      priority: 'medium',
      status: 'pending'
    };

    setCanvasItems(prev => [...prev, newItem]);
  }, [selectedTool, canvasItems.length, colors]);

  const handleItemUpdate = (id: string, updates: Partial<CanvasItem>) => {
    setCanvasItems(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const handleItemDelete = (id: string) => {
    setCanvasItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = canvasItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      {/* Top Toolbar */}
      <CanvasToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 pt-20 cursor-crosshair"
        onClick={handleCanvasClick}
      >
        {filteredItems.map(item => (
          <CanvasItemComponent
            key={item.id}
            item={item}
            onUpdate={handleItemUpdate}
            onDelete={handleItemDelete}
          />
        ))}
      </div>

      {/* Floating Panels */}
      {floatingPanels.map(panel => (
        panel.isVisible && (
          <div
            key={panel.id}
            className="absolute z-40"
            style={{
              left: panel.position.x,
              top: panel.position.y + 80, // Account for toolbar
              width: panel.size.width,
              height: panel.size.height
            }}
          >
            {panel.id === 'tools' && (
              <ToolsPanel
                tools={tools}
                planningModes={planningModes}
                selectedTool={selectedTool}
                selectedPlanningMode={selectedPlanningMode}
                colors={colors}
                onToolSelect={setSelectedTool}
                onPlanningModeSelect={setSelectedPlanningMode}
              />
            )}
            {panel.id === 'ai-assistant' && <AIAssistantPanel />}
          </div>
        )
      ))}

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-black/10 p-2">
        <div className="flex items-center justify-between text-sm text-black/70">
          <div className="flex items-center gap-4">
            <span>العناصر: {canvasItems.length}</span>
            <span>المحددة: {selectedItems.length}</span>
            <span>النمط: {planningModes.find(m => m.id === selectedPlanningMode)?.label}</span>
            <span>الأداة: {tools.find(t => t.id === selectedTool)?.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasBoardContents;