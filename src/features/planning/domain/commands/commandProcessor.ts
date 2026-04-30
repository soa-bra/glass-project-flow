import { observeDomainCommand, setDomainCommandQueueDepth } from '@/features/planning/integration/telemetry/collaborationMetrics';

export interface DomainCommand<TPayload = unknown> {
  id: string;
  name: string;
  payload: TPayload;
  queuedAt?: number;
}

export interface DomainCommandResult<TResult = unknown> {
  commandId: string;
  commandName: string;
  durationMs: number;
  success: boolean;
  result?: TResult;
  error?: string;
}

const now = () => performance.now();

export const processDomainCommand = async <TPayload, TResult>(
  command: DomainCommand<TPayload>,
  handler: (payload: TPayload) => Promise<TResult> | TResult,
  queueDepth = 0,
): Promise<DomainCommandResult<TResult>> => {
  setDomainCommandQueueDepth(queueDepth);
  const start = now();

  try {
    const result = await handler(command.payload);
    const durationMs = now() - start;
    observeDomainCommand({
      commandName: command.name,
      durationMs,
      success: true,
    });

    return {
      commandId: command.id,
      commandName: command.name,
      durationMs,
      success: true,
      result,
    };
  } catch (error) {
    const durationMs = now() - start;
    observeDomainCommand({
      commandName: command.name,
      durationMs,
      success: false,
    });

    return {
      commandId: command.id,
      commandName: command.name,
      durationMs,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown command failure',
    };
  }
};
