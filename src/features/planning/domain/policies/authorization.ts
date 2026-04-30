import { auditService } from '@/services/audit';

export type AuthorizationRole = 'host' | 'editor' | 'viewer' | 'guest' | 'system';

export interface CommandActor {
  id: string;
  role: AuthorizationRole;
}

export interface PolicyAttributes {
  boardId: string;
  boardStatus: 'active' | 'archived' | 'draft';
  boardOwnerId: string;
  source: 'smart-command-bar' | 'toolbar' | 'keyboard' | 'system';
  generatedElementCount: number;
  isTrustedSession: boolean;
}

export interface CommandAuthorizationRequest {
  command: 'canvas.smart-elements.generate';
  actor: CommandActor;
  attributes: PolicyAttributes;
}

export interface AuthorizationDecision {
  allowed: boolean;
  reason: string;
}

const SMART_ELEMENT_LIMIT_PER_COMMAND = 50;

export function evaluateCommandAuthorization(request: CommandAuthorizationRequest): AuthorizationDecision {
  const { actor, attributes } = request;

  if (!attributes.isTrustedSession) {
    return { allowed: false, reason: 'Session is not trusted for mutating commands.' };
  }

  if (attributes.boardStatus === 'archived') {
    return { allowed: false, reason: 'Board is archived and does not allow mutations.' };
  }

  if (attributes.generatedElementCount <= 0) {
    return { allowed: false, reason: 'Command generated no elements.' };
  }

  if (attributes.generatedElementCount > SMART_ELEMENT_LIMIT_PER_COMMAND) {
    return {
      allowed: false,
      reason: `Generated elements exceed policy limit (${SMART_ELEMENT_LIMIT_PER_COMMAND}).`,
    };
  }

  if (actor.role === 'host') {
    return { allowed: true, reason: 'Host role is authorized for command execution.' };
  }

  if (actor.role === 'editor') {
    const ownsBoard = actor.id === attributes.boardOwnerId;
    const fromAllowedSource = attributes.source === 'smart-command-bar' || attributes.source === 'toolbar';

    if (ownsBoard || fromAllowedSource) {
      return { allowed: true, reason: 'Editor is authorized under ABAC conditions.' };
    }

    return { allowed: false, reason: 'Editor command source is not allowed by policy.' };
  }

  return { allowed: false, reason: `Role ${actor.role} is not authorized for this command.` };
}

export function auditAuthorizationDecision(request: CommandAuthorizationRequest, decision: AuthorizationDecision): void {
  const eventType = decision.allowed ? 'authz.approved' : 'authz.denied';

  void auditService.logEvent({
    eventType,
    entityType: 'command',
    entityId: request.command,
    metadata: {
      actorId: request.actor.id,
      actorRole: request.actor.role,
      boardId: request.attributes.boardId,
      boardStatus: request.attributes.boardStatus,
      generatedElementCount: request.attributes.generatedElementCount,
      source: request.attributes.source,
      trustedSession: request.attributes.isTrustedSession,
      decisionReason: decision.reason,
    },
  });
}
