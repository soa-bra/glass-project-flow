import React, { useRef, useCallback } from 'react';
import type { SceneGraph } from '@/lib/canvas/utils/scene-graph';
import type { Point } from '@/lib/canvas/types';

type CreateFn = (type: string, position: { x: number; y: number }) => void;

interface Props {
  selectedTool: string;
  sceneGraph: SceneGraph;
  zoom: number;
  canvasPosition: { x: number; y: number };
  setCanvasPosition: (p: { x: number; y: number }) => void;
  setSelectedElements: (ids: string[]) => void;
  onCreateElement: CreateFn;       // يوصّل لـ insertSmartElement
  'data-test-id'?: string;
}

export default function InteractionOverlay({
  selectedTool,
  sceneGraph,
  zoom,
  canvasPosition,
  setCanvasPosition,
  setSelectedElements,
  onCreateElement,
  'data-test-id': dataTestId = 'overlay-interaction',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panState = useRef<{ active: boolean; sx: number; sy: number; ox: number; oy: number } | null>(null);

  const screenToWorld = useCallback((clientX: number, clientY: number): Point => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = (clientX - rect.left + canvasPosition.x) / zoom;
    const y = (clientY - rect.top + canvasPosition.y) / zoom;
    return { x, y };
  }, [zoom, canvasPosition]);

  const onClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // اختيار عنصر
    if (selectedTool === 'select') {
      const p = screenToWorld(e.clientX, e.clientY);
      const hit = sceneGraph.hitTest(p)[0];
      setSelectedElements(hit ? [hit.id] : []);
      return;
    }

    // إنشاء عنصر سريع
    if (selectedTool === 'sticky' || selectedTool === 'text') {
      const p = screenToWorld(e.clientX, e.clientY);
      const type = selectedTool === 'sticky' ? 'sticky' : 'text';
      onCreateElement(type, p);
    }
  }, [selectedTool, sceneGraph, screenToWorld, setSelectedElements, onCreateElement]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // سحب الكاميرا (Pan)
    if (selectedTool === 'pan') {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      panState.current = { active: true, sx: e.clientX, sy: e.clientY, ox: canvasPosition.x, oy: canvasPosition.y };
    }
  }, [selectedTool, canvasPosition]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (panState.current?.active) {
      const dx = e.clientX - panState.current.sx;
      const dy = e.clientY - panState.current.sy;
      setCanvasPosition({ x: panState.current.ox - dx, y: panState.current.oy - dy });
    }
  }, [setCanvasPosition]);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (panState.current?.active) {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      panState.current = null;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      data-test-id={dataTestId}
      className="absolute inset-0 z-10 bg-transparent"
      // ملاحظات:
      // - نخليها شفافة فوق WhiteboardRoot عشان كل الأحداث تمسكها هذي الطبقة
      // - WhiteboardRoot يظل مسؤول عن الرسم فقط
    />
  );
}