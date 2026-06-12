import { supabase } from '@/integrations/supabase/client';
import type { UnifiedAIContext } from '@/features/ai/context/contextBuilder';

export interface AIGatewayRequest<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  action: string;
  context: UnifiedAIContext;
  payload?: TPayload;
}

export interface AIGatewayResponse<TResult = unknown> {
  result?: TResult;
  proposedActions?: Array<Record<string, unknown>>;
  error?: string;
}

class AIGatewayClient {
  async request<TResult = unknown>(request: AIGatewayRequest): Promise<AIGatewayResponse<TResult>> {
    const { data, error } = await supabase.functions.invoke('ai-gateway', {
      body: request,
    });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? {}) as AIGatewayResponse<TResult>;
  }
}

export const aiGatewayClient = new AIGatewayClient();
export default aiGatewayClient;
