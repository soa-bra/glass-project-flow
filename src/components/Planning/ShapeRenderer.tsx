import React from 'react';
import { icons } from 'lucide-react';
import type { ArrowData, ArrowPoint } from '@/types/arrow-connections';

interface ShapeRendererProps {
  shapeType: string;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  opacity?: number;
  borderRadius?: number;
  iconName?: string;
  stickyText?: string;
  arrowData?: ArrowData; // بيانات السهم المتقدمة
}

/**
 * رسم رأس السهم بشكل V
 */
const renderArrowHead = (
  tipX: number, 
  tipY: number, 
  angle: number, 
  headSize: number = 12
): string => {
  const angle1 = angle + Math.PI * 0.8;
  const angle2 = angle - Math.PI * 0.8;
  
  const x1 = tipX + headSize * Math.cos(angle1);
  const y1 = tipY + headSize * Math.sin(angle1);
  const x2 = tipX + headSize * Math.cos(angle2);
  const y2 = tipY + headSize * Math.sin(angle2);
  
  return `${x1},${y1} ${tipX},${tipY} ${x2},${y2}`;
};

/**
 * حساب زاوية الخط بين نقطتين
 */
const calculateAngle = (from: ArrowPoint, to: ArrowPoint): number => {
  return Math.atan2(to.y - from.y, to.x - from.x);
};

/**
 * مكون لرسم الأشكال الهندسية المختلفة باستخدام SVG
 */
export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  shapeType,
  width,
  height,
  fillColor,
  strokeColor,
  strokeWidth,
  opacity = 1,
  borderRadius = 0,
  iconName,
  stickyText,
  arrowData
}) => {
  // ضمان أحجام موجبة
  const w = Math.max(width, 1);
  const h = Math.max(height, 1);
  const padding = strokeWidth / 2;
  
  // لون السهم: استخدم fillColor إذا كان strokeColor شفاف
  const arrowStroke = strokeColor && strokeColor !== 'transparent' ? strokeColor : fillColor;

  /**
   * رسم سهم متعرج (elbow arrow) أو متعامد (orthogonal)
   */
  const renderElbowArrow = (data: ArrowData) => {
    const start = data.startPoint;
    const end = data.endPoint;
    const headSize = 12;

    let pathD: string;
    let lastSegmentStart: ArrowPoint;
    let firstSegmentEnd: ArrowPoint;

    // استخدام نظام الأضلاع الجديد إذا كان متاحاً
    if (data.segments && data.segments.length > 1) {
      const pathPoints = data.segments.map(s => `${s.startPoint.x},${s.startPoint.y}`);
      pathPoints.push(`${data.segments[data.segments.length - 1].endPoint.x},${data.segments[data.segments.length - 1].endPoint.y}`);
      pathD = `M ${pathPoints.join(' L ')}`;
      
      const lastSeg = data.segments[data.segments.length - 1];
      const firstSeg = data.segments[0];
      lastSegmentStart = lastSeg.startPoint;
      firstSegmentEnd = firstSeg.endPoint;
    } else {
      // fallback للنظام القديم
      const middle = data.middlePoint || { x: w / 2, y: h / 2 };
      const midPoint1 = { x: middle.x, y: start.y };
      const midPoint2 = { x: middle.x, y: end.y };
      pathD = `M ${start.x} ${start.y} L ${midPoint1.x} ${midPoint1.y} L ${midPoint2.x} ${midPoint2.y} L ${end.x} ${end.y}`;
      lastSegmentStart = midPoint2;
      firstSegmentEnd = midPoint1;
    }

    // حساب زاوية رأس السهم
    const endAngle = calculateAngle(lastSegmentStart, end);
    const startAngle = calculateAngle(firstSegmentEnd, start);

    return (
      <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* ✅ Hit area شفافة لتسهيل تحديد السهم */}
        <path d={pathD} stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke' }} />
        <path d={pathD} />
        {/* رأس السهم في النهاية */}
        {(data.headDirection === 'end' || data.headDirection === 'both') && (
          <polyline points={renderArrowHead(end.x, end.y, endAngle, headSize)} />
        )}
        {/* رأس السهم في البداية */}
        {(data.headDirection === 'start' || data.headDirection === 'both') && (
          <polyline points={renderArrowHead(start.x, start.y, startAngle + Math.PI, headSize)} />
        )}
      </g>
    );
  };

  const renderShape = () => {
    const commonProps = {
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity
    };

    // إذا كان هناك بيانات سهم متقدمة وكان السهم متعرجاً أو متعامد
    if (arrowData && (arrowData.arrowType === 'elbow' || arrowData.arrowType === 'orthogonal')) {
      if (arrowData.middlePoint || (arrowData.segments && arrowData.segments.length > 1)) {
        return renderElbowArrow(arrowData);
      }
    }

    switch (shapeType) {
      case 'rectangle':
        return (
          <rect
            x={padding}
            y={padding}
            width={w - strokeWidth}
            height={h - strokeWidth}
            rx={borderRadius}
            ry={borderRadius}
            {...commonProps}
          />
        );

      case 'circle':
        const radius = Math.min(w, h) / 2 - padding;
        return (
          <ellipse
            cx={w / 2}
            cy={h / 2}
            rx={w / 2 - padding}
            ry={h / 2 - padding}
            {...commonProps}
          />
        );

      case 'triangle':
        const triPoints = `${w / 2},${padding} ${w - padding},${h - padding} ${padding},${h - padding}`;
        return <polygon points={triPoints} {...commonProps} />;

      case 'diamond':
        const diaPoints = `${w / 2},${padding} ${w - padding},${h / 2} ${w / 2},${h - padding} ${padding},${h / 2}`;
        return <polygon points={diaPoints} {...commonProps} />;

      case 'hexagon':
        const hexPoints = generatePolygonPoints(6, w, h, padding);
        return <polygon points={hexPoints} {...commonProps} />;

      case 'pentagon':
        const pentPoints = generatePolygonPoints(5, w, h, padding);
        return <polygon points={pentPoints} {...commonProps} />;

      case 'octagon':
        const octPoints = generatePolygonPoints(8, w, h, padding);
        return <polygon points={octPoints} {...commonProps} />;

      case 'star':
        const starPoints = generateStarPoints(5, w, h, padding);
        return <polygon points={starPoints} {...commonProps} />;

      case 'arrow_right': {
        const headSize = 12;
        const lineY = h / 2;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* ✅ Hit area شفافة */}
            <line x1={padding} y1={lineY} x2={w - padding} y2={lineY} stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke' }} />
            <line x1={padding} y1={lineY} x2={w - padding} y2={lineY} />
            <polyline points={`${w - padding - headSize},${lineY - headSize} ${w - padding},${lineY} ${w - padding - headSize},${lineY + headSize}`} />
          </g>
        );
      }

      case 'arrow_left': {
        const headSize = 12;
        const lineY = h / 2;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={w - padding} y1={lineY} x2={padding} y2={lineY} stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke' }} />
            <line x1={w - padding} y1={lineY} x2={padding} y2={lineY} />
            <polyline points={`${padding + headSize},${lineY - headSize} ${padding},${lineY} ${padding + headSize},${lineY + headSize}`} />
          </g>
        );
      }

      case 'arrow_up': {
        const headSize = 12;
        const lineX = w / 2;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={lineX} y1={h - padding} x2={lineX} y2={padding} stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke' }} />
            <line x1={lineX} y1={h - padding} x2={lineX} y2={padding} />
            <polyline points={`${lineX - headSize},${padding + headSize} ${lineX},${padding} ${lineX + headSize},${padding + headSize}`} />
          </g>
        );
      }

      case 'arrow_down': {
        const headSize = 12;
        const lineX = w / 2;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={lineX} y1={padding} x2={lineX} y2={h - padding} stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke' }} />
            <line x1={lineX} y1={padding} x2={lineX} y2={h - padding} />
            <polyline points={`${lineX - headSize},${h - padding - headSize} ${lineX},${h - padding} ${lineX + headSize},${h - padding - headSize}`} />
          </g>
        );
      }

      case 'arrow_up_right': {
        const headSize = 12;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={padding} y1={h - padding} x2={w - padding} y2={padding} stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke' }} />
            <line x1={padding} y1={h - padding} x2={w - padding} y2={padding} />
            <polyline points={`${w - padding - headSize},${padding} ${w - padding},${padding} ${w - padding},${padding + headSize}`} />
          </g>
        );
      }

      case 'arrow_down_right': {
        const headSize = 12;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={padding} y1={padding} x2={w - padding} y2={h - padding} stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke' }} />
            <line x1={padding} y1={padding} x2={w - padding} y2={h - padding} />
            <polyline points={`${w - padding - headSize},${h - padding} ${w - padding},${h - padding} ${w - padding},${h - padding - headSize}`} />
          </g>
        );
      }

      case 'arrow_up_left': {
        const headSize = 12;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={w - padding} y1={h - padding} x2={padding} y2={padding} stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke' }} />
            <line x1={w - padding} y1={h - padding} x2={padding} y2={padding} />
            <polyline points={`${padding + headSize},${padding} ${padding},${padding} ${padding},${padding + headSize}`} />
          </g>
        );
      }

      case 'arrow_down_left': {
        const headSize = 12;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={w - padding} y1={padding} x2={padding} y2={h - padding} stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke' }} />
            <line x1={w - padding} y1={padding} x2={padding} y2={h - padding} />
            <polyline points={`${padding + headSize},${h - padding} ${padding},${h - padding} ${padding},${h - padding - headSize}`} />
          </g>
        );
      }

      case 'arrow_double_horizontal': {
        const headSize = 12;
        const lineY = h / 2;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={padding} y1={lineY} x2={w - padding} y2={lineY} stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke' }} />
            <line x1={padding} y1={lineY} x2={w - padding} y2={lineY} />
            <polyline points={`${padding + headSize},${lineY - headSize} ${padding},${lineY} ${padding + headSize},${lineY + headSize}`} />
            <polyline points={`${w - padding - headSize},${lineY - headSize} ${w - padding},${lineY} ${w - padding - headSize},${lineY + headSize}`} />
          </g>
        );
      }

      case 'arrow_double_vertical': {
        const headSize = 12;
        const lineX = w / 2;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={lineX} y1={padding} x2={lineX} y2={h - padding} stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'stroke' }} />
            <line x1={lineX} y1={padding} x2={lineX} y2={h - padding} />
            <polyline points={`${lineX - headSize},${padding + headSize} ${lineX},${padding} ${lineX + headSize},${padding + headSize}`} />
            <polyline points={`${lineX - headSize},${h - padding - headSize} ${lineX},${h - padding} ${lineX + headSize},${h - padding - headSize}`} />
          </g>
        );
      }

      case 'arrow_four_way': {
        const headSize = 10;
        const cx = w / 2;
        const cy = h / 2;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={padding} y1={cy} x2={w - padding} y2={cy} />
            <line x1={cx} y1={padding} x2={cx} y2={h - padding} />
            <polyline points={`${padding + headSize},${cy - headSize} ${padding},${cy} ${padding + headSize},${cy + headSize}`} />
            <polyline points={`${w - padding - headSize},${cy - headSize} ${w - padding},${cy} ${w - padding - headSize},${cy + headSize}`} />
            <polyline points={`${cx - headSize},${padding + headSize} ${cx},${padding} ${cx + headSize},${padding + headSize}`} />
            <polyline points={`${cx - headSize},${h - padding - headSize} ${cx},${h - padding} ${cx + headSize},${h - padding - headSize}`} />
          </g>
        );
      }

      case 'arrow_double_diagonal': {
        const headSize = 10;
        return (
          <g stroke={arrowStroke} strokeWidth={strokeWidth || 2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1={padding} y1={h - padding} x2={w - padding} y2={padding} />
            <polyline points={`${padding},${h - padding - headSize} ${padding},${h - padding} ${padding + headSize},${h - padding}`} />
            <polyline points={`${w - padding - headSize},${padding} ${w - padding},${padding} ${w - padding},${padding + headSize}`} />
          </g>
        );
      }

      case 'icon':
        // رسم الأيقونات باستخدام Lucide
        const IconComponent = iconName ? icons[iconName as keyof typeof icons] : null;
        if (!IconComponent) {
          return <rect x={padding} y={padding} width={w - strokeWidth} height={h - strokeWidth} rx={8} {...commonProps} />;
        }
        return (
          <foreignObject x={0} y={0} width={w} height={h}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <IconComponent 
                size={Math.min(w, h) * 0.7} 
                color={fillColor === 'transparent' ? strokeColor : fillColor} 
                strokeWidth={strokeWidth || 2}
              />
            </div>
          </foreignObject>
        );

      case 'sticky':
        // رسم ستيكي نوت
        return (
          <g>
            <rect
              x={padding}
              y={padding}
              width={w - strokeWidth}
              height={h - strokeWidth}
              rx={8}
              fill={fillColor || '#F6C445'}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              opacity={opacity}
            />
            <foreignObject x={12} y={12} width={w - 24} height={h - 24}>
              <div style={{ 
                fontSize: Math.max(12, Math.min(w, h) * 0.12), 
                color: '#0B0F12',
                textAlign: 'center',
                wordBreak: 'break-word',
                fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}>
                {stickyText || 'ملاحظة'}
              </div>
            </foreignObject>
          </g>
        );

      default:
        // الشكل الافتراضي: مستطيل
        return (
          <rect
            x={padding}
            y={padding}
            width={w - strokeWidth}
            height={h - strokeWidth}
            rx={borderRadius}
            ry={borderRadius}
            {...commonProps}
          />
        );
    }
  };

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: 'visible' }}
    >
      {renderShape()}
    </svg>
  );
};

/**
 * توليد نقاط مضلع منتظم
 */
function generatePolygonPoints(sides: number, width: number, height: number, padding: number): string {
  const points: string[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radiusX = width / 2 - padding;
  const radiusY = height / 2 - padding;
  const angleOffset = -Math.PI / 2; // البدء من الأعلى

  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides + angleOffset;
    const x = centerX + radiusX * Math.cos(angle);
    const y = centerY + radiusY * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return points.join(' ');
}

/**
 * توليد نقاط نجمة
 */
function generateStarPoints(points: number, width: number, height: number, padding: number): string {
  const result: string[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadiusX = width / 2 - padding;
  const outerRadiusY = height / 2 - padding;
  const innerRadiusX = outerRadiusX * 0.4;
  const innerRadiusY = outerRadiusY * 0.4;
  const angleOffset = -Math.PI / 2;

  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points + angleOffset;
    const isOuter = i % 2 === 0;
    const rx = isOuter ? outerRadiusX : innerRadiusX;
    const ry = isOuter ? outerRadiusY : innerRadiusY;
    const x = centerX + rx * Math.cos(angle);
    const y = centerY + ry * Math.sin(angle);
    result.push(`${x},${y}`);
  }

  return result.join(' ');
}

export default ShapeRenderer;
