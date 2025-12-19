import React from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { getAnchorPosition } from '@/types/mindmap-canvas';
import type { CanvasElement } from '@/types/canvas';
import type { MindMapNodeData } from '@/types/mindmap-canvas';

interface MindMapDebugOverlayProps {
  enabled: boolean;
}

const MindMapDebugOverlay: React.FC<MindMapDebugOverlayProps> = ({ enabled }) => {
  const { elements, viewport, selectedElementIds } = useCanvasStore();
  
  if (!enabled) return null;
  
  const mindmapNodes = elements.filter(el => el.type === 'mindmap_node');
  const selectedNodes = mindmapNodes.filter(el => selectedElementIds.includes(el.id));
  
  return (
    <>
      {/* لوحة معلومات Debug ثابتة */}
      <div 
        className="fixed top-20 left-4 bg-black/80 text-white text-xs font-mono p-3 rounded-lg z-[9999] max-w-[300px] backdrop-blur-sm border border-white/20"
        dir="ltr"
      >
        <div className="text-yellow-400 font-bold mb-2">🔧 MindMap Debug</div>
        
        {/* معلومات الـ Viewport */}
        <div className="mb-2 pb-2 border-b border-white/20">
          <div className="text-cyan-400">Viewport:</div>
          <div>zoom: <span className="text-green-400">{viewport.zoom.toFixed(2)}</span></div>
          <div>pan: <span className="text-green-400">({viewport.pan.x.toFixed(0)}, {viewport.pan.y.toFixed(0)})</span></div>
        </div>
        
        {/* معلومات العقد المحددة */}
        <div className="text-cyan-400 mb-1">Selected Nodes ({selectedNodes.length}):</div>
        {selectedNodes.length === 0 ? (
          <div className="text-gray-400 italic">No nodes selected</div>
        ) : (
          selectedNodes.map(node => {
            const nodeData = node.data as MindMapNodeData;
            return (
              <div key={node.id} className="mb-2 pb-2 border-b border-white/10">
                <div className="text-orange-400 truncate">{nodeData.label || 'Untitled'}</div>
                <div>pos: <span className="text-green-400">({node.position.x.toFixed(0)}, {node.position.y.toFixed(0)})</span></div>
                <div>size: <span className="text-green-400">{node.size.width.toFixed(0)} × {node.size.height.toFixed(0)}</span></div>
                <div className="text-purple-400 mt-1">Anchors:</div>
                {(['top', 'bottom', 'left', 'right'] as const).map(anchor => {
                  const pos = getAnchorPosition(node.position, node.size, anchor);
                  return (
                    <div key={anchor} className="text-gray-300 text-[10px]">
                      {anchor}: ({pos.x.toFixed(0)}, {pos.y.toFixed(0)})
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
        
        {/* إجمالي العقد */}
        <div className="text-gray-400 mt-2 pt-2 border-t border-white/20">
          Total nodes: {mindmapNodes.length}
        </div>
      </div>
      
      {/* طبقة شفافة فوق العقد المحددة تُظهر الـ anchors */}
      {selectedNodes.map(node => (
        <React.Fragment key={`debug-${node.id}`}>
          {/* مربع حدود العنصر */}
          <div
            className="absolute pointer-events-none border-2 border-dashed border-yellow-400/60"
            style={{
              left: node.position.x,
              top: node.position.y,
              width: node.size.width,
              height: node.size.height,
              zIndex: 9998,
            }}
          >
            {/* عرض الحجم */}
            <div className="absolute -top-5 left-0 text-[10px] font-mono text-yellow-400 bg-black/70 px-1 rounded">
              {node.size.width.toFixed(0)} × {node.size.height.toFixed(0)}
            </div>
          </div>
          
          {/* نقاط الـ Anchor مع إحداثياتها */}
          {(['top', 'bottom', 'left', 'right'] as const).map(anchor => {
            const pos = getAnchorPosition(node.position, node.size, anchor);
            return (
              <div
                key={`${node.id}-${anchor}`}
                className="absolute pointer-events-none"
                style={{
                  left: pos.x - 20,
                  top: pos.y - 20,
                  zIndex: 9999,
                }}
              >
                {/* دائرة الـ anchor */}
                <div 
                  className="absolute w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-lg"
                  style={{ left: 14, top: 14 }}
                />
                {/* تسمية الموقع */}
                <div 
                  className="absolute text-[9px] font-mono text-red-400 bg-black/80 px-1 rounded whitespace-nowrap"
                  style={{
                    left: anchor === 'left' ? -50 : anchor === 'right' ? 25 : 0,
                    top: anchor === 'top' ? -15 : anchor === 'bottom' ? 25 : 5,
                  }}
                >
                  {anchor}: ({pos.x.toFixed(0)}, {pos.y.toFixed(0)})
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
};

export default MindMapDebugOverlay;
