// Collaboration Types for Planning Board
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color?: string;
}

export interface Participant {
  id: string;
  userId: string;
  boardId: string;
  role: ParticipantRole;
  joinedAt: number;
  lastActivity: number;
  isActive: boolean;
  cursor?: CursorState;
}

export type ParticipantRole = 'host' | 'editor' | 'commenter' | 'viewer';

export interface CursorState {
  x: number;
  y: number;
  userId: string;
  userName: string;
  color: string;
  visible: boolean;
}

export interface Presence {
  userId: string;
  cursor: CursorState | null;
  selection: string[];
  activeElement: string | null;
  lastSeen: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'system';
  mentions?: string[];
  replyTo?: string;
}

export interface VoiceState {
  userId: string;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  volume: number;
}

export interface SessionState {
  id: string;
  boardId: string;
  hostId: string;
  participants: Participant[];
  activeUsers: string[];
  isLocked: boolean;
  settings: SessionSettings;
  timer?: SessionTimer;
  voting?: VotingSession;
}

export interface SessionSettings {
  allowGuests: boolean;
  maxParticipants: number;
  requireApproval: boolean;
  enableVoice: boolean;
  enableChat: boolean;
  lockOnEdit: boolean;
  showCursors: boolean;
  showNames: boolean;
}

export interface SessionTimer {
  id: string;
  name: string;
  duration: number;
  startTime: number;
  isActive: boolean;
  isPaused: boolean;
}

export interface VotingSession {
  id: string;
  question: string;
  options: VotingOption[];
  allowMultiple: boolean;
  isAnonymous: boolean;
  startTime: number;
  endTime?: number;
  isActive: boolean;
  votes: Vote[];
}

export interface VotingOption {
  id: string;
  text: string;
  color?: string;
}

export interface Vote {
  id: string;
  userId: string;
  optionIds: string[];
  timestamp: number;
}

export interface ElementLock {
  elementId: string;
  userId: string;
  userName: string;
  lockedAt: number;
  expiresAt: number;
}

export interface CollaborationEvent {
  id: string;
  type: CollaborationEventType;
  userId: string;
  boardId: string;
  timestamp: number;
  data: Record<string, any>;
}

export type CollaborationEventType = 
  | 'user_joined'
  | 'user_left'
  | 'cursor_moved'
  | 'selection_changed'
  | 'element_locked'
  | 'element_unlocked'
  | 'message_sent'
  | 'timer_started'
  | 'timer_paused'
  | 'timer_stopped'
  | 'vote_started'
  | 'vote_cast'
  | 'vote_ended';

export interface ShareSettings {
  linkId: string;
  boardId: string;
  role: ParticipantRole;
  expiresAt?: number;
  maxUses?: number;
  usedCount: number;
  requireApproval: boolean;
  allowedDomains?: string[];
  password?: string;
}

export interface InviteLink {
  id: string;
  boardId: string;
  createdBy: string;
  role: ParticipantRole;
  expiresAt?: number;
  isActive: boolean;
  settings: ShareSettings;
}

export interface CollaborationState {
  session: SessionState | null;
  participants: Participant[];
  presences: Record<string, Presence>;
  messages: ChatMessage[];
  voiceStates: Record<string, VoiceState>;
  elementLocks: Record<string, ElementLock>;
  shareLinks: InviteLink[];
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export interface CollaborationConfig {
  enableRealTime: boolean;
  enableVoice: boolean;
  enableChat: boolean;
  enableCursors: boolean;
  enableLocking: boolean;
  autoSave: boolean;
  conflictResolution: 'last-write-wins' | 'operational-transform';
  heartbeatInterval: number;
  lockTimeout: number;
}