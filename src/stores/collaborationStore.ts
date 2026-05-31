/**
 * Collaboration Store - Sprint 17
 * نظام إدارة التعاون: التعليقات والصوت والمشاركين
 */

import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

// === أنواع التعليقات ===
export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorColor: string;
  text: string;
  timestamp: number;
  resolved: boolean;
  elementId?: string; // تعليق مرتبط بعنصر معين
}

// === أنواع المشاركين ===
export interface Participant {
  id: string;
  name: string;
  color: string;
  role: 'host' | 'editor' | 'viewer';
  online: boolean;
  avatar?: string;
  inVoiceCall: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
}

// === أنواع الصوت ===
export interface VoiceState {
  isCallActive: boolean;
  isHost: boolean;
  isMuted: boolean;
  participants: string[]; // قائمة المشاركين في المكالمة
}

interface CollaborationState {
  // المشاركين
  participants: Participant[];
  currentUserId: string | null;
  isHost: boolean;
  isConnected: boolean;
  
  // التعليقات
  comments: Comment[];
  
  // الصوت
  voiceState: VoiceState;
  
  // الإجراءات
  setCurrentUser: (userId: string, isHost: boolean) => void;
  setConnected: (connected: boolean) => void;
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, updates: Partial<Participant>) => void;
  
  // التعليقات
  addComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  resolveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  
  // الصوت
  startVoiceCall: () => void;
  endVoiceCall: () => void;
  joinVoiceCall: () => void;
  leaveVoiceCall: () => void;
  toggleMute: () => void;
  setParticipantSpeaking: (userId: string, isSpeaking: boolean) => void;
}

export const useCollaborationStore = create<CollaborationState>((set, get) => ({
  // الحالة الابتدائية
  participants: [],
  currentUserId: null,
  isHost: false,
  isConnected: false,
  comments: [],
  voiceState: {
    isCallActive: false,
    isHost: false,
    isMuted: true,
    participants: [],
  },

  // === إجراءات المشاركين ===
  setCurrentUser: (userId, isHost) => set({ currentUserId: userId, isHost }),
  
  setConnected: (connected) => set({ isConnected: connected }),
  
  setParticipants: (participants) => set({ participants }),
  
  addParticipant: (participant) => set((state) => ({
    participants: [...state.participants.filter(p => p.id !== participant.id), participant],
  })),
  
  removeParticipant: (userId) => set((state) => ({
    participants: state.participants.filter(p => p.id !== userId),
    voiceState: {
      ...state.voiceState,
      participants: state.voiceState.participants.filter(id => id !== userId),
    },
  })),
  
  updateParticipant: (userId, updates) => set((state) => ({
    participants: state.participants.map(p =>
      p.id === userId ? { ...p, ...updates } : p
    ),
  })),

  // === إجراءات التعليقات ===
  addComment: (comment) => {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    set((state) => ({
      comments: [...state.comments, newComment],
    }));
  },
  
  resolveComment: (commentId) => set((state) => ({
    comments: state.comments.map(c =>
      c.id === commentId ? { ...c, resolved: true } : c
    ),
  })),
  
  deleteComment: (commentId) => set((state) => ({
    comments: state.comments.filter(c => c.id !== commentId),
  })),

  // === إجراءات الصوت ===
  startVoiceCall: () => {
    const { currentUserId, isHost } = get();
    if (!isHost || !currentUserId) return; // فقط المستضيف يمكنه بدء المكالمة
    
    set((state) => ({
      voiceState: {
        isCallActive: true,
        isHost: true,
        isMuted: false,
        participants: [currentUserId],
      },
      participants: state.participants.map(p =>
        p.id === currentUserId ? { ...p, inVoiceCall: true, isMuted: false } : p
      ),
    }));
  },
  
  endVoiceCall: () => {
    const { isHost } = get();
    if (!isHost) return; // فقط المستضيف يمكنه إنهاء المكالمة
    
    set((state) => ({
      voiceState: {
        isCallActive: false,
        isHost: false,
        isMuted: true,
        participants: [],
      },
      participants: state.participants.map(p => ({
        ...p,
        inVoiceCall: false,
        isMuted: true,
        isSpeaking: false,
      })),
    }));
  },
  
  joinVoiceCall: () => {
    const { currentUserId, voiceState } = get();
    if (!currentUserId || !voiceState.isCallActive) return;
    
    set((state) => ({
      voiceState: {
        ...state.voiceState,
        participants: [...state.voiceState.participants.filter(id => id !== currentUserId), currentUserId],
      },
      participants: state.participants.map(p =>
        p.id === currentUserId ? { ...p, inVoiceCall: true, isMuted: true } : p
      ),
    }));
  },
  
  leaveVoiceCall: () => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    set((state) => ({
      voiceState: {
        ...state.voiceState,
        participants: state.voiceState.participants.filter(id => id !== currentUserId),
      },
      participants: state.participants.map(p =>
        p.id === currentUserId ? { ...p, inVoiceCall: false, isMuted: true, isSpeaking: false } : p
      ),
    }));
  },
  
  toggleMute: () => {
    const { currentUserId, isHost } = get();
    if (!currentUserId) return;
    
    set((state) => {
      // المستضيف فقط يمكنه إلغاء كتم نفسه للتحدث
      // الآخرون يمكنهم الكتم فقط (لا يمكنهم التحدث)
      const currentParticipant = state.participants.find(p => p.id === currentUserId);
      if (!currentParticipant) return state;
      
      const newMutedState = isHost ? !currentParticipant.isMuted : true;
      
      return {
        voiceState: {
          ...state.voiceState,
          isMuted: newMutedState,
        },
        participants: state.participants.map(p =>
          p.id === currentUserId ? { ...p, isMuted: newMutedState } : p
        ),
      };
    });
  },
  
  setParticipantSpeaking: (userId, isSpeaking) => set((state) => ({
    participants: state.participants.map(p =>
      p.id === userId ? { ...p, isSpeaking } : p
    ),
  })),
}));
