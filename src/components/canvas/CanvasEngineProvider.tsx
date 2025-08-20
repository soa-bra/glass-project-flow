import React, { createContext, useContext } from 'react';
import { useCanvasEngine, UseCanvasEngineReturn } from '@/hooks/canvas/useCanvasEngine';
import { CanvasEngineOptions } from '@/lib/canvas/engine/canvas-engine';

interface CanvasEngineProviderProps {
  children: React.ReactNode;
  options?: CanvasEngineOptions;
}

const CanvasEngineContext = createContext<UseCanvasEngineReturn | null>(null);

export const CanvasEngineProvider: React.FC<CanvasEngineProviderProps> = ({
  children,
  options = {}
}) => {
  const canvasEngine = useCanvasEngine(options);

  return (
    <CanvasEngineContext.Provider value={canvasEngine}>
      {children}
    </CanvasEngineContext.Provider>
  );
};

export const useCanvasEngineContext = (): UseCanvasEngineReturn => {
  const context = useContext(CanvasEngineContext);
  if (!context) {
    throw new Error('useCanvasEngineContext must be used within a CanvasEngineProvider');
  }
  return context;
};