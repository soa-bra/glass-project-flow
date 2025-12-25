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

export const SmartTextDoc: React.FC<SmartTextDocProps> = ({ data, onUpdate }) => {
  const [content, setContent] = useState(data.content || '');
  const [fontSize, setFontSize] = useState(data.fontSize || 14);
  const [direction, setDirection] = useState<'rtl' | 'ltr'>(data.direction || 'rtl');
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

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
  }, [onUpdate]);

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

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    const node = selection?.anchorNode;
    
    // Find if we're inside a list item
    const listItem = node?.nodeType === Node.TEXT_NODE 
      ? node.parentElement?.closest('li')
      : (node as Element)?.closest?.('li');
    
    if (e.key === 'Enter' && !e.shiftKey) {
      if (listItem) {
        // Check if current list item is empty - exit list
        const itemText = listItem.textContent?.trim() || '';
        if (itemText === '') {
          e.preventDefault();
          const list = listItem.closest('ul, ol');
          if (list) {
            // Remove the empty list item
            listItem.remove();
            // If list is now empty, remove it too
            if (list.children.length === 0) {
              list.remove();
            }
            // Insert a new paragraph after the list or at cursor
            document.execCommand('insertParagraph');
          }
          handleContentChange();
          return;
        }
        // Non-empty list item - let browser handle normally
        return;
      }
      
      // For regular text, insert a line break
      e.preventDefault();
      document.execCommand('insertLineBreak');
      handleContentChange();
      return;
    }
    
    if (e.key === 'Backspace' && listItem) {
      // Check if cursor is at the beginning of the list item
      const range = selection?.getRangeAt(0);
      if (range && range.startOffset === 0) {
        const isAtStart = range.startContainer === listItem || 
          (range.startContainer.nodeType === Node.TEXT_NODE && 
           range.startContainer === listItem.firstChild);
        
        if (isAtStart || range.startOffset === 0) {
          e.preventDefault();
          const list = listItem.closest('ul, ol');
          const itemContent = listItem.innerHTML;
          
          // Get previous sibling or parent context
          const prevItem = listItem.previousElementSibling;
          
          if (prevItem) {
            // Merge with previous item
            prevItem.innerHTML += itemContent;
            listItem.remove();
            // Move cursor to the merge point
            const sel = window.getSelection();
            if (sel && prevItem.lastChild) {
              const newRange = document.createRange();
              newRange.selectNodeContents(prevItem);
              newRange.collapse(false);
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
          } else if (list) {
            // First item - convert to paragraph
            listItem.remove();
            if (list.children.length === 0) {
              // Replace empty list with content
              const p = document.createElement('div');
              p.innerHTML = itemContent || '<br>';
              list.parentNode?.replaceChild(p, list);
              // Move cursor to the new element
              const sel = window.getSelection();
              if (sel) {
                const newRange = document.createRange();
                newRange.selectNodeContents(p);
                newRange.collapse(false);
                sel.removeAllRanges();
                sel.addRange(newRange);
              }
            } else {
              // Insert content before list
              const p = document.createElement('div');
              p.innerHTML = itemContent || '<br>';
              list.parentNode?.insertBefore(p, list);
            }
          }
          handleContentChange();
        }
      }
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
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          dir={direction}
          style={{ 
            fontSize: `${fontSize}px`,
            textAlign: direction === 'rtl' ? 'right' : 'left',
          }}
          className={cn(
            "w-full h-full min-h-[200px] outline-none",
            "text-foreground leading-relaxed whitespace-pre-wrap",
            "[&:empty]:before:content-['ابدأ_الكتابة_هنا...'] [&:empty]:before:text-muted-foreground [&:empty]:before:pointer-events-none",
            direction === 'rtl' ? "text-right" : "text-left",
            // List indentation styles
            "[&_ul]:pr-6 [&_ul]:mr-2 [&_ol]:pr-6 [&_ol]:mr-2",
            "[&_ul]:list-disc [&_ol]:list-decimal",
            "[&_li]:pr-2 [&_li]:my-1"
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