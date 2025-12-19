/**
 * اختبارات Selection Behavior و Multi-select
 * 
 * تتحقق من:
 * 1. تحديد عنصر واحد
 * 2. تحديد متعدد (Shift/Ctrl)
 * 3. Box Selection (مستطيل التحديد)
 * 4. إلغاء التحديد
 * 5. Select All
 * 6. تحديد العناصر المتداخلة
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';

// ========================================
// Types
// ========================================

interface Point {
  x: number;
  y: number;
}

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CanvasElement {
  id: string;
  type: string;
  position: Point;
  size: { width: number; height: number };
  locked?: boolean;
  hidden?: boolean;
  parentId?: string | null;
}

// ========================================
// Helper Functions
// ========================================

const pointInBounds = (point: Point, bounds: Bounds): boolean => {
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
};

const boundsIntersect = (a: Bounds, b: Bounds): boolean => {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
};

const getElementBounds = (element: CanvasElement): Bounds => ({
  x: element.position.x,
  y: element.position.y,
  width: element.size.width,
  height: element.size.height,
});

const findElementAtPoint = (
  elements: CanvasElement[],
  point: Point
): CanvasElement | null => {
  // البحث من الأعلى للأسفل (آخر عنصر مرسوم أولاً)
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];
    if (element.hidden || element.locked) continue;
    
    const bounds = getElementBounds(element);
    if (pointInBounds(point, bounds)) {
      return element;
    }
  }
  return null;
};

const findElementsInBox = (
  elements: CanvasElement[],
  boxBounds: Bounds
): CanvasElement[] => {
  return elements.filter(element => {
    if (element.hidden || element.locked) return false;
    const elementBounds = getElementBounds(element);
    return boundsIntersect(boxBounds, elementBounds);
  });
};

// ========================================
// Single Selection Tests
// ========================================

describe('Single Selection', () => {
  let elements: CanvasElement[];
  let selectedIds: string[];

  beforeEach(() => {
    elements = [
      { id: 'el-1', type: 'rect', position: { x: 100, y: 100 }, size: { width: 100, height: 100 } },
      { id: 'el-2', type: 'rect', position: { x: 300, y: 100 }, size: { width: 100, height: 100 } },
      { id: 'el-3', type: 'rect', position: { x: 100, y: 300 }, size: { width: 100, height: 100 } },
    ];
    selectedIds = [];
  });

  test('النقر على عنصر يحدده', () => {
    const clickPoint = { x: 150, y: 150 };
    const element = findElementAtPoint(elements, clickPoint);
    
    expect(element).not.toBeNull();
    expect(element?.id).toBe('el-1');
    
    selectedIds = [element!.id];
    expect(selectedIds).toContain('el-1');
  });

  test('النقر على منطقة فارغة يلغي التحديد', () => {
    selectedIds = ['el-1'];
    
    const clickPoint = { x: 500, y: 500 };
    const element = findElementAtPoint(elements, clickPoint);
    
    expect(element).toBeNull();
    
    // إلغاء التحديد عند النقر على الفراغ
    if (!element) {
      selectedIds = [];
    }
    
    expect(selectedIds).toHaveLength(0);
  });

  test('النقر على عنصر آخر يغير التحديد', () => {
    selectedIds = ['el-1'];
    
    const clickPoint = { x: 350, y: 150 };
    const element = findElementAtPoint(elements, clickPoint);
    
    expect(element?.id).toBe('el-2');
    
    // تحديد جديد بدون Shift
    selectedIds = [element!.id];
    
    expect(selectedIds).toEqual(['el-2']);
    expect(selectedIds).not.toContain('el-1');
  });

  test('النقر على عنصر محدد مسبقاً يبقيه محدداً', () => {
    selectedIds = ['el-1'];
    
    const clickPoint = { x: 150, y: 150 };
    const element = findElementAtPoint(elements, clickPoint);
    
    expect(element?.id).toBe('el-1');
    
    // إذا كان محدداً مسبقاً، يبقى محدداً
    if (!selectedIds.includes(element!.id)) {
      selectedIds = [element!.id];
    }
    
    expect(selectedIds).toEqual(['el-1']);
  });

  test('العناصر المقفلة لا يمكن تحديدها', () => {
    elements[0].locked = true;
    
    const clickPoint = { x: 150, y: 150 };
    const element = findElementAtPoint(elements, clickPoint);
    
    expect(element).toBeNull();
  });

  test('العناصر المخفية لا يمكن تحديدها', () => {
    elements[0].hidden = true;
    
    const clickPoint = { x: 150, y: 150 };
    const element = findElementAtPoint(elements, clickPoint);
    
    expect(element).toBeNull();
  });
});

// ========================================
// Multi-Selection Tests
// ========================================

describe('Multi-Selection with Shift', () => {
  let elements: CanvasElement[];
  let selectedIds: string[];

  const handleShiftClick = (elementId: string) => {
    if (selectedIds.includes(elementId)) {
      // إزالة من التحديد
      selectedIds = selectedIds.filter(id => id !== elementId);
    } else {
      // إضافة للتحديد
      selectedIds = [...selectedIds, elementId];
    }
  };

  beforeEach(() => {
    elements = [
      { id: 'el-1', type: 'rect', position: { x: 100, y: 100 }, size: { width: 100, height: 100 } },
      { id: 'el-2', type: 'rect', position: { x: 300, y: 100 }, size: { width: 100, height: 100 } },
      { id: 'el-3', type: 'rect', position: { x: 100, y: 300 }, size: { width: 100, height: 100 } },
    ];
    selectedIds = [];
  });

  test('Shift+Click يضيف عنصر للتحديد', () => {
    selectedIds = ['el-1'];
    
    handleShiftClick('el-2');
    
    expect(selectedIds).toContain('el-1');
    expect(selectedIds).toContain('el-2');
    expect(selectedIds).toHaveLength(2);
  });

  test('Shift+Click على عنصر محدد يزيله من التحديد', () => {
    selectedIds = ['el-1', 'el-2'];
    
    handleShiftClick('el-1');
    
    expect(selectedIds).not.toContain('el-1');
    expect(selectedIds).toContain('el-2');
    expect(selectedIds).toHaveLength(1);
  });

  test('Shift+Click متعدد يحدد عناصر متعددة', () => {
    handleShiftClick('el-1');
    handleShiftClick('el-2');
    handleShiftClick('el-3');
    
    expect(selectedIds).toHaveLength(3);
    expect(selectedIds).toEqual(['el-1', 'el-2', 'el-3']);
  });

  test('Shift+Click على الفراغ لا يلغي التحديد', () => {
    selectedIds = ['el-1', 'el-2'];
    
    // عند Shift+Click على الفراغ، نحافظ على التحديد
    const clickPoint = { x: 500, y: 500 };
    const element = findElementAtPoint(elements, clickPoint);
    
    if (element) {
      handleShiftClick(element.id);
    }
    // لا نفعل شيء إذا كان الفراغ
    
    expect(selectedIds).toHaveLength(2);
  });
});

describe('Multi-Selection with Ctrl/Cmd', () => {
  let selectedIds: string[];

  const handleCtrlClick = (elementId: string) => {
    if (selectedIds.includes(elementId)) {
      selectedIds = selectedIds.filter(id => id !== elementId);
    } else {
      selectedIds = [...selectedIds, elementId];
    }
  };

  beforeEach(() => {
    selectedIds = [];
  });

  test('Ctrl+Click يعمل مثل Shift+Click للتحديد المتعدد', () => {
    selectedIds = ['el-1'];
    
    handleCtrlClick('el-2');
    
    expect(selectedIds).toContain('el-1');
    expect(selectedIds).toContain('el-2');
  });

  test('Ctrl+A يحدد جميع العناصر', () => {
    const allElements = ['el-1', 'el-2', 'el-3', 'el-4'];
    
    // محاكاة Ctrl+A
    selectedIds = [...allElements];
    
    expect(selectedIds).toHaveLength(4);
    expect(selectedIds).toEqual(allElements);
  });
});

// ========================================
// Box Selection Tests
// ========================================

describe('Box Selection (Marquee)', () => {
  let elements: CanvasElement[];

  beforeEach(() => {
    elements = [
      { id: 'el-1', type: 'rect', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
      { id: 'el-2', type: 'rect', position: { x: 200, y: 100 }, size: { width: 50, height: 50 } },
      { id: 'el-3', type: 'rect', position: { x: 300, y: 100 }, size: { width: 50, height: 50 } },
      { id: 'el-4', type: 'rect', position: { x: 100, y: 200 }, size: { width: 50, height: 50 } },
      { id: 'el-5', type: 'rect', position: { x: 200, y: 200 }, size: { width: 50, height: 50 } },
    ];
  });

  test('مستطيل التحديد يحدد العناصر المتقاطعة', () => {
    const boxBounds: Bounds = { x: 80, y: 80, width: 200, height: 100 };
    
    const selected = findElementsInBox(elements, boxBounds);
    
    expect(selected.map(e => e.id)).toContain('el-1');
    expect(selected.map(e => e.id)).toContain('el-2');
    expect(selected.map(e => e.id)).not.toContain('el-3');
  });

  test('مستطيل صغير يحدد عنصر واحد', () => {
    const boxBounds: Bounds = { x: 100, y: 100, width: 30, height: 30 };
    
    const selected = findElementsInBox(elements, boxBounds);
    
    expect(selected).toHaveLength(1);
    expect(selected[0].id).toBe('el-1');
  });

  test('مستطيل كبير يحدد جميع العناصر', () => {
    const boxBounds: Bounds = { x: 0, y: 0, width: 500, height: 500 };
    
    const selected = findElementsInBox(elements, boxBounds);
    
    expect(selected).toHaveLength(5);
  });

  test('مستطيل في منطقة فارغة لا يحدد شيء', () => {
    const boxBounds: Bounds = { x: 500, y: 500, width: 100, height: 100 };
    
    const selected = findElementsInBox(elements, boxBounds);
    
    expect(selected).toHaveLength(0);
  });

  test('السحب من اليمين لليسار يعمل (inverted box)', () => {
    // عندما يسحب المستخدم من اليمين لليسار
    const start = { x: 300, y: 200 };
    const end = { x: 100, y: 100 };
    
    // تطبيع الـ bounds
    const normalizedBounds: Bounds = {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y),
    };
    
    expect(normalizedBounds.x).toBe(100);
    expect(normalizedBounds.y).toBe(100);
    expect(normalizedBounds.width).toBe(200);
    expect(normalizedBounds.height).toBe(100);
    
    const selected = findElementsInBox(elements, normalizedBounds);
    expect(selected.length).toBeGreaterThan(0);
  });

  test('Shift + Box Selection يضيف للتحديد الحالي', () => {
    let selectedIds = ['el-5']; // عنصر محدد مسبقاً
    
    const boxBounds: Bounds = { x: 80, y: 80, width: 100, height: 100 };
    const newSelection = findElementsInBox(elements, boxBounds);
    
    // Shift يضيف بدلاً من الاستبدال
    const newIds = newSelection.map(e => e.id);
    selectedIds = [...new Set([...selectedIds, ...newIds])];
    
    expect(selectedIds).toContain('el-5'); // المحدد سابقاً
    expect(selectedIds).toContain('el-1'); // الجديد
  });
});

// ========================================
// Selection State Management Tests
// ========================================

describe('Selection State Management', () => {
  
  describe('Selection Store', () => {
    let state: {
      selectedIds: string[];
      lastSelectedId: string | null;
      selectionBounds: Bounds | null;
    };

    const selectElement = (id: string) => {
      state.selectedIds = [id];
      state.lastSelectedId = id;
    };

    const addToSelection = (id: string) => {
      if (!state.selectedIds.includes(id)) {
        state.selectedIds = [...state.selectedIds, id];
        state.lastSelectedId = id;
      }
    };

    const removeFromSelection = (id: string) => {
      state.selectedIds = state.selectedIds.filter(i => i !== id);
      if (state.lastSelectedId === id) {
        state.lastSelectedId = state.selectedIds[state.selectedIds.length - 1] || null;
      }
    };

    const clearSelection = () => {
      state.selectedIds = [];
      state.lastSelectedId = null;
      state.selectionBounds = null;
    };

    const selectAll = (allIds: string[]) => {
      state.selectedIds = [...allIds];
      state.lastSelectedId = allIds[allIds.length - 1] || null;
    };

    beforeEach(() => {
      state = {
        selectedIds: [],
        lastSelectedId: null,
        selectionBounds: null,
      };
    });

    test('selectElement يحدد عنصر واحد', () => {
      selectElement('el-1');
      
      expect(state.selectedIds).toEqual(['el-1']);
      expect(state.lastSelectedId).toBe('el-1');
    });

    test('addToSelection يضيف للتحديد', () => {
      selectElement('el-1');
      addToSelection('el-2');
      
      expect(state.selectedIds).toEqual(['el-1', 'el-2']);
      expect(state.lastSelectedId).toBe('el-2');
    });

    test('addToSelection لا يكرر العناصر', () => {
      selectElement('el-1');
      addToSelection('el-1');
      
      expect(state.selectedIds).toEqual(['el-1']);
    });

    test('removeFromSelection يزيل من التحديد', () => {
      state.selectedIds = ['el-1', 'el-2', 'el-3'];
      state.lastSelectedId = 'el-3';
      
      removeFromSelection('el-2');
      
      expect(state.selectedIds).toEqual(['el-1', 'el-3']);
    });

    test('clearSelection يمسح كل شيء', () => {
      state.selectedIds = ['el-1', 'el-2'];
      state.lastSelectedId = 'el-2';
      
      clearSelection();
      
      expect(state.selectedIds).toEqual([]);
      expect(state.lastSelectedId).toBeNull();
    });

    test('selectAll يحدد جميع العناصر', () => {
      selectAll(['el-1', 'el-2', 'el-3']);
      
      expect(state.selectedIds).toHaveLength(3);
    });
  });

  describe('Selection Bounds Calculation', () => {
    const calculateSelectionBounds = (elements: CanvasElement[]): Bounds | null => {
      if (elements.length === 0) return null;
      
      let minX = Infinity, minY = Infinity;
      let maxX = -Infinity, maxY = -Infinity;
      
      elements.forEach(el => {
        minX = Math.min(minX, el.position.x);
        minY = Math.min(minY, el.position.y);
        maxX = Math.max(maxX, el.position.x + el.size.width);
        maxY = Math.max(maxY, el.position.y + el.size.height);
      });
      
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    };

    test('حساب bounds لعنصر واحد', () => {
      const elements: CanvasElement[] = [
        { id: 'el-1', type: 'rect', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
      ];
      
      const bounds = calculateSelectionBounds(elements);
      
      expect(bounds).toEqual({ x: 100, y: 100, width: 50, height: 50 });
    });

    test('حساب bounds لعناصر متعددة', () => {
      const elements: CanvasElement[] = [
        { id: 'el-1', type: 'rect', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
        { id: 'el-2', type: 'rect', position: { x: 200, y: 200 }, size: { width: 50, height: 50 } },
      ];
      
      const bounds = calculateSelectionBounds(elements);
      
      expect(bounds).toEqual({ x: 100, y: 100, width: 150, height: 150 });
    });

    test('bounds فارغ لقائمة فارغة', () => {
      const bounds = calculateSelectionBounds([]);
      expect(bounds).toBeNull();
    });
  });
});

// ========================================
// Keyboard Selection Tests
// ========================================

describe('Keyboard Selection', () => {
  
  test('Escape يلغي التحديد', () => {
    let selectedIds = ['el-1', 'el-2'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectedIds = [];
      }
    };
    
    handleKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
    
    expect(selectedIds).toHaveLength(0);
  });

  test('Delete يحذف العناصر المحددة', () => {
    let elements = ['el-1', 'el-2', 'el-3'];
    let selectedIds = ['el-1', 'el-2'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        elements = elements.filter(id => !selectedIds.includes(id));
        selectedIds = [];
      }
    };
    
    handleKeyDown(new KeyboardEvent('keydown', { key: 'Delete' }));
    
    expect(elements).toEqual(['el-3']);
    expect(selectedIds).toHaveLength(0);
  });

  test('Ctrl+A يحدد الكل (مع منع الافتراضي)', () => {
    const allElements = ['el-1', 'el-2', 'el-3'];
    let selectedIds: string[] = [];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        selectedIds = [...allElements];
      }
    };
    
    const event = new KeyboardEvent('keydown', { 
      key: 'a', 
      ctrlKey: true 
    });
    
    // Mock preventDefault
    const preventDefaultMock = vi.fn();
    Object.defineProperty(event, 'preventDefault', { value: preventDefaultMock });
    
    handleKeyDown(event);
    
    expect(selectedIds).toEqual(allElements);
    expect(preventDefaultMock).toHaveBeenCalled();
  });

  test('Arrow keys تحرك العناصر المحددة', () => {
    const elements: CanvasElement[] = [
      { id: 'el-1', type: 'rect', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
    ];
    const selectedIds = ['el-1'];
    
    const moveSelected = (dx: number, dy: number) => {
      elements.forEach(el => {
        if (selectedIds.includes(el.id)) {
          el.position.x += dx;
          el.position.y += dy;
        }
      });
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 1;
      switch (e.key) {
        case 'ArrowUp': moveSelected(0, -step); break;
        case 'ArrowDown': moveSelected(0, step); break;
        case 'ArrowLeft': moveSelected(-step, 0); break;
        case 'ArrowRight': moveSelected(step, 0); break;
      }
    };
    
    handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(elements[0].position.x).toBe(101);
    
    handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true }));
    expect(elements[0].position.y).toBe(110);
  });

  test('Tab ينتقل للعنصر التالي', () => {
    const allElements = ['el-1', 'el-2', 'el-3'];
    let selectedIds = ['el-1'];
    
    const selectNext = () => {
      if (selectedIds.length === 1) {
        const currentIndex = allElements.indexOf(selectedIds[0]);
        const nextIndex = (currentIndex + 1) % allElements.length;
        selectedIds = [allElements[nextIndex]];
      }
    };
    
    selectNext();
    expect(selectedIds).toEqual(['el-2']);
    
    selectNext();
    expect(selectedIds).toEqual(['el-3']);
    
    selectNext();
    expect(selectedIds).toEqual(['el-1']); // يعود للبداية
  });

  test('Shift+Tab ينتقل للعنصر السابق', () => {
    const allElements = ['el-1', 'el-2', 'el-3'];
    let selectedIds = ['el-2'];
    
    const selectPrevious = () => {
      if (selectedIds.length === 1) {
        const currentIndex = allElements.indexOf(selectedIds[0]);
        const prevIndex = (currentIndex - 1 + allElements.length) % allElements.length;
        selectedIds = [allElements[prevIndex]];
      }
    };
    
    selectPrevious();
    expect(selectedIds).toEqual(['el-1']);
    
    selectPrevious();
    expect(selectedIds).toEqual(['el-3']); // يعود للنهاية
  });
});

// ========================================
// Overlapping Elements Selection Tests
// ========================================

describe('Overlapping Elements Selection', () => {
  let elements: CanvasElement[];

  beforeEach(() => {
    // عناصر متداخلة
    elements = [
      { id: 'bottom', type: 'rect', position: { x: 100, y: 100 }, size: { width: 100, height: 100 } },
      { id: 'middle', type: 'rect', position: { x: 120, y: 120 }, size: { width: 100, height: 100 } },
      { id: 'top', type: 'rect', position: { x: 140, y: 140 }, size: { width: 100, height: 100 } },
    ];
  });

  test('النقر يحدد العنصر الأعلى (top-most)', () => {
    const clickPoint = { x: 150, y: 150 };
    const element = findElementAtPoint(elements, clickPoint);
    
    expect(element?.id).toBe('top');
  });

  test('النقر في منطقة غير متداخلة يحدد العنصر الصحيح', () => {
    const clickPoint = { x: 105, y: 105 };
    const element = findElementAtPoint(elements, clickPoint);
    
    expect(element?.id).toBe('bottom');
  });

  test('تدوير التحديد بين العناصر المتداخلة', () => {
    const clickPoint = { x: 150, y: 150 };
    let lastSelectedId: string | null = null;
    
    const cycleSelection = () => {
      // إيجاد جميع العناصر في النقطة
      const elementsAtPoint = elements.filter(el => {
        const bounds = getElementBounds(el);
        return pointInBounds(clickPoint, bounds);
      });
      
      if (elementsAtPoint.length === 0) return null;
      
      const currentIndex = lastSelectedId 
        ? elementsAtPoint.findIndex(e => e.id === lastSelectedId)
        : -1;
      
      const nextIndex = (currentIndex + 1) % elementsAtPoint.length;
      lastSelectedId = elementsAtPoint[nextIndex].id;
      
      return lastSelectedId;
    };
    
    // أول نقرة
    expect(cycleSelection()).toBe('bottom');
    // ثاني نقرة
    expect(cycleSelection()).toBe('middle');
    // ثالث نقرة
    expect(cycleSelection()).toBe('top');
    // رابع نقرة (تعود للبداية)
    expect(cycleSelection()).toBe('bottom');
  });
});

// ========================================
// Group Selection Tests
// ========================================

describe('Group Selection', () => {
  let elements: CanvasElement[];

  beforeEach(() => {
    elements = [
      { id: 'group-1', type: 'group', position: { x: 100, y: 100 }, size: { width: 200, height: 200 } },
      { id: 'child-1', type: 'rect', position: { x: 110, y: 110 }, size: { width: 50, height: 50 }, parentId: 'group-1' },
      { id: 'child-2', type: 'rect', position: { x: 170, y: 110 }, size: { width: 50, height: 50 }, parentId: 'group-1' },
      { id: 'standalone', type: 'rect', position: { x: 400, y: 100 }, size: { width: 50, height: 50 } },
    ];
  });

  test('النقر على عنصر في مجموعة يحدد المجموعة', () => {
    const clickPoint = { x: 130, y: 130 };
    
    // إيجاد العنصر المباشر
    const directElement = findElementAtPoint(elements, clickPoint);
    
    // إذا كان له parent، نحدد الـ parent
    if (directElement?.parentId) {
      const parent = elements.find(e => e.id === directElement.parentId);
      expect(parent?.id).toBe('group-1');
    }
  });

  test('النقر المزدوج يدخل المجموعة لتحديد الأطفال', () => {
    let editingGroupId: string | null = null;
    
    const handleDoubleClick = (groupId: string) => {
      editingGroupId = groupId;
    };
    
    handleDoubleClick('group-1');
    expect(editingGroupId).toBe('group-1');
    
    // الآن النقر على طفل يحدده مباشرة
    const clickPoint = { x: 130, y: 130 };
    const childElements = elements.filter(e => e.parentId === editingGroupId);
    
    const clickedChild = childElements.find(el => {
      const bounds = getElementBounds(el);
      return pointInBounds(clickPoint, bounds);
    });
    
    expect(clickedChild?.id).toBe('child-1');
  });

  test('Escape يخرج من وضع تحرير المجموعة', () => {
    let editingGroupId: string | null = 'group-1';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editingGroupId) {
        editingGroupId = null;
      }
    };
    
    handleKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
    
    expect(editingGroupId).toBeNull();
  });

  test('تحديد جميع أطفال المجموعة', () => {
    const groupId = 'group-1';
    const children = elements.filter(e => e.parentId === groupId);
    
    const selectedIds = children.map(c => c.id);
    
    expect(selectedIds).toEqual(['child-1', 'child-2']);
  });
});

// ========================================
// Selection Visual Feedback Tests
// ========================================

describe('Selection Visual Feedback', () => {
  
  test('العنصر المحدد له إطار مميز', () => {
    const getSelectionStyle = (isSelected: boolean) => ({
      strokeColor: isSelected ? '#3DA8F5' : 'transparent',
      strokeWidth: isSelected ? 2 : 0,
      showHandles: isSelected,
    });
    
    const selectedStyle = getSelectionStyle(true);
    const unselectedStyle = getSelectionStyle(false);
    
    expect(selectedStyle.strokeColor).toBe('#3DA8F5');
    expect(selectedStyle.showHandles).toBe(true);
    expect(unselectedStyle.strokeColor).toBe('transparent');
    expect(unselectedStyle.showHandles).toBe(false);
  });

  test('تحديد متعدد يظهر bounding box موحد', () => {
    const elements: CanvasElement[] = [
      { id: 'el-1', type: 'rect', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
      { id: 'el-2', type: 'rect', position: { x: 200, y: 200 }, size: { width: 50, height: 50 } },
    ];
    
    const calculateGroupBounds = (els: CanvasElement[]): Bounds => {
      let minX = Infinity, minY = Infinity;
      let maxX = -Infinity, maxY = -Infinity;
      
      els.forEach(el => {
        minX = Math.min(minX, el.position.x);
        minY = Math.min(minY, el.position.y);
        maxX = Math.max(maxX, el.position.x + el.size.width);
        maxY = Math.max(maxY, el.position.y + el.size.height);
      });
      
      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    };
    
    const bounds = calculateGroupBounds(elements);
    
    expect(bounds.x).toBe(100);
    expect(bounds.y).toBe(100);
    expect(bounds.width).toBe(150);
    expect(bounds.height).toBe(150);
  });

  test('مستطيل التحديد له نمط مميز', () => {
    const getBoxSelectionStyle = () => ({
      fill: 'rgba(61, 168, 245, 0.1)',
      stroke: '#3DA8F5',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    });
    
    const style = getBoxSelectionStyle();
    
    expect(style.fill).toContain('rgba');
    expect(style.stroke).toBe('#3DA8F5');
    expect(style.strokeDasharray).toBe('4 2');
  });
});

// ========================================
// Selection History (Undo/Redo) Tests
// ========================================

describe('Selection History', () => {
  
  test('Ctrl+Z يتراجع عن آخر تحديد', () => {
    const selectionHistory: string[][] = [];
    let currentSelection: string[] = [];
    let historyIndex = -1;
    
    const pushSelection = (ids: string[]) => {
      historyIndex++;
      selectionHistory.splice(historyIndex, Infinity, [...ids]);
      currentSelection = ids;
    };
    
    const undo = () => {
      if (historyIndex > 0) {
        historyIndex--;
        currentSelection = [...selectionHistory[historyIndex]];
      }
    };
    
    pushSelection(['el-1']);
    pushSelection(['el-1', 'el-2']);
    pushSelection(['el-3']);
    
    expect(currentSelection).toEqual(['el-3']);
    
    undo();
    expect(currentSelection).toEqual(['el-1', 'el-2']);
    
    undo();
    expect(currentSelection).toEqual(['el-1']);
  });

  test('Ctrl+Shift+Z يعيد التحديد', () => {
    const selectionHistory: string[][] = [['el-1'], ['el-1', 'el-2'], ['el-3']];
    let historyIndex = 1; // بعد undo
    let currentSelection = ['el-1', 'el-2'];
    
    const redo = () => {
      if (historyIndex < selectionHistory.length - 1) {
        historyIndex++;
        currentSelection = [...selectionHistory[historyIndex]];
      }
    };
    
    redo();
    expect(currentSelection).toEqual(['el-3']);
    expect(historyIndex).toBe(2);
  });
});
