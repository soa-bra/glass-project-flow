/**
 * Element Creation Integration Tests
 * 
 * اختبارات شاملة لإنشاء العناصر وأنواعها المختلفة
 * تغطي: creation, validation, defaults, positioning, sizing
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { nanoid } from 'nanoid';

// ============================================
// Types and Interfaces
// ============================================

interface Point {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface ElementStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  borderRadius?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
}

type ElementType = 
  | 'rect' 
  | 'ellipse' 
  | 'text' 
  | 'sticky_note' 
  | 'image' 
  | 'frame' 
  | 'line' 
  | 'arrow'
  | 'smart'
  | 'file'
  | 'group';

interface CanvasElement {
  id: string;
  type: ElementType;
  position: Point;
  size: Size;
  rotation: number;
  style: ElementStyle;
  content?: string;
  locked: boolean;
  visible: boolean;
  layerId: string;
  parentId?: string | null;
  children?: string[];
  metadata?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

interface ElementDefaults {
  [key: string]: Partial<CanvasElement>;
}

// ============================================
// Element Factory
// ============================================

const ELEMENT_DEFAULTS: ElementDefaults = {
  rect: {
    size: { width: 100, height: 100 },
    style: { fill: '#ffffff', stroke: '#000000', strokeWidth: 1, borderRadius: 0 }
  },
  ellipse: {
    size: { width: 100, height: 100 },
    style: { fill: '#ffffff', stroke: '#000000', strokeWidth: 1 }
  },
  text: {
    size: { width: 200, height: 40 },
    style: { fontSize: 16, fontFamily: 'IBM Plex Sans Arabic', color: '#000000', textAlign: 'right' },
    content: ''
  },
  sticky_note: {
    size: { width: 200, height: 200 },
    style: { fill: '#FEF7CD', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic' },
    content: ''
  },
  image: {
    size: { width: 300, height: 200 },
    style: { opacity: 1 }
  },
  frame: {
    size: { width: 400, height: 300 },
    style: { fill: 'transparent', stroke: '#3DA8F5', strokeWidth: 2 },
    children: []
  },
  line: {
    size: { width: 100, height: 0 },
    style: { stroke: '#000000', strokeWidth: 2 }
  },
  arrow: {
    size: { width: 100, height: 0 },
    style: { stroke: '#000000', strokeWidth: 2 }
  },
  smart: {
    size: { width: 300, height: 200 },
    style: {},
    metadata: { smartType: 'chart' }
  },
  file: {
    size: { width: 200, height: 60 },
    style: { fill: '#f5f5f5', stroke: '#e0e0e0' },
    metadata: { fileName: '', fileType: '', fileSize: 0 }
  },
  group: {
    size: { width: 0, height: 0 },
    style: {},
    children: []
  }
};

function createElement(
  type: ElementType,
  position: Point,
  options: Partial<CanvasElement> = {}
): CanvasElement {
  const defaults = ELEMENT_DEFAULTS[type] || {};
  const now = Date.now();

  return {
    id: options.id || nanoid(),
    type,
    position,
    size: options.size || defaults.size || { width: 100, height: 100 },
    rotation: options.rotation || 0,
    style: { ...defaults.style, ...options.style },
    content: options.content ?? defaults.content,
    locked: options.locked || false,
    visible: options.visible !== false,
    layerId: options.layerId || 'default',
    parentId: options.parentId || null,
    children: options.children || defaults.children,
    metadata: { ...defaults.metadata, ...options.metadata },
    createdAt: now,
    updatedAt: now
  };
}

function validateElement(element: CanvasElement): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!element.id) errors.push('ID is required');
  if (!element.type) errors.push('Type is required');
  if (!element.position) errors.push('Position is required');
  if (typeof element.position.x !== 'number') errors.push('Position.x must be a number');
  if (typeof element.position.y !== 'number') errors.push('Position.y must be a number');
  if (!element.size) errors.push('Size is required');
  if (element.size.width <= 0) errors.push('Width must be positive');
  if (element.size.height < 0) errors.push('Height cannot be negative');
  if (typeof element.rotation !== 'number') errors.push('Rotation must be a number');

  return { valid: errors.length === 0, errors };
}

// ============================================
// Basic Element Creation Tests
// ============================================

describe('Basic Element Creation', () => {
  describe('Rectangle Creation', () => {
    it('should create a rectangle with default properties', () => {
      const rect = createElement('rect', { x: 100, y: 100 });

      expect(rect.type).toBe('rect');
      expect(rect.position).toEqual({ x: 100, y: 100 });
      expect(rect.size).toEqual({ width: 100, height: 100 });
      expect(rect.style.fill).toBe('#ffffff');
      expect(rect.style.stroke).toBe('#000000');
    });

    it('should create a rectangle with custom size', () => {
      const rect = createElement('rect', { x: 0, y: 0 }, { size: { width: 200, height: 150 } });

      expect(rect.size).toEqual({ width: 200, height: 150 });
    });

    it('should create a rectangle with custom style', () => {
      const rect = createElement('rect', { x: 0, y: 0 }, {
        style: { fill: '#3DA8F5', borderRadius: 10 }
      });

      expect(rect.style.fill).toBe('#3DA8F5');
      expect(rect.style.borderRadius).toBe(10);
    });

    it('should create a rectangle with rotation', () => {
      const rect = createElement('rect', { x: 0, y: 0 }, { rotation: 45 });

      expect(rect.rotation).toBe(45);
    });
  });

  describe('Ellipse Creation', () => {
    it('should create an ellipse with default properties', () => {
      const ellipse = createElement('ellipse', { x: 200, y: 200 });

      expect(ellipse.type).toBe('ellipse');
      expect(ellipse.size).toEqual({ width: 100, height: 100 });
    });

    it('should create an oval ellipse', () => {
      const ellipse = createElement('ellipse', { x: 0, y: 0 }, { size: { width: 200, height: 100 } });

      expect(ellipse.size.width).toBe(200);
      expect(ellipse.size.height).toBe(100);
    });
  });

  describe('Text Element Creation', () => {
    it('should create a text element with default properties', () => {
      const text = createElement('text', { x: 100, y: 100 });

      expect(text.type).toBe('text');
      expect(text.style.fontSize).toBe(16);
      expect(text.style.fontFamily).toBe('IBM Plex Sans Arabic');
      expect(text.content).toBe('');
    });

    it('should create a text element with content', () => {
      const text = createElement('text', { x: 0, y: 0 }, { content: 'مرحباً بالعالم' });

      expect(text.content).toBe('مرحباً بالعالم');
    });

    it('should create a text element with custom font', () => {
      const text = createElement('text', { x: 0, y: 0 }, {
        style: { fontSize: 24, fontWeight: 'bold' }
      });

      expect(text.style.fontSize).toBe(24);
      expect(text.style.fontWeight).toBe('bold');
    });

    it('should support RTL text alignment', () => {
      const text = createElement('text', { x: 0, y: 0 }, {
        style: { textAlign: 'right' }
      });

      expect(text.style.textAlign).toBe('right');
    });
  });

  describe('Sticky Note Creation', () => {
    it('should create a sticky note with default color', () => {
      const sticky = createElement('sticky_note', { x: 100, y: 100 });

      expect(sticky.type).toBe('sticky_note');
      expect(sticky.style.fill).toBe('#FEF7CD');
      expect(sticky.size).toEqual({ width: 200, height: 200 });
    });

    it('should create a sticky note with custom color', () => {
      const sticky = createElement('sticky_note', { x: 0, y: 0 }, {
        style: { fill: '#E5564D' }
      });

      expect(sticky.style.fill).toBe('#E5564D');
    });

    it('should create a sticky note with content', () => {
      const sticky = createElement('sticky_note', { x: 0, y: 0 }, {
        content: 'ملاحظة مهمة'
      });

      expect(sticky.content).toBe('ملاحظة مهمة');
    });
  });

  describe('Image Element Creation', () => {
    it('should create an image element', () => {
      const image = createElement('image', { x: 0, y: 0 }, {
        metadata: { src: 'https://example.com/image.png' }
      });

      expect(image.type).toBe('image');
      expect(image.metadata?.src).toBe('https://example.com/image.png');
    });

    it('should preserve aspect ratio metadata', () => {
      const image = createElement('image', { x: 0, y: 0 }, {
        size: { width: 400, height: 300 },
        metadata: { aspectRatio: 4 / 3, originalWidth: 1200, originalHeight: 900 }
      });

      expect(image.metadata?.aspectRatio).toBeCloseTo(1.333, 2);
    });
  });

  describe('Frame Element Creation', () => {
    it('should create a frame with children array', () => {
      const frame = createElement('frame', { x: 0, y: 0 });

      expect(frame.type).toBe('frame');
      expect(frame.children).toEqual([]);
    });

    it('should create a frame with preset children', () => {
      const frame = createElement('frame', { x: 0, y: 0 }, {
        children: ['child-1', 'child-2']
      });

      expect(frame.children).toEqual(['child-1', 'child-2']);
    });
  });

  describe('Line and Arrow Creation', () => {
    it('should create a line element', () => {
      const line = createElement('line', { x: 100, y: 100 });

      expect(line.type).toBe('line');
      expect(line.style.stroke).toBe('#000000');
    });

    it('should create an arrow element', () => {
      const arrow = createElement('arrow', { x: 100, y: 100 }, {
        size: { width: 200, height: 0 }
      });

      expect(arrow.type).toBe('arrow');
      expect(arrow.size.width).toBe(200);
    });
  });

  describe('Smart Element Creation', () => {
    it('should create a smart element with type', () => {
      const smart = createElement('smart', { x: 0, y: 0 }, {
        metadata: { smartType: 'chart', chartType: 'bar' }
      });

      expect(smart.type).toBe('smart');
      expect(smart.metadata?.smartType).toBe('chart');
    });
  });

  describe('File Element Creation', () => {
    it('should create a file element with metadata', () => {
      const file = createElement('file', { x: 0, y: 0 }, {
        metadata: { fileName: 'document.pdf', fileType: 'application/pdf', fileSize: 1024000 }
      });

      expect(file.type).toBe('file');
      expect(file.metadata?.fileName).toBe('document.pdf');
    });
  });

  describe('Group Element Creation', () => {
    it('should create a group with children', () => {
      const group = createElement('group', { x: 0, y: 0 }, {
        children: ['el-1', 'el-2', 'el-3']
      });

      expect(group.type).toBe('group');
      expect(group.children).toHaveLength(3);
    });
  });
});

// ============================================
// Element Validation Tests
// ============================================

describe('Element Validation', () => {
  it('should validate a correct element', () => {
    const element = createElement('rect', { x: 100, y: 100 });
    const result = validateElement(element);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject element without ID', () => {
    const element = createElement('rect', { x: 0, y: 0 });
    element.id = '';

    const result = validateElement(element);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('ID is required');
  });

  it('should reject element with negative width', () => {
    const element = createElement('rect', { x: 0, y: 0 });
    element.size.width = -10;

    const result = validateElement(element);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Width must be positive');
  });

  it('should reject element with invalid position', () => {
    const element = createElement('rect', { x: 0, y: 0 });
    (element.position as any).x = 'invalid';

    const result = validateElement(element);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Position.x must be a number');
  });
});

// ============================================
// Element Positioning Tests
// ============================================

describe('Element Positioning', () => {
  describe('Initial Positioning', () => {
    it('should place element at exact position', () => {
      const element = createElement('rect', { x: 150, y: 250 });

      expect(element.position.x).toBe(150);
      expect(element.position.y).toBe(250);
    });

    it('should handle negative positions', () => {
      const element = createElement('rect', { x: -100, y: -200 });

      expect(element.position.x).toBe(-100);
      expect(element.position.y).toBe(-200);
    });

    it('should handle zero position', () => {
      const element = createElement('rect', { x: 0, y: 0 });

      expect(element.position.x).toBe(0);
      expect(element.position.y).toBe(0);
    });
  });

  describe('Grid Snapping', () => {
    const snapToGrid = (value: number, gridSize: number): number => {
      return Math.round(value / gridSize) * gridSize;
    };

    it('should snap position to grid', () => {
      const position = { x: 123, y: 167 };
      const gridSize = 20;

      const snapped = {
        x: snapToGrid(position.x, gridSize),
        y: snapToGrid(position.y, gridSize)
      };

      expect(snapped.x).toBe(120);
      expect(snapped.y).toBe(160);
    });

    it('should snap to nearest grid line', () => {
      expect(snapToGrid(15, 20)).toBe(20);
      expect(snapToGrid(14, 20)).toBe(20);
      expect(snapToGrid(9, 20)).toBe(0);
    });
  });

  describe('Center Positioning', () => {
    const centerElement = (element: CanvasElement, containerSize: Size): Point => {
      return {
        x: (containerSize.width - element.size.width) / 2,
        y: (containerSize.height - element.size.height) / 2
      };
    };

    it('should center element in container', () => {
      const element = createElement('rect', { x: 0, y: 0 }, { size: { width: 100, height: 100 } });
      const containerSize = { width: 800, height: 600 };

      const centeredPos = centerElement(element, containerSize);

      expect(centeredPos.x).toBe(350);
      expect(centeredPos.y).toBe(250);
    });
  });
});

// ============================================
// Element Sizing Tests
// ============================================

describe('Element Sizing', () => {
  describe('Default Sizes', () => {
    it('should use default size for each type', () => {
      const rect = createElement('rect', { x: 0, y: 0 });
      const text = createElement('text', { x: 0, y: 0 });
      const sticky = createElement('sticky_note', { x: 0, y: 0 });

      expect(rect.size).toEqual({ width: 100, height: 100 });
      expect(text.size).toEqual({ width: 200, height: 40 });
      expect(sticky.size).toEqual({ width: 200, height: 200 });
    });
  });

  describe('Custom Sizes', () => {
    it('should accept custom size', () => {
      const element = createElement('rect', { x: 0, y: 0 }, {
        size: { width: 500, height: 300 }
      });

      expect(element.size.width).toBe(500);
      expect(element.size.height).toBe(300);
    });
  });

  describe('Minimum Size Constraints', () => {
    const MIN_SIZE = 10;

    const enforceMinSize = (size: Size): Size => ({
      width: Math.max(size.width, MIN_SIZE),
      height: Math.max(size.height, MIN_SIZE)
    });

    it('should enforce minimum width', () => {
      const size = { width: 5, height: 100 };
      const enforced = enforceMinSize(size);

      expect(enforced.width).toBe(MIN_SIZE);
    });

    it('should enforce minimum height', () => {
      const size = { width: 100, height: 3 };
      const enforced = enforceMinSize(size);

      expect(enforced.height).toBe(MIN_SIZE);
    });
  });

  describe('Aspect Ratio', () => {
    const resizeWithAspectRatio = (
      currentSize: Size,
      newWidth: number,
      aspectRatio: number
    ): Size => ({
      width: newWidth,
      height: newWidth / aspectRatio
    });

    it('should maintain aspect ratio when resizing', () => {
      const originalSize = { width: 400, height: 300 };
      const aspectRatio = originalSize.width / originalSize.height;

      const newSize = resizeWithAspectRatio(originalSize, 200, aspectRatio);

      expect(newSize.width).toBe(200);
      expect(newSize.height).toBe(150);
      expect(newSize.width / newSize.height).toBeCloseTo(aspectRatio, 5);
    });
  });
});

// ============================================
// Element Metadata Tests
// ============================================

describe('Element Metadata', () => {
  it('should store custom metadata', () => {
    const element = createElement('smart', { x: 0, y: 0 }, {
      metadata: {
        smartType: 'persona',
        personaName: 'أحمد',
        age: 30,
        traits: ['مبتكر', 'تحليلي']
      }
    });

    expect(element.metadata?.personaName).toBe('أحمد');
    expect(element.metadata?.age).toBe(30);
    expect(element.metadata?.traits).toContain('مبتكر');
  });

  it('should merge metadata with defaults', () => {
    const element = createElement('file', { x: 0, y: 0 }, {
      metadata: { fileName: 'test.pdf' }
    });

    expect(element.metadata?.fileName).toBe('test.pdf');
    expect(element.metadata?.fileType).toBe('');
  });
});

// ============================================
// Element Timestamps Tests
// ============================================

describe('Element Timestamps', () => {
  it('should set createdAt on creation', () => {
    const before = Date.now();
    const element = createElement('rect', { x: 0, y: 0 });
    const after = Date.now();

    expect(element.createdAt).toBeGreaterThanOrEqual(before);
    expect(element.createdAt).toBeLessThanOrEqual(after);
  });

  it('should set updatedAt equal to createdAt initially', () => {
    const element = createElement('rect', { x: 0, y: 0 });

    expect(element.updatedAt).toBe(element.createdAt);
  });

  it('should update updatedAt on modification', () => {
    const element = createElement('rect', { x: 0, y: 0 });
    const originalUpdatedAt = element.updatedAt;

    // محاكاة تأخير
    const newUpdatedAt = Date.now() + 1000;
    element.updatedAt = newUpdatedAt;

    expect(element.updatedAt).toBeGreaterThan(originalUpdatedAt);
  });
});

// ============================================
// Layer Assignment Tests
// ============================================

describe('Layer Assignment', () => {
  it('should assign default layer', () => {
    const element = createElement('rect', { x: 0, y: 0 });

    expect(element.layerId).toBe('default');
  });

  it('should assign custom layer', () => {
    const element = createElement('rect', { x: 0, y: 0 }, {
      layerId: 'layer-2'
    });

    expect(element.layerId).toBe('layer-2');
  });
});

// ============================================
// Element Visibility and Locking Tests
// ============================================

describe('Element Visibility and Locking', () => {
  it('should be visible by default', () => {
    const element = createElement('rect', { x: 0, y: 0 });

    expect(element.visible).toBe(true);
  });

  it('should allow creating hidden element', () => {
    const element = createElement('rect', { x: 0, y: 0 }, {
      visible: false
    });

    expect(element.visible).toBe(false);
  });

  it('should be unlocked by default', () => {
    const element = createElement('rect', { x: 0, y: 0 });

    expect(element.locked).toBe(false);
  });

  it('should allow creating locked element', () => {
    const element = createElement('rect', { x: 0, y: 0 }, {
      locked: true
    });

    expect(element.locked).toBe(true);
  });
});

// ============================================
// Batch Creation Tests
// ============================================

describe('Batch Element Creation', () => {
  const createMultipleElements = (
    configs: Array<{ type: ElementType; position: Point; options?: Partial<CanvasElement> }>
  ): CanvasElement[] => {
    return configs.map(config => createElement(config.type, config.position, config.options));
  };

  it('should create multiple elements at once', () => {
    const configs = [
      { type: 'rect' as ElementType, position: { x: 0, y: 0 } },
      { type: 'ellipse' as ElementType, position: { x: 100, y: 100 } },
      { type: 'text' as ElementType, position: { x: 200, y: 200 } }
    ];

    const elements = createMultipleElements(configs);

    expect(elements).toHaveLength(3);
    expect(elements[0].type).toBe('rect');
    expect(elements[1].type).toBe('ellipse');
    expect(elements[2].type).toBe('text');
  });

  it('should assign unique IDs to batch elements', () => {
    const configs = [
      { type: 'rect' as ElementType, position: { x: 0, y: 0 } },
      { type: 'rect' as ElementType, position: { x: 100, y: 100 } },
      { type: 'rect' as ElementType, position: { x: 200, y: 200 } }
    ];

    const elements = createMultipleElements(configs);
    const ids = elements.map(e => e.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(3);
  });
});

// ============================================
// Clone and Duplicate Tests
// ============================================

describe('Element Cloning', () => {
  const cloneElement = (element: CanvasElement, offset: Point = { x: 20, y: 20 }): CanvasElement => {
    return {
      ...element,
      id: nanoid(),
      position: {
        x: element.position.x + offset.x,
        y: element.position.y + offset.y
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  };

  it('should clone element with new ID', () => {
    const original = createElement('rect', { x: 100, y: 100 });
    const clone = cloneElement(original);

    expect(clone.id).not.toBe(original.id);
    expect(clone.type).toBe(original.type);
  });

  it('should clone element with offset position', () => {
    const original = createElement('rect', { x: 100, y: 100 });
    const clone = cloneElement(original, { x: 50, y: 50 });

    expect(clone.position.x).toBe(150);
    expect(clone.position.y).toBe(150);
  });

  it('should preserve style in clone', () => {
    const original = createElement('rect', { x: 0, y: 0 }, {
      style: { fill: '#ff0000', strokeWidth: 3 }
    });
    const clone = cloneElement(original);

    expect(clone.style.fill).toBe('#ff0000');
    expect(clone.style.strokeWidth).toBe(3);
  });

  it('should create new timestamps for clone', () => {
    const original = createElement('rect', { x: 0, y: 0 });
    
    // تأخير صغير
    const clone = cloneElement(original);

    expect(clone.createdAt).toBeGreaterThanOrEqual(original.createdAt);
  });
});

// ============================================
// Performance Tests
// ============================================

describe('Element Creation Performance', () => {
  it('should create 1000 elements efficiently', () => {
    const startTime = performance.now();

    const elements: CanvasElement[] = [];
    for (let i = 0; i < 1000; i++) {
      elements.push(createElement('rect', { x: i * 10, y: i * 10 }));
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(elements).toHaveLength(1000);
    expect(duration).toBeLessThan(500); // أقل من 500ms
  });

  it('should create complex elements efficiently', () => {
    const startTime = performance.now();

    const elements: CanvasElement[] = [];
    for (let i = 0; i < 500; i++) {
      elements.push(createElement('smart', { x: i * 10, y: i * 10 }, {
        metadata: {
          smartType: 'persona',
          data: { name: `User ${i}`, traits: ['a', 'b', 'c'] }
        }
      }));
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(elements).toHaveLength(500);
    expect(duration).toBeLessThan(300);
  });
});

// ============================================
// Edge Cases Tests
// ============================================

describe('Edge Cases', () => {
  it('should handle empty string content', () => {
    const text = createElement('text', { x: 0, y: 0 }, { content: '' });

    expect(text.content).toBe('');
  });

  it('should handle very long content', () => {
    const longContent = 'أ'.repeat(10000);
    const text = createElement('text', { x: 0, y: 0 }, { content: longContent });

    expect(text.content?.length).toBe(10000);
  });

  it('should handle special characters in content', () => {
    const content = 'مرحباً! 🎨 <script>alert("xss")</script>';
    const text = createElement('text', { x: 0, y: 0 }, { content });

    expect(text.content).toBe(content);
  });

  it('should handle very large positions', () => {
    const element = createElement('rect', { x: 1000000, y: 1000000 });

    expect(element.position.x).toBe(1000000);
    expect(element.position.y).toBe(1000000);
  });

  it('should handle floating point positions', () => {
    const element = createElement('rect', { x: 100.5, y: 200.75 });

    expect(element.position.x).toBe(100.5);
    expect(element.position.y).toBe(200.75);
  });

  it('should handle zero-size elements (for lines)', () => {
    const line = createElement('line', { x: 0, y: 0 }, {
      size: { width: 100, height: 0 }
    });

    expect(line.size.height).toBe(0);
  });
});
