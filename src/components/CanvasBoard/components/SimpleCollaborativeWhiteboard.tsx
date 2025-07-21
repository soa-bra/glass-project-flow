import React, { useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// استخدام الكومبوننتس الموجودة
import { TopFloatingPanel } from './TopFloatingPanel';
import { AdvancedToolbar } from './AdvancedToolbar';
import { CanvasGrid } from './CanvasGrid';
import { CanvasStatusBar } from './CanvasStatusBar';
import { MiniMap } from './MiniMap';
import { SmartAssistantChat } from './SmartAssistantChat';

// استخدام الأنواع الموجودة
import type { CanvasElement } from '../types';
import type { Participant } from '../types/enhanced';

interface SimpleCollaborativeWhiteboardProps {
  projectId?: string;
  userId?: string;
  className?: string;
}

export const SimpleCollaborativeWhiteboard: React.FC<SimpleCollaborativeWhiteboardProps> = ({
  projectId,
  userId,
  className
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // حالة مبسطة
  const [selectedTool, setSelectedTool] = useState('select');
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(100);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'user-1',
      name: 'المستخدم الحالي',
      role: 'host',
      isOnline: true
    }
  ]);

  // معالجات الأحداث
  const handleToolSelect = useCallback((tool: string) => {
    setSelectedTool(tool);
  }, []);

  const handleInviteParticipant = useCallback(() => {
    const newParticipant: Participant = {
      id: `participant_${Date.now()}`,
      name: `مستخدم ${participants.length + 1}`,
      role: 'editor',
      isOnline: true
    };
    setParticipants(prev => [...prev, newParticipant]);
  }, [participants.length]);

  const handleExport = useCallback((format: 'pdf' | 'png' | 'svg') => {
    console.log(`تصدير بصيغة ${format}...`);
  }, []);

  const handleSave = useCallback(() => {
    console.log('حفظ اللوحة...');
  }, []);

  const handleUpload = useCallback(() => {
    console.log('فتح حوار الرفع...');
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      setSelectedElementIds([]);
    }
  }, [selectedTool]);

  const handleCreateElement = useCallback((type: string, x: number, y: number) => {
    const newElement: CanvasElement = {
      id: `element_${Date.now()}`,
      type: type as any,
      position: { x, y },
      size: { width: 100, height: 100 },
      content: type === 'text' ? 'نص جديد' : ''
    };
    
    setElements(prev => [...prev, newElement]);
  }, []);

  return (
    <div className={cn("relative w-full h-screen overflow-hidden bg-gray-50", className)}>
      {/* الشريط العلوي */}
      <TopFloatingPanel
        participants={participants}
        onInviteParticipant={handleInviteParticipant}
        onExport={handleExport}
        onSave={handleSave}
        onUpload={handleUpload}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        snapEnabled={snapEnabled}
        onToggleSnap={() => setSnapEnabled(!snapEnabled)}
        theme="light"
        onToggleTheme={() => {}}
        showMiniMap={showMiniMap}
        onToggleMiniMap={() => setShowMiniMap(!showMiniMap)}
      />

      {/* اللوحة الرئيسية */}
      <div className="relative w-full h-full">
        <div
          ref={canvasRef}
          className="relative w-full h-full cursor-default"
          onClick={handleCanvasClick}
          style={{
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0'
          }}
        >
          {/* الشبكة */}
          <CanvasGrid showGrid={showGrid} size={24} type="dots" />
          
          {/* العناصر - مساحة فارغة للبداية */}
          <div className="absolute inset-0">
            {elements.map((element) => (
              <div
                key={element.id}
                className={cn(
                  "absolute border-2 rounded shadow-sm cursor-pointer transition-all",
                  selectedElementIds.includes(element.id) 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 bg-white hover:border-blue-300"
                )}
                style={{
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElementIds([element.id]);
                }}
              >
                <div className="p-2 h-full flex items-center justify-center text-sm">
                  {element.content || element.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* الخريطة المصغرة */}
        {showMiniMap && (
          <div className="absolute bottom-4 right-4 z-40">
            <MiniMap
              elements={elements}
              viewportBounds={{
                left: -canvasPosition.x / (zoom / 100),
                top: -canvasPosition.y / (zoom / 100),
                right: (-canvasPosition.x + 800) / (zoom / 100),
                bottom: (-canvasPosition.y + 600) / (zoom / 100)
              }}
              zoom={zoom}
              canvasPosition={canvasPosition}
              onViewportChange={setCanvasPosition}
            />
          </div>
        )}

        {/* شريط الحالة */}
        <div className="absolute bottom-4 left-4 z-40">
          <CanvasStatusBar
            zoom={zoom}
            position={canvasPosition}
            selectedCount={selectedElementIds.length}
            totalElements={elements.length}
            selectedTool={selectedTool}
            gridEnabled={showGrid}
            snapEnabled={snapEnabled}
          />
        </div>
      </div>

      {/* شريط الأدوات السفلي المحسن */}
      <AdvancedToolbar
        selectedTool={selectedTool}
        onToolSelect={handleToolSelect}
        onCreateElement={handleCreateElement}
      />

      {/* معلومات التطوير */}
      <div className="fixed top-2 right-2 z-20 text-xs text-gray-500 bg-white/90 px-3 py-2 rounded-lg shadow border">
        <div className="flex items-center gap-2">
          <span className="text-green-600">●</span>
          <span className="font-semibold">لوحة التخطيط التشاركي</span>
        </div>
        العناصر: {elements.length} • المشاركين: {participants.length} • الزوم: {zoom}%
      </div>

      {/* رسالة ترحيب - تظهر فقط عند عدم وجود عناصر */}
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Card className="p-8 max-w-md text-center bg-white/95 backdrop-blur-sm shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">مرحباً بك!</h2>
            <p className="text-gray-600 mb-4">
              ابدأ بإنشاء عناصر جديدة باستخدام الأدوات في الأسفل، أو اسحب الماوس لتحريك اللوحة.
            </p>
            <div className="text-sm text-gray-500">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span>✓ الأساسيات جاهزة</span>
                <span>🔄 قيد التطوير</span>
              </div>
              <p className="text-xs">جرب الأدوات: النص، المستطيل، الدائرة</p>
            </div>
          </Card>
        </div>
      )}

      {/* AI Assistant Chat */}
      {showAIChat && (
        <div className="fixed left-4 top-20 z-50">
          <SmartAssistantChat
            elements={elements}
            onCreateElement={handleCreateElement}
            onClose={() => setShowAIChat(false)}
          />
        </div>
      )}

      {/* Quick AI Toggle */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
        <Button
          onClick={() => setShowAIChat(!showAIChat)}
          className={cn(
            "w-12 h-12 rounded-full shadow-lg transition-all",
            showAIChat ? "bg-blue-500 text-white" : "bg-white text-blue-500 hover:bg-blue-50"
          )}
          title="المساعد الذكي"
        >
          🤖
        </Button>
      </div>
    </div>
  );
};