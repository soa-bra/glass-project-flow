import React from 'react';
import { useWhiteboardStore } from '../../../store/whiteboard';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { shallow } from 'zustand/shallow';

const BottomToolbar: React.FC = () => {
  const { zoom, setZoom, occupants } = useWhiteboardStore((state) => ({
    zoom: state.zoom,
    setZoom: state.setZoom,
    occupants: state.occupants,
  }), shallow);
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.1, 5);
    setZoom(newZoom);
  };
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom * 0.9, 0.1);
    setZoom(newZoom);
  };
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 rounded-full shadow px-4 py-1 backdrop-blur-sm">
      <button
        onClick={handleZoomOut}
        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Zoom out"
      >
        <ZoomOut size={18} />
      </button>
      <span className="text-sm font-medium w-14 text-center select-none">
        {(zoom * 100).toFixed(0)}%
      </span>
      <button
        onClick={handleZoomIn}
        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Zoom in"
      >
        <ZoomIn size={18} />
      </button>
      <span className="w-px bg-gray-300 dark:bg-gray-600 mx-2" />
      <div className="flex items-center gap-1">
        {occupants.map((name) => (
          <div
            key={name}
            className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs uppercase"
            title={name}
          >
            {name.slice(0, 2)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomToolbar;