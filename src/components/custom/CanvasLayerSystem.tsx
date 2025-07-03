import React from 'react';

interface CanvasLayerSystemProps {
  projectId: string;
  userId: string;
  selectedTool: string;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  layers: any[];
  setLayers: (layers: any[]) => void;
}

export const CanvasLayerSystem: React.FC<CanvasLayerSystemProps> = ({
  projectId,
  userId,
  selectedTool,
  selectedElementId,
  onSelectElement,
  layers,
  setLayers
}) => {
  return (
    <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-2xl mb-2">🎨</div>
          <div className="text-lg font-medium">لوحة التخطيط التشاركي</div>
          <div className="text-sm mt-2">الأداة المحددة: {selectedTool}</div>
        </div>
      </div>
    </div>
  );
};