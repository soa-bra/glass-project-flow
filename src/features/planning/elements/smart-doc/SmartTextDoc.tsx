import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, Bold, Italic, Underline, AlignRight, AlignCenter, AlignLeft, 
  Sparkles, List, ListOrdered, TextCursorInput, Pilcrow
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SmartTextDocData {
  title: string;
  content: string;
  format: 'plain' | 'rich' | 'markdown';
  aiAssist: boolean;
  readOnly: boolean;
  showToolbar: boolean;
  fontSize?: number;
  direction?: 'rtl' | 'ltr';
}

interface SmartTextDocProps {
  data: SmartTextDocData;
  onUpdate: (data: Partial<SmartTextDocData>) => void;
}

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

export const SmartTextDoc: React.FC<SmartTextDocProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || '');
  const [fontSize, setFontSize] = useState(data.fontSize || 14);
  const [direction, setDirection] = useState<'rtl' | 'ltr'>(data.direction || 'rtl');
  const editorRef = useRef<HTMLDivElement>(null);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    onUpdate({ content: newContent });
  }, [onUpdate]);

  const handleTitleChange = useCallback((title: string) => {
    onUpdate({ title });
  }, [onUpdate]);

  const applyFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      handleContentChange(editorRef.current.innerHTML);
    }
  }, [handleContentChange]);

  const handleFontSizeChange = useCallback((size: string) => {
    const newSize = parseInt(size);
    setFontSize(newSize);
    onUpdate({ fontSize: newSize });
  }, [onUpdate]);

  const toggleDirection = useCallback(() => {
    const newDirection = direction === 'rtl' ? 'ltr' : 'rtl';
    setDirection(newDirection);
    onUpdate({ direction: newDirection });
  }, [direction, onUpdate]);

  const insertList = useCallback((ordered: boolean) => {
    applyFormat(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  }, [applyFormat]);

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
        <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30 flex-wrap">
          {/* Font Size */}
          <Select value={fontSize.toString()} onValueChange={handleFontSizeChange}>
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Text Formatting */}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyFormat('bold')}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyFormat('italic')}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyFormat('underline')}>
            <Underline className="h-4 w-4" />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Text Direction Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={toggleDirection}
            title={direction === 'rtl' ? 'تبديل إلى اليسار لليمين' : 'تبديل إلى اليمين لليسار'}
          >
            <Pilcrow className={cn("h-4 w-4", direction === 'rtl' && "transform scale-x-[-1]")} />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Text Alignment */}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyFormat('justifyRight')}>
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyFormat('justifyCenter')}>
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyFormat('justifyLeft')}>
            <AlignLeft className="h-4 w-4" />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Lists */}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertList(false)} title="قائمة نقطية">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertList(true)} title="قائمة رقمية">
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4">
        <div
          ref={editorRef}
          contentEditable={!data.readOnly}
          onInput={(e) => handleContentChange(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: content }}
          dir={direction}
          style={{ fontSize: `${fontSize}px` }}
          className={cn(
            "w-full h-full min-h-[200px] outline-none",
            "text-foreground leading-relaxed",
            "[&:empty]:before:content-['ابدأ_الكتابة_هنا...'] [&:empty]:before:text-muted-foreground"
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
