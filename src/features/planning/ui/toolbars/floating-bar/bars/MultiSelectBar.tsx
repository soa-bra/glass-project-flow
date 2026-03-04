/**
 * MultiSelectBar - شريط تحديد عناصر متعددة
 */

import React from "react";
import { ToolbarShell } from "../components/ToolbarShell";
import { MultipleActions } from "../groups/MultipleActions";
import { CommonActions } from "../groups/CommonActions";
import { useCommonActions } from "../hooks/useCommonActions";
import { useSelectionMeta } from "../hooks/useSelectionMeta";
import { useLayoutOperations } from "../hooks/useLayoutOperations";
import { toast } from "sonner";

export const MultiSelectBar: React.FC = () => {
  const actions = useCommonActions();
  const meta = useSelectionMeta();
  const layoutOps = useLayoutOperations();
  const { areElementsGrouped, areElementsLocked, areElementsVisible, selectionCount, selectedElements } = meta;

  const handleToggleGroup = () => toast.info("سيتم إضافة ميزة التجميع قريباً");

  return (
    <ToolbarShell activeElements={selectedElements}>
      <MultipleActions
        selectionCount={selectionCount}
        areElementsGrouped={areElementsGrouped}
        onHorizontalAlign={(align) => layoutOps.alignHorizontally(align)}
        onVerticalAlignMultiple={(align) => layoutOps.alignVertically(align)}
        onToggleGroup={handleToggleGroup}
        onCreateFrame={actions.handleCreateFrame}
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

export default MultiSelectBar;
