import React, { useState } from 'react';
import { SceneGraph } from '../../lib/canvas/utils/scene-graph';
import { ConnectionManager } from '../../lib/canvas/controllers/connection-manager';
import { useWF01Generator } from '../../hooks/useWF01Generator';
import { WF01Button } from './WF01Button';
import { WF01PreviewDialog } from './WF01PreviewDialog';

interface WF01IntegrationProps {
  sceneGraph: SceneGraph;
  connectionManager: ConnectionManager;
  boardId: string;
  className?: string;
}

export function WF01Integration({
  sceneGraph,
  connectionManager,
  boardId,
  className = ''
}: WF01IntegrationProps) {
  const [showPreview, setShowPreview] = useState(false);
  
  const {
    isGenerating,
    lastResult,
    generateProject,
    applyProjectStructure,
    validateCanvas,
    getCanvasInfo,
    clearResult
  } = useWF01Generator({
    sceneGraph,
    connectionManager,
    boardId
  });

  const handleGenerate = async () => {
    try {
      const result = await generateProject();
      if (result.success) {
        setShowPreview(true);
      }
    } catch (error) {
      console.error('WF-01 Generation failed:', error);
    }
  };

  const handleApply = async (projectStructure: any) => {
    const success = await applyProjectStructure(projectStructure);
    if (success) {
      clearResult();
      setShowPreview(false);
    }
    return success;
  };

  const handleQuickFix = (mappingId: string, fix: string) => {
    // TODO: Implement quick fixes
    console.log('Quick fix requested:', { mappingId, fix });
  };

  const canvasInfo = getCanvasInfo();
  const validation = validateCanvas();

  return (
    <div className={className}>
      <WF01Button
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        canvasInfo={canvasInfo}
        validation={validation}
      />

      {lastResult && (
        <WF01PreviewDialog
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          result={lastResult}
          onApply={handleApply}
          onQuickFix={handleQuickFix}
        />
      )}
    </div>
  );
}