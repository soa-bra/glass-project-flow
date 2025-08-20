import React from 'react';

export interface StatusBarProps {
  fps: number;
  zoom: number;
  elementsCount: number;
  selectedCount: number;
  boardId?: string | null;
  connected?: boolean;        // ✅ جديد
  isLocalMode?: boolean;      // ✅ جديد
  className?: string;
  'data-test-id'?: string;
}

export default function StatusBar({
  fps,
  zoom,
  elementsCount,
  selectedCount,
  boardId,
  connected = false,
  isLocalMode = false,
  className = '',
  'data-test-id': dataTestId = 'status-realtime',
}: StatusBarProps) {
  const connectionLabel = isLocalMode
    ? 'local-ephemeral'
    : (connected ? 'connected' : 'disconnected');

  const connectionClass = isLocalMode
    ? 'text-amber-600'
    : (connected ? 'text-green-600' : 'text-red-600');

  return (
    <div
      className={`absolute top-2 right-6 flex items-center gap-3 text-xs text-muted-foreground ${className}`}
      data-test-id={dataTestId}
    >
      {boardId ? <span className="truncate max-w-[120px]">{boardId}</span> : null}
      <span>FPS {fps}</span>
      <span>{Math.round(zoom * 100)}%</span>
      <span>عناصر {elementsCount}</span>
      <span>مختارة {selectedCount}</span>
      <span className={connectionClass}>{connectionLabel}</span>
    </div>
  );
}
