/**
 * MindmapBar - شريط الخريطة الذهنية
 */

import React from "react";
import { Separator } from "@/components/ui/separator";
import { ToolbarShell } from "../components/ToolbarShell";
import { MindmapActions } from "../groups/MindmapActions";
import { CommonActions } from "../groups/CommonActions";
import { useCommonActions } from "../hooks/useCommonActions";
import { useSelectionMeta } from "../hooks/useSelectionMeta";

export const MindmapBar: React.FC = () => {
  const actions = useCommonActions();
  const meta = useSelectionMeta();
  const {
    areElementsLocked,
    areElementsVisible,
    selectionCount,
    selectedElements,
    mindmapTreeElements,
  } = meta;

  return (
    <ToolbarShell activeElements={selectedElements}>
      <MindmapActions
        selectedNodeIds={actions.selectedElementIds}
        elements={actions.elements}
        treeElements={mindmapTreeElements}
        onUpdateElement={actions.handleUpdateElement}
        onDeleteElements={actions.handleDeleteElements}
        onAddElement={actions.handleAddElement}
      />
      <Separator orientation="vertical" className="h-6 mx-1" />
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

export default MindmapBar;
