import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Wifi, 
  WifiOff, 
  Clock,
  AlertTriangle,
  Users,
  MessageSquare,
  Activity,
  RefreshCw
} from 'lucide-react';
import { RealTimeCollaborators } from './RealTimeCollaborators';

interface CollaborationBarProps {
  isConnected: boolean;
  isReconnecting: boolean;
  isSyncing: boolean;
  collaborators: Array<{
    id: string;
    name: string;
    color: string;
    isOnline: boolean;
    cursor?: { x: number; y: number };
    lastActivity?: Date;
    isTyping?: boolean;
    currentElement?: string;
  }>;
  currentUserId: string;
  conflicts: number;
  pendingOperations: number;
  lastSyncTime?: Date | null;
  messages: number;
  onReconnect?: () => void;
  onShowMessages?: () => void;
  onShowActivity?: () => void;
  onResolveConflicts?: () => void;
}

export const CollaborationBar: React.FC<CollaborationBarProps> = ({
  isConnected,
  isReconnecting,
  isSyncing,
  collaborators,
  currentUserId,
  conflicts,
  pendingOperations,
  lastSyncTime,
  messages,
  onReconnect,
  onShowMessages,
  onShowActivity,
  onResolveConflicts
}) => {
  const getConnectionStatus = () => {
    if (isReconnecting) return { icon: RefreshCw, color: 'text-yellow-500', label: 'إعادة الاتصال...' };
    if (!isConnected) return { icon: WifiOff, color: 'text-red-500', label: 'غير متصل' };
    if (isSyncing) return { icon: RefreshCw, color: 'text-blue-500', label: 'مزامنة...' };
    return { icon: Wifi, color: 'text-green-500', label: 'متصل' };
  };

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  const formatLastSync = () => {
    if (!lastSyncTime) return 'لم يتم';
    const seconds = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
    if (seconds < 60) return `منذ ${seconds} ثانية`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    return `منذ ${hours} ساعة`;
  };

  return (
    <TooltipProvider>
      <Card className="px-4 py-2 shadow-sm border-b">
        <div className="flex items-center justify-between gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <StatusIcon 
                    className={`w-4 h-4 ${status.color} ${isReconnecting || isSyncing ? 'animate-spin' : ''}`} 
                  />
                  <span className="text-sm font-medium">{status.label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1 text-right">
                  <p>حالة الاتصال: {status.label}</p>
                  <p>آخر مزامنة: {formatLastSync()}</p>
                  {pendingOperations > 0 && (
                    <p>عمليات معلقة: {pendingOperations}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>

            {!isConnected && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReconnect}
                className="text-xs h-7"
              >
                إعادة الاتصال
              </Button>
            )}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Collaborators */}
          <div className="flex items-center gap-3">
            <RealTimeCollaborators 
              collaborators={collaborators}
              currentUserId={currentUserId}
              maxVisible={4}
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Activity Indicators */}
          <div className="flex items-center gap-2">
            {/* Messages */}
            {messages > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShowMessages}
                    className="relative h-8 w-8 p-0"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center"
                    >
                      {messages > 99 ? '99+' : messages}
                    </Badge>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{messages} رسالة جديدة</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Conflicts */}
            {conflicts > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onResolveConflicts}
                    className="relative h-8 w-8 p-0 text-amber-500 hover:text-amber-600"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center"
                    >
                      {conflicts}
                    </Badge>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{conflicts} تعارض يحتاج حل</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Pending Operations */}
            {pendingOperations > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {pendingOperations}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{pendingOperations} عملية معلقة</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Activity Monitor */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowActivity}
                  className="h-8 w-8 p-0"
                >
                  <Activity className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>عرض النشاط المباشر</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Sync Status */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>آخر مزامنة:</span>
            <span className="font-mono">{formatLastSync()}</span>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};