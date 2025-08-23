import React, { useMemo } from 'react';
import TopToolbar from './TopToolbar';
import BottomToolbar from './BottomToolbar';
import CollaborationPanel from './CollaborationPanel';
import SmartAssistantPanel from './SmartAssistantPanel';
import SelectionPanel from './SelectionPanel';
import SmartPenPanel from './SmartPenPanel';
import ZoomPanel from './ZoomPanel';
import PanPanel from './PanPanel';
import FileUploadPanel from './FileUploadPanel';
import CommentPanel from './CommentPanel';
import TextPanel from './TextPanel';
import ShapesPanel from './ShapesPanel';
import SmartElementsPanel from './SmartElementsPanel';
import RootLinkPanel from './RootLinkPanel';
import { ToolProvider, useTooling } from './ToolState';
import type { ToolId } from './panels';

const panelMap: Record<ToolId, React.ComponentType | null> = {
  selection_tool: SelectionPanel,
  smart_pen: SmartPenPanel,
  zoom_tool: ZoomPanel,
  pan_tool: PanPanel,
  file_uploader: FileUploadPanel,
  comment_tool: CommentPanel,
  text_tool: TextPanel,
  shapes_tool: ShapesPanel,
  smart_element_tool: SmartElementsPanel,
  root_link_tool: RootLinkPanel,
};

function CanvasSurface() {
  const { grid } = useTooling();
  const style = useMemo(() => {
    if (!grid.visible) return { background: '#fff' };
    const c = '#e5e7eb';
    const s = grid.size;
    switch (grid.type) {
      case 'dots':
        return {
          backgroundSize: `${s}px ${s}px`,
          backgroundImage: `radial-gradient(${c} 1px, transparent 1px)`
        } as React.CSSProperties;
      case 'grid':
        return {
          backgroundSize: `${s}px ${s}px`,
          backgroundImage:
            `linear-gradient(to right, ${c} 1px, transparent 1px),` +
            `linear-gradient(to bottom, ${c} 1px, transparent 1px)`
        } as React.CSSProperties;
      case 'isometric':
        return {
          backgroundSize: `${s}px ${s}px`,
          backgroundImage:
            `linear-gradient(60deg, ${c} 1px, transparent 1px),` +
            `linear-gradient(120deg, ${c} 1px, transparent 1px),` +
            `linear-gradient(0deg, ${c} 1px, transparent 1px)`
        } as React.CSSProperties;
      case 'hex':
        const h = Math.sqrt(3) * s;
        return {
          backgroundSize: `${h}px ${1.5 * s}px`,
          backgroundImage:
            `linear-gradient(60deg, ${c} 1px, transparent 1px),` +
            `linear-gradient(-60deg, ${c} 1px, transparent 1px),` +
            `linear-gradient(0deg, ${c} 1px, transparent 1px)`
        } as React.CSSProperties;
      default:
        return { background: '#fff' };
    }
  }, [grid]);

  return <div style={{ position: 'absolute', inset: 0, ...style }} />;
}

function InspectorPanels() {
  const { activeTool } = useTooling();
  const Panel = panelMap[activeTool];
  return (
    <div
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        bottom: 8,
        width: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          background: '#ffffffd9',
          backdropFilter: 'blur(8px)',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 12,
          pointerEvents: 'auto'
        }}
      >
        {Panel && <Panel />}
      </div>
      <div style={{ pointerEvents: 'auto' }}>
        <CollaborationPanel />
      </div>
      <div style={{ pointerEvents: 'auto' }}>
        <SmartAssistantPanel />
      </div>
    </div>
  );
}

export default function PlanningPanel() {
  const undo = () => console.log('undo');
  const redo = () => console.log('redo');
  return (
    <ToolProvider>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <CanvasSurface />
        <TopToolbar
          canUndo={false}
          canRedo={false}
          undo={undo}
          redo={redo}
          onNew={() => console.log('new')}
          onSave={() => console.log('save')}
          onExport={() => console.log('export')}
          onOpen={() => console.log('open')}
          onDuplicate={() => console.log('duplicate')}
          onGenerateProject={() => console.log('ai')}
        />
        <BottomToolbar />
        <InspectorPanels />
      </div>
    </ToolProvider>
  );
}

