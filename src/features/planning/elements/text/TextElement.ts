/**
 * TextElement - كائن النص الأساسي للـ Canvas
 * Text element class definition for canvas operations
 * 
 * @module features/planning/elements/text/TextElement
 */

import { nanoid } from 'nanoid';

export type TextType = 'line' | 'box' | 'attached';
export type TextAlign = 'left' | 'center' | 'right';
export type TextDirection = 'rtl' | 'ltr';
export type VerticalAlign = 'top' | 'middle' | 'bottom' | 'flex-start' | 'center' | 'flex-end';

/**
 * واجهة بيانات عنصر النص
 * Text element data interface
 */
export interface TextElementData {
  /** معرف فريد - Unique identifier */
  id: string;
  
  /** المحتوى النصي - Text content */
  text: string;
  
  /** إحداثيات الموضع - Position coordinates */
  x: number;
  y: number;
  
  /** أبعاد المربع - Box dimensions */
  width: number;
  height: number;
  
  /** عائلة الخط - Font family */
  fontFamily: string;
  
  /** حجم الخط - Font size in pixels */
  fontSize: number;
  
  /** وزن الخط - Font weight */
  fontWeight: string;
  
  /** نمط الخط - Font style (normal/italic) */
  fontStyle: string;
  
  /** لون النص - Text color */
  color: string;
  
  /** لون الخلفية - Background color */
  backgroundColor: string;
  
  /** محاذاة النص الأفقية - Horizontal text alignment */
  textAlign: TextAlign;
  
  /** اتجاه النص - Text direction */
  direction: TextDirection;
  
  /** المحاذاة العمودية - Vertical alignment */
  verticalAlign: VerticalAlign;
  
  /** نوع النص - Text type */
  textType: TextType;
  
  /** حالة التحرير - Editing state */
  isEditing: boolean;
  
  /** التمدد التلقائي - Auto grow enabled */
  autoGrow: boolean;
  
  /** الحد الأدنى للعرض - Minimum width */
  minWidth: number;
  
  /** الحد الأدنى للارتفاع - Minimum height */
  minHeight: number;
  
  /** الحشوة الداخلية - Internal padding */
  padding: number;
  
  /** زخرفة النص - Text decoration */
  textDecoration: string;
}

/**
 * الإعدادات الافتراضية لعنصر النص
 * Default text element settings
 */
export const DEFAULT_TEXT_ELEMENT: Omit<TextElementData, 'id' | 'x' | 'y'> = {
  text: '',
  width: 150,
  height: 30,
  fontFamily: 'IBM Plex Sans Arabic',
  fontSize: 16,
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#0B0F12',
  backgroundColor: 'transparent',
  textAlign: 'right',
  direction: 'rtl',
  verticalAlign: 'top',
  textType: 'line',
  isEditing: false,
  autoGrow: true,
  minWidth: 50,
  minHeight: 20,
  padding: 8,
  textDecoration: 'none',
};

/**
 * فئة عنصر النص
 * Text element class for canvas operations
 */
export class TextElement implements TextElementData {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  color: string;
  backgroundColor: string;
  textAlign: TextAlign;
  direction: TextDirection;
  verticalAlign: VerticalAlign;
  textType: TextType;
  isEditing: boolean;
  autoGrow: boolean;
  minWidth: number;
  minHeight: number;
  padding: number;
  textDecoration: string;

  constructor(
    x: number,
    y: number,
    options: Partial<Omit<TextElementData, 'id' | 'x' | 'y'>> = {}
  ) {
    this.id = nanoid();
    this.x = x;
    this.y = y;
    
    // دمج الخيارات مع الإعدادات الافتراضية
    const merged = { ...DEFAULT_TEXT_ELEMENT, ...options };
    
    this.text = merged.text;
    this.width = merged.width;
    this.height = merged.height;
    this.fontFamily = merged.fontFamily;
    this.fontSize = merged.fontSize;
    this.fontWeight = merged.fontWeight;
    this.fontStyle = merged.fontStyle;
    this.color = merged.color;
    this.backgroundColor = merged.backgroundColor;
    this.textAlign = merged.textAlign;
    this.direction = merged.direction;
    this.verticalAlign = merged.verticalAlign;
    this.textType = merged.textType;
    this.isEditing = merged.isEditing;
    this.autoGrow = merged.autoGrow;
    this.minWidth = merged.minWidth;
    this.minHeight = merged.minHeight;
    this.padding = merged.padding;
    this.textDecoration = merged.textDecoration;
  }

  /**
   * رسم النص على canvas
   * Draw text on canvas context
   */
  draw(ctx: CanvasRenderingContext2D): void {
    if (this.isEditing) return; // لا نرسم أثناء التحرير
    
    ctx.save();
    
    // إعدادات الخط
    ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.textAlign === 'right' ? 'right' : 
                    this.textAlign === 'center' ? 'center' : 'left';
    ctx.direction = this.direction;
    
    // رسم الخلفية إذا كانت موجودة
    if (this.backgroundColor && this.backgroundColor !== 'transparent') {
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.color;
    }
    
    // حساب موضع النص
    let textX = this.x + this.padding;
    if (this.textAlign === 'center') {
      textX = this.x + this.width / 2;
    } else if (this.textAlign === 'right') {
      textX = this.x + this.width - this.padding;
    }
    
    const textY = this.y + this.fontSize + this.padding;
    
    // رسم النص
    ctx.fillText(this.text, textX, textY);
    
    ctx.restore();
  }

  /**
   * التحقق من وجود نقطة داخل حدود العنصر
   * Check if point is within element bounds
   */
  containsPoint(px: number, py: number): boolean {
    return (
      px >= this.x &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.height
    );
  }

  /**
   * الحصول على حدود العنصر
   * Get element bounding box
   */
  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * تحديث موضع العنصر
   * Update element position
   */
  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * تحديث حجم العنصر
   * Update element size
   */
  setSize(width: number, height: number): void {
    this.width = Math.max(width, this.minWidth);
    this.height = Math.max(height, this.minHeight);
  }

  /**
   * تحويل إلى كائن بسيط للتخزين
   * Convert to plain object for storage
   */
  toJSON(): TextElementData {
    return {
      id: this.id,
      text: this.text,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      fontStyle: this.fontStyle,
      color: this.color,
      backgroundColor: this.backgroundColor,
      textAlign: this.textAlign,
      direction: this.direction,
      verticalAlign: this.verticalAlign,
      textType: this.textType,
      isEditing: this.isEditing,
      autoGrow: this.autoGrow,
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      padding: this.padding,
      textDecoration: this.textDecoration,
    };
  }

  /**
   * إنشاء عنصر من كائن JSON
   * Create element from JSON object
   */
  static fromJSON(data: TextElementData): TextElement {
    const element = new TextElement(data.x, data.y, data);
    element.id = data.id;
    return element;
  }
}

export default TextElement;
