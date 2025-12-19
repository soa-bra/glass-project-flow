/**
 * اختبارات Canvas Rendering و Zoom/Pan Behavior
 * 
 * تتحقق من:
 * 1. رسم العناصر بشكل صحيح
 * 2. التكبير والتصغير
 * 3. التحريك (Pan)
 * 4. تحويلات الإحداثيات
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// ========================================
// Canvas Rendering Tests
// ========================================

describe('Canvas Rendering', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext('2d')!;
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    document.body.removeChild(canvas);
  });

  describe('Basic Shapes Rendering', () => {
    test('رسم مستطيل بشكل صحيح', () => {
      const rect = { x: 100, y: 100, width: 200, height: 150 };
      
      ctx.fillStyle = '#3DBE8B';
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      
      // التحقق من أن البكسل داخل المستطيل ملون
      const imageData = ctx.getImageData(rect.x + 10, rect.y + 10, 1, 1);
      expect(imageData.data[3]).toBeGreaterThan(0); // alpha > 0
    });

    test('رسم دائرة بشكل صحيح', () => {
      const circle = { x: 200, y: 200, radius: 50 };
      
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#F6C445';
      ctx.fill();
      
      // التحقق من المركز
      const centerData = ctx.getImageData(circle.x, circle.y, 1, 1);
      expect(centerData.data[3]).toBeGreaterThan(0);
      
      // التحقق من خارج الدائرة
      const outsideData = ctx.getImageData(circle.x + circle.radius + 10, circle.y, 1, 1);
      expect(outsideData.data[3]).toBe(0);
    });

    test('رسم خط بشكل صحيح', () => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(100, 100);
      ctx.strokeStyle = '#0B0F12';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // التحقق من نقطة على الخط
      const lineData = ctx.getImageData(50, 50, 1, 1);
      expect(lineData.data[3]).toBeGreaterThan(0);
    });

    test('رسم نص بشكل صحيح', () => {
      ctx.font = '16px IBM Plex Sans Arabic';
      ctx.fillStyle = '#0B0F12';
      ctx.fillText('مرحبا', 100, 100);
      
      // التحقق من أن منطقة النص ليست فارغة
      const textArea = ctx.getImageData(100, 85, 50, 20);
      let hasContent = false;
      for (let i = 3; i < textArea.data.length; i += 4) {
        if (textArea.data[i] > 0) {
          hasContent = true;
          break;
        }
      }
      expect(hasContent).toBe(true);
    });
  });

  describe('Transform Operations', () => {
    test('تطبيق scale بشكل صحيح', () => {
      ctx.save();
      ctx.scale(2, 2);
      ctx.fillStyle = '#E5564D';
      ctx.fillRect(10, 10, 50, 50);
      ctx.restore();
      
      // المستطيل يجب أن يكون بضعف الحجم (20, 20) إلى (120, 120)
      const scaledData = ctx.getImageData(30, 30, 1, 1);
      expect(scaledData.data[3]).toBeGreaterThan(0);
    });

    test('تطبيق translate بشكل صحيح', () => {
      ctx.save();
      ctx.translate(100, 100);
      ctx.fillStyle = '#3DA8F5';
      ctx.fillRect(0, 0, 50, 50);
      ctx.restore();
      
      // المستطيل يجب أن يكون في (100, 100)
      const translatedData = ctx.getImageData(110, 110, 1, 1);
      expect(translatedData.data[3]).toBeGreaterThan(0);
      
      // النقطة الأصلية (10, 10) يجب أن تكون فارغة
      const originalData = ctx.getImageData(10, 10, 1, 1);
      expect(originalData.data[3]).toBe(0);
    });

    test('تطبيق rotate بشكل صحيح', () => {
      ctx.save();
      ctx.translate(200, 200);
      ctx.rotate(Math.PI / 4); // 45 درجة
      ctx.fillStyle = '#3DBE8B';
      ctx.fillRect(-25, -25, 50, 50);
      ctx.restore();
      
      // المركز يجب أن يكون ملون
      const centerData = ctx.getImageData(200, 200, 1, 1);
      expect(centerData.data[3]).toBeGreaterThan(0);
    });
  });

  describe('Clear and Reset', () => {
    test('مسح الكانفس بالكامل', () => {
      // رسم شيء
      ctx.fillStyle = '#0B0F12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // مسح
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // التحقق من أن الكانفس فارغ
      const data = ctx.getImageData(100, 100, 1, 1);
      expect(data.data[3]).toBe(0);
    });

    test('إعادة تعيين التحويلات', () => {
      ctx.scale(2, 2);
      ctx.translate(100, 100);
      ctx.rotate(Math.PI);
      
      // إعادة تعيين
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      ctx.fillStyle = '#F6C445';
      ctx.fillRect(10, 10, 20, 20);
      
      // يجب أن يكون في الموقع الأصلي
      const data = ctx.getImageData(15, 15, 1, 1);
      expect(data.data[3]).toBeGreaterThan(0);
    });
  });
});

// ========================================
// Zoom Behavior Tests
// ========================================

describe('Zoom Behavior', () => {
  
  describe('Zoom Calculations', () => {
    const calculateZoom = (currentZoom: number, delta: number, minZoom = 0.1, maxZoom = 10) => {
      const zoomFactor = delta > 0 ? 0.9 : 1.1;
      const newZoom = currentZoom * zoomFactor;
      return Math.max(minZoom, Math.min(maxZoom, newZoom));
    };

    test('التكبير يزيد مستوى الزوم', () => {
      const currentZoom = 1;
      const newZoom = calculateZoom(currentZoom, -100); // scroll up = zoom in
      expect(newZoom).toBeGreaterThan(currentZoom);
    });

    test('التصغير يقلل مستوى الزوم', () => {
      const currentZoom = 1;
      const newZoom = calculateZoom(currentZoom, 100); // scroll down = zoom out
      expect(newZoom).toBeLessThan(currentZoom);
    });

    test('الزوم لا يتجاوز الحد الأقصى', () => {
      const currentZoom = 9.5;
      const maxZoom = 10;
      const newZoom = calculateZoom(currentZoom, -100, 0.1, maxZoom);
      expect(newZoom).toBeLessThanOrEqual(maxZoom);
    });

    test('الزوم لا يقل عن الحد الأدنى', () => {
      const currentZoom = 0.15;
      const minZoom = 0.1;
      const newZoom = calculateZoom(currentZoom, 100, minZoom, 10);
      expect(newZoom).toBeGreaterThanOrEqual(minZoom);
    });

    test('حساب الزوم التدريجي صحيح', () => {
      let zoom = 1;
      // 5 خطوات تكبير
      for (let i = 0; i < 5; i++) {
        zoom = calculateZoom(zoom, -100);
      }
      expect(zoom).toBeCloseTo(1.1 ** 5, 2);
    });
  });

  describe('Zoom to Point', () => {
    interface ViewState {
      zoom: number;
      panX: number;
      panY: number;
    }

    const zoomToPoint = (
      view: ViewState,
      point: { x: number; y: number },
      newZoom: number
    ): ViewState => {
      const zoomRatio = newZoom / view.zoom;
      return {
        zoom: newZoom,
        panX: point.x - (point.x - view.panX) * zoomRatio,
        panY: point.y - (point.y - view.panY) * zoomRatio,
      };
    };

    test('التكبير نحو نقطة يحافظ على موقعها', () => {
      const view: ViewState = { zoom: 1, panX: 0, panY: 0 };
      const point = { x: 400, y: 300 };
      
      const newView = zoomToPoint(view, point, 2);
      
      // النقطة يجب أن تبقى في نفس الموقع على الشاشة
      const worldXBefore = (point.x - view.panX) / view.zoom;
      const worldXAfter = (point.x - newView.panX) / newView.zoom;
      
      expect(worldXAfter).toBeCloseTo(worldXBefore, 5);
    });

    test('التصغير نحو نقطة يحافظ على موقعها', () => {
      const view: ViewState = { zoom: 2, panX: -200, panY: -150 };
      const point = { x: 400, y: 300 };
      
      const newView = zoomToPoint(view, point, 1);
      
      const worldXBefore = (point.x - view.panX) / view.zoom;
      const worldXAfter = (point.x - newView.panX) / newView.zoom;
      
      expect(worldXAfter).toBeCloseTo(worldXBefore, 5);
    });

    test('التكبير من المركز لا يغير pan عند zoom = 1', () => {
      const view: ViewState = { zoom: 1, panX: 0, panY: 0 };
      const center = { x: 0, y: 0 };
      
      const newView = zoomToPoint(view, center, 2);
      
      expect(newView.panX).toBe(0);
      expect(newView.panY).toBe(0);
    });
  });

  describe('Zoom Presets', () => {
    const zoomPresets = [0.25, 0.5, 0.75, 1, 1.5, 2, 4];

    const findNearestPreset = (currentZoom: number, direction: 'in' | 'out'): number => {
      if (direction === 'in') {
        return zoomPresets.find(p => p > currentZoom) ?? zoomPresets[zoomPresets.length - 1];
      } else {
        return [...zoomPresets].reverse().find(p => p < currentZoom) ?? zoomPresets[0];
      }
    };

    test('إيجاد أقرب preset للتكبير', () => {
      expect(findNearestPreset(1, 'in')).toBe(1.5);
      expect(findNearestPreset(0.5, 'in')).toBe(0.75);
      expect(findNearestPreset(3, 'in')).toBe(4);
    });

    test('إيجاد أقرب preset للتصغير', () => {
      expect(findNearestPreset(1, 'out')).toBe(0.75);
      expect(findNearestPreset(2, 'out')).toBe(1.5);
      expect(findNearestPreset(0.3, 'out')).toBe(0.25);
    });

    test('الحد الأقصى للتكبير', () => {
      expect(findNearestPreset(4, 'in')).toBe(4);
      expect(findNearestPreset(10, 'in')).toBe(4);
    });

    test('الحد الأدنى للتصغير', () => {
      expect(findNearestPreset(0.25, 'out')).toBe(0.25);
      expect(findNearestPreset(0.1, 'out')).toBe(0.25);
    });
  });

  describe('Fit to View', () => {
    interface Bounds {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    }

    const fitToView = (
      bounds: Bounds,
      viewportWidth: number,
      viewportHeight: number,
      padding = 50
    ) => {
      const contentWidth = bounds.maxX - bounds.minX;
      const contentHeight = bounds.maxY - bounds.minY;
      
      const availableWidth = viewportWidth - padding * 2;
      const availableHeight = viewportHeight - padding * 2;
      
      const zoom = Math.min(
        availableWidth / contentWidth,
        availableHeight / contentHeight,
        1 // لا نكبر أكثر من 100%
      );
      
      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerY = (bounds.minY + bounds.maxY) / 2;
      
      return {
        zoom: Math.max(0.1, zoom),
        panX: viewportWidth / 2 - centerX * zoom,
        panY: viewportHeight / 2 - centerY * zoom,
      };
    };

    test('حساب fit لمحتوى أصغر من الشاشة', () => {
      const bounds: Bounds = { minX: 100, minY: 100, maxX: 300, maxY: 200 };
      const result = fitToView(bounds, 800, 600);
      
      expect(result.zoom).toBe(1); // لا تكبير
    });

    test('حساب fit لمحتوى أكبر من الشاشة', () => {
      const bounds: Bounds = { minX: 0, minY: 0, maxX: 2000, maxY: 1500 };
      const result = fitToView(bounds, 800, 600);
      
      expect(result.zoom).toBeLessThan(1);
      expect(result.zoom).toBeGreaterThan(0);
    });

    test('المحتوى يتمركز بعد fit', () => {
      const bounds: Bounds = { minX: 0, minY: 0, maxX: 400, maxY: 300 };
      const viewportWidth = 800;
      const viewportHeight = 600;
      const result = fitToView(bounds, viewportWidth, viewportHeight);
      
      const contentCenterX = (bounds.minX + bounds.maxX) / 2;
      const screenCenterX = (contentCenterX * result.zoom) + result.panX;
      
      expect(screenCenterX).toBeCloseTo(viewportWidth / 2, 0);
    });
  });
});

// ========================================
// Pan Behavior Tests
// ========================================

describe('Pan Behavior', () => {
  
  describe('Pan Calculations', () => {
    interface ViewState {
      zoom: number;
      panX: number;
      panY: number;
    }

    const applyPan = (
      view: ViewState,
      deltaX: number,
      deltaY: number
    ): ViewState => ({
      ...view,
      panX: view.panX + deltaX,
      panY: view.panY + deltaY,
    });

    test('التحريك يغير قيم pan', () => {
      const view: ViewState = { zoom: 1, panX: 0, panY: 0 };
      const newView = applyPan(view, 100, 50);
      
      expect(newView.panX).toBe(100);
      expect(newView.panY).toBe(50);
    });

    test('التحريك المتراكم', () => {
      let view: ViewState = { zoom: 1, panX: 0, panY: 0 };
      
      view = applyPan(view, 100, 0);
      view = applyPan(view, 0, 100);
      view = applyPan(view, -50, -50);
      
      expect(view.panX).toBe(50);
      expect(view.panY).toBe(50);
    });

    test('التحريك مع zoom يؤثر على الحركة الفعلية', () => {
      const view: ViewState = { zoom: 2, panX: 0, panY: 0 };
      const screenDelta = { x: 100, y: 100 };
      
      // الحركة في عالم الكانفس = حركة الشاشة / zoom
      const worldDelta = {
        x: screenDelta.x / view.zoom,
        y: screenDelta.y / view.zoom,
      };
      
      expect(worldDelta.x).toBe(50);
      expect(worldDelta.y).toBe(50);
    });
  });

  describe('Pan Boundaries', () => {
    const clampPan = (
      panX: number,
      panY: number,
      zoom: number,
      contentBounds: { width: number; height: number },
      viewportSize: { width: number; height: number }
    ) => {
      const scaledWidth = contentBounds.width * zoom;
      const scaledHeight = contentBounds.height * zoom;
      
      const maxPanX = Math.max(0, (scaledWidth - viewportSize.width) / 2 + 100);
      const maxPanY = Math.max(0, (scaledHeight - viewportSize.height) / 2 + 100);
      
      return {
        panX: Math.max(-maxPanX, Math.min(maxPanX, panX)),
        panY: Math.max(-maxPanY, Math.min(maxPanY, panY)),
      };
    };

    test('تقييد pan ضمن الحدود', () => {
      const result = clampPan(
        10000, 10000,
        1,
        { width: 800, height: 600 },
        { width: 800, height: 600 }
      );
      
      expect(result.panX).toBeLessThan(10000);
      expect(result.panY).toBeLessThan(10000);
    });

    test('pan سلبي مقيد أيضاً', () => {
      const result = clampPan(
        -10000, -10000,
        1,
        { width: 800, height: 600 },
        { width: 800, height: 600 }
      );
      
      expect(result.panX).toBeGreaterThan(-10000);
      expect(result.panY).toBeGreaterThan(-10000);
    });
  });

  describe('Pan with Space Key', () => {
    test('Space key يفعل وضع التحريك', () => {
      let isPanMode = false;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' && !e.repeat) {
          isPanMode = true;
        }
      };
      
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          isPanMode = false;
        }
      };
      
      // محاكاة الضغط
      handleKeyDown(new KeyboardEvent('keydown', { code: 'Space' }));
      expect(isPanMode).toBe(true);
      
      // محاكاة الرفع
      handleKeyUp(new KeyboardEvent('keyup', { code: 'Space' }));
      expect(isPanMode).toBe(false);
    });

    test('تجاهل key repeat للـ Space', () => {
      let activations = 0;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' && !e.repeat) {
          activations++;
        }
      };
      
      // أول ضغطة
      handleKeyDown(new KeyboardEvent('keydown', { code: 'Space', repeat: false }));
      // تكرارات
      handleKeyDown(new KeyboardEvent('keydown', { code: 'Space', repeat: true }));
      handleKeyDown(new KeyboardEvent('keydown', { code: 'Space', repeat: true }));
      
      expect(activations).toBe(1);
    });
  });

  describe('Pan with Middle Mouse Button', () => {
    test('الزر الأوسط يبدأ التحريك', () => {
      let isPanning = false;
      
      const handleMouseDown = (e: MouseEvent) => {
        if (e.button === 1) { // middle button
          isPanning = true;
        }
      };
      
      const handleMouseUp = (e: MouseEvent) => {
        if (e.button === 1) {
          isPanning = false;
        }
      };
      
      handleMouseDown(new MouseEvent('mousedown', { button: 1 }));
      expect(isPanning).toBe(true);
      
      handleMouseUp(new MouseEvent('mouseup', { button: 1 }));
      expect(isPanning).toBe(false);
    });
  });

  describe('Inertia/Momentum Pan', () => {
    const applyInertia = (
      velocity: { x: number; y: number },
      friction: number
    ): { x: number; y: number } => ({
      x: velocity.x * friction,
      y: velocity.y * friction,
    });

    test('الاحتكاك يقلل السرعة تدريجياً', () => {
      let velocity = { x: 100, y: 100 };
      const friction = 0.95;
      
      for (let i = 0; i < 10; i++) {
        velocity = applyInertia(velocity, friction);
      }
      
      expect(velocity.x).toBeLessThan(100);
      expect(velocity.y).toBeLessThan(100);
    });

    test('السرعة تقترب من الصفر بعد فترة', () => {
      let velocity = { x: 100, y: 100 };
      const friction = 0.9;
      
      for (let i = 0; i < 50; i++) {
        velocity = applyInertia(velocity, friction);
      }
      
      expect(Math.abs(velocity.x)).toBeLessThan(1);
      expect(Math.abs(velocity.y)).toBeLessThan(1);
    });
  });
});

// ========================================
// Coordinate Transformation Tests
// ========================================

describe('Coordinate Transformations', () => {
  
  describe('Screen to World', () => {
    const screenToWorld = (
      screenX: number,
      screenY: number,
      panX: number,
      panY: number,
      zoom: number
    ) => ({
      x: (screenX - panX) / zoom,
      y: (screenY - panY) / zoom,
    });

    test('تحويل من شاشة إلى عالم بدون zoom أو pan', () => {
      const result = screenToWorld(100, 200, 0, 0, 1);
      expect(result.x).toBe(100);
      expect(result.y).toBe(200);
    });

    test('تحويل مع zoom', () => {
      const result = screenToWorld(200, 200, 0, 0, 2);
      expect(result.x).toBe(100);
      expect(result.y).toBe(100);
    });

    test('تحويل مع pan', () => {
      const result = screenToWorld(200, 200, 100, 50, 1);
      expect(result.x).toBe(100);
      expect(result.y).toBe(150);
    });

    test('تحويل مع zoom و pan معاً', () => {
      const result = screenToWorld(300, 300, 100, 100, 2);
      expect(result.x).toBe(100);
      expect(result.y).toBe(100);
    });
  });

  describe('World to Screen', () => {
    const worldToScreen = (
      worldX: number,
      worldY: number,
      panX: number,
      panY: number,
      zoom: number
    ) => ({
      x: worldX * zoom + panX,
      y: worldY * zoom + panY,
    });

    test('تحويل من عالم إلى شاشة بدون zoom أو pan', () => {
      const result = worldToScreen(100, 200, 0, 0, 1);
      expect(result.x).toBe(100);
      expect(result.y).toBe(200);
    });

    test('تحويل مع zoom', () => {
      const result = worldToScreen(100, 100, 0, 0, 2);
      expect(result.x).toBe(200);
      expect(result.y).toBe(200);
    });

    test('تحويل مع pan', () => {
      const result = worldToScreen(100, 150, 100, 50, 1);
      expect(result.x).toBe(200);
      expect(result.y).toBe(200);
    });

    test('التحويل ذهاباً وإياباً يعيد القيمة الأصلية', () => {
      const original = { x: 150, y: 250 };
      const panX = 50, panY = 100, zoom = 1.5;
      
      const screen = worldToScreen(original.x, original.y, panX, panY, zoom);
      
      const screenToWorld = (sx: number, sy: number) => ({
        x: (sx - panX) / zoom,
        y: (sy - panY) / zoom,
      });
      
      const back = screenToWorld(screen.x, screen.y);
      
      expect(back.x).toBeCloseTo(original.x, 10);
      expect(back.y).toBeCloseTo(original.y, 10);
    });
  });

  describe('Bounds Transformation', () => {
    interface Bounds {
      x: number;
      y: number;
      width: number;
      height: number;
    }

    const transformBounds = (
      bounds: Bounds,
      panX: number,
      panY: number,
      zoom: number
    ): Bounds => ({
      x: bounds.x * zoom + panX,
      y: bounds.y * zoom + panY,
      width: bounds.width * zoom,
      height: bounds.height * zoom,
    });

    test('تحويل bounds مع zoom', () => {
      const bounds: Bounds = { x: 100, y: 100, width: 200, height: 150 };
      const result = transformBounds(bounds, 0, 0, 2);
      
      expect(result.x).toBe(200);
      expect(result.y).toBe(200);
      expect(result.width).toBe(400);
      expect(result.height).toBe(300);
    });

    test('تحويل bounds مع pan', () => {
      const bounds: Bounds = { x: 100, y: 100, width: 200, height: 150 };
      const result = transformBounds(bounds, 50, 50, 1);
      
      expect(result.x).toBe(150);
      expect(result.y).toBe(150);
      expect(result.width).toBe(200);
      expect(result.height).toBe(150);
    });
  });
});

// ========================================
// Wheel Event Handling Tests
// ========================================

describe('Wheel Event Handling', () => {
  
  test('wheel مع Ctrl يفعل zoom', () => {
    let action: 'zoom' | 'pan' | null = null;
    
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        action = 'zoom';
      } else {
        action = 'pan';
      }
    };
    
    const wheelEvent = new WheelEvent('wheel', { 
      deltaY: -100, 
      ctrlKey: true 
    });
    handleWheel(wheelEvent);
    
    expect(action).toBe('zoom');
  });

  test('wheel بدون Ctrl يفعل pan', () => {
    let action: 'zoom' | 'pan' | null = null;
    
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        action = 'zoom';
      } else {
        action = 'pan';
      }
    };
    
    const wheelEvent = new WheelEvent('wheel', { 
      deltaY: -100, 
      ctrlKey: false 
    });
    handleWheel(wheelEvent);
    
    expect(action).toBe('pan');
  });

  test('pinch gesture (deltaMode = 0) يُعامل كـ zoom', () => {
    // في معظم المتصفحات، pinch يُرسل wheel events مع deltaMode = 0
    const isPinchGesture = (e: WheelEvent) => {
      return e.ctrlKey && e.deltaMode === 0;
    };
    
    const wheelEvent = new WheelEvent('wheel', {
      deltaY: -50,
      ctrlKey: true,
      // deltaMode = 0 by default (DOM_DELTA_PIXEL)
    });
    
    expect(isPinchGesture(wheelEvent)).toBe(true);
  });
});

// ========================================
// Touch Gesture Tests
// ========================================

describe('Touch Gestures', () => {
  
  describe('Pinch to Zoom', () => {
    const calculatePinchZoom = (
      touch1Start: { x: number; y: number },
      touch2Start: { x: number; y: number },
      touch1Current: { x: number; y: number },
      touch2Current: { x: number; y: number }
    ) => {
      const startDistance = Math.hypot(
        touch2Start.x - touch1Start.x,
        touch2Start.y - touch1Start.y
      );
      
      const currentDistance = Math.hypot(
        touch2Current.x - touch1Current.x,
        touch2Current.y - touch1Current.y
      );
      
      return currentDistance / startDistance;
    };

    test('pinch outward يعطي zoom > 1', () => {
      const ratio = calculatePinchZoom(
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 50, y: 100 },
        { x: 250, y: 100 }
      );
      
      expect(ratio).toBeGreaterThan(1);
    });

    test('pinch inward يعطي zoom < 1', () => {
      const ratio = calculatePinchZoom(
        { x: 50, y: 100 },
        { x: 250, y: 100 },
        { x: 100, y: 100 },
        { x: 200, y: 100 }
      );
      
      expect(ratio).toBeLessThan(1);
    });

    test('نفس المسافة يعطي zoom = 1', () => {
      const ratio = calculatePinchZoom(
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 150, y: 150 },
        { x: 250, y: 150 }
      );
      
      expect(ratio).toBeCloseTo(1, 5);
    });
  });

  describe('Pinch Center', () => {
    const getPinchCenter = (
      touch1: { x: number; y: number },
      touch2: { x: number; y: number }
    ) => ({
      x: (touch1.x + touch2.x) / 2,
      y: (touch1.y + touch2.y) / 2,
    });

    test('حساب مركز pinch صحيح', () => {
      const center = getPinchCenter(
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      );
      
      expect(center.x).toBe(150);
      expect(center.y).toBe(150);
    });
  });

  describe('Two Finger Pan', () => {
    test('حركة إصبعين بنفس الاتجاه = pan', () => {
      const delta1 = { x: 50, y: 30 };
      const delta2 = { x: 48, y: 32 };
      
      // متوسط الحركة
      const avgDelta = {
        x: (delta1.x + delta2.x) / 2,
        y: (delta1.y + delta2.y) / 2,
      };
      
      expect(avgDelta.x).toBeCloseTo(49, 0);
      expect(avgDelta.y).toBeCloseTo(31, 0);
    });
  });
});
