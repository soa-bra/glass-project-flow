/**
 * عنصر المستند الحي
 * يعرض المستند مع حالته وإمكانية التفاعل
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  File, 
  FileImage, 
  FileSpreadsheet,
  Download,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { DocumentStatus } from './DocumentStatus';
import type { DocumentData, DocumentStatus as DocStatus } from '@/types/canvas-elements';

export interface DocumentElementProps {
  id: string;
  data: DocumentData;
  selected?: boolean;
  onSelect?: () => void;
  onStatusChange?: (status: DocStatus) => void;
  onOpen?: () => void;
}

const fileTypeIcons: Record<string, React.ElementType> = {
  'application/pdf': FileText,
  'application/msword': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  'application/vnd.ms-excel': FileSpreadsheet,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileSpreadsheet,
  'image/png': FileImage,
  'image/jpeg': FileImage,
  'image/gif': FileImage,
  'default': File
};

const statusColors: Record<DocStatus, string> = {
  pending: 'hsl(var(--accent-yellow))',
  review: 'hsl(var(--accent-blue))',
  approved: 'hsl(var(--accent-green))',
  rejected: 'hsl(var(--accent-red))',
  draft: 'hsl(var(--ink-30))'
};

export function DocumentElement({
  id,
  data,
  selected = false,
  onSelect,
  onStatusChange,
  onOpen
}: DocumentElementProps) {
  const [showActions, setShowActions] = useState(false);
  
  const FileIcon = fileTypeIcons[data.mimeType] || fileTypeIcons.default;
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateStr));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative bg-white rounded-[18px] overflow-hidden
        border transition-all duration-200 cursor-pointer
        ${selected 
          ? 'border-[hsl(var(--accent-blue))] shadow-[0_0_0_2px_rgba(61,168,245,0.2)]' 
          : 'border-[#DADCE0] hover:border-[hsl(var(--ink-30))]'
        }
      `}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header with Status */}
      <div className="flex items-center justify-between px-3 py-2 bg-[hsl(var(--panel))]">
        <DocumentStatus status={data.status} size="sm" />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showActions ? 1 : 0 }}
          className="flex items-center gap-1"
        >
          {data.url && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(data.url, '_blank');
              }}
              className="p-1 hover:bg-white rounded transition-colors"
              title="فتح في نافذة جديدة"
            >
              <ExternalLink size={14} className="text-[hsl(var(--ink-60))]" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Download logic
            }}
            className="p-1 hover:bg-white rounded transition-colors"
            title="تحميل"
          >
            <Download size={14} className="text-[hsl(var(--ink-60))]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // More options
            }}
            className="p-1 hover:bg-white rounded transition-colors"
          >
            <MoreVertical size={14} className="text-[hsl(var(--ink-60))]" />
          </button>
        </motion.div>
      </div>

      {/* Thumbnail or Icon */}
      <div 
        className="relative aspect-[4/3] bg-[hsl(var(--panel))] flex items-center justify-center"
        onDoubleClick={onOpen}
      >
        {data.thumbnailUrl ? (
          <img 
            src={data.thumbnailUrl} 
            alt={data.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${statusColors[data.status]}20` }}
            >
              <FileIcon 
                size={32} 
                style={{ color: statusColors[data.status] }}
              />
            </div>
            <span className="text-[10px] text-[hsl(var(--ink-60))] uppercase font-medium">
              {data.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
            </span>
          </div>
        )}

        {/* Status Indicator Overlay */}
        <div 
          className="absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-white"
          style={{ backgroundColor: statusColors[data.status] }}
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] truncate mb-1">
          {data.name}
        </h4>
        
        <div className="flex items-center justify-between text-[10px] text-[hsl(var(--ink-60))]">
          <span>{formatFileSize(data.size)}</span>
          {data.updatedAt && (
            <span>{formatDate(data.updatedAt)}</span>
          )}
        </div>

        {/* Version Info */}
        {data.version && (
          <div className="mt-2 pt-2 border-t border-[#DADCE0]">
            <span className="text-[9px] text-[hsl(var(--ink-30))]">
              الإصدار {data.version}
            </span>
          </div>
        )}
      </div>

      {/* Workflow Binding Indicator */}
      {data.workflowNodeId && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--accent-blue))] to-[hsl(var(--accent-green))]" />
      )}
    </motion.div>
  );
}

export default DocumentElement;
