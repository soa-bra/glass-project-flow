/**
 * useSnapEngine - Hook لاستخدام محرك المحاذاة الذكية
 * 
 * يوفر واجهة React للتفاعل مع Snap Engine
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { snapEngine, type SnapConfig, type SnapLine, type SnapResult } from '@/engine/canvas/interaction/snapEngine';
import type { Point, Bounds } from '@/engine/canvas/kernel/canvasKernel';

interface UseSnapEngineOptions {
  /** معرفات العناصر المستثناة من المحاذاة */
  excludeIds?: string[];
  /** تفعيل/تعطيل المحاذاة */
  enabled?: boolean;
}

interface UseSnapEngineReturn {
  /** خطوط الإرشاد الحالية */
  guides: SnapLine[];
  /** تطبيق المحاذاة على نقطة */
  snapPoint: (point: Point) => SnapResult;
  /** تطبيق المحاذاة على حدود عنصر */
  snapBounds: (bounds: Bounds) => SnapResult & { snappedBounds: Bounds };
  /** تحديث إعدادات المحاذاة */
  updateConfig: (config: Partial<SnapConfig>) => void;
  /** مسح خطوط الإرشاد */
  clearGuides: () => void;
  /** تحديث العناصر المستهدفة */
  refreshTargets: () => void;
  /** إعدادات المحاذاة الحالية */
  config: SnapConfig;
}

export const useSnapEngine = (options: UseSnapEngineOptions = {}): UseSnapEngineReturn => {
  const { excludeIds = [], enabled = true } = options;
  
  const [guides, setGuides] = useState<SnapLine[]>([]);
  
  const elements = useCanvasStore(state => state.elements);
  const settings = useCanvasStore(state => state.settings);

  // تحديث إعدادات المحاذاة من Store
  useEffect(() => {
    snapEngine.updateConfig({
      gridEnabled: settings.snapToGrid,
      gridSize: settings.gridSize,
      elementSnapEnabled: true,
      snapThreshold: 8,
      centerSnapEnabled: true,
      edgeSnapEnabled: true,
      distributionGuidesEnabled: true
    });
  }, [settings.snapToGrid, settings.gridSize]);

  // تحديث العناصر المستهدفة
  const refreshTargets = useCallback(() => {
    const validElements = elements.filter(el => 
      el.visible !== false && 
      el.locked !== true
    );
    
    snapEngine.updateTargets(validElements, excludeIds);
  }, [elements, excludeIds]);

  // تحديث العناصر عند تغييرها
  useEffect(() => {
    refreshTargets();
  }, [refreshTargets]);

  // تطبيق المحاذاة على نقطة
  const snapPoint = useCallback((point: Point): SnapResult => {
    if (!enabled) {
      return {
        snappedPoint: point,
        didSnap: false,
        snappedX: false,
        snappedY: false,
        guides: [],
        deltaX: 0,
        deltaY: 0
      };
    }

    const result = snapEngine.snapPoint(point, excludeIds);
    setGuides(result.guides);
    return result;
  }, [enabled, excludeIds]);

  // تطبيق المحاذاة على حدود عنصر
  const snapBounds = useCallback((bounds: Bounds): SnapResult & { snappedBounds: Bounds } => {
    if (!enabled) {
      return {
        snappedPoint: { x: bounds.x, y: bounds.y },
        snappedBounds: bounds,
        didSnap: false,
        snappedX: false,
        snappedY: false,
        guides: [],
        deltaX: 0,
        deltaY: 0
      };
    }

    const result = snapEngine.snapBounds(bounds, excludeIds);
    setGuides(result.guides);
    return result;
  }, [enabled, excludeIds]);

  // تحديث الإعدادات
  const updateConfig = useCallback((config: Partial<SnapConfig>) => {
    snapEngine.updateConfig(config);
  }, []);

  // مسح خطوط الإرشاد
  const clearGuides = useCallback(() => {
    setGuides([]);
  }, []);

  // الإعدادات الحالية
  const config = useMemo(() => snapEngine.config, []);

  return {
    guides,
    snapPoint,
    snapBounds,
    updateConfig,
    clearGuides,
    refreshTargets,
    config
  };
};

export default useSnapEngine;
