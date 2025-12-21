/**
 * SyncStatusIndicator - Sprint 17
 * مؤشر حالة التزامن
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, CloudOff, RefreshCw, Check, AlertCircle, 
  Wifi, WifiOff, Loader2 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error' | 'offline' | 'reconnecting';

interface SyncStatusIndicatorProps {
  status: SyncState;
  lastSyncTime?: number;
  pendingChanges?: number;
  collaboratorCount?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  idle: {
    icon: Cloud,
    color: 'text-ink-60',
    bgColor: 'bg-muted',
    label: 'في انتظار التغييرات',
    animate: false,
  },
  syncing: {
    icon: RefreshCw,
    color: 'text-accent-blue',
    bgColor: 'bg-accent-blue/10',
    label: 'جارٍ المزامنة...',
    animate: true,
  },
  synced: {
    icon: Check,
    color: 'text-accent-green',
    bgColor: 'bg-accent-green/10',
    label: 'متزامن',
    animate: false,
  },
  error: {
    icon: AlertCircle,
    color: 'text-accent-red',
    bgColor: 'bg-accent-red/10',
    label: 'خطأ في المزامنة',
    animate: false,
  },
  offline: {
    icon: CloudOff,
    color: 'text-ink-60',
    bgColor: 'bg-muted',
    label: 'غير متصل',
    animate: false,
  },
  reconnecting: {
    icon: Loader2,
    color: 'text-accent-yellow',
    bgColor: 'bg-accent-yellow/10',
    label: 'إعادة الاتصال...',
    animate: true,
  },
};

const sizeConfig = {
  sm: {
    container: 'h-6 px-2 text-xs gap-1.5',
    icon: 'h-3 w-3',
    dot: 'h-1.5 w-1.5',
  },
  md: {
    container: 'h-8 px-3 text-sm gap-2',
    icon: 'h-4 w-4',
    dot: 'h-2 w-2',
  },
  lg: {
    container: 'h-10 px-4 text-base gap-2.5',
    icon: 'h-5 w-5',
    dot: 'h-2.5 w-2.5',
  },
};

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  status,
  lastSyncTime,
  pendingChanges = 0,
  collaboratorCount = 0,
  className = '',
  showLabel = true,
  size = 'md',
}) => {
  const config = statusConfig[status];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  // تنسيق الوقت
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `منذ ${Math.floor(diff / 60000)} دقيقة`;
    return `منذ ${Math.floor(diff / 3600000)} ساعة`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`
              inline-flex items-center rounded-full
              ${sizes.container} ${config.bgColor} ${className}
            `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* أيقونة الحالة */}
            <motion.div
              animate={config.animate ? { rotate: 360 } : {}}
              transition={config.animate ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            >
              <Icon className={`${sizes.icon} ${config.color}`} />
            </motion.div>

            {/* التسمية */}
            {showLabel && (
              <span className={`font-medium ${config.color}`}>
                {config.label}
              </span>
            )}

            {/* عدد التغييرات المعلقة */}
            {pendingChanges > 0 && status === 'syncing' && (
              <span className="bg-accent-blue text-white text-xs px-1.5 py-0.5 rounded-full">
                {pendingChanges}
              </span>
            )}

            {/* مؤشر الاتصال */}
            {status === 'synced' && (
              <motion.div
                className={`${sizes.dot} rounded-full bg-accent-green`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {status === 'synced' || status === 'syncing' ? (
                <Wifi className="h-3 w-3 text-accent-green" />
              ) : (
                <WifiOff className="h-3 w-3 text-accent-red" />
              )}
              <span>{config.label}</span>
            </div>
            
            {lastSyncTime && (
              <p className="text-muted-foreground">
                آخر تزامن: {formatTime(lastSyncTime)}
              </p>
            )}
            
            {collaboratorCount > 0 && (
              <p className="text-muted-foreground">
                {collaboratorCount} متعاون متصل
              </p>
            )}
            
            {pendingChanges > 0 && (
              <p className="text-accent-blue">
                {pendingChanges} تغيير في الانتظار
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SyncStatusIndicator;
