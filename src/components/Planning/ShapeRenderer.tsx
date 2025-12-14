import React from 'react';
import { icons } from 'lucide-react';

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
}

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
  stickyText
}) => {
  // ضمان أحجام موجبة
  const w = Math.max(width, 1);
  const h = Math.max(height, 1);
  const padding = strokeWidth / 2;

  const renderShape = () => {
    const commonProps = {
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity
    };

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

      case 'arrow_right':
        const arrowPath = `M ${padding} ${h * 0.3} L ${w * 0.6} ${h * 0.3} L ${w * 0.6} ${padding} L ${w - padding} ${h / 2} L ${w * 0.6} ${h - padding} L ${w * 0.6} ${h * 0.7} L ${padding} ${h * 0.7} Z`;
        return <path d={arrowPath} {...commonProps} />;

      case 'arrow_left':
        const arrowLeftPath = `M ${w - padding} ${h * 0.3} L ${w * 0.4} ${h * 0.3} L ${w * 0.4} ${padding} L ${padding} ${h / 2} L ${w * 0.4} ${h - padding} L ${w * 0.4} ${h * 0.7} L ${w - padding} ${h * 0.7} Z`;
        return <path d={arrowLeftPath} {...commonProps} />;

      case 'arrow_up':
        const arrowUpPath = `M ${w * 0.3} ${h - padding} L ${w * 0.3} ${h * 0.4} L ${padding} ${h * 0.4} L ${w / 2} ${padding} L ${w - padding} ${h * 0.4} L ${w * 0.7} ${h * 0.4} L ${w * 0.7} ${h - padding} Z`;
        return <path d={arrowUpPath} {...commonProps} />;

      case 'arrow_down':
        const arrowDownPath = `M ${w * 0.3} ${padding} L ${w * 0.3} ${h * 0.6} L ${padding} ${h * 0.6} L ${w / 2} ${h - padding} L ${w - padding} ${h * 0.6} L ${w * 0.7} ${h * 0.6} L ${w * 0.7} ${padding} Z`;
        return <path d={arrowDownPath} {...commonProps} />;

      case 'arrow_up_right':
        const arrowUpRightPath = `M ${padding} ${h - padding} L ${w - padding} ${padding} M ${w * 0.5} ${padding} L ${w - padding} ${padding} L ${w - padding} ${h * 0.5}`;
        return <path d={arrowUpRightPath} {...commonProps} fill="none" />;

      case 'arrow_down_right':
        const arrowDownRightPath = `M ${padding} ${padding} L ${w - padding} ${h - padding} M ${w * 0.5} ${h - padding} L ${w - padding} ${h - padding} L ${w - padding} ${h * 0.5}`;
        return <path d={arrowDownRightPath} {...commonProps} fill="none" />;

      case 'arrow_up_left':
        const arrowUpLeftPath = `M ${w - padding} ${h - padding} L ${padding} ${padding} M ${w * 0.5} ${padding} L ${padding} ${padding} L ${padding} ${h * 0.5}`;
        return <path d={arrowUpLeftPath} {...commonProps} fill="none" />;

      case 'arrow_down_left':
        const arrowDownLeftPath = `M ${w - padding} ${padding} L ${padding} ${h - padding} M ${w * 0.5} ${h - padding} L ${padding} ${h - padding} L ${padding} ${h * 0.5}`;
        return <path d={arrowDownLeftPath} {...commonProps} fill="none" />;

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
