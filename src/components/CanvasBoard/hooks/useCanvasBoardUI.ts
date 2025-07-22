/**
 * @fileoverview Canvas Board UI state management hook
 * @author AI Assistant
 * @version 1.0.0
 */

import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/canvas';
import { createNewChatMessage } from '../data/mockData';

interface PanelVisibility {
  smartAssistant: boolean;
  layers: boolean;
  appearance: boolean;
  collaboration: boolean;
  tools: boolean;
}

export const useCanvasBoardUI = () => {
  const [showPanels, setShowPanels] = useState<PanelVisibility>({
    smartAssistant: true,
    layers: true,
    appearance: true,
    collaboration: true,
    tools: true
  });

  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedSmartElement, setSelectedSmartElement] = useState('');
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });

  const togglePanel = useCallback((panelName: keyof PanelVisibility) => {
    setShowPanels(prev => ({
      ...prev,
      [panelName]: !prev[panelName]
    }));
  }, []);

  const handleSendMessage = useCallback((message: string, addChatMessage: (message: ChatMessage) => void) => {
    const newMessage = createNewChatMessage(message);
    addChatMessage(newMessage);
  }, []);

  const handleInviteParticipant = useCallback(() => {
    // TODO: Implement participant invitation logic
    console.log('Inviting participant...');
  }, []);

  return {
    showPanels,
    selectedTool,
    selectedSmartElement,
    canvasPosition,
    setSelectedTool,
    setSelectedSmartElement,
    setCanvasPosition,
    togglePanel,
    handleSendMessage,
    handleInviteParticipant
  };
};