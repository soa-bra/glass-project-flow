import React, { useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// استخدام الكومبوننتس الموجودة
import { TopFloatingPanel } from './TopFloatingPanel';
import { MainToolbar } from './';
import { CanvasGrid } from './CanvasGrid';
import { CanvasStatusBar } from './CanvasStatusBar';
import { MiniMap } from './MiniMap';

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
                className="absolute border-2 border-gray-300 bg-white rounded shadow-sm"
                style={{
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height
                }}
              >
                {element.content}
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

      {/* شريط الأدوات السفلي */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <MainToolbar
          selectedTool={selectedTool}
          onToolSelect={handleToolSelect}
        />
      </div>

      {/* معلومات التطوير */}
      <div className="fixed top-2 right-2 z-20 text-xs text-gray-500 bg-white/90 px-3 py-2 rounded-lg shadow">
        🚀 لوحة التخطيط التشاركي - الإصدار التجريبي
        <br />
        العناصر: {elements.length} • المشاركين: {participants.length} • الزوم: {zoom}%
      </div>

      {/* رسالة ترحيب */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Card className="p-8 max-w-md text-center bg-white/95 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">مرحباً بك!</h2>
          <p className="text-gray-600 mb-4">
            هذه لوحة التخطيط التشاركي الذكية. ابدأ بإنشاء عناصر جديدة باستخدام الأدوات في الأسفل.
          </p>
          <div className="text-sm text-gray-500">
            الأساسيات جاهزة ✓<br />
            الأدوات المتقدمة قيد التطوير 🔄
          </div>
        </Card>
      </div>
    </div>
  );
};