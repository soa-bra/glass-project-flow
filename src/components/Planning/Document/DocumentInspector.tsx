/**
 * لوحة خصائص المستند
 * تعرض وتعدّل خصائص المستند المحدد
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  User, 
  Calendar, 
  Tag, 
  Link2, 
  History,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronDown,
  Plus
} from 'lucide-react';
import type { DocumentData, DocumentStatus } from '@/types/canvas-elements';

interface DocumentInspectorProps {
  document: DocumentData;
  onUpdate: (updates: Partial<DocumentData>) => void;
  workflowNodes?: Array<{ id: string; label: string }>;
}

const statusOptions: Array<{ value: DocumentStatus; label: string; icon: React.ElementType; color: string }> = [
  { value: 'draft', label: 'مسودة', icon: FileText, color: 'hsl(var(--ink-30))' },
  { value: 'pending', label: 'قيد الانتظار', icon: Clock, color: 'hsl(var(--accent-yellow))' },
  { value: 'review', label: 'قيد المراجعة', icon: AlertCircle, color: 'hsl(var(--accent-blue))' },
  { value: 'approved', label: 'معتمد', icon: CheckCircle2, color: 'hsl(var(--accent-green))' },
  { value: 'rejected', label: 'مرفوض', icon: XCircle, color: 'hsl(var(--accent-red))' }
];

export function DocumentInspector({ 
  document, 
  onUpdate,
  workflowNodes = []
}: DocumentInspectorProps) {
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    metadata: true,
    workflow: true,
    history: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  const currentStatus = statusOptions.find(s => s.value === document.status);

  return (
    <div className="space-y-4">
      {/* Document Header */}
      <div className="flex items-start gap-3 p-3 bg-[hsl(var(--panel))] rounded-[12px]">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${currentStatus?.color}20` }}
        >
          <FileText size={20} style={{ color: currentStatus?.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={document.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full bg-transparent text-[14px] font-semibold text-[hsl(var(--ink))] outline-none"
          />
          <p className="text-[11px] text-[hsl(var(--ink-60))] truncate">
            {document.mimeType}
          </p>
        </div>
      </div>

      {/* Status Section */}
      <Section
        title="الحالة"
        icon={CheckCircle2}
        expanded={expandedSections.status}
        onToggle={() => toggleSection('status')}
      >
        <div className="grid grid-cols-2 gap-2">
          {statusOptions.map((status) => {
            const Icon = status.icon;
            const isActive = document.status === status.value;
            
            return (
              <button
                key={status.value}
                onClick={() => onUpdate({ status: status.value })}
                className={`
                  flex items-center gap-2 p-2 rounded-lg text-[12px] transition-all
                  ${isActive 
                    ? 'bg-white shadow-sm ring-1' 
                    : 'hover:bg-white/50'
                  }
                `}
                style={{ 
                  color: isActive ? status.color : 'hsl(var(--ink-60))',
                  boxShadow: isActive ? `0 0 0 1px ${status.color}` : 'none'
                }}
              >
                <Icon size={14} />
                <span className="font-medium">{status.label}</span>
              </button>
            );
          })}
        </div>

        {/* Approval Info */}
        {(document.status === 'approved' || document.status === 'rejected') && (
          <div className="mt-3 p-2 bg-white rounded-lg">
            <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--ink-60))]">
              <User size={12} />
              <span>{document.approvedBy || document.rejectedBy || 'غير محدد'}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--ink-30))] mt-1">
              <Calendar size={12} />
              <span>{formatDate(document.approvedAt || document.rejectedAt)}</span>
            </div>
          </div>
        )}
      </Section>

      {/* Metadata Section */}
      <Section
        title="البيانات الوصفية"
        icon={Tag}
        expanded={expandedSections.metadata}
        onToggle={() => toggleSection('metadata')}
      >
        <div className="space-y-3">
          {/* Description */}
          <div>
            <label className="block text-[11px] text-[hsl(var(--ink-60))] mb-1">
              الوصف
            </label>
            <textarea
              value={document.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="أضف وصفاً للمستند..."
              className="w-full bg-white rounded-lg p-2 text-[12px] text-[hsl(var(--ink))] 
                border border-[#DADCE0] outline-none focus:border-[hsl(var(--accent-blue))]
                resize-none h-16"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] text-[hsl(var(--ink-60))] mb-1">
              الوسوم
            </label>
            <div className="flex flex-wrap gap-1">
              {document.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[hsl(var(--panel))] 
                    rounded-full text-[10px] text-[hsl(var(--ink-80))]"
                >
                  {tag}
                  <button
                    onClick={() => {
                      const newTags = document.tags?.filter((_, i) => i !== index);
                      onUpdate({ tags: newTags });
                    }}
                    className="hover:text-[hsl(var(--accent-red))]"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => {
                  const tag = prompt('أدخل الوسم الجديد:');
                  if (tag) {
                    onUpdate({ tags: [...(document.tags || []), tag] });
                  }
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 border border-dashed 
                  border-[#DADCE0] rounded-full text-[10px] text-[hsl(var(--ink-60))]
                  hover:bg-[hsl(var(--panel))] transition-colors"
              >
                <Plus size={10} />
                إضافة
              </button>
            </div>
          </div>

          {/* Version */}
          <div className="flex items-center justify-between">
            <label className="text-[11px] text-[hsl(var(--ink-60))]">
              الإصدار
            </label>
            <input
              type="number"
              value={document.version || 1}
              onChange={(e) => onUpdate({ version: parseInt(e.target.value) || 1 })}
              min={1}
              className="w-16 bg-white rounded px-2 py-1 text-[12px] text-center
                border border-[#DADCE0] outline-none focus:border-[hsl(var(--accent-blue))]"
            />
          </div>
        </div>
      </Section>

      {/* Workflow Binding */}
      <Section
        title="ربط Workflow"
        icon={Link2}
        expanded={expandedSections.workflow}
        onToggle={() => toggleSection('workflow')}
      >
        <div className="space-y-2">
          <label className="block text-[11px] text-[hsl(var(--ink-60))]">
            العقدة المرتبطة
          </label>
          <select
            value={document.workflowNodeId || ''}
            onChange={(e) => onUpdate({ workflowNodeId: e.target.value || undefined })}
            className="w-full bg-white rounded-lg p-2 text-[12px] text-[hsl(var(--ink))]
              border border-[#DADCE0] outline-none focus:border-[hsl(var(--accent-blue))]"
          >
            <option value="">بدون ربط</option>
            {workflowNodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>

          <p className="text-[10px] text-[hsl(var(--ink-30))] leading-relaxed">
            عند ربط المستند بعقدة، يمكن استخدام حالة المستند كشرط للانتقال في Workflow.
          </p>
        </div>
      </Section>

      {/* History Section */}
      <Section
        title="السجل"
        icon={History}
        expanded={expandedSections.history}
        onToggle={() => toggleSection('history')}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[hsl(var(--ink-60))]">تاريخ الإنشاء</span>
            <span className="text-[hsl(var(--ink))]">{formatDate(document.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[hsl(var(--ink-60))]">آخر تحديث</span>
            <span className="text-[hsl(var(--ink))]">{formatDate(document.updatedAt)}</span>
          </div>
          {document.createdBy && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[hsl(var(--ink-60))]">بواسطة</span>
              <span className="text-[hsl(var(--ink))]">{document.createdBy}</span>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

// Collapsible Section Component
function Section({ 
  title, 
  icon: Icon, 
  expanded, 
  onToggle, 
  children 
}: {
  title: string;
  icon: React.ElementType;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[hsl(var(--panel))] rounded-[12px] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-[hsl(var(--ink-60))]" />
          <span className="text-[12px] font-semibold text-[hsl(var(--ink))]">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-[hsl(var(--ink-30))]" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 pb-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DocumentInspector;
