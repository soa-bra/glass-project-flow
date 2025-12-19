/**
 * Integration Tests - Export/Import Integration
 * Tests the complete export and import workflows
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Canvas element type for tests
interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  layerId: string;
  style?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    fontSize?: number;
    shadow?: { color: string; blur: number; offsetX: number; offsetY: number };
  };
  locked: boolean;
  visible: boolean;
  content?: string;
}

// Mock canvas and document APIs
const mockCanvas = {
  getContext: vi.fn(() => ({
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 100 })),
    setTransform: vi.fn(),
    clearRect: vi.fn(),
  })),
  toDataURL: vi.fn(() => 'data:image/png;base64,test'),
  toBlob: vi.fn((cb) => cb(new Blob(['test'], { type: 'image/png' }))),
  width: 1920,
  height: 1080,
};

vi.stubGlobal('document', {
  createElement: vi.fn((tag) => {
    if (tag === 'canvas') return mockCanvas;
    if (tag === 'a') return { click: vi.fn(), href: '', download: '' };
    return {};
  }),
});

// Helper to create test elements
const createTestElement = (overrides: Partial<CanvasElement> = {}): CanvasElement => ({
  id: `el-${Math.random().toString(36).substr(2, 9)}`,
  type: 'rectangle',
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  rotation: 0,
  layerId: 'default',
  style: {
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 1,
    opacity: 1,
  },
  locked: false,
  visible: true,
  ...overrides,
});

// Export/Import utilities
const exportToJSON = (elements: CanvasElement[]): string => {
  const exportData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    elements: elements.map(el => ({
      ...el,
      exportedAt: new Date().toISOString(),
    })),
    metadata: {
      elementCount: elements.length,
      types: [...new Set(elements.map(e => e.type))],
    },
  };
  return JSON.stringify(exportData, null, 2);
};

const importFromJSON = (jsonString: string): { elements: CanvasElement[]; metadata: any } => {
  const data = JSON.parse(jsonString);
  
  // Validate structure
  if (!data.elements || !Array.isArray(data.elements)) {
    throw new Error('Invalid JSON structure: missing elements array');
  }
  
  // Validate and clean elements
  const elements = data.elements.map((el: any) => {
    const { exportedAt, ...cleanElement } = el;
    return {
      ...cleanElement,
      id: `imported-${cleanElement.id}`, // Generate new IDs
    };
  });
  
  return {
    elements,
    metadata: data.metadata || {},
  };
};

const exportToSVG = (elements: CanvasElement[]): string => {
  const bounds = calculateBounds(elements);
  
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${bounds.width}" 
     height="${bounds.height}" 
     viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}">
  <defs>
    <style>
      .canvas-element { transition: all 0.2s; }
    </style>
  </defs>
  <g id="canvas-content">`;
  
  for (const element of elements) {
    svg += elementToSVG(element);
  }
  
  svg += `
  </g>
</svg>`;
  
  return svg;
};

const elementToSVG = (element: CanvasElement): string => {
  const { x, y, width, height, style, rotation, type } = element;
  const transform = rotation ? ` transform="rotate(${rotation} ${x + width/2} ${y + height/2})"` : '';
  
  switch (type) {
    case 'rectangle':
      return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" 
          fill="${style?.fill || 'none'}" 
          stroke="${style?.stroke || 'black'}" 
          stroke-width="${style?.strokeWidth || 1}"
          opacity="${style?.opacity || 1}"
          ${transform}
          class="canvas-element" />`;
    
    case 'ellipse':
      const cx = x + width / 2;
      const cy = y + height / 2;
      return `
    <ellipse cx="${cx}" cy="${cy}" rx="${width/2}" ry="${height/2}"
             fill="${style?.fill || 'none'}" 
             stroke="${style?.stroke || 'black'}"
             stroke-width="${style?.strokeWidth || 1}"
             opacity="${style?.opacity || 1}"
             ${transform}
             class="canvas-element" />`;
    
    case 'text':
      return `
    <text x="${x}" y="${y + 20}" 
          font-family="IBM Plex Sans Arabic, sans-serif"
          font-size="${style?.fontSize || 16}"
          fill="${style?.fill || 'black'}"
          ${transform}
          class="canvas-element">${element.content || ''}</text>`;
    
    default:
      return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" 
          fill="${style?.fill || 'none'}" 
          stroke="${style?.stroke || 'black'}"
          ${transform}
          class="canvas-element" />`;
  }
};

const calculateBounds = (elements: CanvasElement[]) => {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 1920, height: 1080 };
  }
  
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  for (const el of elements) {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width);
    maxY = Math.max(maxY, el.y + el.height);
  }
  
  const padding = 50;
  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
};

const importFromSVG = (svgString: string): CanvasElement[] => {
  const elements: CanvasElement[] = [];
  
  // Simple regex-based parser for demo
  const rectMatches = svgString.matchAll(/<rect[^>]*x="([^"]*)"[^>]*y="([^"]*)"[^>]*width="([^"]*)"[^>]*height="([^"]*)"[^>]*>/g);
  
  for (const match of rectMatches) {
    elements.push(createTestElement({
      id: `imported-${Math.random().toString(36).substr(2, 9)}`,
      type: 'rectangle',
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
      width: parseFloat(match[3]),
      height: parseFloat(match[4]),
    }));
  }
  
  return elements;
};

describe('Export/Import Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('JSON Export/Import', () => {
    it('should export elements to valid JSON', () => {
      const elements = [
        createTestElement({ id: 'el-1', type: 'rectangle' }),
        createTestElement({ id: 'el-2', type: 'ellipse' }),
      ];
      
      const json = exportToJSON(elements);
      const parsed = JSON.parse(json);
      
      expect(parsed.version).toBe('1.0.0');
      expect(parsed.elements).toHaveLength(2);
      expect(parsed.metadata.elementCount).toBe(2);
    });

    it('should import JSON and restore elements', () => {
      const original = [
        createTestElement({ id: 'el-1', x: 100, y: 200 }),
      ];
      
      const json = exportToJSON(original);
      const { elements } = importFromJSON(json);
      
      expect(elements).toHaveLength(1);
      expect(elements[0].x).toBe(100);
      expect(elements[0].y).toBe(200);
    });

    it('should generate new IDs on import', () => {
      const original = [createTestElement({ id: 'el-1' })];
      const json = exportToJSON(original);
      const { elements } = importFromJSON(json);
      
      expect(elements[0].id).not.toBe('el-1');
      expect(elements[0].id).toContain('imported-');
    });

    it('should preserve all element properties', () => {
      const original = [
        createTestElement({
          id: 'el-1',
          type: 'rectangle',
          x: 50,
          y: 75,
          width: 300,
          height: 200,
          rotation: 45,
          style: {
            fill: '#ff0000',
            stroke: '#00ff00',
            strokeWidth: 3,
            opacity: 0.8,
          },
        }),
      ];
      
      const json = exportToJSON(original);
      const { elements } = importFromJSON(json);
      
      expect(elements[0].type).toBe('rectangle');
      expect(elements[0].rotation).toBe(45);
      expect(elements[0].style?.fill).toBe('#ff0000');
      expect(elements[0].style?.strokeWidth).toBe(3);
    });

    it('should include metadata in export', () => {
      const elements = [
        createTestElement({ type: 'rectangle' }),
        createTestElement({ type: 'ellipse' }),
        createTestElement({ type: 'text' }),
      ];
      
      const json = exportToJSON(elements);
      const parsed = JSON.parse(json);
      
      expect(parsed.metadata.elementCount).toBe(3);
      expect(parsed.metadata.types).toContain('rectangle');
      expect(parsed.metadata.types).toContain('ellipse');
      expect(parsed.metadata.types).toContain('text');
    });

    it('should throw error for invalid JSON structure', () => {
      const invalidJSON = JSON.stringify({ invalid: 'data' });
      
      expect(() => importFromJSON(invalidJSON)).toThrow('Invalid JSON structure');
    });

    it('should handle empty elements array', () => {
      const json = exportToJSON([]);
      const { elements, metadata } = importFromJSON(json);
      
      expect(elements).toHaveLength(0);
      expect(metadata.elementCount).toBe(0);
    });

    it('should handle large number of elements', () => {
      const elements = Array.from({ length: 1000 }, (_, i) =>
        createTestElement({ id: `el-${i}`, x: i * 10, y: i * 10 })
      );
      
      const json = exportToJSON(elements);
      const { elements: imported } = importFromJSON(json);
      
      expect(imported).toHaveLength(1000);
    });
  });

  describe('SVG Export/Import', () => {
    it('should export elements to valid SVG', () => {
      const elements = [
        createTestElement({ id: 'el-1', type: 'rectangle', x: 100, y: 100 }),
      ];
      
      const svg = exportToSVG(elements);
      
      expect(svg).toContain('<?xml version="1.0"');
      expect(svg).toContain('<svg');
      expect(svg).toContain('<rect');
    });

    it('should include viewBox based on element bounds', () => {
      const elements = [
        createTestElement({ x: 0, y: 0, width: 100, height: 100 }),
        createTestElement({ x: 500, y: 500, width: 100, height: 100 }),
      ];
      
      const svg = exportToSVG(elements);
      
      expect(svg).toContain('viewBox=');
    });

    it('should export different element types', () => {
      const elements = [
        createTestElement({ type: 'rectangle' }),
        createTestElement({ type: 'ellipse' }),
        createTestElement({ type: 'text', content: 'Hello' }),
      ];
      
      const svg = exportToSVG(elements);
      
      expect(svg).toContain('<rect');
      expect(svg).toContain('<ellipse');
      expect(svg).toContain('<text');
    });

    it('should include element styles', () => {
      const elements = [
        createTestElement({
          style: { fill: '#ff0000', stroke: '#00ff00', strokeWidth: 2 },
        }),
      ];
      
      const svg = exportToSVG(elements);
      
      expect(svg).toContain('fill="#ff0000"');
      expect(svg).toContain('stroke="#00ff00"');
      expect(svg).toContain('stroke-width="2"');
    });

    it('should handle element rotation', () => {
      const elements = [
        createTestElement({ rotation: 45 }),
      ];
      
      const svg = exportToSVG(elements);
      
      expect(svg).toContain('transform="rotate(45');
    });

    it('should import simple SVG rectangles', () => {
      const svg = `<svg><rect x="100" y="200" width="300" height="400" /></svg>`;
      const elements = importFromSVG(svg);
      
      expect(elements).toHaveLength(1);
      expect(elements[0].x).toBe(100);
      expect(elements[0].y).toBe(200);
      expect(elements[0].width).toBe(300);
      expect(elements[0].height).toBe(400);
    });
  });

  describe('Round-trip Export/Import', () => {
    it('should maintain data integrity through JSON round-trip', () => {
      const original = [
        createTestElement({ id: 'el-1', x: 100, y: 200, width: 300, height: 400 }),
        createTestElement({ id: 'el-2', type: 'ellipse', x: 500, y: 600 }),
      ];
      
      const json = exportToJSON(original);
      const { elements: imported } = importFromJSON(json);
      
      expect(imported[0].x).toBe(original[0].x);
      expect(imported[0].y).toBe(original[0].y);
      expect(imported[0].width).toBe(original[0].width);
      expect(imported[1].type).toBe('ellipse');
    });

    it('should handle special characters in content', () => {
      const original = [
        createTestElement({
          type: 'text',
          content: 'مرحباً بالعالم! <script>alert("xss")</script>',
        }),
      ];
      
      const json = exportToJSON(original);
      const { elements } = importFromJSON(json);
      
      expect(elements[0].content).toBe('مرحباً بالعالم! <script>alert("xss")</script>');
    });

    it('should preserve nested style objects', () => {
      const original = [
        createTestElement({
          style: {
            fill: '#ff0000',
            stroke: '#00ff00',
            strokeWidth: 5,
            opacity: 0.5,
            shadow: {
              color: '#000000',
              blur: 10,
              offsetX: 5,
              offsetY: 5,
            } as any,
          },
        }),
      ];
      
      const json = exportToJSON(original);
      const { elements } = importFromJSON(json);
      
      expect(elements[0].style?.fill).toBe('#ff0000');
      expect((elements[0].style as any)?.shadow?.blur).toBe(10);
    });
  });

  describe('Export Performance', () => {
    it('should export 100 elements in under 50ms', () => {
      const elements = Array.from({ length: 100 }, (_, i) =>
        createTestElement({ id: `el-${i}` })
      );
      
      const start = performance.now();
      exportToJSON(elements);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(50);
    });

    it('should export 100 elements to SVG in under 100ms', () => {
      const elements = Array.from({ length: 100 }, (_, i) =>
        createTestElement({ id: `el-${i}` })
      );
      
      const start = performance.now();
      exportToSVG(elements);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(100);
    });

    it('should import 100 elements in under 50ms', () => {
      const elements = Array.from({ length: 100 }, (_, i) =>
        createTestElement({ id: `el-${i}` })
      );
      const json = exportToJSON(elements);
      
      const start = performance.now();
      importFromJSON(json);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON gracefully', () => {
      expect(() => importFromJSON('not valid json')).toThrow();
    });

    it('should handle missing required fields', () => {
      const incomplete = JSON.stringify({ version: '1.0.0' });
      expect(() => importFromJSON(incomplete)).toThrow('Invalid JSON structure');
    });

    it('should handle null values in elements', () => {
      const original = [
        createTestElement({ content: undefined }),
      ];
      
      const json = exportToJSON(original);
      const { elements } = importFromJSON(json);
      
      expect(elements).toHaveLength(1);
    });
  });
});
