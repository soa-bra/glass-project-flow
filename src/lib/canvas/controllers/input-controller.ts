import { Point, CanvasEvent } from '../types';
import { CameraController } from './camera-controller';

export interface InputEvent {
  type: 'pointer-down' | 'pointer-move' | 'pointer-up' | 'wheel' | 'key-down' | 'key-up';
  point: Point;
  screenPoint: Point;
  button?: number;
  buttons?: number;
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
  };
  deltaY?: number;
  key?: string;
  preventDefault: () => void;
}

export class InputController {
  private element: HTMLElement;
  private camera: CameraController;
  private listeners: ((event: InputEvent) => void)[] = [];
  private isPointerDown: boolean = false;
  private lastPointerPosition: Point = { x: 0, y: 0 };

  constructor(element: HTMLElement, camera: CameraController) {
    this.element = element;
    this.camera = camera;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Pointer events
    this.element.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    this.element.addEventListener('pointermove', this.handlePointerMove.bind(this));
    this.element.addEventListener('pointerup', this.handlePointerUp.bind(this));
    this.element.addEventListener('pointercancel', this.handlePointerUp.bind(this));
    
    // Wheel events
    this.element.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    
    // Keyboard events
    this.element.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.element.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // Prevent context menu
    this.element.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Make element focusable
    this.element.tabIndex = 0;
  }

  private handlePointerDown(e: PointerEvent): void {
    this.element.setPointerCapture(e.pointerId);
    this.isPointerDown = true;
    this.lastPointerPosition = { x: e.clientX, y: e.clientY };

    const inputEvent = this.createInputEvent('pointer-down', e);
    this.notifyListeners(inputEvent);
  }

  private handlePointerMove(e: PointerEvent): void {
    const inputEvent = this.createInputEvent('pointer-move', e);
    
    // Update last position for delta calculations
    this.lastPointerPosition = { x: e.clientX, y: e.clientY };
    
    this.notifyListeners(inputEvent);
  }

  private handlePointerUp(e: PointerEvent): void {
    this.element.releasePointerCapture(e.pointerId);
    this.isPointerDown = false;

    const inputEvent = this.createInputEvent('pointer-up', e);
    this.notifyListeners(inputEvent);
  }

  private handleWheel(e: WheelEvent): void {
    const inputEvent: InputEvent = {
      type: 'wheel',
      point: this.camera.screenToWorld({ x: e.clientX, y: e.clientY }),
      screenPoint: { x: e.clientX, y: e.clientY },
      deltaY: e.deltaY,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey || e.metaKey,
        alt: e.altKey
      },
      preventDefault: () => e.preventDefault()
    };

    this.notifyListeners(inputEvent);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const inputEvent: InputEvent = {
      type: 'key-down',
      point: { x: 0, y: 0 },
      screenPoint: { x: 0, y: 0 },
      key: e.key,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey || e.metaKey,
        alt: e.altKey
      },
      preventDefault: () => e.preventDefault()
    };

    this.notifyListeners(inputEvent);
  }

  private handleKeyUp(e: KeyboardEvent): void {
    const inputEvent: InputEvent = {
      type: 'key-up',
      point: { x: 0, y: 0 },
      screenPoint: { x: 0, y: 0 },
      key: e.key,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey || e.metaKey,
        alt: e.altKey
      },
      preventDefault: () => e.preventDefault()
    };

    this.notifyListeners(inputEvent);
  }

  private createInputEvent(type: 'pointer-down' | 'pointer-move' | 'pointer-up', e: PointerEvent): InputEvent {
    const rect = this.element.getBoundingClientRect();
    const screenPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    return {
      type,
      point: this.camera.screenToWorld(screenPoint),
      screenPoint,
      button: e.button,
      buttons: e.buttons,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey || e.metaKey,
        alt: e.altKey
      },
      preventDefault: () => e.preventDefault()
    };
  }

  // Add input event listener
  addEventListener(listener: (event: InputEvent) => void): void {
    this.listeners.push(listener);
  }

  // Remove input event listener
  removeEventListener(listener: (event: InputEvent) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Notify all listeners of an input event
  private notifyListeners(event: InputEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in input event listener:', error);
      }
    });
  }

  // Check if pointer is currently down
  isPointerPressed(): boolean {
    return this.isPointerDown;
  }

  // Get last pointer position
  getLastPointerPosition(): Point {
    return { ...this.lastPointerPosition };
  }

  // Focus the input element
  focus(): void {
    this.element.focus();
  }

  // Cleanup event listeners
  destroy(): void {
    // Remove all event listeners
    const events = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'wheel', 'keydown', 'keyup', 'contextmenu'];
    events.forEach(eventName => {
      this.element.removeEventListener(eventName, this.handlePointerDown.bind(this));
    });
    
    this.listeners = [];
  }
}