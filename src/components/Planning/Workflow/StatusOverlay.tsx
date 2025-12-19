/**
 * StatusOverlay - طبقة عرض حالة العقدة أثناء التشغيل
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Loader2,
  SkipForward
} from 'lucide-react';
import type { NodeRuntimeStatus } from '@/types/workflow-runtime';

interface StatusOverlayProps {
  status: NodeRuntimeStatus;
  size?: { width: number; height: number };
  showLabel?: boolean;
}

const statusConfig: Record<NodeRuntimeStatus, {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  label: string;
  animate?: boolean;
}> = {
  idle: {
    icon: <Clock className="w-4 h-4" />,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
    label: 'في الانتظار'
  },
  pending: {
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100/80',
    label: 'معلق',
    animate: true
  },
  active: {
    icon: <Play className="w-4 h-4" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100/80',
    label: 'نشط',
    animate: true
  },
  completed: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100/80',
    label: 'مكتمل'
  },
  blocked: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100/80',
    label: 'محظور'
  },
  skipped: {
    icon: <SkipForward className="w-4 h-4" />,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100/80',
    label: 'تم تخطيه'
  },
  error: {
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100/80',
    label: 'خطأ'
  }
};

export function StatusOverlay({ 
  status, 
  size = { width: 160, height: 80 },
  showLabel = true 
}: StatusOverlayProps) {
  const config = statusConfig[status];
  
  if (status === 'idle') {
    return null; // لا نعرض شيء للحالة الافتراضية
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute inset-0 pointer-events-none z-10"
      >
        {/* طبقة التراكب */}
        <div 
          className={`absolute inset-0 rounded-lg ${config.bgColor} backdrop-blur-sm`}
          style={{ opacity: status === 'active' ? 0.3 : 0.6 }}
        />
        
        {/* حدود متحركة للحالة النشطة */}
        {config.animate && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-current"
            style={{ borderColor: 'currentColor' }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(59, 130, 246, 0.4)',
                '0 0 0 8px rgba(59, 130, 246, 0)',
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        )}
        
        {/* شارة الحالة */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`
            absolute -top-3 left-1/2 -translate-x-1/2
            flex items-center gap-1.5 px-2 py-1 rounded-full
            ${config.bgColor} ${config.color}
            shadow-sm border border-current/20
            text-xs font-medium
          `}
        >
          {config.icon}
          {showLabel && <span>{config.label}</span>}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// مكون شارة صغيرة للحالة
export function StatusBadge({ status }: { status: NodeRuntimeStatus }) {
  const config = statusConfig[status];
  
  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
      ${config.bgColor} ${config.color}
    `}>
      {config.icon}
      {config.label}
    </span>
  );
}

// مكون نقطة حالة صغيرة
export function StatusDot({ status }: { status: NodeRuntimeStatus }) {
  const config = statusConfig[status];
  
  return (
    <span className={`relative flex h-3 w-3`}>
      {config.animate && (
        <span className={`
          animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
          ${config.bgColor}
        `} />
      )}
      <span className={`
        relative inline-flex rounded-full h-3 w-3
        ${config.bgColor} ${config.color}
      `} />
    </span>
  );
}
