/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Interactive Document - مستند تفاعلي
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * مستند نصي تفاعلي يدعم:
 * - التحرير المباشر مع دعم Markdown
 * - معاينة مباشرة للتنسيق
 * - أزرار تنسيق سريعة
 * - ربط بـ Workflow للمراجعة والموافقات
 * - حساب عدد الكلمات والحروف
 * - التصدير
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Clock,
  CheckCircle,
  Edit3,
  Eye,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Workflow,
  Send,
  XCircle,
  MessageSquare,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type DocumentStatus = 'draft' | 'review' | 'approved' | 'rejected' | 'completed';
export type WorkflowStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export interface InteractiveDocumentData {
  content: string;
  format: 'plain' | 'markdown';
  isReadOnly: boolean;
  status: DocumentStatus;
  showWordCount: boolean;
  wordCount: number;
  charCount: number;
  lastEditedAt: string;
  createdAt: string;
  // Workflow
  linkedWorkflowNodeId?: string;
  workflowStatus?: WorkflowStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  reviewComments?: string;
}

interface InteractiveDocumentProps {
  data: Partial<InteractiveDocumentData>;
  onUpdate?: (data: Partial<InteractiveDocumentData>) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Data
// ─────────────────────────────────────────────────────────────────────────────

const getDefaultData = (): InteractiveDocumentData => ({
  content: '',
  format: 'markdown',
  isReadOnly: false,
  status: 'draft',
  showWordCount: true,
  wordCount: 0,
  charCount: 0,
  lastEditedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Status Config
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<DocumentStatus, { label: string; icon: React.ElementType; color: string }> = {
  draft: { label: 'مسودة', icon: Edit3, color: 'bg-muted text-muted-foreground' },
  review: { label: 'قيد المراجعة', icon: Clock, color: 'bg-[hsl(var(--accent-yellow))]/20 text-[hsl(var(--accent-yellow))]' },
  approved: { label: 'معتمد', icon: CheckCircle, color: 'bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))]' },
  rejected: { label: 'مرفوض', icon: XCircle, color: 'bg-[hsl(var(--accent-red))]/20 text-[hsl(var(--accent-red))]' },
  completed: { label: 'مكتمل', icon: CheckCircle, color: 'bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))]' },
};

const WORKFLOW_STATUS_CONFIG: Record<WorkflowStatus, { label: string; color: string }> = {
  pending: { label: 'في الانتظار', color: 'bg-muted text-muted-foreground' },
  in_review: { label: 'قيد المراجعة', color: 'bg-[hsl(var(--accent-yellow))]/20 text-[hsl(var(--accent-yellow))]' },
  approved: { label: 'تمت الموافقة', color: 'bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))]' },
  rejected: { label: 'مرفوض', color: 'bg-[hsl(var(--accent-red))]/20 text-[hsl(var(--accent-red))]' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Markdown Formatting Helpers
// ─────────────────────────────────────────────────────────────────────────────

interface FormatAction {
  icon: React.ElementType;
  label: string;
  prefix: string;
  suffix: string;
  block?: boolean;
}

const FORMAT_ACTIONS: FormatAction[] = [
  { icon: Bold, label: 'عريض', prefix: '**', suffix: '**' },
  { icon: Italic, label: 'مائل', prefix: '*', suffix: '*' },
  { icon: Heading1, label: 'عنوان 1', prefix: '# ', suffix: '', block: true },
  { icon: Heading2, label: 'عنوان 2', prefix: '## ', suffix: '', block: true },
  { icon: List, label: 'قائمة', prefix: '- ', suffix: '', block: true },
  { icon: ListOrdered, label: 'قائمة مرقمة', prefix: '1. ', suffix: '', block: true },
  { icon: Quote, label: 'اقتباس', prefix: '> ', suffix: '', block: true },
  { icon: Code, label: 'كود', prefix: '`', suffix: '`' },
  { icon: Link2, label: 'رابط', prefix: '[', suffix: '](url)' },
];

// Simple Markdown to HTML renderer
const renderMarkdown = (text: string): string => {
  if (!text) return '';
  
  let html = text
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>')
    // Bold and Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Code
    .replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline" target="_blank">$1</a>')
    // Blockquotes
    .replace(/^&gt; (.+)$/gm, '<blockquote class="border-r-2 border-primary pr-3 my-2 text-muted-foreground">$1</blockquote>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="mr-4">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="mr-4 list-decimal">$2</li>')
    // Line breaks
    .replace(/\n/g, '<br />');
  
  return html;
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const InteractiveDocument: React.FC<InteractiveDocumentProps> = ({ 
  data: inputData, 
  onUpdate 
}) => {
  const data = { ...getDefaultData(), ...inputData };
  const [isEditing, setIsEditing] = useState(!data.isReadOnly);
  const [content, setContent] = useState(data.content);
  const [showWorkflowPanel, setShowWorkflowPanel] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word and char count
  const calculateCounts = useCallback((text: string) => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    return { wordCount: words, charCount: chars };
  }, []);

  // Update content
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    const counts = calculateCounts(newContent);
    onUpdate?.({
      content: newContent,
      ...counts,
      lastEditedAt: new Date().toISOString(),
    });
  }, [calculateCounts, onUpdate]);

  // Apply formatting
  const applyFormat = useCallback((action: FormatAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'نص';
    
    let newContent: string;
    let newCursorPos: number;

    if (action.block) {
      // For block-level formatting, add at the start of line
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      newContent = 
        content.substring(0, lineStart) + 
        action.prefix + 
        content.substring(lineStart);
      newCursorPos = lineStart + action.prefix.length;
    } else {
      newContent = 
        content.substring(0, start) + 
        action.prefix + 
        selectedText + 
        action.suffix + 
        content.substring(end);
      newCursorPos = start + action.prefix.length + selectedText.length + action.suffix.length;
    }

    handleContentChange(newContent);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [content, handleContentChange]);

  // Change status
  const handleStatusChange = useCallback((newStatus: DocumentStatus) => {
    onUpdate?.({
      status: newStatus,
      lastEditedAt: new Date().toISOString(),
    });
  }, [onUpdate]);

  // Submit for review
  const handleSubmitForReview = useCallback(() => {
    onUpdate?.({
      status: 'review',
      workflowStatus: 'pending',
      lastEditedAt: new Date().toISOString(),
    });
    setShowWorkflowPanel(false);
  }, [onUpdate]);

  // Approve document
  const handleApprove = useCallback(() => {
    onUpdate?.({
      status: 'approved',
      workflowStatus: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewComments: reviewComment || undefined,
      lastEditedAt: new Date().toISOString(),
    });
    setReviewComment('');
    setShowWorkflowPanel(false);
  }, [onUpdate, reviewComment]);

  // Reject document
  const handleReject = useCallback(() => {
    onUpdate?.({
      status: 'rejected',
      workflowStatus: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewComments: reviewComment || 'تم الرفض',
      lastEditedAt: new Date().toISOString(),
    });
    setReviewComment('');
    setShowWorkflowPanel(false);
  }, [onUpdate, reviewComment]);

  // Export document
  const handleExport = useCallback(() => {
    const extension = data.format === 'markdown' ? 'md' : 'txt';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${new Date().toISOString().slice(0, 10)}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, data.format]);

  // Toggle format
  const toggleFormat = useCallback(() => {
    const newFormat = data.format === 'plain' ? 'markdown' : 'plain';
    onUpdate?.({ format: newFormat });
  }, [data.format, onUpdate]);

  // Sync content from data
  useEffect(() => {
    if (inputData.content !== undefined && inputData.content !== content) {
      setContent(inputData.content);
    }
  }, [inputData.content]);

  const counts = calculateCounts(content);
  const StatusIcon = STATUS_CONFIG[data.status].icon;
  const isMarkdown = data.format === 'markdown';

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">مستند تفاعلي</span>
          
          {/* Format Toggle */}
          <button
            onClick={toggleFormat}
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
              isMarkdown 
                ? "bg-primary/10 text-primary" 
                : "bg-muted text-muted-foreground"
            )}
          >
            {isMarkdown ? 'MD' : 'TXT'}
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Status Badge */}
          <button 
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium cursor-pointer transition-colors",
              STATUS_CONFIG[data.status].color
            )}
            onClick={() => {
              const statuses: DocumentStatus[] = ['draft', 'review', 'approved', 'rejected', 'completed'];
              const currentIndex = statuses.indexOf(data.status);
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              handleStatusChange(nextStatus);
            }}
          >
            <StatusIcon className="w-2.5 h-2.5" />
            {STATUS_CONFIG[data.status].label}
          </button>

          {/* Workflow */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowWorkflowPanel(!showWorkflowPanel)}
            className={cn("h-6 px-1.5", showWorkflowPanel && "bg-primary/10 text-primary")}
          >
            <Workflow className="w-3.5 h-3.5" />
          </Button>

          {/* Toggle Edit/View */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-6 px-1.5"
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          </Button>

          {/* Export */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="h-6 px-1.5"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Markdown Toolbar */}
      {isEditing && isMarkdown && (
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/20 overflow-x-auto">
          {FORMAT_ACTIONS.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => applyFormat(action)}
              className="h-6 w-6 p-0 flex-shrink-0"
              title={action.label}
            >
              <action.icon className="w-3.5 h-3.5" />
            </Button>
          ))}
        </div>
      )}

      {/* Workflow Panel */}
      {showWorkflowPanel && (
        <div className="px-3 py-2 border-b border-border bg-muted/20 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Workflow className="w-3.5 h-3.5" />
            <span>سير العمل والموافقات</span>
          </div>
          
          {data.workflowStatus && (
            <div className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
              WORKFLOW_STATUS_CONFIG[data.workflowStatus].color
            )}>
              {WORKFLOW_STATUS_CONFIG[data.workflowStatus].label}
            </div>
          )}

          {data.reviewerName && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <User className="w-3 h-3" />
              <span>المراجع: {data.reviewerName}</span>
            </div>
          )}

          {data.reviewComments && (
            <div className="flex items-start gap-1 text-[10px] text-muted-foreground bg-muted/50 p-2 rounded">
              <MessageSquare className="w-3 h-3 mt-0.5" />
              <span>{data.reviewComments}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="أضف تعليق..."
              className="h-16 text-xs resize-none"
            />
          </div>

          <div className="flex items-center gap-1">
            {data.status === 'draft' && (
              <Button size="sm" onClick={handleSubmitForReview} className="h-6 text-[10px] gap-1">
                <Send className="w-3 h-3" />
                إرسال للمراجعة
              </Button>
            )}
            {(data.status === 'review' || data.workflowStatus === 'pending' || data.workflowStatus === 'in_review') && (
              <>
                <Button size="sm" onClick={handleApprove} className="h-6 text-[10px] gap-1 bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/90">
                  <CheckCircle className="w-3 h-3" />
                  موافقة
                </Button>
                <Button size="sm" variant="destructive" onClick={handleReject} className="h-6 text-[10px] gap-1">
                  <XCircle className="w-3 h-3" />
                  رفض
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 p-3 overflow-hidden">
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={isMarkdown ? "# اكتب عنوانك هنا\n\nابدأ الكتابة بتنسيق Markdown..." : "ابدأ الكتابة هنا..."}
            className="w-full h-full resize-none border-0 focus-visible:ring-0 bg-transparent text-sm leading-relaxed font-mono"
            dir="rtl"
          />
        ) : (
          <div className="w-full h-full overflow-auto text-sm leading-relaxed text-foreground">
            {content ? (
              isMarkdown ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
              ) : (
                <div className="whitespace-pre-wrap">{content}</div>
              )
            ) : (
              <span className="text-muted-foreground">لا يوجد محتوى</span>
            )}
          </div>
        )}
      </div>

      {/* Footer - Word Count */}
      {data.showWordCount && (
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/30 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>{counts.wordCount} كلمة</span>
            <span>{counts.charCount} حرف</span>
          </div>
          <span>آخر تعديل: {new Date(data.lastEditedAt).toLocaleString('ar-SA')}</span>
        </div>
      )}
    </div>
  );
};

export default InteractiveDocument;
