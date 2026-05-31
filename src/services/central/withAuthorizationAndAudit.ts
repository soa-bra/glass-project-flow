/**
 * withAuthorizationAndAudit — Generic Command Gateway decorator.
 *
 * يلفّ أي عملية كتابة (command) بثلاث طبقات:
 *   1) فحص صلاحية عبر RPC `has_permission`.
 *   2) تنفيذ العملية الأصلية.
 *   3) كتابة سجلّ audit_events (allowed/denied) دون إسقاط العملية عند فشل التسجيل.
 *
 * يخدم P2 (Generic Command Gateway المؤجَّل) ويوحّد سلوك كل خدمات central.
 *
 * @example
 *   export const createProject = withAuthorizationAndAudit(
 *     { permission: "project:create", resource_type: "project", action: "project.create" },
 *     async (input: CreateProjectInput) => ProjectsService.create(input),
 *   );
 */
import { supabase } from "@/integrations/supabase/client";
import { AuditService, type AuditScopeType } from "./audit.service";

export interface CommandPolicy {
  /** Permission code فحصه عبر RPC has_permission. اتركه null لتخطّي الفحص. */
  permission: string | null;
  /** نوع المورد لسجل audit (project, task, tool, …). */
  resource_type: string;
  /** اسم العملية لسجل audit (project.create, task.update, …). */
  action: string;
  /** نطاق اختياري لسجل audit. */
  scope_type?: AuditScopeType | null;
}

type AnyArgs = readonly unknown[];

type ResourceIdResolver<TArgs extends AnyArgs, TResult> = (
  args: TArgs,
  result: TResult | undefined,
) => string | null | undefined;

export interface CommandOptions<TArgs extends AnyArgs, TResult> {
  /** يستخرج resource_id لسجل audit (من المدخلات أو من النتيجة). */
  resolveResourceId?: ResourceIdResolver<TArgs, TResult>;
  /** بيانات وصفية إضافية تُرفق بسجل audit. */
  resolveMetadata?: (args: TArgs, result: TResult | undefined) => Record<string, unknown> | null;
}

class AuthorizationDeniedError extends Error {
  code = "PERMISSION_DENIED" as const;
  constructor(permission: string) {
    super(`صلاحية مفقودة: ${permission}`);
  }
}

export function withAuthorizationAndAudit<TArgs extends AnyArgs, TResult>(
  policy: CommandPolicy,
  command: (...args: TArgs) => Promise<TResult>,
  options: CommandOptions<TArgs, TResult> = {},
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    // 1) فحص الصلاحية (إذا كانت مطلوبة)
    if (policy.permission) {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) {
        await safeAudit({ ...policy, decision: "denied", reason: "unauthenticated", args, result: undefined, options });
        throw new AuthorizationDeniedError(policy.permission);
      }
      const { data: allowed, error } = await supabase.rpc("has_permission", {
        _user_id: userId,
        _permission_code: policy.permission,
      });
      if (error || !allowed) {
        await safeAudit({
          ...policy,
          decision: "denied",
          reason: error?.message ?? "permission missing",
          args,
          result: undefined,
          options,
        });
        throw new AuthorizationDeniedError(policy.permission);
      }
    }

    // 2) تنفيذ العملية
    let result: TResult;
    try {
      result = await command(...args);
    } catch (err) {
      await safeAudit({
        ...policy,
        decision: "denied",
        reason: err instanceof Error ? err.message : "command failed",
        args,
        result: undefined,
        options,
      });
      throw err;
    }

    // 3) سجلّ نجاح
    await safeAudit({ ...policy, decision: "allowed", reason: null, args, result, options });
    return result;
  };
}

async function safeAudit<TArgs extends AnyArgs, TResult>(input: {
  permission: string | null;
  resource_type: string;
  action: string;
  scope_type?: AuditScopeType | null;
  decision: "allowed" | "denied";
  reason: string | null;
  args: TArgs;
  result: TResult | undefined;
  options: CommandOptions<TArgs, TResult>;
}): Promise<void> {
  try {
    const resource_id = input.options.resolveResourceId?.(input.args, input.result) ?? null;
    const metadata = input.options.resolveMetadata?.(input.args, input.result) ?? null;
    await AuditService.log({
      action: input.action,
      resource_type: input.resource_type,
      resource_id,
      decision: input.decision,
      reason: input.reason ?? undefined,
      scope_type: input.scope_type ?? null,
      metadata,
    });
  } catch {
    /* audit must never break commands */
  }
}

export { AuthorizationDeniedError };
