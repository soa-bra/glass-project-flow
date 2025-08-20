// Status Bar Component
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wifi, WifiOff, Users, MousePointer, Zap } from 'lucide-react';

export interface StatusBarProps {
  fps: number;
  zoom: number;
  elementsCount: number;
  selectedCount: number;
  boardId?: string | null;
  connected?: boolean;
  isLocalMode?: boolean;
  'data-test-id'?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  fps,
  zoom,
  elementsCount,
  selectedCount,
  boardId,
  connected = false,
  isLocalMode = false,
  'data-test-id': testId
}) => {
  const connectionStatus = isLocalMode ? 'local-ephemeral' : (connected ? 'connected' : 'disconnected');
  return (
    <div 
      className="flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur-sm border-t text-xs"
      data-test-id={testId}
    >
      <div className="flex items-center gap-3">
        {/* Connection Status */}
        <div className="flex items-center gap-1" data-test-id="status-realtime">
          {connectionStatus === 'connected' ? (
            <>
              <Wifi className="w-3 h-3 text-green-500" />
              <span className="text-green-500">connected</span>
            </>
          ) : connectionStatus === 'local-ephemeral' ? (
            <>
              <WifiOff className="w-3 h-3 text-yellow-500" />
              <span className="text-yellow-500">local-ephemeral</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-red-500" />
              <span className="text-red-500">disconnected</span>
            </>
          )}
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* FPS Counter */}
        <div className="flex items-center gap-1" data-test-id="status-fps">
          <Zap className="w-3 h-3 text-muted-foreground" />
          <span className="font-mono">{fps} FPS</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Elements Count */}
        <div className="flex items-center gap-1">
          <MousePointer className="w-3 h-3 text-muted-foreground" />
          <span>{elementsCount} عنصر</span>
          {selectedCount > 0 && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary">{selectedCount} محدد</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Zoom Level */}
        <Badge variant="outline" className="font-mono">
          {Math.round(zoom * 100)}%
        </Badge>

        {/* Board ID */}
        {boardId && (
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Users className="w-3 h-3" />
            <span>{boardId.substring(0, 8)}...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;