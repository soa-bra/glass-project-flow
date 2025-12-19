/**
 * Elements Slice - إدارة عناصر Canvas
 */

import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { CanvasElement, LayerInfo } from '@/types/canvas';
import { resolveSnapConnection, type SnapEdge } from '@/utils/arrow-routing';
import { calculateConnectorBounds } from '@/types/mindmap-canvas';
import { getAnchorPositionForElement, deepCloneArrowData } from './helpers';

export interface ElementsSlice {
  elements: CanvasElement[];
  
  // Element Actions
  addElement: (element: Omit<CanvasElement, 'id'> & { id?: string }) => void;
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  deleteElements: (elementIds: string[]) => void;
  duplicateElement: (elementId: string) => void;
  moveElements: (elementIds: string[], deltaX: number, deltaY: number) => void;
  resizeElements: (elementIds: string[], scaleX: number, scaleY: number, origin: { x: number; y: number }) => void;
  rotateElements: (elementIds: string[], angle: number, origin: { x: number; y: number }) => void;
  flipHorizontally: (elementIds: string[]) => void;
  flipVertically: (elementIds: string[]) => void;
  lockElements: (elementIds: string[]) => void;
  unlockElements: (elementIds: string[]) => void;
  alignElements: (elementIds: string[], alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  groupElements: (elementIds: string[]) => void;
  ungroupElements: (groupId: string) => void;
}

export const createElementsSlice: StateCreator<
  any,
  [],
  [],
  ElementsSlice
> = (set, get) => ({
  elements: [],
  
  addElement: (elementData) => {
    const element: CanvasElement = {
      type: elementData.type || 'text',
      position: elementData.position || { x: 0, y: 0 },
      size: elementData.size || { width: 200, height: 100 },
      style: elementData.style || {},
      ...elementData,
      id: elementData.id || nanoid(),
      layerId: get().activeLayerId || 'default',
      visible: true,
      locked: false
    };
    
    set((state: any) => {
      const updatedLayers = state.layers.map((layer: LayerInfo) =>
        layer.id === element.layerId
          ? { ...layer, elements: [...layer.elements, element.id] }
          : layer
      );
      
      return {
        elements: [...state.elements, element],
        layers: updatedLayers
      };
    });
    
    get().pushHistory();
  },
  
  updateElement: (elementId, updates) => {
    set((state: any) => {
      let updatedElements = state.elements.map((el: CanvasElement) =>
        el.id === elementId ? { ...el, ...updates } : el
      );
      
      const updatedElement = updatedElements.find((el: CanvasElement) => el.id === elementId);
      
      // تحديث النصوص المرتبطة إذا تغير الموضع
      if (updates.position) {
        const attachedTexts = updatedElements.filter(
          (el: CanvasElement) => el.type === 'text' && el.data?.attachedTo === elementId
        );
        
        attachedTexts.forEach((text: CanvasElement) => {
          if (text.data?.relativePosition) {
            const newX = updates.position!.x + text.data.relativePosition.x;
            const newY = updates.position!.y + text.data.relativePosition.y;
            
            const idx = updatedElements.findIndex((e: CanvasElement) => e.id === text.id);
            if (idx !== -1) {
              updatedElements[idx] = {
                ...updatedElements[idx],
                position: { x: newX, y: newY }
              };
            }
          }
        });
        
        // تحديث الأسهم المتصلة
        if (updatedElement) {
          const connectedArrows = updatedElements.filter((el: CanvasElement) => {
            if (el.type !== 'shape') return false;
            const arrowData = el.data?.arrowData;
            if (!arrowData) return false;
            return (
              arrowData.startConnection?.elementId === elementId ||
              arrowData.endConnection?.elementId === elementId
            );
          });
          
          connectedArrows.forEach((arrow: CanvasElement) => {
            let arrowData = deepCloneArrowData(arrow.data.arrowData);
            
            if (arrowData.startConnection?.elementId === elementId) {
              const anchorPos = getAnchorPositionForElement(updatedElement, arrowData.startConnection.anchorPoint);
              const newStartPoint = {
                x: anchorPos.x - arrow.position.x,
                y: anchorPos.y - arrow.position.y
              };
              
              const relativeTargetElement = {
                id: updatedElement.id,
                position: {
                  x: updatedElement.position.x - arrow.position.x,
                  y: updatedElement.position.y - arrow.position.y
                },
                size: updatedElement.size
              };
              
              arrowData = resolveSnapConnection(
                arrowData,
                newStartPoint,
                arrowData.startConnection.anchorPoint as SnapEdge,
                relativeTargetElement,
                'start'
              );
            }
            
            if (arrowData.endConnection?.elementId === elementId) {
              const anchorPos = getAnchorPositionForElement(updatedElement, arrowData.endConnection.anchorPoint);
              const newEndPoint = {
                x: anchorPos.x - arrow.position.x,
                y: anchorPos.y - arrow.position.y
              };
              
              const relativeTargetElement = {
                id: updatedElement.id,
                position: {
                  x: updatedElement.position.x - arrow.position.x,
                  y: updatedElement.position.y - arrow.position.y
                },
                size: updatedElement.size
              };
              
              arrowData = resolveSnapConnection(
                arrowData,
                newEndPoint,
                arrowData.endConnection.anchorPoint as SnapEdge,
                relativeTargetElement,
                'end'
              );
            }
            
            const idx = updatedElements.findIndex((e: CanvasElement) => e.id === arrow.id);
            if (idx !== -1) {
              updatedElements[idx] = {
                ...updatedElements[idx],
                data: { ...updatedElements[idx].data, arrowData }
              };
            }
          });
        }
        
        // تحديث mindmap_connectors
        if (updatedElement?.type === 'mindmap_node') {
          const connectedMindMapConnectors = updatedElements.filter((el: CanvasElement) => {
            if (el.type !== 'mindmap_connector') return false;
            const connectorData = el.data as any;
            return (
              connectorData?.startNodeId === elementId ||
              connectorData?.endNodeId === elementId
            );
          });
          
          connectedMindMapConnectors.forEach((connector: CanvasElement) => {
            const connectorData = connector.data as any;
            const startNode = updatedElements.find((el: CanvasElement) => el.id === connectorData?.startNodeId);
            const endNode = updatedElements.find((el: CanvasElement) => el.id === connectorData?.endNodeId);
            
            if (startNode && endNode) {
              const newBounds = calculateConnectorBounds(
                { position: startNode.position, size: startNode.size },
                { position: endNode.position, size: endNode.size }
              );
              
              const connIdx = updatedElements.findIndex((e: CanvasElement) => e.id === connector.id);
              if (connIdx !== -1) {
                updatedElements[connIdx] = {
                  ...updatedElements[connIdx],
                  position: newBounds.position,
                  size: newBounds.size
                };
              }
            }
          });
        }
      }
      
      return { elements: updatedElements };
    });
  },
  
  deleteElement: (elementId) => {
    set((state: any) => {
      const updatedLayers = state.layers.map((layer: LayerInfo) => ({
        ...layer,
        elements: layer.elements.filter((id: string) => id !== elementId)
      }));
      
      return {
        elements: state.elements.filter((el: CanvasElement) => el.id !== elementId),
        selectedElementIds: state.selectedElementIds.filter((id: string) => id !== elementId),
        layers: updatedLayers
      };
    });
    
    get().pushHistory();
  },
  
  deleteElements: (elementIds) => {
    elementIds.forEach((id: string) => get().deleteElement(id));
  },
  
  duplicateElement: (elementId) => {
    const element = get().elements.find((el: CanvasElement) => el.id === elementId);
    if (!element) return;
    
    const duplicate = {
      ...element,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      }
    };
    
    delete (duplicate as any).id;
    get().addElement(duplicate);
  },
  
  moveElements: (elementIds, deltaX, deltaY) => {
    const uniqueIds = Array.from(new Set(elementIds));
    const state = get();
    const frameIds: string[] = [];
    const nonFrameIds: string[] = [];
    
    uniqueIds.forEach((id: string) => {
      const el = state.elements.find((e: CanvasElement) => e.id === id);
      if (el?.type === 'frame') {
        frameIds.push(id);
      } else if (el && !el.locked) {
        nonFrameIds.push(id);
      }
    });
    
    frameIds.forEach((frameId: string) => {
      get().moveFrame(frameId, deltaX, deltaY);
    });
    
    if (nonFrameIds.length > 0) {
      set((state: any) => {
        let updatedElements = state.elements.map((el: CanvasElement) =>
          nonFrameIds.includes(el.id)
            ? { ...el, position: { x: el.position.x + deltaX, y: el.position.y + deltaY } }
            : el
        );
        
        // تحديث الأسهم المتصلة
        nonFrameIds.forEach((movedElementId: string) => {
          const movedElement = updatedElements.find((e: CanvasElement) => e.id === movedElementId);
          if (!movedElement) return;
          
          const connectedArrows = updatedElements.filter((el: CanvasElement) => {
            if (el.type !== 'shape') return false;
            const shapeType = el.shapeType || el.data?.shapeType;
            if (!shapeType?.startsWith('arrow_')) return false;
            const arrowData = el.data?.arrowData;
            if (!arrowData) return false;
            return (
              arrowData.startConnection?.elementId === movedElementId ||
              arrowData.endConnection?.elementId === movedElementId
            );
          });
          
          connectedArrows.forEach((arrow: CanvasElement) => {
            let arrowData = deepCloneArrowData(arrow.data.arrowData);
            
            if (arrowData.startConnection?.elementId === movedElementId) {
              const anchorPos = getAnchorPositionForElement(movedElement, arrowData.startConnection.anchorPoint);
              const newStartPoint = {
                x: anchorPos.x - arrow.position.x,
                y: anchorPos.y - arrow.position.y
              };
              
              const relativeTargetElement = {
                id: movedElement.id,
                position: {
                  x: movedElement.position.x - arrow.position.x,
                  y: movedElement.position.y - arrow.position.y
                },
                size: movedElement.size
              };
              
              arrowData = resolveSnapConnection(
                arrowData,
                newStartPoint,
                arrowData.startConnection.anchorPoint as SnapEdge,
                relativeTargetElement,
                'start'
              );
            }
            
            if (arrowData.endConnection?.elementId === movedElementId) {
              const anchorPos = getAnchorPositionForElement(movedElement, arrowData.endConnection.anchorPoint);
              const newEndPoint = {
                x: anchorPos.x - arrow.position.x,
                y: anchorPos.y - arrow.position.y
              };
              
              const relativeTargetElement = {
                id: movedElement.id,
                position: {
                  x: movedElement.position.x - arrow.position.x,
                  y: movedElement.position.y - arrow.position.y
                },
                size: movedElement.size
              };
              
              arrowData = resolveSnapConnection(
                arrowData,
                newEndPoint,
                arrowData.endConnection.anchorPoint as SnapEdge,
                relativeTargetElement,
                'end'
              );
            }
            
            const idx = updatedElements.findIndex((e: CanvasElement) => e.id === arrow.id);
            if (idx !== -1) {
              updatedElements[idx] = {
                ...updatedElements[idx],
                data: { ...updatedElements[idx].data, arrowData }
              };
            }
          });
        });
        
        return { elements: updatedElements };
      });
    }
    
    if (frameIds.length === 0 && nonFrameIds.length > 0) {
      get().pushHistory();
    }
  },
  
  resizeElements: (elementIds, scaleX, scaleY, origin) => {
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (!elementIds.includes(el.id) || el.locked) return el;
        
        const relX = el.position.x - origin.x;
        const relY = el.position.y - origin.y;
        
        return {
          ...el,
          position: { x: origin.x + relX * scaleX, y: origin.y + relY * scaleY },
          size: { width: el.size.width * scaleX, height: el.size.height * scaleY }
        };
      })
    }));
    get().pushHistory();
  },
  
  rotateElements: (elementIds, angle, origin) => {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (!elementIds.includes(el.id) || el.locked) return el;
        
        const relX = el.position.x - origin.x;
        const relY = el.position.y - origin.y;
        
        return {
          ...el,
          position: {
            x: origin.x + relX * cos - relY * sin,
            y: origin.y + relX * sin + relY * cos
          },
          rotation: (typeof el.rotation === 'number' ? el.rotation : 0) + angle
        };
      })
    }));
    get().pushHistory();
  },
  
  flipHorizontally: (elementIds) => {
    const elements = get().elements.filter((el: CanvasElement) => elementIds.includes(el.id));
    if (elements.length === 0) return;
    
    const bounds = {
      minX: Math.min(...elements.map((e: CanvasElement) => e.position.x)),
      maxX: Math.max(...elements.map((e: CanvasElement) => e.position.x + e.size.width))
    };
    const centerX = (bounds.minX + bounds.maxX) / 2;
    
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (!elementIds.includes(el.id) || el.locked) return el;
        const distFromCenter = el.position.x + el.size.width / 2 - centerX;
        return {
          ...el,
          position: { ...el.position, x: centerX - distFromCenter - el.size.width / 2 },
          style: { ...el.style, transform: `scaleX(-1) ${el.style?.transform || ''}` }
        };
      })
    }));
    get().pushHistory();
  },
  
  flipVertically: (elementIds) => {
    const elements = get().elements.filter((el: CanvasElement) => elementIds.includes(el.id));
    if (elements.length === 0) return;
    
    const bounds = {
      minY: Math.min(...elements.map((e: CanvasElement) => e.position.y)),
      maxY: Math.max(...elements.map((e: CanvasElement) => e.position.y + e.size.height))
    };
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (!elementIds.includes(el.id) || el.locked) return el;
        const distFromCenter = el.position.y + el.size.height / 2 - centerY;
        return {
          ...el,
          position: { ...el.position, y: centerY - distFromCenter - el.size.height / 2 },
          style: { ...el.style, transform: `scaleY(-1) ${el.style?.transform || ''}` }
        };
      })
    }));
    get().pushHistory();
  },
  
  lockElements: (elementIds) => {
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) =>
        elementIds.includes(el.id) ? { ...el, locked: true } : el
      )
    }));
  },
  
  unlockElements: (elementIds) => {
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) =>
        elementIds.includes(el.id) ? { ...el, locked: false } : el
      )
    }));
  },
  
  alignElements: (elementIds, alignment) => {
    const elements = get().elements.filter((el: CanvasElement) => elementIds.includes(el.id));
    if (elements.length === 0) return;
    
    const bounds = {
      minX: Math.min(...elements.map((el: CanvasElement) => el.position.x)),
      minY: Math.min(...elements.map((el: CanvasElement) => el.position.y)),
      maxX: Math.max(...elements.map((el: CanvasElement) => el.position.x + el.size.width)),
      maxY: Math.max(...elements.map((el: CanvasElement) => el.position.y + el.size.height)),
      centerX: 0,
      centerY: 0
    };
    
    bounds.centerX = bounds.minX + (bounds.maxX - bounds.minX) / 2;
    bounds.centerY = bounds.minY + (bounds.maxY - bounds.minY) / 2;
    
    elements.forEach((el: CanvasElement) => {
      let newPosition = { ...el.position };
      
      switch(alignment) {
        case 'left': newPosition.x = bounds.minX; break;
        case 'center': newPosition.x = bounds.centerX - el.size.width / 2; break;
        case 'right': newPosition.x = bounds.maxX - el.size.width; break;
        case 'top': newPosition.y = bounds.minY; break;
        case 'middle': newPosition.y = bounds.centerY - el.size.height / 2; break;
        case 'bottom': newPosition.y = bounds.maxY - el.size.height; break;
      }
      
      get().updateElement(el.id, { position: newPosition });
    });
  },
  
  groupElements: (elementIds) => {
    const groupId = nanoid();
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) =>
        elementIds.includes(el.id)
          ? { ...el, metadata: { ...el.metadata, groupId } }
          : el
      )
    }));
  },
  
  ungroupElements: (groupId) => {
    set((state: any) => ({
      elements: state.elements.map((el: CanvasElement) => {
        if (el.metadata?.groupId === groupId) {
          const { groupId: _, ...restMetadata } = el.metadata;
          return { ...el, metadata: restMetadata };
        }
        return el;
      })
    }));
  }
});
