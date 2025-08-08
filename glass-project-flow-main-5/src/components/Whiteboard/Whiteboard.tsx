import React from 'react';
import InfiniteCanvas from './canvas/InfiniteCanvas';
import TopToolbar from './toolbars/TopToolbar';
import BottomToolbar from './toolbars/BottomToolbar';
import SmartAssistantPanel from './panels/SmartAssistantPanel';
import LayersPanel from './panels/LayersPanel';
import AppearancePanel from './panels/AppearancePanel';
import CollaborationPanel from './panels/CollaborationPanel';
import { useWhiteboardStore } from '../../store/whiteboard';

const Whiteboard: React.FC = () => {
  const { openPanels, theme } = useWhiteboardStore((state) => ({
    openPanels: state.openPanels,
    theme: state.theme,
  }));
  return (
    <div
      className={`relative flex flex-col h-full w-full overflow-hidden ${
        theme === 'dark' ? 'dark' : ''
      }`}
    >
      {openPanels.assistant && (
        <div className="absolute inset-y-0 left-0 z-40 w-72 max-w-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          <SmartAssistantPanel />
        </div>
      )}
      {openPanels.layers && (
        <div className="absolute inset-y-0 left-0 z-30 w-60 max-w-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg ml-72">
          <LayersPanel />
        </div>
      )}
      {openPanels.appearance && (
        <div className="absolute inset-y-0 left-0 z-20 w-60 max-w-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg ml-[20rem]">
          <AppearancePanel />
        </div>
      )}
      {openPanels.collaboration && (
        <div className="absolute inset-y-0 left-0 z-10 w-60 max-w-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg ml-[25rem]">
          <CollaborationPanel />
        </div>
      )}
      <div className="flex-1 relative">
        <TopToolbar />
        <InfiniteCanvas />
        <BottomToolbar />
      </div>
    </div>
  );
};

export default Whiteboard;