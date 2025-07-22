/**
 * @fileoverview Validation utilities for Canvas Board
 * @author AI Assistant
 * @version 1.0.0
 */

import { CanvasElement, Layer, Participant, ChatMessage } from '@/types/canvas';

/**
 * Validates a canvas element
 */
export const validateCanvasElement = (element: any): element is CanvasElement => {
  if (!element || typeof element !== 'object') return false;
  
  const requiredFields = ['id', 'type', 'position', 'size'];
  for (const field of requiredFields) {
    if (!(field in element)) return false;
  }
  
  // Validate position
  if (!element.position || typeof element.position.x !== 'number' || typeof element.position.y !== 'number') {
    return false;
  }
  
  // Validate size
  if (!element.size || typeof element.size.width !== 'number' || typeof element.size.height !== 'number') {
    return false;
  }
  
  // Validate type
  const validTypes = ['text', 'shape', 'image', 'smart-element', 'sticky', 'comment', 'upload', 'timeline', 'mindmap', 'brainstorm', 'root', 'moodboard', 'line'];
  if (!validTypes.includes(element.type)) {
    return false;
  }
  
  return true;
};

/**
 * Validates a layer
 */
export const validateLayer = (layer: any): layer is Layer => {
  if (!layer || typeof layer !== 'object') return false;
  
  const requiredFields = ['id', 'name', 'visible', 'locked', 'elements'];
  for (const field of requiredFields) {
    if (!(field in layer)) return false;
  }
  
  if (typeof layer.visible !== 'boolean' || typeof layer.locked !== 'boolean') {
    return false;
  }
  
  if (!Array.isArray(layer.elements)) {
    return false;
  }
  
  return true;
};

/**
 * Validates a participant
 */
export const validateParticipant = (participant: any): participant is Participant => {
  if (!participant || typeof participant !== 'object') return false;
  
  const requiredFields = ['id', 'name', 'role', 'isOnline'];
  for (const field of requiredFields) {
    if (!(field in participant)) return false;
  }
  
  const validRoles = ['host', 'user', 'guest'];
  if (!validRoles.includes(participant.role)) {
    return false;
  }
  
  if (typeof participant.isOnline !== 'boolean') {
    return false;
  }
  
  return true;
};

/**
 * Validates a chat message
 */
export const validateChatMessage = (message: any): message is ChatMessage => {
  if (!message || typeof message !== 'object') return false;
  
  const requiredFields = ['id', 'userId', 'userName', 'message', 'timestamp', 'type'];
  for (const field of requiredFields) {
    if (!(field in message)) return false;
  }
  
  const validTypes = ['text', 'emoji', 'file'];
  if (!validTypes.includes(message.type)) {
    return false;
  }
  
  if (!(message.timestamp instanceof Date)) {
    return false;
  }
  
  return true;
};

/**
 * Sanitizes element content
 */
export const sanitizeElementContent = (content: string): string => {
  if (typeof content !== 'string') return '';
  
  // Basic HTML sanitization - remove scripts and unsafe tags
  return content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * Validates and sanitizes position coordinates
 */
export const validatePosition = (position: any): { x: number; y: number } => {
  const defaultPosition = { x: 0, y: 0 };
  
  if (!position || typeof position !== 'object') return defaultPosition;
  
  const x = typeof position.x === 'number' && !isNaN(position.x) ? position.x : 0;
  const y = typeof position.y === 'number' && !isNaN(position.y) ? position.y : 0;
  
  // Clamp to reasonable bounds
  return {
    x: Math.max(-10000, Math.min(10000, x)),
    y: Math.max(-10000, Math.min(10000, y))
  };
};

/**
 * Validates and sanitizes size dimensions
 */
export const validateSize = (size: any): { width: number; height: number } => {
  const defaultSize = { width: 100, height: 100 };
  
  if (!size || typeof size !== 'object') return defaultSize;
  
  const width = typeof size.width === 'number' && !isNaN(size.width) ? size.width : 100;
  const height = typeof size.height === 'number' && !isNaN(size.height) ? size.height : 100;
  
  // Ensure minimum size and reasonable maximum
  return {
    width: Math.max(10, Math.min(5000, width)),
    height: Math.max(10, Math.min(5000, height))
  };
};