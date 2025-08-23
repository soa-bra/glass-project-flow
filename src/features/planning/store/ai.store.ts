import { create } from 'zustand';
import { AIAssistantState, AISuggestion, AIChatMessage, AIContext, AICommand } from '../types/ai.types';

interface AIStore extends AIAssistantState {
  // Actions
  toggleAssistant: () => void;
  setProcessing: (processing: boolean) => void;
  updateContext: (context: Partial<AIContext>) => void;
  addSuggestion: (suggestion: AISuggestion) => void;
  removeSuggestion: (suggestionId: string) => void;
  addChatMessage: (message: AIChatMessage) => void;
  clearChat: () => void;
  setActiveCommands: (commands: AICommand[]) => void;
  addCommand: (command: AICommand) => void;
  removeCommand: (commandId: string) => void;
}

const initialContext: AIContext = {
  boardId: '',
  selectedElements: [],
  visibleElements: [],
  currentTool: 'select',
  canvasState: {
    zoom: 1,
    pan: { x: 0, y: 0 },
    bounds: { width: 0, height: 0 }
  },
  sessionInfo: {
    participants: 1,
    duration: 0,
    mode: 'individual'
  }
};

export const useAIStore = create<AIStore>((set, get) => ({
  // Initial state
  isVisible: false,
  isProcessing: false,
  currentContext: initialContext,
  suggestions: [],
  chatHistory: [],
  activeCommands: [],

  // Actions
  toggleAssistant: () => set((state) => ({ 
    isVisible: !state.isVisible 
  })),

  setProcessing: (processing: boolean) => set({ 
    isProcessing: processing 
  }),

  updateContext: (context: Partial<AIContext>) => set((state) => ({
    currentContext: { ...state.currentContext, ...context }
  })),

  addSuggestion: (suggestion: AISuggestion) => set((state) => ({
    suggestions: [...state.suggestions, suggestion]
  })),

  removeSuggestion: (suggestionId: string) => set((state) => ({
    suggestions: state.suggestions.filter(s => s.id !== suggestionId)
  })),

  addChatMessage: (message: AIChatMessage) => set((state) => ({
    chatHistory: [...state.chatHistory, message]
  })),

  clearChat: () => set({
    chatHistory: []
  }),

  setActiveCommands: (commands: AICommand[]) => set({
    activeCommands: commands
  }),

  addCommand: (command: AICommand) => set((state) => ({
    activeCommands: [...state.activeCommands, command]
  })),

  removeCommand: (commandId: string) => set((state) => ({
    activeCommands: state.activeCommands.filter(c => c.id !== commandId)
  }))
}));