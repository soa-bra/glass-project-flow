import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SmartElementCanvasIntegration } from '../lib/smart-elements/canvas-integration';

interface RealtimeSmartElementsProps {
  canvasIntegration: SmartElementCanvasIntegration;
  boardId: string;
  userId: string;
}

export function useRealtimeSmartElements({ 
  canvasIntegration, 
  boardId, 
  userId 
}: RealtimeSmartElementsProps) {
  const channelsRef = useRef<Map<string, any>>(new Map());
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (!boardId || !userId || !canvasIntegration) return;

    const setupRealtimeChannels = () => {
      // Thinking Board Channel
      const thinkingBoardChannel = supabase
        .channel(`thinking_board:${boardId}`)
        .on('broadcast', { event: 'thinking_board_update' }, (payload) => {
          console.log('Thinking Board update received:', payload);
          handleThinkingBoardUpdate(payload.payload);
        })
        .subscribe();

      // Kanban Board Channel
      const kanbanChannel = supabase
        .channel(`kanban_board:${boardId}`)
        .on('broadcast', { event: 'kanban_update' }, (payload) => {
          console.log('Kanban update received:', payload);
          handleKanbanUpdate(payload.payload);
        })
        .subscribe();

      // Voting Channel
      const votingChannel = supabase
        .channel(`voting_poll:${boardId}`)
        .on('broadcast', { event: 'voting_update' }, (payload) => {
          console.log('Voting update received:', payload);
          handleVotingUpdate(payload.payload);
        })
        .subscribe();

      // Brainstorming Channel
      const brainstormingChannel = supabase
        .channel(`brainstorming:${boardId}`)
        .on('broadcast', { event: 'brainstorming_update' }, (payload) => {
          console.log('Brainstorming update received:', payload);
          handleBrainstormingUpdate(payload.payload);
        })
        .subscribe();

      // Store channel references for cleanup
      channelsRef.current.set('thinking_board', thinkingBoardChannel);
      channelsRef.current.set('kanban_board', kanbanChannel);
      channelsRef.current.set('voting_poll', votingChannel);
      channelsRef.current.set('brainstorming', brainstormingChannel);

      isConnectedRef.current = true;
      console.log('🔗 Realtime channels setup for smart elements');
    };

    const handleThinkingBoardUpdate = (payload: any) => {
      const { boardId: elementId, elements, tags, participants } = payload;
      
      // Update the smart element with new data
      canvasIntegration.updateSmartElementSettings(elementId, {
        elements: elements || [],
        tags: tags || [],
        participants: participants || [],
        lastModified: Date.now()
      });
    };

    const handleKanbanUpdate = (payload: any) => {
      const { boardId: elementId, columns } = payload;
      
      // Update kanban board columns
      canvasIntegration.updateSmartElementSettings(elementId, {
        columns: columns || [],
        lastModified: Date.now()
      });

      // Emit custom event for smooth DnD animations
      window.dispatchEvent(new CustomEvent('kanban-update', {
        detail: { elementId, columns }
      }));
    };

    const handleVotingUpdate = (payload: any) => {
      const { pollId: elementId, options, participants } = payload;
      
      // Update voting options with real-time results
      canvasIntegration.updateSmartElementSettings(elementId, {
        options: options || [],
        participants: participants || [],
        lastModified: Date.now()
      });

      // Emit custom event for live results animation
      window.dispatchEvent(new CustomEvent('voting-update', {
        detail: { elementId, options }
      }));
    };

    const handleBrainstormingUpdate = (payload: any) => {
      const { sessionId: elementId, ideas, mode, aiSuggestions } = payload;
      
      // Update brainstorming session data
      const updates: any = { lastModified: Date.now() };
      if (ideas) updates.ideas = ideas;
      if (mode) updates.mode = mode;
      if (aiSuggestions) updates.aiSuggestions = aiSuggestions;

      canvasIntegration.updateSmartElementSettings(elementId, updates);

      // Emit custom event for mode switching animations
      if (mode) {
        window.dispatchEvent(new CustomEvent('brainstorming-mode-change', {
          detail: { elementId, mode }
        }));
      }
    };

    setupRealtimeChannels();

    // Cleanup function
    return () => {
      channelsRef.current.forEach((channel) => {
        supabase.removeChannel(channel);
      });
      channelsRef.current.clear();
      isConnectedRef.current = false;
      console.log('🔌 Disconnected realtime channels for smart elements');
    };
  }, [canvasIntegration, boardId, userId]);

  // Broadcast functions for sending updates
  const broadcastThinkingBoardUpdate = async (elementId: string, updates: any) => {
    const channel = channelsRef.current.get('thinking_board');
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'thinking_board_update',
        payload: { boardId: elementId, userId, timestamp: Date.now(), ...updates }
      });
    }
  };

  const broadcastKanbanUpdate = async (elementId: string, updates: any) => {
    const channel = channelsRef.current.get('kanban_board');
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'kanban_update',
        payload: { boardId: elementId, userId, timestamp: Date.now(), ...updates }
      });
    }
  };

  const broadcastVotingUpdate = async (elementId: string, updates: any) => {
    const channel = channelsRef.current.get('voting_poll');
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'voting_update',
        payload: { pollId: elementId, userId, timestamp: Date.now(), ...updates }
      });
    }
  };

  const broadcastBrainstormingUpdate = async (elementId: string, updates: any) => {
    const channel = channelsRef.current.get('brainstorming');
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'brainstorming_update',
        payload: { sessionId: elementId, userId, timestamp: Date.now(), ...updates }
      });
    }
  };

  return {
    isConnected: isConnectedRef.current,
    broadcastThinkingBoardUpdate,
    broadcastKanbanUpdate,
    broadcastVotingUpdate,
    broadcastBrainstormingUpdate
  };
}