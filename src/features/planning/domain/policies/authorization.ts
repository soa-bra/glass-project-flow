import { supabase } from '@/integrations/supabase/client';
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

export type CanvasCommand =
  | 'canvas.smart-elements.generate'
  | 'canvas.smart-doc.create'
  | 'canvas.smart-doc.ai-assist';

export interface CommandAuthorizationRequest {
  command: CanvasCommand;
  actor: CommandActor;
  attributes: PolicyAttributes;
}

export interface AuthorizationDecision {
  allowed: boolean;
  reason: string;
}

const SMART_ELEMENT_LIMIT_PER_COMMAND = 50;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function evaluateCommandAuthorization(request: CommandAuthorizationRequest): AuthorizationDecision {
  const { actor, attributes } = request;

  if (!attributes.isTrustedSession) {
    return { allowed: false, reason: 'Session is not trusted for mutating commands.' };
  }

  if (attributes.boardStatus === 'archived') {
    return { allowed: false, reason: 'Board is archived and does not allow mutations.' };
  }

  // Generation-volume guards apply only to bulk-generation commands.
  if (request.command === 'canvas.smart-elements.generate') {
    if (attributes.generatedElementCount <= 0) {
      return { allowed: false, reason: 'Command generated no elements.' };
    }
    if (attributes.generatedElementCount > SMART_ELEMENT_LIMIT_PER_COMMAND) {
      return {
        allowed: false,
        reason: `Generated elements exceed policy limit (${SMART_ELEMENT_LIMIT_PER_COMMAND}).`,
      };
    }
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

  void traceAiCommandAuthorization(request, decision);
}

async function traceAiCommandAuthorization(
  request: CommandAuthorizationRequest,
  decision: AuthorizationDecision,
): Promise<void> {
  if (!request.command.startsWith('canvas.smart-')) return;
  if (!UUID_PATTERN.test(request.actor.id)) return;

  try {
    const sensitivityReasons = decision.allowed ? [] : [decision.reason];
    const db = supabase as unknown as { from: (table: string) => { insert: (row: unknown) => Promise<unknown> } };

    await db.from('ai_command_traces').insert({
      user_id: request.actor.id,
      action: request.command,
      selected_tool: request.attributes.source,
      model: 'planning-command-gateway',
      prompt_excerpt: null,
      selected_elements_count: request.attributes.generatedElementCount,
      target_type: 'planning_canvas',
      confidence_min: null,
      confidence_max: null,
      confidence_avg: null,
      confidence_count: 0,
      escalation_gate: decision.allowed ? 'allowed' : 'denied',
      sensitivity_score: decision.allowed ? 0 : 1,
      sensitivity_reasons: sensitivityReasons,
      approval_required: !decision.allowed,
      approval_provided: decision.allowed,
      approver_id: decision.allowed ? request.actor.id : null,
      approved_at: decision.allowed ? new Date().toISOString() : null,
      output_summary: {
        decision: decision.allowed ? 'allowed' : 'denied',
        reason: decision.reason,
      },
      explainability_payload: {
        boardId: request.attributes.boardId,
        boardStatus: request.attributes.boardStatus,
        actorRole: request.actor.role,
        trustedSession: request.attributes.isTrustedSession,
      },
    });
  } catch (err) {
    // AI traces are audit evidence, but must not block the canvas command path.
    // eslint-disable-next-line no-console
    console.warn('[planning-ai-trace] failed to record authorization trace', request.command, err);
  }
}
