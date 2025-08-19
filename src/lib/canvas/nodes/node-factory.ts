import { nanoid } from 'nanoid';
import { 
  CanvasNode, 
  NodeType, 
  Point, 
  Size, 
  Transform, 
  NodeStyle,
  RectNode,
  EllipseNode,
  LineNode,
  ArrowNode,
  TextNode,
  StickyNode,
  FrameNode,
  ImageNode
} from '../types';

export interface CreateNodeOptions {
  position: Point;
  size?: Size;
  style?: Partial<NodeStyle>;
  metadata?: Record<string, any>;
}

export class NodeFactory {
  static createNode(
    type: NodeType,
    options: CreateNodeOptions,
    additionalData?: any
  ): CanvasNode {
    const baseTransform: Transform = {
      position: options.position,
      rotation: 0,
      scale: { x: 1, y: 1 }
    };

    const baseSize: Size = options.size || this.getDefaultSize(type);
    
    const baseStyle: NodeStyle = {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
      opacity: 1,
      ...options.style
    };

    const baseNode = {
      id: nanoid(),
      transform: baseTransform,
      size: baseSize,
      style: baseStyle,
      metadata: options.metadata,
      visible: true,
      locked: false
    };

    switch (type) {
      case 'rect':
        return {
          ...baseNode,
          type: 'rect' as const,
          radius: additionalData?.radius || 0
        };

      case 'ellipse':
        return {
          ...baseNode,
          type: 'ellipse' as const
        };

      case 'line':
        return {
          ...baseNode,
          type: 'line' as const,
          points: additionalData?.points || [
            { x: -baseSize.width / 2, y: 0 },
            { x: baseSize.width / 2, y: 0 }
          ]
        };

      case 'arrow':
        const arrowStart = additionalData?.start || { x: -baseSize.width / 2, y: 0 };
        const arrowEnd = additionalData?.end || { x: baseSize.width / 2, y: 0 };
        return {
          ...baseNode,
          type: 'arrow' as const,
          start: arrowStart,
          end: arrowEnd,
          arrowStyle: additionalData?.arrowStyle || 'simple'
        };

      case 'text':
        return {
          ...baseNode,
          type: 'text' as const,
          content: additionalData?.content || 'Text',
          fontSize: additionalData?.fontSize || 16,
          fontFamily: additionalData?.fontFamily || 'Arial, sans-serif',
          fontWeight: additionalData?.fontWeight || 'normal',
          textAlign: additionalData?.textAlign || 'center',
          color: additionalData?.color || '#000000'
        };

      case 'sticky':
        return {
          ...baseNode,
          type: 'sticky' as const,
          content: additionalData?.content || '',
          color: additionalData?.color || '#FFF740'
        };

      case 'frame':
        return {
          ...baseNode,
          type: 'frame' as const,
          title: additionalData?.title || 'Frame',
          children: additionalData?.children || []
        };

      case 'image':
        return {
          ...baseNode,
          type: 'image' as const,
          src: additionalData?.src || '',
          preserveAspectRatio: additionalData?.preserveAspectRatio !== false
        };

      default:
        throw new Error(`Unknown node type: ${type}`);
    }
  }

  // Create a rectangle node
  static createRect(options: CreateNodeOptions & { radius?: number }): RectNode {
    return this.createNode('rect', options, { radius: options.radius }) as RectNode;
  }

  // Create an ellipse node
  static createEllipse(options: CreateNodeOptions): EllipseNode {
    return this.createNode('ellipse', options) as EllipseNode;
  }

  // Create a line node
  static createLine(options: CreateNodeOptions & { points?: Point[] }): LineNode {
    return this.createNode('line', options, { points: options.points }) as LineNode;
  }

  // Create an arrow node
  static createArrow(
    options: CreateNodeOptions & { 
      start?: Point; 
      end?: Point; 
      arrowStyle?: 'simple' | 'filled' | 'diamond' 
    }
  ): ArrowNode {
    return this.createNode('arrow', options, {
      start: options.start,
      end: options.end,
      arrowStyle: options.arrowStyle
    }) as ArrowNode;
  }

  // Create a text node
  static createText(
    options: CreateNodeOptions & {
      content?: string;
      fontSize?: number;
      fontFamily?: string;
      fontWeight?: 'normal' | 'bold';
      textAlign?: 'left' | 'center' | 'right';
      color?: string;
    }
  ): TextNode {
    return this.createNode('text', options, {
      content: options.content,
      fontSize: options.fontSize,
      fontFamily: options.fontFamily,
      fontWeight: options.fontWeight,
      textAlign: options.textAlign,
      color: options.color
    }) as TextNode;
  }

  // Create a sticky note node
  static createSticky(
    options: CreateNodeOptions & { content?: string; color?: string }
  ): StickyNode {
    return this.createNode('sticky', options, {
      content: options.content,
      color: options.color
    }) as StickyNode;
  }

  // Create a frame node
  static createFrame(
    options: CreateNodeOptions & { title?: string; children?: string[] }
  ): FrameNode {
    return this.createNode('frame', options, {
      title: options.title,
      children: options.children
    }) as FrameNode;
  }

  // Create an image node
  static createImage(
    options: CreateNodeOptions & { src: string; preserveAspectRatio?: boolean }
  ): ImageNode {
    return this.createNode('image', options, {
      src: options.src,
      preserveAspectRatio: options.preserveAspectRatio
    }) as ImageNode;
  }

  // Get default size for each node type
  private static getDefaultSize(type: NodeType): Size {
    switch (type) {
      case 'rect':
      case 'ellipse':
        return { width: 100, height: 100 };
      case 'line':
      case 'arrow':
        return { width: 200, height: 2 };
      case 'text':
        return { width: 100, height: 30 };
      case 'sticky':
        return { width: 150, height: 150 };
      case 'frame':
        return { width: 300, height: 200 };
      case 'image':
        return { width: 200, height: 150 };
      default:
        return { width: 100, height: 100 };
    }
  }

  // Clone a node with a new ID
  static cloneNode(node: CanvasNode, offset?: Point): CanvasNode {
    const cloned: CanvasNode = {
      ...node,
      id: nanoid(),
      transform: {
        position: {
          x: node.transform.position.x + (offset?.x || 20),
          y: node.transform.position.y + (offset?.y || 20)
        },
        rotation: node.transform.rotation,
        scale: { ...node.transform.scale }
      },
      size: { ...node.size },
      style: { ...node.style },
      metadata: node.metadata ? { ...node.metadata } : undefined
    };

    // Handle type-specific cloning
    switch (node.type) {
      case 'line':
        (cloned as LineNode).points = [...(node as LineNode).points];
        break;
      case 'frame':
        // Don't copy children references for frames
        (cloned as FrameNode).children = [];
        break;
    }

    return cloned;
  }
}