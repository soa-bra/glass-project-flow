/**
 * مكون الرابط للمخطط البصري
 */

import React, { useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';
import type { VisualConnectorData } from '@/types/visual-diagram-canvas';
import { 
  getVisualAnchorPosition, 
  createVisualBezierPath, 
  createVisualStraightPath, 
  createVisualElbowPath 
} from '@/types/visual-diagram-canvas';

interface VisualConnectorProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (multiSelect: boolean) => void;
}

const VisualConnector: React.FC<VisualConnectorProps> = ({
  element,
  isSelected,
  onSelect
}) => {
  const elements = useCanvasStore(state => state.elements);
  const connectorData = element.data as VisualConnectorData;
  
  // إيجاد العقد المتصلة
  const startNode = elements.find(el => el.id === connectorData.startNodeId);
  const endNode = elements.find(el => el.id === connectorData.endNodeId);
  
  // حساب مواقع نقاط الاتصال
  const { startPos, endPos, path, viewBox, svgPosition, svgSize } = useMemo(() => {
    if (!startNode || !endNode) {
      return {
        startPos: { x: 0, y: 0 },
        endPos: { x: 100, y: 100 },
        path: 'M 0 0 L 100 100',
        viewBox: '0 0 100 100',
        svgPosition: { x: 0, y: 0 },
        svgSize: { width: 100, height: 100 }
      };
    }
    
    const startAnchorRaw = connectorData.startAnchor?.anchor || 'right';
    const endAnchorRaw = connectorData.endAnchor?.anchor || 'left';
    const startAnchor: 'top' | 'bottom' | 'left' | 'right' = startAnchorRaw === 'center' ? 'right' : startAnchorRaw;
    const endAnchor: 'top' | 'bottom' | 'left' | 'right' = endAnchorRaw === 'center' ? 'left' : endAnchorRaw;
    
    const start = getVisualAnchorPosition(startNode.position, startNode.size, startAnchor);
    const end = getVisualAnchorPosition(endNode.position, endNode.size, endAnchor);
    
    // حساب bounding box مع padding
    const padding = 50;
    const minX = Math.min(start.x, end.x) - padding;
    const minY = Math.min(start.y, end.y) - padding;
    const maxX = Math.max(start.x, end.x) + padding;
    const maxY = Math.max(start.y, end.y) + padding;
    
    const width = maxX - minX;
    const height = maxY - minY;
    
    // تحويل الإحداثيات إلى إحداثيات الـ SVG
    const localStart = { x: start.x - minX, y: start.y - minY };
    const localEnd = { x: end.x - minX, y: end.y - minY };
    
    // إنشاء المسار
    let pathD: string;
    const curveStyle = connectorData.curveStyle || 'bezier';
    
    switch (curveStyle) {
      case 'straight':
        pathD = createVisualStraightPath(localStart, localEnd);
        break;
      case 'elbow':
        pathD = createVisualElbowPath(localStart, localEnd, startAnchor, endAnchor);
        break;
      case 'bezier':
      default:
        pathD = createVisualBezierPath(localStart, localEnd, startAnchor, endAnchor);
        break;
    }
    
    return {
      startPos: start,
      endPos: end,
      path: pathD,
      viewBox: `0 0 ${width} ${height}`,
      svgPosition: { x: minX, y: minY },
      svgSize: { width, height }
    };
  }, [startNode, endNode, connectorData]);
  
  // التحقق من إخفاء الـ connector إذا كان الأب مطوياً
  const parentNode = elements.find(el => el.id === connectorData.startNodeId);
  if (parentNode && (parentNode.data as any)?.isCollapsed) {
    return null;
  }
  
  if (!startNode || !endNode) {
    return null;
  }
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const multiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
    onSelect(multiSelect);
  };
  
  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: svgPosition.x,
        top: svgPosition.y,
        width: svgSize.width,
        height: svgSize.height,
        overflow: 'visible',
        zIndex: 5
      }}
      viewBox={viewBox}
    >
      {/* خط غير مرئي عريض للنقر */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        className="pointer-events-auto cursor-pointer"
        onClick={handleClick}
      />
      
      {/* الخط المرئي */}
      <path
        d={path}
        stroke={connectorData.color || '#3DA8F5'}
        strokeWidth={connectorData.strokeWidth || 2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all ${isSelected ? 'filter drop-shadow-md' : ''}`}
        style={{
          strokeDasharray: isSelected ? 'none' : 'none',
          opacity: isSelected ? 1 : 0.85
        }}
      />
      
      {/* تأثير التحديد */}
      {isSelected && (
        <path
          d={path}
          stroke="hsl(var(--accent-blue))"
          strokeWidth={(connectorData.strokeWidth || 2) + 4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.3}
        />
      )}
      
      {/* نقطة السهم عند النهاية */}
      <circle
        cx={endPos.x - svgPosition.x}
        cy={endPos.y - svgPosition.y}
        r={4}
        fill={connectorData.color || '#3DA8F5'}
        className="pointer-events-none"
      />
    </svg>
  );
};

export default VisualConnector;
