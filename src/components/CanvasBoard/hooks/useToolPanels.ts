import { useState, useCallback } from 'react';

export interface PanelConfig {
  isOpen: boolean;
  position: { x: number; y: number };
  tool: string;
}

interface ToolPanelsState {
  [key: string]: PanelConfig;
}

export const useToolPanels = () => {
  const [panels, setPanels] = useState<ToolPanelsState>({});
  
  const openPanel = useCallback((tool: string, position?: { x: number; y: number }) => {
    setPanels(prev => ({
      ...prev,
      [tool]: {
        isOpen: true,
        position: position || { x: 100, y: 100 },
        tool
      }
    }));
  }, []);

  const closePanel = useCallback((tool: string) => {
    setPanels(prev => ({
      ...prev,
      [tool]: {
        ...prev[tool],
        isOpen: false
      }
    }));
  }, []);

  const togglePanel = useCallback((tool: string, position?: { x: number; y: number }) => {
    setPanels(prev => {
      const currentPanel = prev[tool];
      if (currentPanel?.isOpen) {
        return {
          ...prev,
          [tool]: {
            ...currentPanel,
            isOpen: false
          }
        };
      } else {
        return {
          ...prev,
          [tool]: {
            isOpen: true,
            position: position || currentPanel?.position || { x: 100, y: 100 },
            tool
          }
        };
      }
    });
  }, []);

  const movePanel = useCallback((tool: string, position: { x: number; y: number }) => {
    setPanels(prev => ({
      ...prev,
      [tool]: {
        ...prev[tool],
        position
      }
    }));
  }, []);

  const closeAllPanels = useCallback(() => {
    setPanels(prev => {
      const newPanels = { ...prev };
      Object.keys(newPanels).forEach(key => {
        newPanels[key] = {
          ...newPanels[key],
          isOpen: false
        };
      });
      return newPanels;
    });
  }, []);

  const getPanelConfig = useCallback((tool: string): PanelConfig | null => {
    return panels[tool] || null;
  }, [panels]);

  return {
    panels,
    openPanel,
    closePanel,
    togglePanel,
    movePanel,
    closeAllPanels,
    getPanelConfig
  };
};