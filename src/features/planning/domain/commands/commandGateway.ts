import {
  type AuthorizationDecision,
  type CommandAuthorizationRequest,
  auditAuthorizationDecision,
  evaluateCommandAuthorization,
} from '@/features/planning/domain/policies/authorization';

export interface CommandGatewayResult<T = void> {
  decision: AuthorizationDecision;
  data?: T;
}

export function executeCommandWithAuthorization<T>(
  request: CommandAuthorizationRequest,
  execute: () => T,
): CommandGatewayResult<T> {
  const decision = evaluateCommandAuthorization(request);
  auditAuthorizationDecision(request, decision);

  if (!decision.allowed) {
    return { decision };
  }

  const data = execute();
  return {
    decision,
    data,
  };
}
