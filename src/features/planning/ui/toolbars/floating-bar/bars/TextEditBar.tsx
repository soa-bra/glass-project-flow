/**
 * TextEditBar - شريط تحرير النص
 */

import React, { useCallback } from "react";
import { ToolbarShell } from "../components/ToolbarShell";
import { TextActions } from "../groups/TextActions";
import { CommonActions } from "../groups/CommonActions";
import { useCommonActions } from "../hooks/useCommonActions";
import { useSelectionMeta } from "../hooks/useSelectionMeta";


export const TextEditBar: React.FC = () => {
  const actions = useCommonActions();
  const meta = useSelectionMeta();
  const { firstElement, areElementsLocked, areElementsVisible, selectionCount, selectedElements } = meta;

  const style = firstElement?.style || {};

  const activeFormats: Record<string, boolean> = {
    bold: document.queryCommandState?.("bold") ?? false,
    italic: document.queryCommandState?.("italic") ?? false,
    underline: document.queryCommandState?.("underline") ?? false,
    strikeThrough: document.queryCommandState?.("strikeThrough") ?? false,
    insertUnorderedList: document.queryCommandState?.("insertUnorderedList") ?? false,
    insertOrderedList: document.queryCommandState?.("insertOrderedList") ?? false,
  };

  const makeStyleUpdater = useCallback(
    (prop: string) => (value: any) => {
      if (firstElement) actions.updateElement(firstElement.id, { style: { ...firstElement.style, [prop]: value } });
    },
    [firstElement, actions.updateElement]
  );

  return (
    <ToolbarShell activeElements={selectedElements}>
      <TextActions
        currentFontFamily={style.fontFamily || "IBM Plex Sans Arabic"}
        currentFontSize={style.fontSize ?? 14}
        currentFontWeight={style.fontWeight || "400"}
        currentColor={style.color || "#000000"}
        currentAlign={(style.textAlign as any) || "right"}
        currentVerticalAlign={(style.alignItems as any) || "flex-start"}
        currentDirection={(style.direction as any) || "rtl"}
        activeFormats={activeFormats}
        onFontFamilyChange={makeStyleUpdater("fontFamily")}
        onFontSizeChange={makeStyleUpdater("fontSize")}
        onFontWeightChange={makeStyleUpdater("fontWeight")}
        onColorChange={makeStyleUpdater("color")}
        onTextFormat={(format) => document.execCommand(format, false)}
        onToggleList={(type) => document.execCommand(type === "ul" ? "insertUnorderedList" : "insertOrderedList", false)}
        onTextDirection={makeStyleUpdater("direction")}
        onTextAlign={makeStyleUpdater("textAlign")}
        onVerticalAlign={makeStyleUpdater("alignItems")}
        onClearFormatting={() => document.execCommand("removeFormat", false)}
        onAddLink={() => {}}
      />
      <CommonActions
        areElementsVisible={areElementsVisible}
        areElementsLocked={areElementsLocked}
        clipboardLength={actions.clipboard.length}
        selectedCount={selectionCount}
        layers={actions.layersList}
        isAILoading={actions.isAILoading}
        isTransforming={actions.isTransforming}
        onDuplicate={actions.handleDuplicate}
        onToggleVisibility={() => actions.handleToggleVisibility(areElementsVisible)}
        onToggleLock={() => actions.handleToggleLock(areElementsLocked)}
        onComment={actions.handleComment}
        onDelete={actions.handleDelete}
        onCopy={actions.handleCopy}
        onCut={actions.handleCut}
        onPaste={actions.handlePaste}
        onAddText={actions.handleAddText}
        onChangeLayer={actions.handleChangeLayer}
        onBringToFront={actions.handleBringToFront}
        onBringForward={actions.handleBringForward}
        onSendBackward={actions.handleSendBackward}
        onSendToBack={actions.handleSendToBack}
        onQuickGenerate={actions.handleQuickGenerate}
        onTransform={actions.handleTransform}
        onCustomTransform={actions.handleCustomTransform}
      />
    </ToolbarShell>
  );
};

export default TextEditBar;
