import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, Bold, Italic, Underline, AlignRight, AlignCenter, AlignLeft, 
  Sparkles, List, ListOrdered, Pilcrow
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

interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export const SmartTextDoc: React.FC<SmartTextDocProps> = ({ data, onUpdate }) => {
  const [content, setContent] = useState(data.content || '');
  const [currentFontSize, setCurrentFontSize] = useState(data.fontSize || 14);
  const [direction, setDirection] = useState<'rtl' | 'ltr'>(data.direction || 'rtl');
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
  });
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Detect active formats at current cursor position
  const detectActiveFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    });
  }, []);

  // Detect font size at current cursor position
  const detectCurrentFontSize = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    let node: Node | null = selection.anchorNode;
    if (!node) return;

    // Get the element to check computed style
    let element: HTMLElement | null = null;
    if (node.nodeType === Node.TEXT_NODE) {
      element = node.parentElement;
    } else {
      element = node as HTMLElement;
    }

    if (element && editorRef.current?.contains(element)) {
      const computedStyle = window.getComputedStyle(element);
      const fontSizePx = parseFloat(computedStyle.fontSize);
      const roundedSize = Math.round(fontSizePx);
      
      // Find closest matching font size from our options
      const closestSize = FONT_SIZES.reduce((prev, curr) => 
        Math.abs(curr - roundedSize) < Math.abs(prev - roundedSize) ? curr : prev
      );
      
      setCurrentFontSize(closestSize);
    }
  }, []);

  // Initialize content only once
  useEffect(() => {
    if (editorRef.current && !isInitialized.current && data.content) {
      editorRef.current.innerHTML = data.content;
      isInitialized.current = true;
    }
  }, [data.content]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onUpdate({ content: newContent });
    }
    detectCurrentFontSize();
  }, [onUpdate, detectCurrentFontSize]);

  const handleSelectionChange = useCallback(() => {
    detectCurrentFontSize();
    detectActiveFormats();
  }, [detectCurrentFontSize, detectActiveFormats]);

  const handleTitleChange = useCallback((title: string) => {
    onUpdate({ title });
  }, [onUpdate]);

  const applyFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  }, [handleContentChange]);

  const handleFontSizeChange = useCallback((size: string) => {
    const newSize = parseInt(size);
    setCurrentFontSize(newSize);
    
    // Apply font size to current selection or line
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // If there's a selection, apply to selected text
      if (!range.collapsed) {
        // Use execCommand with a temporary size, then replace with actual px
        document.execCommand('fontSize', false, '7');
        
        // Find all font elements with size 7 and replace with span with actual size
        if (editorRef.current) {
          const fontElements = editorRef.current.querySelectorAll('font[size="7"]');
          fontElements.forEach((font) => {
            const span = document.createElement('span');
            span.style.fontSize = `${newSize}px`;
            span.innerHTML = font.innerHTML;
            font.parentNode?.replaceChild(span, font);
          });
        }
      } else {
        // No selection - wrap the current line/block with the new size
        const node = selection.anchorNode;
        if (node) {
          // Find the parent block element
          let blockElement: HTMLElement | null = null;
          if (node.nodeType === Node.TEXT_NODE) {
            blockElement = node.parentElement;
          } else {
            blockElement = node as HTMLElement;
          }
          
          // Walk up to find the block-level parent within editor
          while (blockElement && blockElement !== editorRef.current) {
            const display = window.getComputedStyle(blockElement).display;
            if (display === 'block' || display === 'list-item' || blockElement.tagName === 'DIV' || blockElement.tagName === 'P' || blockElement.tagName === 'LI') {
              break;
            }
            blockElement = blockElement.parentElement;
          }
          
          if (blockElement && blockElement !== editorRef.current) {
            blockElement.style.fontSize = `${newSize}px`;
          }
        }
      }
      
      editorRef.current?.focus();
      handleContentChange();
    }
  }, [handleContentChange]);

  const toggleDirection = useCallback(() => {
    const newDirection = direction === 'rtl' ? 'ltr' : 'rtl';
    setDirection(newDirection);
    onUpdate({ direction: newDirection });
  }, [direction, onUpdate]);

  const insertList = useCallback((ordered: boolean) => {
    applyFormat(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  }, [applyFormat]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const selection = window.getSelection();
      const node = selection?.anchorNode;
      
      // Check if we're inside a list item
      const listItem = node?.parentElement?.closest('li');
      if (listItem) {
        // Let the browser handle list item creation naturally
        return;
      }
      
      // For regular text, insert a line break
      e.preventDefault();
      document.execCommand('insertLineBreak');
      handleContentChange();
    }
  }, [handleContentChange]);

  const getWordCount = useCallback(() => {
    if (!editorRef.current) return 0;
    const text = editorRef.current.innerText || '';
    return text.split(/\s+/).filter(Boolean).length;
  }, []);

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
          <Select value={currentFontSize.toString()} onValueChange={handleFontSizeChange}>
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
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-7 w-7", activeFormats.bold && "bg-accent text-accent-foreground")} 
            onClick={() => applyFormat('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-7 w-7", activeFormats.italic && "bg-accent text-accent-foreground")} 
            onClick={() => applyFormat('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-7 w-7", activeFormats.underline && "bg-accent text-accent-foreground")} 
            onClick={() => applyFormat('underline')}
          >
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
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          onClick={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          dir={direction}
          style={{ 
            textAlign: direction === 'rtl' ? 'right' : 'left',
          }}
          className={cn(
            "w-full h-full min-h-[200px] outline-none",
            "text-foreground leading-relaxed whitespace-pre-wrap text-sm",
            "[&:empty]:before:content-['ابدأ_الكتابة_هنا...'] [&:empty]:before:text-muted-foreground [&:empty]:before:pointer-events-none",
            direction === 'rtl' ? "text-right" : "text-left",
            // List alignment styles - bullets/numbers follow text alignment with padding
            "[&_ul]:list-inside [&_ol]:list-inside",
            "[&_ul]:ps-6 [&_ol]:ps-6",
            "[&_li]:my-1"
          )}
        />
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border bg-muted/30 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {getWordCount()} كلمة
        </p>
        <p className="text-xs text-muted-foreground">
          {data.format === 'rich' ? 'تنسيق غني' : data.format === 'markdown' ? 'Markdown' : 'نص عادي'}
        </p>
      </div>
    </div>
  );
};