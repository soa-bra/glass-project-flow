import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Bold, Italic, Underline, AlignRight, AlignCenter, AlignLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartTextDocData {
  title: string;
  content: string;
  format: 'plain' | 'rich' | 'markdown';
  aiAssist: boolean;
  readOnly: boolean;
  showToolbar: boolean;
}

interface SmartTextDocProps {
  data: SmartTextDocData;
  onUpdate: (data: Partial<SmartTextDocData>) => void;
}

export const SmartTextDoc: React.FC<SmartTextDocProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || '');

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    onUpdate({ content: newContent });
  }, [onUpdate]);

  const handleTitleChange = useCallback((title: string) => {
    onUpdate({ title });
  }, [onUpdate]);

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-panel">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <input
            type="text"
            value={data.title || 'مستند جديد'}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="font-semibold text-foreground bg-transparent border-none outline-none focus:ring-0"
            placeholder="عنوان المستند"
          />
        </div>
        
        {data.aiAssist && (
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            <Sparkles className="h-3 w-3" />
            مساعد AI
          </Button>
        )}
      </div>

      {/* Toolbar */}
      {data.showToolbar !== false && (
        <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Underline className="h-4 w-4" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <AlignLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          readOnly={data.readOnly}
          placeholder="ابدأ الكتابة هنا..."
          className={cn(
            "w-full h-full min-h-[200px] resize-none",
            "bg-transparent border-none outline-none focus:ring-0",
            "text-foreground text-sm leading-relaxed",
            "placeholder:text-muted-foreground"
          )}
          onClick={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
        />
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border bg-muted/30 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {content.split(/\s+/).filter(Boolean).length} كلمة
        </p>
        <p className="text-xs text-muted-foreground">
          {data.format === 'rich' ? 'تنسيق غني' : data.format === 'markdown' ? 'Markdown' : 'نص عادي'}
        </p>
      </div>
    </div>
  );
};
