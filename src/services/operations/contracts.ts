export type OperationDomain = 'finance' | 'team' | 'client' | 'files' | 'templates' | 'reports';

export interface OperationContext {
  domain: OperationDomain;
  action: string;
  resourceId?: string;
}

export interface OperationInput<TPayload = Record<string, unknown>> {
  context: OperationContext;
  payload: TPayload;
}

export interface OperationResult<TResult = unknown> {
  ok: boolean;
  data?: TResult;
  error?: string;
}

export type OperationHandler<TPayload = Record<string, unknown>, TResult = unknown> = (
  input: OperationInput<TPayload>,
) => Promise<OperationResult<TResult>>;
