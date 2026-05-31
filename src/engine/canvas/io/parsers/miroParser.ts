/**
 * Miro Parser - محلل صيغة Miro
 */

import { ExportableElement } from '../exportEngine';

// أنواع widgets Miro
export interface MiroWidget {
  id: string;
  type: 'SHAPE' | 'TEXT' | 'STICKY_NOTE' | 'CARD' | 'IMAGE' | 'FRAME' | 
        'LINE' | 'CONNECTOR' | 'DOCUMENT' | 'PREVIEW' | 'EMBED';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  text?: string;
  plainText?: string;
  content?: string;
  style?: MiroStyle;
  shape?: 'rectangle' | 'circle' | 'triangle' | 'rhombus' | 'star' | 
         'parallelogram' | 'trapezoid' | 'pentagon' | 'hexagon' | 'octagon';
  url?: string;
  title?: string;
}

export interface MiroStyle {
  fillColor?: string;
  fillOpacity?: number;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'normal' | 'dashed' | 'dotted';
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  textAlignVertical?: 'top' | 'middle' | 'bottom';
  backgroundColor?: string;
}

export interface MiroBoard {
  id: string;
  name?: string;
  description?: string;
  widgets: MiroWidget[];
  version?: string;
  createdAt?: string;
  modifiedAt?: string;
}

/**
 * محلل ملفات Miro
 */
export class MiroParser {
  /**
   * تحليل ملف Miro وتحويله لعناصر
   */
  parse(data: MiroBoard): ExportableElement[] {
    if (!data.widgets || !Array.isArray(data.widgets)) {
      return [];
    }

    return data.widgets
      .map(widget => this.convertWidgetToElement(widget))
      .filter((el): el is ExportableElement => el !== null);
  }

  /**
   * تحويل widget إلى عنصر
   */
  private convertWidgetToElement(widget: MiroWidget): ExportableElement | null {
    const baseElement = {
      id: `miro_${widget.id}`,
      position: { x: widget.x, y: widget.y },
      size: {
        width: widget.width || 100,
        height: widget.height || 100,
      },
      rotation: widget.rotation || 0,
    };

    switch (widget.type) {
      case 'SHAPE':
        return {
          ...baseElement,
          type: 'shape',
          style: {
            shapeType: this.mapShapeType(widget.shape),
            fillColor: widget.style?.fillColor || '#3DBE8B',
            fillOpacity: widget.style?.fillOpacity ?? 1,
            strokeColor: widget.style?.borderColor || 'transparent',
            strokeWidth: widget.style?.borderWidth || 0,
            strokeStyle: widget.style?.borderStyle || 'normal',
          },
        };

      case 'STICKY_NOTE':
        return {
          ...baseElement,
          type: 'sticky_note',
          content: widget.plainText || widget.text || widget.content || '',
          style: {
            fillColor: widget.style?.fillColor || widget.style?.backgroundColor || '#F6C445',
            fontSize: widget.style?.fontSize || 14,
            textColor: widget.style?.textColor || '#000000',
          },
        };

      case 'TEXT':
        return {
          ...baseElement,
          type: 'text',
          content: widget.plainText || widget.text || widget.content || '',
          style: {
            fontSize: widget.style?.fontSize || 14,
            fontFamily: widget.style?.fontFamily || 'IBM Plex Sans Arabic',
            color: widget.style?.textColor || '#000000',
            textAlign: widget.style?.textAlign || 'left',
          },
        };

      case 'CARD':
        return {
          ...baseElement,
          type: 'sticky_note',
          content: widget.title || widget.plainText || widget.text || '',
          style: {
            fillColor: widget.style?.fillColor || '#FFFFFF',
            strokeColor: widget.style?.borderColor || '#E0E0E0',
            strokeWidth: 1,
            fontSize: widget.style?.fontSize || 14,
          },
        };

      case 'IMAGE':
        return {
          ...baseElement,
          type: 'image',
          style: {
            src: widget.url || '',
            objectFit: 'contain',
          },
        };

      case 'FRAME':
        return {
          ...baseElement,
          type: 'shape',
          content: widget.title || '',
          style: {
            shapeType: 'rectangle',
            fillColor: widget.style?.fillColor || 'transparent',
            strokeColor: widget.style?.borderColor || '#E0E0E0',
            strokeWidth: widget.style?.borderWidth || 1,
            strokeStyle: 'dashed',
          },
        };

      case 'LINE':
      case 'CONNECTOR':
        return {
          ...baseElement,
          type: 'connector',
          style: {
            strokeColor: widget.style?.borderColor || '#000000',
            strokeWidth: widget.style?.borderWidth || 2,
            strokeStyle: widget.style?.borderStyle || 'normal',
          },
        };

      case 'DOCUMENT':
      case 'PREVIEW':
      case 'EMBED':
        return {
          ...baseElement,
          type: 'shape',
          content: widget.title || widget.url || '',
          style: {
            shapeType: 'rectangle',
            fillColor: '#F5F5F5',
            strokeColor: '#E0E0E0',
            strokeWidth: 1,
          },
        };

      default:
        return null;
    }
  }

  /**
   * تحويل نوع الشكل
   */
  private mapShapeType(shape?: string): string {
    switch (shape) {
      case 'circle': return 'circle';
      case 'triangle': return 'triangle';
      case 'rhombus': return 'diamond';
      case 'star': return 'star';
      case 'pentagon':
      case 'hexagon':
      case 'octagon':
        return 'polygon';
      default:
        return 'rectangle';
    }
  }

  /**
   * التحقق من صحة بيانات Miro
   */
  static validate(data: unknown): data is MiroBoard {
    if (!data || typeof data !== 'object') return false;
    
    const obj = data as Record<string, unknown>;
    
    return (
      typeof obj.id === 'string' &&
      Array.isArray(obj.widgets)
    );
  }
}

export const miroParser = new MiroParser();
