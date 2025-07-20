/**
 * AI Service for handling canvas-related AI operations
 * This service provides context-aware AI assistance for canvas tasks
 */

/**
 * Interface for AI assistance requests
 */
export interface AIAssistRequest {
  message?: string;
  canvasState?: any;
  action?: 'complete' | 'review' | 'clean' | 'suggest';
  context?: Record<string, any>;
}

/**
 * Interface for AI assistance responses
 */
export interface AIAssistResponse {
  response: string;
  suggestions?: string[];
  changes?: string[];
  score?: number;
  feedback?: string[];
  elementsAdded?: number;
  elementsRemoved?: number;
  confidence?: number;
}

/**
 * Canvas state interface for context extraction
 */
export interface CanvasState {
  elements: any[];
  selectedElements: string[];
  viewportBounds: { x: number; y: number; width: number; height: number };
  zoom: number;
  tool: string;
  layers: any[];
}

/**
 * AI Service class for canvas operations
 */
export class AIService {
  private static instance: AIService;
  private baseURL: string = '/api/ai';

  private constructor() {}

  /**
   * Get singleton instance of AIService
   */
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Extract canvas state for AI context
   */
  public extractCanvasState(): CanvasState {
    // Mock canvas state extraction
    // In real implementation, this would interface with canvas state management
    return {
      elements: [
        { id: 'elem-1', type: 'rectangle', x: 100, y: 100, width: 200, height: 150 },
        { id: 'elem-2', type: 'text', x: 50, y: 50, content: 'Sample Text' },
        { id: 'elem-3', type: 'circle', x: 300, y: 200, radius: 75 }
      ],
      selectedElements: ['elem-1'],
      viewportBounds: { x: 0, y: 0, width: 1200, height: 800 },
      zoom: 1.0,
      tool: 'select',
      layers: [
        { id: 'layer-1', name: 'Background', visible: true },
        { id: 'layer-2', name: 'Content', visible: true }
      ]
    };
  }

  /**
   * Send general assistance request to AI
   */
  public async getAssistance(request: AIAssistRequest): Promise<AIAssistResponse> {
    try {
      // In development, use mock responses
      if (process.env.NODE_ENV === 'development') {
        return this.getMockResponse('/ai/assist', request);
      }

      const response = await fetch(`${this.baseURL}/assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI assistance error:', error);
      return this.getMockResponse('/ai/assist', request);
    }
  }

  /**
   * Complete current canvas task with AI
   */
  public async completeTask(canvasState: CanvasState): Promise<AIAssistResponse> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return this.getMockResponse('/ai/assist/complete', { canvasState });
      }

      const response = await fetch(`${this.baseURL}/assist/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ canvasState }),
      });

      if (!response.ok) {
        throw new Error(`AI completion error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI completion error:', error);
      return this.getMockResponse('/ai/assist/complete', { canvasState });
    }
  }

  /**
   * Review current canvas with AI
   */
  public async reviewCanvas(canvasState: CanvasState): Promise<AIAssistResponse> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return this.getMockResponse('/ai/assist/review', { canvasState });
      }

      const response = await fetch(`${this.baseURL}/assist/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ canvasState }),
      });

      if (!response.ok) {
        throw new Error(`AI review error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI review error:', error);
      return this.getMockResponse('/ai/assist/review', { canvasState });
    }
  }

  /**
   * Clean up canvas with AI
   */
  public async cleanCanvas(canvasState: CanvasState): Promise<AIAssistResponse> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return this.getMockResponse('/ai/assist/clean', { canvasState });
      }

      const response = await fetch(`${this.baseURL}/assist/clean`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ canvasState }),
      });

      if (!response.ok) {
        throw new Error(`AI cleanup error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI cleanup error:', error);
      return this.getMockResponse('/ai/assist/clean', { canvasState });
    }
  }

  /**
   * Get mock response for development
   */
  private getMockResponse(endpoint: string, request: any): Promise<AIAssistResponse> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const mockResponses: Record<string, AIAssistResponse> = {
          '/ai/assist': {
            response: `I can help you with that! Based on your current canvas with ${request.canvasState?.elements?.length || 0} elements, I suggest focusing on layout optimization and visual hierarchy.`,
            suggestions: [
              'Improve spacing between elements',
              'Add consistent color scheme',
              'Enhance typography hierarchy',
              'Optimize element alignment'
            ],
            confidence: 0.85
          },
          '/ai/assist/complete': {
            response: 'I\'ve analyzed your canvas and completed the missing elements to enhance your design.',
            changes: [
              'Added consistent spacing grid',
              'Completed color scheme with complementary colors',
              'Added missing navigation labels',
              'Enhanced visual hierarchy with proper heading sizes'
            ],
            elementsAdded: 3,
            confidence: 0.92
          },
          '/ai/assist/review': {
            response: 'Here\'s my comprehensive review of your current canvas design:',
            score: 85,
            feedback: [
              '✅ Great use of visual hierarchy',
              '✅ Consistent spacing throughout',
              '⚠️ Color contrast could be improved',
              '⚠️ Some elements appear misaligned',
              '💡 Consider adding more whitespace for better readability'
            ],
            suggestions: [
              'Increase contrast ratio for text elements',
              'Align elements to a consistent grid',
              'Add breathing room around key content',
              'Consider using a more consistent color palette'
            ],
            confidence: 0.88
          },
          '/ai/assist/clean': {
            response: 'I\'ve cleaned up your canvas by removing redundant elements and optimizing the layout for better user experience.',
            changes: [
              'Removed 2 duplicate text elements',
              'Merged overlapping shapes',
              'Aligned all elements to 8px grid',
              'Optimized layer structure',
              'Removed unused color variations'
            ],
            elementsRemoved: 2,
            confidence: 0.94
          }
        };

        resolve(mockResponses[endpoint] || {
          response: 'AI service response',
          confidence: 0.75
        });
      }, 1000 + Math.random() * 1000); // 1-2 second delay
    });
  }

  /**
   * Debounced input analysis for smart suggestions
   */
  public debounceAnalyzeInput = this.debounce(async (input: string, context: any) => {
    return await this.getAssistance({
      message: input,
      context,
      action: 'suggest'
    });
  }, 400);

  /**
   * Utility debounce function
   */
  private debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();