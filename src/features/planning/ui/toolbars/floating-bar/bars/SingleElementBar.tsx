/**
 * SingleElementBar - شريط تحديد عنصر واحد
 */

import React, { useCallback } from "react";
import { ToolbarShell } from "../components/ToolbarShell";
import { ElementActions } from "../groups/ElementActions";
import { CommonActions } from "../groups/CommonActions";
import { useCommonActions } from "../hooks/useCommonActions";
import { useSelectionMeta } from "../hooks/useSelectionMeta";

export const SingleElementBar: React.FC = () => {
  const actions = useCommonActions();
  const meta = useSelectionMeta();
  const { firstElement, areElementsLocked, areElementsVisible, selectionCount, selectedElements } = meta;

  const style = firstElement?.style || {};

  const handleBgColorChange = useCallback(
    (color: string) => {
      if (firstElement) actions.updateElement(firstElement.id, { style: { ...firstElement.style, backgroundColor: color } });
    },
    [firstElement, actions.updateElement]
  );

  const handleStrokeColorChange = useCallback(
    (color: string) => {
      if (firstElement) actions.updateElement(firstElement.id, { style: { ...firstElement.style, borderColor: color } });
    },
    [firstElement, actions.updateElement]
  );

  const handleOpacityChange = useCallback(
    (value: number[]) => {
      if (firstElement) actions.updateElement(firstElement.id, { style: { ...firstElement.style, opacity: value[0] / 100 } });
    },
    [firstElement, actions.updateElement]
  );

  const handleStrokeWidthChange = useCallback(
    (value: number[]) => {
      if (firstElement) actions.updateElement(firstElement.id, { style: { ...firstElement.style, borderWidth: value[0] } });
    },
    [firstElement, actions.updateElement]
  );

  if (!firstElement) return null;

  return (
    <ToolbarShell activeElements={selectedElements}>
      <ElementActions
        currentBg={style.backgroundColor || "#ffffff"}
        currentStroke={style.borderColor || "#000000"}
        currentOpacity={(style.opacity ?? 1) * 100}
        currentStrokeWidth={style.borderWidth ?? 1}
        onBgColorChange={handleBgColorChange}
        onStrokeColorChange={handleStrokeColorChange}
        onOpacityChange={handleOpacityChange}
        onStrokeWidthChange={handleStrokeWidthChange}
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

export default SingleElementBar;
