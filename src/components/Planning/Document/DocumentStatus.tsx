/**
 * مكون عرض حالة المستند
 * يعرض الحالة بشكل بصري مع أيقونة ولون
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import type { DocumentStatus as DocStatus } from '@/types/canvas-elements';

interface DocumentStatusProps {
  status: DocStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const statusConfig: Record<DocStatus, {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
}> = {
  draft: {
    icon: FileText,
    label: 'مسودة',
    color: 'hsl(var(--ink-60))',
    bgColor: 'rgba(11,15,18,0.08)'
  },
  pending: {
    icon: Clock,
    label: 'قيد الانتظار',
    color: 'hsl(var(--accent-yellow))',
    bgColor: 'rgba(246,196,69,0.15)'
  },
  review: {
    icon: AlertCircle,
    label: 'قيد المراجعة',
    color: 'hsl(var(--accent-blue))',
    bgColor: 'rgba(61,168,245,0.15)'
  },
  approved: {
    icon: CheckCircle2,
    label: 'معتمد',
    color: 'hsl(var(--accent-green))',
    bgColor: 'rgba(61,190,139,0.15)'
  },
  rejected: {
    icon: XCircle,
    label: 'مرفوض',
    color: 'hsl(var(--accent-red))',
    bgColor: 'rgba(229,86,77,0.15)'
  }
};

const sizeConfig = {
  sm: { icon: 12, text: 10, padding: '2px 6px', gap: 4 },
  md: { icon: 14, text: 12, padding: '4px 10px', gap: 6 },
  lg: { icon: 18, text: 14, padding: '6px 14px', gap: 8 }
};

export function DocumentStatus({ 
  status, 
  size = 'md', 
  showLabel = true,
  animated = false
}: DocumentStatusProps) {
  const config = statusConfig[status];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  const content = (
    <div
      className="inline-flex items-center rounded-full"
      style={{ 
        padding: sizes.padding,
        backgroundColor: config.bgColor,
        gap: sizes.gap
      }}
    >
      <Icon 
        size={sizes.icon} 
        style={{ color: config.color }}
      />
      {showLabel && (
        <span 
          className="font-medium"
          style={{ 
            fontSize: sizes.text,
            color: config.color
          }}
        >
          {config.label}
        </span>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

// Compact Dot Version
export function DocumentStatusDot({ status }: { status: DocStatus }) {
  const config = statusConfig[status];
  
  return (
    <div
      className="w-2.5 h-2.5 rounded-full"
      style={{ backgroundColor: config.color }}
      title={config.label}
    />
  );
}

// Badge for Workflow Integration
export function DocumentStatusBadge({ 
  status,
  documentName 
}: { 
  status: DocStatus;
  documentName?: string;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg border"
      style={{ 
        backgroundColor: config.bgColor,
        borderColor: `${config.color}40`
      }}
    >
      <Icon size={16} style={{ color: config.color }} />
      <div className="flex flex-col">
        {documentName && (
          <span className="text-[11px] text-[hsl(var(--ink-80))] font-medium truncate max-w-[120px]">
            {documentName}
          </span>
        )}
        <span 
          className="text-[10px] font-medium"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}

export default DocumentStatus;
