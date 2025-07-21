/**
 * @fileoverview Canvas state management hook using Zustand
 * @author AI Assistant
 * @version 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CanvasState, CanvasElement, Layer, Participant, ChatMessage, Comment } from '@/types/canvas';

interface CanvasStore extends CanvasState {
  // Element actions
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElements: (ids: string[]) => void;
  clearSelection: () => void;
  
  // Layer actions
  addLayer: (layer: Layer) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  deleteLayer: (id: string) => void;
  selectLayer: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  
  // Tool actions
  setActiveTool: (toolId: string) => void;
  
  // View actions
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  
  // Collaboration actions
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  
  // Chat actions
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  
  // Comment actions
  addComment: (comment: Comment) => void;
  updateComment: (id: string, updates: Partial<Comment>) => void;
  deleteComment: (id: string) => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  
  // File actions
  saveCanvas: () => void;
  loadCanvas: (data: any) => void;
  exportCanvas: (format: 'png' | 'svg' | 'pdf') => void;
}

const useCanvasState = create<CanvasStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      elements: [],
      layers: [
        {
          id: 'default',
          name: 'الطبقة الافتراضية',
          visible: true,
          locked: false,
          elements: []
        }
      ],
      selectedElementIds: [],
      selectedLayerId: 'default',
      activeTool: 'selection',
      zoom: 1,
      pan: { x: 0, y: 0 },
      gridVisible: true,
      snapToGrid: true,
      participants: [],
      comments: [],
      chatMessages: [],

      // Element actions
      addElement: (element) => {
        set((state) => ({
          elements: [...state.elements, element],
          layers: state.layers.map(layer => 
            layer.id === element.layerId 
              ? { ...layer, elements: [...layer.elements, element.id] }
              : layer
          )
        }));
      },

      updateElement: (id, updates) => {
        set((state) => ({
          elements: state.elements.map(el => 
            el.id === id ? { ...el, ...updates } : el
          )
        }));
      },

      deleteElement: (id) => {
        set((state) => ({
          elements: state.elements.filter(el => el.id !== id),
          selectedElementIds: state.selectedElementIds.filter(eid => eid !== id),
          layers: state.layers.map(layer => ({
            ...layer,
            elements: layer.elements.filter(eid => eid !== id)
          }))
        }));
      },

      selectElements: (ids) => {
        set({ selectedElementIds: ids });
      },

      clearSelection: () => {
        set({ selectedElementIds: [] });
      },

      // Layer actions
      addLayer: (layer) => {
        set((state) => ({
          layers: [...state.layers, layer]
        }));
      },

      updateLayer: (id, updates) => {
        set((state) => ({
          layers: state.layers.map(layer => 
            layer.id === id ? { ...layer, ...updates } : layer
          )
        }));
      },

      deleteLayer: (id) => {
        const state = get();
        if (state.layers.length <= 1) return; // Don't delete the last layer
        
        set((state) => ({
          layers: state.layers.filter(layer => layer.id !== id),
          selectedLayerId: state.selectedLayerId === id ? state.layers[0]?.id : state.selectedLayerId,
          elements: state.elements.filter(el => el.layerId !== id)
        }));
      },

      selectLayer: (id) => {
        set({ selectedLayerId: id });
      },

      reorderLayers: (fromIndex, toIndex) => {
        set((state) => {
          const newLayers = [...state.layers];
          const [removed] = newLayers.splice(fromIndex, 1);
          newLayers.splice(toIndex, 0, removed);
          return { layers: newLayers };
        });
      },

      // Tool actions
      setActiveTool: (toolId) => {
        set({ activeTool: toolId });
      },

      // View actions
      setZoom: (zoom) => {
        set({ zoom: Math.max(0.1, Math.min(5, zoom)) });
      },

      setPan: (pan) => {
        set({ pan });
      },

      toggleGrid: () => {
        set((state) => ({ gridVisible: !state.gridVisible }));
      },

      toggleSnap: () => {
        set((state) => ({ snapToGrid: !state.snapToGrid }));
      },

      // Collaboration actions
      addParticipant: (participant) => {
        set((state) => ({
          participants: [...state.participants, participant]
        }));
      },

      removeParticipant: (id) => {
        set((state) => ({
          participants: state.participants.filter(p => p.id !== id)
        }));
      },

      updateParticipant: (id, updates) => {
        set((state) => ({
          participants: state.participants.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }));
      },

      // Chat actions
      addChatMessage: (message) => {
        set((state) => ({
          chatMessages: [...state.chatMessages, message]
        }));
      },

      clearChat: () => {
        set({ chatMessages: [] });
      },

      // Comment actions
      addComment: (comment) => {
        set((state) => ({
          comments: [...state.comments, comment]
        }));
      },

      updateComment: (id, updates) => {
        set((state) => ({
          comments: state.comments.map(c => 
            c.id === id ? { ...c, ...updates } : c
          )
        }));
      },

      deleteComment: (id) => {
        set((state) => ({
          comments: state.comments.filter(c => c.id !== id)
        }));
      },

      // History actions (simplified - would need proper implementation)
      undo: () => {
        // TODO: Implement undo functionality
        console.log('Undo action');
      },

      redo: () => {
        // TODO: Implement redo functionality  
        console.log('Redo action');
      },

      // File actions
      saveCanvas: () => {
        const state = get();
        const canvasData = {
          elements: state.elements,
          layers: state.layers,
          zoom: state.zoom,
          pan: state.pan,
          savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('canvas-data', JSON.stringify(canvasData));
        console.log('Canvas saved');
      },

      loadCanvas: (data) => {
        set({
          elements: data.elements || [],
          layers: data.layers || [],
          zoom: data.zoom || 1,
          pan: data.pan || { x: 0, y: 0 },
          selectedElementIds: [],
          selectedLayerId: data.layers?.[0]?.id || 'default'
        });
      },

      exportCanvas: (format) => {
        // TODO: Implement export functionality
        console.log(`Exporting canvas as ${format}`);
      }
    }),
    {
      name: 'canvas-storage'
    }
  )
);

export default useCanvasState;