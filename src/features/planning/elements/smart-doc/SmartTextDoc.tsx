import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, Bold, Italic, Underline, AlignRight, AlignCenter, AlignLeft, 
  Sparkles, List, ListOrdered, Pilcrow, Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Arabic Unicode range for detection
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_REGEX = /[A-Za-z]/;

// Detect text direction based on first significant character
const detectTextDirection = (text: string): 'rtl' | 'ltr' | null => {
  // Strip HTML tags for detection
  const plainText = text.replace(/<[^>]*>/g, '').trim();
  
  for (const char of plainText) {
    if (ARABIC_REGEX.test(char)) return 'rtl';
    if (LATIN_REGEX.test(char)) return 'ltr';
  }
  return null;
};

// Wrap paragraphs with appropriate direction
const wrapWithBidiSupport = (html: string): string => {
  // If it's just plain text without HTML structure, return as is
  if (!html.includes('<')) return html;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Process text nodes and paragraphs
  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      const direction = detectTextDirection(node.textContent);
      if (direction && node.parentElement) {
        const span = document.createElement('span');
        span.dir = direction;
        span.style.unicodeBidi = 'isolate';
        span.textContent = node.textContent;
        node.parentElement.replaceChild(span, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      // Process block elements
      if (['P', 'DIV', 'LI'].includes(element.tagName)) {
        const textContent = element.textContent || '';
        const direction = detectTextDirection(textContent);
        if (direction) {
          element.dir = direction;
          element.style.textAlign = direction === 'rtl' ? 'right' : 'left';
        }
      }
      // Recurse into children
      Array.from(node.childNodes).forEach(processNode);
    }
  };
  
  Array.from(tempDiv.childNodes).forEach(processNode);
  return tempDiv.innerHTML;
};

interface SmartTextDocData {
  title: string;
  content: string;
  format: 'plain' | 'rich' | 'markdown';
  aiAssist: boolean;
  readOnly: boolean;
  showToolbar: boolean;
  fontSize?: number;
  direction?: 'rtl' | 'ltr';
  autoDetectDirection?: boolean;
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
  const [autoDetect, setAutoDetect] = useState(data.autoDetectDirection !== false);
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Auto-detect direction on content change
  useEffect(() => {
    if (autoDetect && content && !isInitialMount.current) {
      const detected = detectTextDirection(content);
      if (detected && detected !== direction) {
        setDirection(detected);
        onUpdate({ direction: detected });
      }
    }
    isInitialMount.current = false;
  }, [content, autoDetect]);

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
    setAutoDetect(false); // Disable auto-detect when manually toggled
    onUpdate({ direction: newDirection, autoDetectDirection: false });
  }, [direction, onUpdate]);

  const toggleAutoDetect = useCallback(() => {
    const newAutoDetect = !autoDetect;
    setAutoDetect(newAutoDetect);
    onUpdate({ autoDetectDirection: newAutoDetect });
    
    // If enabling, detect current content direction
    if (newAutoDetect && content) {
      const detected = detectTextDirection(content);
      if (detected) {
        setDirection(detected);
        onUpdate({ direction: detected });
      }
    }
  }, [autoDetect, content, onUpdate]);

  const insertList = useCallback((ordered: boolean) => {
    applyFormat(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  }, [applyFormat]);

  // Apply Bidi support to existing content
  const applyBidiSupport = useCallback(() => {
    if (editorRef.current) {
      const processed = wrapWithBidiSupport(editorRef.current.innerHTML);
      editorRef.current.innerHTML = processed;
      handleContentChange(processed);
    }
  }, [handleContentChange]);

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

          {/* Auto-detect Direction Toggle */}
          <Button 
            variant={autoDetect ? 'secondary' : 'ghost'} 
            size="icon" 
            className="h-7 w-7"
            onClick={toggleAutoDetect}
            title={autoDetect ? 'الكشف التلقائي مفعّل' : 'تفعيل الكشف التلقائي للاتجاه'}
          >
            <Wand2 className="h-4 w-4" />
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
          style={{ 
            fontSize: `${fontSize}px`,
            textAlign: direction === 'rtl' ? 'right' : 'left',
            unicodeBidi: 'plaintext'
          }}
          className={cn(
            "w-full h-full min-h-[200px] outline-none",
            "text-foreground leading-relaxed",
            "[&:empty]:before:content-['ابدأ_الكتابة_هنا...'] [&:empty]:before:text-muted-foreground",
            direction === 'rtl' ? "text-right" : "text-left"
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
