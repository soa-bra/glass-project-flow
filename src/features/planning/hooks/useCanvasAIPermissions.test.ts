import { describe, expect, it } from 'vitest';
import { CANVAS_AI_DENIAL_REASONS, resolveCanvasAIPermissions } from './useCanvasAIPermissions';

describe('resolveCanvasAIPermissions', () => {
  it('blocks loading, guest, and viewer states before AI can run', () => {
    expect(resolveCanvasAIPermissions({ role: 'editor', loading: true })).toMatchObject({
      canUseAI: false,
      denialReason: CANVAS_AI_DENIAL_REASONS.loading,
    });
    expect(resolveCanvasAIPermissions({ role: 'guest', userId: null })).toMatchObject({
      canUseAI: false,
      denialReason: CANVAS_AI_DENIAL_REASONS.guest,
    });
    expect(resolveCanvasAIPermissions({ role: 'viewer', userId: 'viewer-user' })).toMatchObject({
      canUseAI: false,
      denialReason: CANVAS_AI_DENIAL_REASONS.viewer,
    });
  });

  it('requires a trusted editor or host session', () => {
    expect(resolveCanvasAIPermissions({ role: 'editor', userId: null, trustedSession: false })).toMatchObject({
      canUseAI: false,
      trustedSession: false,
      denialReason: CANVAS_AI_DENIAL_REASONS.untrustedSession,
    });
    expect(resolveCanvasAIPermissions({ role: 'editor', userId: 'editor-user' })).toMatchObject({
      canUseAI: true,
      denialReason: null,
      trustedSession: true,
      userId: 'editor-user',
    });
    expect(resolveCanvasAIPermissions({ role: 'host', userId: 'host-user' })).toMatchObject({
      canUseAI: true,
      denialReason: null,
      trustedSession: true,
      userId: 'host-user',
    });
  });

  it('normalizes anonymous collaboration users to an untrusted session', () => {
    expect(resolveCanvasAIPermissions({ role: 'editor', userId: 'anonymous-user' })).toMatchObject({
      userId: null,
      trustedSession: false,
      canUseAI: false,
      denialReason: CANVAS_AI_DENIAL_REASONS.untrustedSession,
    });
  });
});
