import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { UserPresence, LiveCursor, ChatMessage, BoardChange, CollaborationState } from '../types/collaboration.types';

interface CollaborationStore extends CollaborationState {
  // Actions
  joinRoom: (roomId: string, userId: string, userInfo: any) => Promise<void>;
  leaveRoom: () => void;
  updateUserPresence: (presence: Partial<UserPresence>) => void;
  updateLiveCursor: (cursor: Omit<LiveCursor, 'userId' | 'timestamp'>) => void;
  sendMessage: (content: string) => void;
  sendBoardUpdate: (elementId: string, updates: any) => void;
  setVoiceChatActive: (active: boolean) => void;
  setScreenSharingActive: (active: boolean) => void;
}

const initialState: CollaborationState = {
  roomId: null,
  currentUserId: null,
  connectedUsers: new Map(),
  liveCursors: new Map(),
  chatMessages: [],
  isVoiceChatActive: false,
  isScreenSharingActive: false,
  pendingChanges: [],
  lastSyncTimestamp: Date.now()
};

export const useCollaborationStore = create<CollaborationStore>((set, get) => {
  let channel: RealtimeChannel | null = null;
  let presenceUpdateInterval: NodeJS.Timeout | null = null;

  return {
    // Initial state
    ...initialState,

    // Actions
    joinRoom: async (roomId: string, userId: string, userInfo: any) => {
      // Leave existing room if any
      if (channel) {
        await channel.unsubscribe();
      }

      // Create new channel
      channel = supabase.channel(`planning_board_${roomId}`, {
        config: {
          presence: {
            key: userId
          }
        }
      });

      // Set up presence tracking
      channel
        .on('presence', { event: 'sync' }, () => {
          const presenceState = channel!.presenceState();
          const connectedUsers = new Map<string, UserPresence>();
          
          Object.entries(presenceState).forEach(([key, presence]) => {
            if (Array.isArray(presence) && presence[0]) {
              const userPresence = presence[0] as any;
              if (userPresence.userId) {
                connectedUsers.set(key, userPresence);
              }
            }
          });

          set({ connectedUsers });
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
          const { liveCursors } = get();
          liveCursors.delete(key);
          set({ liveCursors: new Map(liveCursors) });
        });

      // Set up real-time messaging
      channel
        .on('broadcast', { event: 'cursor_update' }, (payload) => {
          const { liveCursors } = get();
          liveCursors.set(payload.userId, payload.cursor);
          set({ liveCursors: new Map(liveCursors) });
        })
        .on('broadcast', { event: 'chat_message' }, (payload) => {
          set((state) => ({
            chatMessages: [...state.chatMessages, payload.message]
          }));
        })
        .on('broadcast', { event: 'board_update' }, (payload) => {
          set((state) => ({
            pendingChanges: [...state.pendingChanges, payload.update]
          }));
        });

      // Subscribe to channel
      await channel.subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        const userPresence: UserPresence = {
          userId,
          displayName: userInfo.displayName || 'مستخدم مجهول',
          avatar: userInfo.avatar,
          role: userInfo.role || 'member',
          status: 'active',
          lastSeen: Date.now(),
          cursor: null,
          currentTool: 'select',
          selectedElements: []
        };

        // Track initial presence
        await channel!.track(userPresence);

        set({
          roomId,
          currentUserId: userId,
          lastSyncTimestamp: Date.now()
        });

        // Set up periodic presence updates
        presenceUpdateInterval = setInterval(() => {
          const { connectedUsers, currentUserId } = get();
          const currentUser = connectedUsers.get(currentUserId!);
          if (currentUser) {
            channel!.track({
              ...currentUser,
              lastSeen: Date.now()
            });
          }
        }, 30000); // Update every 30 seconds
      });
    },

    leaveRoom: async () => {
      if (channel) {
        await channel.untrack();
        await channel.unsubscribe();
        channel = null;
      }

      if (presenceUpdateInterval) {
        clearInterval(presenceUpdateInterval);
        presenceUpdateInterval = null;
      }

      set(initialState);
    },

    updateUserPresence: async (presence: Partial<UserPresence>) => {
      if (!channel) return;

      const { connectedUsers, currentUserId } = get();
      const currentUser = connectedUsers.get(currentUserId!);
      
      if (currentUser) {
        const updatedPresence = { ...currentUser, ...presence, lastSeen: Date.now() };
        await channel.track(updatedPresence);
        
        // Update local state
        connectedUsers.set(currentUserId!, updatedPresence);
        set({ connectedUsers: new Map(connectedUsers) });
      }
    },

    updateLiveCursor: (cursor: Omit<LiveCursor, 'userId' | 'timestamp'>) => {
      if (!channel) return;

      const { currentUserId } = get();
      const liveCursor: LiveCursor = {
        ...cursor,
        userId: currentUserId!,
        timestamp: Date.now()
      };

      // Broadcast cursor update
      channel.send({
        type: 'broadcast',
        event: 'cursor_update',
        payload: { userId: currentUserId, cursor: liveCursor }
      });

      // Update user presence with cursor
      get().updateUserPresence({ cursor: liveCursor });
    },

    sendMessage: (content: string) => {
      if (!channel) return;

      const { currentUserId, connectedUsers } = get();
      const user = connectedUsers.get(currentUserId!);
      
      if (!user) return;

      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        senderId: currentUserId!,
        senderName: user.displayName,
        timestamp: Date.now(),
        type: 'text' as const
      };

      // Broadcast message
      channel.send({
        type: 'broadcast',
        event: 'chat_message',
        payload: { message }
      });

      // Add to local state
      set((state) => ({
        chatMessages: [...state.chatMessages, message]
      }));
    },

    sendBoardUpdate: (elementId: string, updates: any) => {
      if (!channel) return;

      const { currentUserId } = get();
      const update = {
        id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        elementId,
        updates,
        userId: currentUserId!,
        timestamp: Date.now()
      };

      // Broadcast board update
      channel.send({
        type: 'broadcast',
        event: 'board_update',
        payload: { update }
      });
    },

    setVoiceChatActive: (active: boolean) => {
      set({ isVoiceChatActive: active });
      get().updateUserPresence({ status: active ? 'in_voice_chat' : 'active' });
    },

    setScreenSharingActive: (active: boolean) => {
      set({ isScreenSharingActive: active });
      get().updateUserPresence({ status: active ? 'screen_sharing' : 'active' });
    }
  };
});