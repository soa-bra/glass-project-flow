import React, { useEffect, useRef, useState, useCallback } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/stores/canvasStore";
import { sanitizeHTML } from "@/utils/sanitize";
import { useTextEditorRegistration } from "./TextEditorContext";
import { isTextEmpty } from "@/utils/textDirection";
import { useTextHistory } from "./hooks/useTextHistory";

interface TextEditorProps {
  element: CanvasElement;
  onUpdate: (content: string) => void;
  onClose: () => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ element, onUpdate, onClose, onDoubleClick }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { startTyping, stopTyping, updateElement, deleteElement } = useCanvasStore();

  const [isEmpty, setIsEmpty] = useState(!element.content || element.content.trim() === "");

  const originalContentRef = useRef<string>(element.content || "");

  const { pushState, undo, redo } = useTextHistory({
    initialContent: element.content || "",
    maxHistorySize: 50,
  });

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = sanitizeHTML(element.content || "");
      const textContent = editorRef.current.textContent?.trim() || "";
      setIsEmpty(textContent.length === 0);
    }
  }, []);

  useEffect(() => {
    startTyping();

    if (editorRef.current) {
      setTimeout(() => {
        const editor = editorRef.current;
        if (!editor) return;

        editor.focus();

        if (editor.childNodes.length === 0) {
          editor.appendChild(document.createTextNode(""));
        }

        const range = document.createRange();
        const selection = window.getSelection();

        range.selectNodeContents(editor);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }, 50);
    }

    return () => stopTyping();
  }, [startTyping, stopTyping]);

  const applyFormat = useCallback(
    (command: string, value?: string) => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        editorRef.current.focus();
        return;
      }

      const range = selection.getRangeAt(0);
      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        editorRef.current.focus();
        return;
      }

      editorRef.current.focus();
      document.execCommand(command, false, value);

      const newContent = sanitizeHTML(editorRef.current.innerHTML);
      onUpdate(newContent);
    },
    [onUpdate],
  );

  const toggleList = useCallback(
    (listType: "ul" | "ol") => {
      if (!editorRef.current) return;

      editorRef.current.focus();

      const command = listType === "ul" ? "insertUnorderedList" : "insertOrderedList";
      document.execCommand(command, false);

      onUpdate(sanitizeHTML(editorRef.current.innerHTML));
    },
    [onUpdate],
  );

  const removeFormatting = useCallback(() => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand("removeFormat", false);

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const node = selection.anchorNode;
      const parentList = node?.parentElement?.closest("ul, ol");

      if (parentList) {
        const listType = parentList.tagName.toLowerCase();
        if (listType === "ul") {
          document.execCommand("insertUnorderedList", false);
        } else if (listType === "ol") {
          document.execCommand("insertOrderedList", false);
        }
      }
    }

    onUpdate(sanitizeHTML(editorRef.current.innerHTML));
  }, [onUpdate]);

  const { preventClose, allowClose, canClose } = useTextEditorRegistration({
    elementId: element.id,
    editorRef: editorRef as React.RefObject<HTMLDivElement>,
    applyFormat,
    toggleList,
    removeFormatting,
  });

  const handleDirectionChange = useCallback(
    (direction: "rtl" | "ltr") => {
      if (editorRef.current) {
        editorRef.current.focus();
      }

      const newAlign = direction === "rtl" ? "right" : "left";
      updateElement(element.id, {
        style: {
          ...element.style,
          direction,
          textAlign: newAlign,
        },
      });
    },
    [element.id, element.style, updateElement],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && element.data?.textType === "line") {
      const selection = window.getSelection();
      const isInsideList = selection?.anchorNode?.parentElement?.closest("ul, ol");

      if (isInsideList) {
        return;
      }

      e.preventDefault();
      if (editorRef.current) {
        onUpdate(sanitizeHTML(editorRef.current.innerHTML));
      }
      stopTyping();
      onClose();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();

      if (editorRef.current) {
        editorRef.current.innerHTML = sanitizeHTML(originalContentRef.current);
        onUpdate(originalContentRef.current);
      }

      if (isTextEmpty(originalContentRef.current)) {
        deleteElement(element.id);
      }

      stopTyping();
      onClose();
      return;
    }

    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === "z") {
      e.preventDefault();
      const previousContent = undo();
      if (previousContent !== null && editorRef.current) {
        editorRef.current.innerHTML = sanitizeHTML(previousContent);
        onUpdate(previousContent);
      }
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") {
      e.preventDefault();
      const nextContent = redo();
      if (nextContent !== null && editorRef.current) {
        editorRef.current.innerHTML = sanitizeHTML(nextContent);
        onUpdate(nextContent);
      }
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "y") {
      e.preventDefault();
      const nextContent = redo();
      if (nextContent !== null && editorRef.current) {
        editorRef.current.innerHTML = sanitizeHTML(nextContent);
        onUpdate(nextContent);
      }
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "b") {
      e.preventDefault();
      applyFormat("bold");
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "i") {
      e.preventDefault();
      applyFormat("italic");
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "u") {
      e.preventDefault();
      applyFormat("underline");
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "r") {
      e.preventDefault();
      handleDirectionChange("rtl");
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      handleDirectionChange("ltr");
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "x") {
      e.preventDefault();
      const currentDir = element.style?.direction || "rtl";
      handleDirectionChange(currentDir === "rtl" ? "ltr" : "rtl");
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "a") {
      e.preventDefault();
      const range = document.createRange();
      const selection = window.getSelection();
      if (editorRef.current) {
        range.selectNodeContents(editorRef.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const finalizeCloseIfNeeded = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement | null;
    const isStillInsideEditor = !!activeElement && !!wrapperRef.current?.contains(activeElement);
    const isClickingToolbar = !!activeElement?.closest("[data-floating-toolbar]");
    const isClickingFormatButton = !!activeElement?.closest("[data-format-button]");

    if (!canClose || isStillInsideEditor || isClickingToolbar || isClickingFormatButton) {
      return;
    }

    if (editorRef.current) {
      onUpdate(sanitizeHTML(editorRef.current.innerHTML));
    }

    stopTyping();
    onClose();
  }, [canClose, onClose, onUpdate, stopTyping]);

  useEffect(() => {
    if (editorRef.current && element.style) {
      const editor = editorRef.current;

      Object.assign(editor.style, {
        fontFamily: element.style.fontFamily || "IBM Plex Sans Arabic",
        fontSize: `${element.style.fontSize || 16}px`,
        fontWeight: element.style.fontWeight || "normal",
        fontStyle: element.style.fontStyle || "normal",
        textDecoration: element.style.textDecoration || "none",
        color: element.style.color || "#0B0F12",
        textAlign: element.style.textAlign || "right",
        direction: element.style.direction || "rtl",
      });

      editor.setAttribute("dir", element.style.direction || "rtl");
    }
  }, [
    element.style?.fontFamily,
    element.style?.fontSize,
    element.style?.fontWeight,
    element.style?.fontStyle,
    element.style?.textDecoration,
    element.style?.color,
    element.style?.textAlign,
    element.style?.direction,
  ]);

  const hasLists = element.content?.includes("<ul>") || element.content?.includes("<ol>");

  return (
    <div
      ref={wrapperRef}
      data-text-editor="true"
      className="flex flex-col relative"
      onDoubleClick={onDoubleClick}
      onMouseEnter={preventClose}
      onMouseLeave={allowClose}
      onFocusCapture={preventClose}
      onBlurCapture={allowClose}
      onMouseDownCapture={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        height: "100%",
        justifyContent:
          element.style?.alignItems === "center"
            ? "center"
            : element.style?.alignItems === "flex-end"
              ? "flex-end"
              : "flex-start",
      }}
    >
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        dir={element.style?.direction || "rtl"}
        data-placeholder="اكتب شيئاً..."
        onInput={(e) => {
          const newContent = sanitizeHTML(e.currentTarget.innerHTML || "");
          onUpdate(newContent);
          pushState(newContent);

          const textContent = e.currentTarget.textContent?.trim() || "";
          setIsEmpty(textContent.length === 0);

          if (element.data?.textType === "box" && editorRef.current) {
            const scrollHeight = editorRef.current.scrollHeight;
            const currentHeight = element.size.height;

            if (scrollHeight > currentHeight - 20) {
              updateElement(element.id, {
                size: {
                  ...element.size,
                  height: scrollHeight + 24,
                },
              });
            }
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          requestAnimationFrame(finalizeCloseIfNeeded);
        }}
        className={isEmpty ? "empty-editor" : ""}
        style={{
          fontFamily: element.style?.fontFamily || "IBM Plex Sans Arabic",
          fontSize: `${element.style?.fontSize || 14}px`,
          fontWeight: element.style?.fontWeight || "normal",
          fontStyle: element.style?.fontStyle || "normal",
          textDecoration: element.style?.textDecoration || "none",
          color: element.style?.color || "#0B0F12",
          textAlign: (element.style?.textAlign as any) || "right",
          direction: (element.style?.direction as any) || "rtl",
          unicodeBidi: "plaintext",
          WebkitUserModify: "read-write-plaintext-only" as any,
          width: "100%",
          outline: "none",
          padding: "0",
          minHeight: "1em",
          whiteSpace: hasLists || element.data?.textType === "box" ? "pre-wrap" : "nowrap",
          wordWrap: hasLists || element.data?.textType === "box" ? "break-word" : "normal",
          overflow: element.data?.textType === "box" ? "auto" : "visible",
        }}
      />
    </div>
  );
};
