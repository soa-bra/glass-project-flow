// Enhanced types for Collaborative Planning Whiteboard
export interface InfiniteCanvasConfig {
  type: "infinite";
  renderEngine: "WebGL" | "Canvas2D";
  features: {
    pan: boolean;
    zoom: {
      min: number;
      max: number;
      default: number;
    };
    grid: {
      enabled: boolean;
      snap: boolean;
      types: Array<"dots" | "lines" | "isometric" | "hex">;
      default: "dots" | "lines" | "isometric" | "hex";
      size: number;
    };
    framesBoards: boolean;
    miniMap: {
      enabled: boolean;
      clickNavigation: boolean;
    };
    autoAlign: {
      enabled: boolean;
      sensitivity: "low" | "medium" | "high";
    };
  };
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: "host" | "editor" | "viewer";
  isOnline: boolean;
  cursor?: {
    x: number;
    y: number;
    color: string;
  };
}

export interface TopFloatingPanelConfig {
  location: "top";
  sections: {
    participantsManagement: {
      displayOnlineUsers: boolean;
      permissions: Array<"host" | "editor" | "viewer">;
      inviteLink: {
        expireTime: string;
        maxGuests: number;
      };
    };
    miniMap: {
      enabled: boolean;
      positionIndicator: boolean;
    };
    aiChatBox: {
      type: "ai_assistant";
      features: Array<"chat_history" | "contextual_commands" | "summarize_board">;
    };
    fileTools: {
      export: Array<"pdf" | "png" | "svg">;
      save: {
        method: "auto" | "manual";
        interval: string;
      };
      upload: {
        types: Array<"pdf" | "png" | "jpg" | "csv" | "docx">;
      };
    };
    settings: {
      theme: Array<"light" | "dark">;
      gridOptions: number[];
      snapToggle: boolean;
      customPalette: boolean;
    };
  };
}

export interface EnhancedTool {
  toolId: string;
  name: string;
  keyboardShortcut: string;
  linkedPanel: string;
  actions: string[];
  category: "basic" | "smart" | "collaboration" | "content";
}

export interface Widget {
  id: string;
  type: "project_cards" | "finance_widget" | "csr_impact_widget";
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: Record<string, any>;
  source?: string;
}

export interface SpecialTool {
  id: string;
  description: string;
  aiIntegration?: boolean;
  features?: string[];
}

export interface EnhancedCanvasElement extends CanvasElement {
  layer?: number;
  zIndex?: number;
  rotation?: number;
  opacity?: number;
  locked?: boolean;
  grouped?: string; // Group ID
  metadata?: Record<string, any>;
}

export interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  elements: string[]; // Element IDs
}

export interface EnhancedCanvasState {
  // Basic state
  selectedTool: string;
  selectedElementIds: string[];
  selectedLayerId: string | null;
  
  // Canvas configuration
  config: InfiniteCanvasConfig;
  
  // View state
  zoom: number;
  canvasPosition: { x: number; y: number };
  viewport: { width: number; height: number };
  
  // Elements and layers
  elements: EnhancedCanvasElement[];
  layers: CanvasLayer[];
  
  // UI state
  showGrid: boolean;
  snapEnabled: boolean;
  showMiniMap: boolean;
  
  // Panels
  activePanels: string[];
  panelPositions: Record<string, { x: number; y: number }>;
  
  // Collaboration
  participants: Participant[];
  isCollaborating: boolean;
  
  // Widgets
  widgets: Widget[];
}

// Import original types
import type { CanvasElement } from '../types';