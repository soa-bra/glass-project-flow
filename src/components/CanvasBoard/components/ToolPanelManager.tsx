import React from 'react';
import { 
  TextPanel, 
  ShapePanel, 
  HandPanel,
  UploadPanel,
  GridPanel
} from '../panels';
import LayersPanel from '../panels/LayersPanel';
import ElementCustomizationPanel from '../panels/ElementCustomizationPanel';
import AIAssistantPanel from '../panels/AIAssistantPanel';
import { CollabBar } from '../collaboration/CollabBar';
import { 
  EnhancedSelectionPanel,
  EnhancedSmartPenPanel,
  EnhancedSmartElementPanel,
  EnhancedZoomPanel,
  EnhancedCommentPanel
} from '../panels/enhanced';
import { CanvasElement } from '../types';
import { Layer } from './CanvasPanelTypes';

interface ToolPanelManagerProps {
  selectedTool: string;
  selectedElements: CanvasElement[];
  selectedElementIds: string[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  panSpeed: number;
  lineWidth: number;
  lineStyle: string;
  selectedPenMode: string;
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize: number;
  gridShape: string;
  layers: Layer[];
  selectedLayerId: string | null;
  
  // Handlers
  onUpdateElement: (elementId: string, updates: any) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onZoomChange: (zoom: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  onPanSpeedChange: (speed: number) => void;
  onLineWidthChange: (width: number) => void;
  onLineStyleChange: (style: string) => void;
  onPenModeSelect: (mode: string) => void;
  onFileUpload: (files: File[]) => void;
  onLayerReorder: (layers: Layer[]) => void;
  onLayerSelect: (layerId: string, multiSelect?: boolean) => void;
  onGridToggle: () => void;
  onSnapToggle: () => void;
  onGridSizeChange: (size: number) => void;
  onGridShapeChange: (shape: string) => void;
  onAlignToGrid: () => void;
}

const ToolPanelManager: React.FC<ToolPanelManagerProps> = ({
  selectedTool,
  selectedElements,
  selectedElementIds,
  zoom,
  canvasPosition,
  panSpeed,
  lineWidth,
  lineStyle,
  selectedPenMode,
  showGrid,
  snapEnabled,
  gridSize,
  gridShape,
  layers,
  selectedLayerId,
  onUpdateElement,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup,
  onZoomChange,
  onPositionChange,
  onFitToScreen,
  onResetView,
  onPanSpeedChange,
  onLineWidthChange,
  onLineStyleChange,
  onPenModeSelect,
  onFileUpload,
  onLayerReorder,
  onLayerSelect,
  onGridToggle,
  onSnapToggle,
  onGridSizeChange,
  onGridShapeChange,
  onAlignToGrid
}) => {

  const renderRightPanels = () => (
    <div className="fixed top-4 right-4 z-40 w-80 space-y-4 h-[calc(100vh-2rem)] flex flex-col">
      {/* لوحة تخصيص مظهر العنصر - 20% */}
      <div className="flex-none" style={{ height: '20%' }}>
        <ElementCustomizationPanel
          selectedElement={selectedElements[0]}
          onUpdateElement={(updates) => {
            if (selectedElements[0]) {
              onUpdateElement(selectedElements[0].id, updates);
            }
          }}
        />
      </div>
      
      {/* لوحة الطبقات - 50% */}
      <div className="flex-1" style={{ height: '50%', overflow: 'hidden' }}>
        <LayersPanel
          layers={layers}
          selectedLayerIds={selectedElementIds}
          onLayerUpdate={onLayerReorder}
          onLayerSelect={onLayerSelect}
        />
      </div>
      
      {/* لوحة المساعد الذكي - 30% */}
      <div className="flex-none" style={{ height: '30%' }}>
        <AIAssistantPanel
          onSmartFinish={() => console.log('إنهاء ذكي')}
          onSmartReview={() => console.log('مراجعة ذكية')}
          onSmartClean={() => console.log('تنظيف ذكي')}
          onSendMessage={(msg) => console.log('رسالة:', msg)}
        />
      </div>
    </div>
  );

  const renderLeftPanels = () => (
    <div className="fixed top-4 left-4 z-40 w-80 space-y-4 h-[calc(100vh-2rem)] flex flex-col">
      {/* لوحة المشاركة والتواصل - 30% */}
      <div className="flex-none" style={{ height: '30%' }}>
        <CollabBar projectId="current-project" currentUserId="user1" isHost={true} />
      </div>
      
      {/* لوحة تخصيص الأدوات - 70% */}
      <div className="flex-1" style={{ height: '70%', overflow: 'hidden' }}>
        {renderToolCustomizationPanel()}
      </div>
    </div>
  );

  const renderToolCustomizationPanel = () => {
    switch (selectedTool) {
      case 'select':
        return (
          <EnhancedSelectionPanel
            selectedElements={selectedElements}
            onUpdateElement={onUpdateElement}
            onCopy={onCopy}
            onCut={onCut}
            onPaste={onPaste}
            onDelete={onDelete}
            onGroup={onGroup}
            onUngroup={() => console.log('إلغاء التجميع')}
            onLock={() => console.log('قفل')}
            onUnlock={() => console.log('إلغاء القفل')}
            onDuplicate={() => console.log('تكرار')}
            onFlipHorizontal={() => console.log('قلب أفقي')}
            onFlipVertical={() => console.log('قلب عمودي')}
            onRotate={(angle) => console.log('دوران:', angle)}
            onAlign={(type) => console.log('محاذاة:', type)}
            onDistribute={(type) => console.log('توزيع:', type)}
            layers={[]}
            onLayerReorder={() => {}}
          />
        );

      case 'smart-pen':
        return (
          <div className="bg-[#f7f8f9] backdrop-blur-xl shadow-sm border border-black/10 rounded-[30px] p-4 h-full">
            <h3 className="text-lg font-arabic text-black mb-4">القلم الذكي</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <h4 className="text-sm font-medium font-arabic text-black mb-2">التصميم</h4>
                <div className="text-xs text-gray-600 font-arabic space-y-1">
                  <div>🎨 رسم ذكي: يحول الرسومات لأشكال هندسية</div>
                  <div>⭕ تجميع: رسم حلقة حول العناصر لتجميعها</div>
                  <div>🧹 مسح: الخربشة فوق عنصر لحذفه</div>
                  <div>🔗 جذر ذكي: ربط عنصرين بخط ذكي</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                <div className="text-xs text-blue-800 font-arabic">
                  💡 النظام يتعرف تلقائياً على الوضع المطلوب بناءً على طريقة الرسم
                </div>
              </div>
            </div>
          </div>
        );

      case 'comment':
        return (
          <div className="bg-[#f7f8f9] backdrop-blur-xl shadow-sm border border-black/10 rounded-[30px] p-4 h-full">
            <h3 className="text-lg font-arabic text-black mb-4">التعليقات التفاعلية</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <h4 className="text-sm font-medium font-arabic text-black mb-2">تعليق نصي</h4>
                <div className="text-xs text-gray-600 font-arabic">
                  تخصيص فقاعات التعليقات النصية
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <h4 className="text-sm font-medium font-arabic text-black mb-2">رسم توضيحي</h4>
                <div className="text-xs text-gray-600 font-arabic">
                  يتطلب صلاحية من المضيف • يُحذف تلقائياً عند إلغاء التحديد
                </div>
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="bg-[#f7f8f9] backdrop-blur-xl shadow-sm border border-black/10 rounded-[30px] p-4 h-full">
            <h3 className="text-lg font-arabic text-black mb-4">أداة النص</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <h4 className="text-sm font-medium font-arabic text-black mb-2">خصائص النص</h4>
                <div className="text-xs text-gray-600 font-arabic">
                  انقر في أي مكان على الكانفاس لإضافة نص جديد
                </div>
              </div>
            </div>
          </div>
        );

      case 'shape':
        return (
          <div className="bg-[#f7f8f9] backdrop-blur-xl shadow-sm border border-black/10 rounded-[30px] p-4 h-full overflow-auto">
            <h3 className="text-lg font-arabic text-black mb-4">أداة الأشكال</h3>
            <div className="grid grid-cols-4 gap-2">
              {/* مضاعفة الأشكال */}
              {[
                '⬜', '🔴', '🔵', '🔶', '▲', '⭐', '💎', '⬡',
                '🟩', '🟪', '🟨', '🟫', '⚫', '⚪', '🔸', '🔹',
                '◐', '◑', '◒', '◓', '⬟', '⬢', '⬣', '⬤'
              ].map((shape, index) => (
                <button
                  key={index}
                  className="w-12 h-12 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors text-lg"
                  onClick={() => console.log('شكل:', shape)}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
        );

      case 'smart-element':
        return (
          <div className="bg-[#f7f8f9] backdrop-blur-xl shadow-sm border border-black/10 rounded-[30px] p-4 h-full overflow-auto">
            <h3 className="text-lg font-arabic text-black mb-4">العناصر الذكية</h3>
            <div className="space-y-2">
              {[
                { name: 'الجذر', icon: '🌳' },
                { name: 'العصف الذهني', icon: '💡' },
                { name: 'الخط الزمني', icon: '📅' },
                { name: 'ثينك بورد', icon: '🎨' },
                { name: 'كانبان', icon: '📋' },
                { name: 'أداة التصويت', icon: '🗳️' },
                { name: 'خريطة ذهنية', icon: '🧠' },
                { name: 'مخطط تدفق', icon: '🔀' }
              ].map((element, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors text-right"
                  onClick={() => console.log('عنصر ذكي:', element.name)}
                >
                  <span className="text-xl">{element.icon}</span>
                  <span className="text-sm font-arabic text-black">{element.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'zoom':
        return (
          <EnhancedZoomPanel
            zoom={zoom}
            canvasPosition={canvasPosition}
            panSpeed={panSpeed}
            smoothZoom={true}
            zoomToMouse={true}
            fitPadding={20}
            onZoomChange={onZoomChange}
            onPositionChange={onPositionChange}
            onFitToScreen={onFitToScreen}
            onFitToSelection={() => console.log('ملاءمة التحديد')}
            onResetView={onResetView}
            onPanSpeedChange={onPanSpeedChange}
            onSmoothZoomToggle={(enabled) => console.log('زوم سلس:', enabled)}
            onZoomToMouseToggle={(enabled) => console.log('زوم للماوس:', enabled)}
            onFitPaddingChange={(padding) => console.log('هامش:', padding)}
            onCenterOnElement={(id) => console.log('توسيط العنصر:', id)}
          />
        );

      case 'hand':
        return (
          <HandPanel
            panSpeed={panSpeed}
            canvasPosition={canvasPosition}
            onPanSpeedChange={onPanSpeedChange}
            onPositionChange={onPositionChange}
            onResetView={onResetView}
          />
        );

      case 'upload':
        return (
          <UploadPanel
            onFileUpload={onFileUpload}
          />
        );

      default:
        return (
          <div className="bg-[#f7f8f9] backdrop-blur-xl shadow-sm border border-black/10 rounded-[30px] p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-500 font-arabic">
                يرجى تحديد أداة لعرض خيارات التخصيص
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderRightPanels()}
      {renderLeftPanels()}
    </>
  );
};

export default ToolPanelManager;
