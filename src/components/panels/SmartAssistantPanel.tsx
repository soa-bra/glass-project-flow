import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, CheckCircle, Eye, Eraser, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

/**
 * Interface for chat message structure
 */
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: string[];
}

/**
 * Interface for AI action states
 */
export interface ActionState {
  isLoading: boolean;
  isComplete: boolean;
  progress?: number;
}

/**
 * Props for the SmartAssistantPanel component
 */
export interface SmartAssistantPanelProps {
  /** Current canvas state for context awareness */
  canvasState?: any;
  /** Callback for when AI performs an action */
  onAIAction?: (action: string, data?: any) => void;
  /** Panel position and size */
  className?: string;
}

/**
 * Smart Assistant Panel component that provides AI-powered assistance
 * for canvas tasks including completion, review, and cleanup
 */
export const SmartAssistantPanel: React.FC<SmartAssistantPanelProps> = ({
  canvasState,
  onAIAction,
  className = "w-96 h-full"
}) => {
  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you complete tasks, review your work, or clean up your canvas. What would you like me to help with?',
      timestamp: new Date(),
      actions: ['complete', 'review', 'clean']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [actionStates, setActionStates] = useState<Record<string, ActionState>>({
    complete: { isLoading: false, isComplete: false },
    review: { isLoading: false, isComplete: false },
    clean: { isLoading: false, isComplete: false }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Mock AI service call
   */
  const callAIService = async (endpoint: string, data: any): Promise<any> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResponses = {
      '/ai/assist': {
        response: `I can help you with that! Based on your current canvas state, I suggest focusing on the layout optimization and adding more visual hierarchy.`,
        suggestions: ['Improve spacing', 'Add color coordination', 'Enhance typography']
      },
      '/ai/assist/complete': {
        response: 'I\'ve analyzed your canvas and added missing elements to complete your design.',
        changes: ['Added consistent spacing', 'Completed color scheme', 'Added missing labels'],
        elementsAdded: 3
      },
      '/ai/assist/review': {
        response: 'Here\'s my review of your current work:',
        score: 85,
        feedback: ['Great use of colors', 'Layout could be more balanced', 'Consider adding more whitespace'],
        suggestions: ['Move elements slightly left', 'Increase font size for headers']
      },
      '/ai/assist/clean': {
        response: 'I\'ve cleaned up your canvas by removing redundant elements and optimizing the layout.',
        changes: ['Removed 2 duplicate elements', 'Aligned objects to grid', 'Optimized layer structure'],
        elementsRemoved: 2
      }
    };

    return mockResponses[endpoint as keyof typeof mockResponses] || { response: 'AI service response' };
  };

  /**
   * Handle sending a message to the AI assistant
   */
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await callAIService('/ai/assist', {
        message: inputMessage,
        canvasState: canvasState
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response,
        timestamp: new Date(),
        actions: response.suggestions ? ['apply_suggestions'] : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
      onAIAction?.('chat_response', response);
    } catch (error) {
      console.error('AI service error:', error);
    }
  };

  /**
   * Handle smart action execution (complete, review, clean)
   */
  const handleSmartAction = async (action: string) => {
    setActionStates(prev => ({
      ...prev,
      [action]: { isLoading: true, isComplete: false, progress: 0 }
    }));

    try {
      const endpoint = `/ai/assist/${action}`;
      const response = await callAIService(endpoint, { canvasState });

      setActionStates(prev => ({
        ...prev,
        [action]: { isLoading: false, isComplete: true }
      }));

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      onAIAction?.(action, response);

      // Reset completion state after 3 seconds
      setTimeout(() => {
        setActionStates(prev => ({
          ...prev,
          [action]: { isLoading: false, isComplete: false }
        }));
      }, 3000);

    } catch (error) {
      console.error(`Error executing ${action}:`, error);
      setActionStates(prev => ({
        ...prev,
        [action]: { isLoading: false, isComplete: false }
      }));
    }
  };

  /**
   * Get button variant based on action state
   */
  const getButtonVariant = (action: string) => {
    const state = actionStates[action];
    if (state.isComplete) return 'default';
    if (state.isLoading) return 'secondary';
    return 'outline';
  };

  /**
   * Get button icon based on action state
   */
  const getButtonIcon = (action: string, defaultIcon: React.ReactNode) => {
    const state = actionStates[action];
    if (state.isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (state.isComplete) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return defaultIcon;
  };

  return (
    <Card className={`${className} flex flex-col`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Smart Actions Bar */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant={getButtonVariant('complete')}
            onClick={() => handleSmartAction('complete')}
            disabled={actionStates.complete.isLoading}
            className="flex items-center gap-1.5 text-xs"
          >
            {getButtonIcon('complete', <Sparkles className="h-3 w-3" />)}
            Complete
          </Button>
          
          <Button
            size="sm"
            variant={getButtonVariant('review')}
            onClick={() => handleSmartAction('review')}
            disabled={actionStates.review.isLoading}
            className="flex items-center gap-1.5 text-xs"
          >
            {getButtonIcon('review', <Eye className="h-3 w-3" />)}
            Review
          </Button>
          
          <Button
            size="sm"
            variant={getButtonVariant('clean')}
            onClick={() => handleSmartAction('clean')}
            disabled={actionStates.clean.isLoading}
            className="flex items-center gap-1.5 text-xs"
          >
            {getButtonIcon('clean', <Eraser className="h-3 w-3" />)}
            Clean
          </Button>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {message.actions && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.actions.map((action, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI for help..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Context Info */}
        {canvasState && (
          <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
            Context: {canvasState.elements?.length || 0} elements on canvas
          </div>
        )}
      </CardContent>
    </Card>
  );
};