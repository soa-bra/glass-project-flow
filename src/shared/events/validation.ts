import { z } from "zod";
import {
  BaseCommandSchema,
  BaseEventSchema,
  type CommandName,
  type EventName,
  getCommandSchema,
  getEventSchema,
} from "./contracts";

export type ValidationSuccess<T> = {
  ok: true;
  data: T;
};

export type ValidationFailure = {
  ok: false;
  errors: string[];
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

function toErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "root";
    return `${path}: ${issue.message}`;
  });
}

function makeId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-fallback-id`;
}

export function validateEventInput(input: {
  id?: string;
  version: number;
  state?: string;
  audit?: unknown;
  links?: unknown;
  board_refs?: unknown;
  name: EventName;
  payload: Record<string, unknown>;
  dedupKey?: string;
  timestamp?: Date | string;
  source?: string;
}): ValidationResult<z.infer<typeof BaseEventSchema>> {
  const enriched = {
    id: input.id ?? makeId(),
    version: input.version,
    state: input.state ?? "active",
    audit: input.audit ?? {
      created_at: new Date(),
      created_by: "system",
    },
    links: input.links ?? [],
    board_refs: input.board_refs ?? [],
    name: input.name,
    payload: input.payload,
    dedupKey: input.dedupKey,
    timestamp: input.timestamp,
    source: input.source,
  };

  const base = BaseEventSchema.safeParse(enriched);
  if (!base.success) {
    return { ok: false, errors: toErrors(base.error) };
  }

  const payloadSchema = getEventSchema(input.name, input.version);
  const payload = payloadSchema.safeParse(input.payload);
  if (!payload.success) {
    return { ok: false, errors: toErrors(payload.error) };
  }

  return {
    ok: true,
    data: {
      ...base.data,
      payload: payload.data,
    },
  };
}

export function validateCommandInput(input: {
  id?: string;
  version: number;
  state?: string;
  audit?: unknown;
  links?: unknown;
  board_refs?: unknown;
  name: CommandName;
  payload: Record<string, unknown>;
  issued_at?: Date | string;
  source?: string;
}): ValidationResult<z.infer<typeof BaseCommandSchema>> {
  const enriched = {
    id: input.id ?? makeId(),
    version: input.version,
    state: input.state ?? "requested",
    audit: input.audit ?? {
      created_at: new Date(),
      created_by: "system",
    },
    links: input.links ?? [],
    board_refs: input.board_refs ?? [],
    name: input.name,
    payload: input.payload,
    issued_at: input.issued_at,
    source: input.source,
  };

  const base = BaseCommandSchema.safeParse(enriched);
  if (!base.success) {
    return { ok: false, errors: toErrors(base.error) };
  }

  const payloadSchema = getCommandSchema(input.name, input.version);
  const payload = payloadSchema.safeParse(input.payload);
  if (!payload.success) {
    return { ok: false, errors: toErrors(payload.error) };
  }

  return {
    ok: true,
    data: {
      ...base.data,
      payload: payload.data,
    },
  };
}
