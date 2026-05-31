/**
 * Figma Parser - محلل صيغة Figma
 */

import { ExportableElement } from '../exportEngine';

// أنواع عقد Figma
export interface FigmaNode {
  id: string;
  name: string;
  type: 'DOCUMENT' | 'CANVAS' | 'FRAME' | 'GROUP' | 'RECTANGLE' | 
        'ELLIPSE' | 'TEXT' | 'VECTOR' | 'INSTANCE' | 'COMPONENT' |
        'LINE' | 'POLYGON' | 'STAR' | 'BOOLEAN_OPERATION';
  children?: FigmaNode[];
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  relativeTransform?: number[][];
  fills?: FigmaFill[];
  strokes?: FigmaStroke[];
  strokeWeight?: number;
  characters?: string;
  style?: FigmaTextStyle;
  cornerRadius?: number;
  rectangleCornerRadii?: number[];
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
}

export interface FigmaFill {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'IMAGE';
  color?: { r: number; g: number; b: number; a: number };
  opacity?: number;
  visible?: boolean;
}

export interface FigmaStroke {
  type: 'SOLID' | 'GRADIENT_LINEAR';
  color?: { r: number; g: number; b: number; a: number };
}

export interface FigmaTextStyle {
  fontFamily?: string;
  fontPostScriptName?: string;
  fontSize?: number;
  fontWeight?: number;
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  letterSpacing?: number;
  lineHeightPx?: number;
}

export interface FigmaFile {
  name: string;
  document: FigmaNode;
  components?: Record<string, FigmaNode>;
  styles?: Record<string, unknown>;
  version?: string;
}

/**
 * محلل ملفات Figma
 */
export class FigmaParser {
  private offsetX = 0;
  private offsetY = 0;

  /**
   * تحليل ملف Figma وتحويله لعناصر
   */
  parse(data: FigmaFile): ExportableElement[] {
    const elements: ExportableElement[] = [];
    
    // حساب offset من أول frame
    this.calculateOffset(data.document);
    
    // تحليل العقد
    this.traverseNodes(data.document, elements);
    
    return elements;
  }

  /**
   * حساب offset لوضع العناصر بشكل صحيح
   */
  private calculateOffset(node: FigmaNode): void {
    if (node.type === 'CANVAS' && node.children?.[0]?.absoluteBoundingBox) {
      const firstFrame = node.children[0];
      this.offsetX = firstFrame.absoluteBoundingBox?.x || 0;
      this.offsetY = firstFrame.absoluteBoundingBox?.y || 0;
    }
    
    node.children?.forEach(child => {
      if (!this.offsetX && !this.offsetY) {
        this.calculateOffset(child);
      }
    });
  }

  /**
   * تحليل العقد بشكل تكراري
   */
  private traverseNodes(node: FigmaNode, elements: ExportableElement[]): void {
    // تجاهل Document و Canvas والعناصر غير المرئية
    if (node.type !== 'DOCUMENT' && node.type !== 'CANVAS') {
      if (node.visible !== false) {
        const element = this.convertNodeToElement(node);
        if (element) {
          elements.push(element);
        }
      }
    }

    // معالجة الأبناء
    node.children?.forEach(child => this.traverseNodes(child, elements));
  }

  /**
   * تحويل عقدة Figma إلى عنصر
   */
  private convertNodeToElement(node: FigmaNode): ExportableElement | null {
    const box = node.absoluteBoundingBox;
    if (!box) return null;

    const baseElement = {
      id: `figma_${node.id}`,
      position: { 
        x: box.x - this.offsetX, 
        y: box.y - this.offsetY 
      },
      size: { width: box.width, height: box.height },
      rotation: this.extractRotation(node),
    };

    switch (node.type) {
      case 'RECTANGLE':
      case 'FRAME':
      case 'GROUP':
        return {
          ...baseElement,
          type: 'shape',
          style: {
            shapeType: 'rectangle',
            fillColor: this.extractFillColor(node.fills),
            strokeColor: this.extractStrokeColor(node.strokes),
            strokeWidth: node.strokeWeight || 0,
            cornerRadius: node.cornerRadius || 0,
            opacity: node.opacity ?? 1,
          },
        };

      case 'ELLIPSE':
        return {
          ...baseElement,
          type: 'shape',
          style: {
            shapeType: 'circle',
            fillColor: this.extractFillColor(node.fills),
            strokeColor: this.extractStrokeColor(node.strokes),
            strokeWidth: node.strokeWeight || 0,
            opacity: node.opacity ?? 1,
          },
        };

      case 'POLYGON':
      case 'STAR':
        return {
          ...baseElement,
          type: 'shape',
          style: {
            shapeType: 'polygon',
            fillColor: this.extractFillColor(node.fills),
            strokeColor: this.extractStrokeColor(node.strokes),
            strokeWidth: node.strokeWeight || 0,
          },
        };

      case 'TEXT':
        return {
          ...baseElement,
          type: 'text',
          content: node.characters || '',
          style: {
            fontSize: node.style?.fontSize || 14,
            fontFamily: node.style?.fontFamily || 'IBM Plex Sans Arabic',
            fontWeight: node.style?.fontWeight || 400,
            color: this.extractFillColor(node.fills),
            textAlign: this.mapTextAlign(node.style?.textAlignHorizontal),
            lineHeight: node.style?.lineHeightPx,
            letterSpacing: node.style?.letterSpacing,
          },
        };

      case 'LINE':
        return {
          ...baseElement,
          type: 'shape',
          style: {
            shapeType: 'line',
            strokeColor: this.extractStrokeColor(node.strokes) || this.extractFillColor(node.fills),
            strokeWidth: node.strokeWeight || 1,
          },
        };

      case 'VECTOR':
        return {
          ...baseElement,
          type: 'drawing',
          style: {
            fillColor: this.extractFillColor(node.fills),
            strokeColor: this.extractStrokeColor(node.strokes),
            strokeWidth: node.strokeWeight || 1,
          },
        };

      default:
        return null;
    }
  }

  /**
   * استخراج لون التعبئة
   */
  private extractFillColor(fills?: FigmaFill[]): string {
    const fill = fills?.find(f => f.type === 'SOLID' && f.visible !== false && f.color);
    if (!fill?.color) return '#CCCCCC';
    
    const { r, g, b, a } = fill.color;
    const opacity = fill.opacity ?? a ?? 1;
    
    if (opacity < 1) {
      return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${opacity})`;
    }
    
    return this.rgbToHex(r, g, b);
  }

  /**
   * استخراج لون الحدود
   */
  private extractStrokeColor(strokes?: FigmaStroke[]): string {
    const stroke = strokes?.find(s => s.type === 'SOLID' && s.color);
    if (!stroke?.color) return 'transparent';
    
    const { r, g, b, a } = stroke.color;
    
    if ((a ?? 1) < 1) {
      return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a ?? 1})`;
    }
    
    return this.rgbToHex(r, g, b);
  }

  /**
   * استخراج الدوران
   */
  private extractRotation(node: FigmaNode): number {
    if (!node.relativeTransform) return 0;
    
    const [[a, b]] = node.relativeTransform;
    const angle = Math.atan2(b, a) * (180 / Math.PI);
    
    return Math.round(angle * 100) / 100;
  }

  /**
   * تحويل RGB إلى Hex
   */
  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  /**
   * تحويل محاذاة النص
   */
  private mapTextAlign(align?: string): 'left' | 'center' | 'right' {
    switch (align) {
      case 'CENTER': return 'center';
      case 'RIGHT': return 'right';
      case 'JUSTIFIED': return 'left';
      default: return 'left';
    }
  }

  /**
   * التحقق من صحة بيانات Figma
   */
  static validate(data: unknown): data is FigmaFile {
    if (!data || typeof data !== 'object') return false;
    
    const obj = data as Record<string, unknown>;
    
    return (
      typeof obj.name === 'string' &&
      obj.document !== undefined &&
      typeof obj.document === 'object'
    );
  }
}

export const figmaParser = new FigmaParser();
