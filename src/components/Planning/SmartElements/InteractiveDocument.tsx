/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Interactive Document - مستند تفاعلي
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * مستند نصي تفاعلي يدعم:
 * - التحرير المباشر
 * - حساب عدد الكلمات والحروف
 * - حالات المستند (مسودة، قيد المراجعة، مكتمل)
 * - التصدير
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  Download, 
  Clock,
  CheckCircle,
  AlertCircle,
  Edit3,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type DocumentStatus = 'draft' | 'review' | 'completed';

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
  format: 'plain',
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
  completed: { label: 'مكتمل', icon: CheckCircle, color: 'bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))]' },
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

  // Change status
  const handleStatusChange = useCallback((newStatus: DocumentStatus) => {
    onUpdate?.({
      status: newStatus,
      lastEditedAt: new Date().toISOString(),
    });
  }, [onUpdate]);

  // Export document
  const handleExport = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content]);

  // Sync content from data
  useEffect(() => {
    if (inputData.content !== undefined && inputData.content !== content) {
      setContent(inputData.content);
    }
  }, [inputData.content]);

  const counts = calculateCounts(content);
  const StatusIcon = STATUS_CONFIG[data.status].icon;

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">مستند تفاعلي</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <button 
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors",
              STATUS_CONFIG[data.status].color
            )}
            onClick={() => {
              const statuses: DocumentStatus[] = ['draft', 'review', 'completed'];
              const currentIndex = statuses.indexOf(data.status);
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              handleStatusChange(nextStatus);
            }}
          >
            <StatusIcon className="w-3 h-3" />
            {STATUS_CONFIG[data.status].label}
          </button>

          {/* Toggle Edit/View */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-7 px-2"
          >
            {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </Button>

          {/* Export */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="h-7 px-2"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-hidden">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="ابدأ الكتابة هنا..."
            className="w-full h-full resize-none border-0 focus-visible:ring-0 bg-transparent text-sm leading-relaxed"
            dir="rtl"
          />
        ) : (
          <div className="w-full h-full overflow-auto text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {content || <span className="text-muted-foreground">لا يوجد محتوى</span>}
          </div>
        )}
      </div>

      {/* Footer - Word Count */}
      {data.showWordCount && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
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
