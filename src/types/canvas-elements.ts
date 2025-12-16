export type ElementId = string;

export type ElementType = "rect" | "note" | "text" | "frame" | "image" | "connector" | "group";

export type ElementStyle = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  opacity?: number;
  fontSize?: number;
  fontWeight?: number | string;
  textColor?: string;
  zIndex?: number;
};

export type BaseElement = {
  id: ElementId;
  type: ElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number; // degrees
  locked?: boolean;
  hidden?: boolean;
  style?: ElementStyle;
  name?: string;
  createdAt?: number;
  updatedAt?: number;
};

export type RectElement = BaseElement & {
  type: "rect";
};

export type NoteElement = BaseElement & {
  type: "note";
  text?: string;
};

export type TextElement = BaseElement & {
  type: "text";
  text?: string;
};

export type FrameElement = BaseElement & {
  type: "frame";
};

export type ImageElement = BaseElement & {
  type: "image";
  src?: string;
};

export type ConnectorElement = BaseElement & {
  type: "connector";
  fromId?: ElementId;
  toId?: ElementId;
};

export type GroupElement = BaseElement & {
  type: "group";
  childIds?: ElementId[];
};

export type CanvasElementModel =
  | RectElement
  | NoteElement
  | TextElement
  | FrameElement
  | ImageElement
  | ConnectorElement
  | GroupElement;

export type ElementsById = Record<ElementId, CanvasElementModel>;

export const DEFAULT_ELEMENT_STYLE: Required<ElementStyle> = {
  fill: "#ffffff",
  stroke: "#e5e7eb",
  strokeWidth: 1,
  radius: 12,
  opacity: 1,
  fontSize: 14,
  fontWeight: 500,
  textColor: "#111827",
  zIndex: 0,
};

export function nowTs() {
  return Date.now();
}

export function createElement(
  partial: Partial<CanvasElementModel> & Pick<CanvasElementModel, "type">,
): CanvasElementModel {
  const id = partial.id ?? cryptoRandomId();
  const t = nowTs();

  const base: BaseElement = {
    id,
    type: partial.type,
    x: partial.x ?? 0,
    y: partial.y ?? 0,
    w: partial.w ?? 240,
    h: partial.h ?? 160,
    rotation: partial.rotation ?? 0,
    locked: partial.locked ?? false,
    hidden: partial.hidden ?? false,
    style: { ...DEFAULT_ELEMENT_STYLE, ...(partial.style ?? {}) },
    name: partial.name ?? "",
    createdAt: partial.createdAt ?? t,
    updatedAt: partial.updatedAt ?? t,
  };

  switch (partial.type) {
    case "note":
      return { ...base, type: "note", text: (partial as any).text ?? "ملاحظة" };
    case "text":
      return { ...base, type: "text", text: (partial as any).text ?? "نص" };
    case "image":
      return { ...base, type: "image", src: (partial as any).src ?? "" };
    case "connector":
      return {
        ...base,
        type: "connector",
        fromId: (partial as any).fromId,
        toId: (partial as any).toId,
      };
    case "group":
      return {
        ...base,
        type: "group",
        childIds: (partial as any).childIds ?? [],
      };
    case "frame":
      return { ...base, type: "frame" };
    case "rect":
    default:
      return { ...base, type: "rect" };
  }
}

export function normalizeElement(el: CanvasElementModel): CanvasElementModel {
  return {
    ...el,
    rotation: el.rotation ?? 0,
    locked: el.locked ?? false,
    hidden: el.hidden ?? false,
    style: { ...DEFAULT_ELEMENT_STYLE, ...(el.style ?? {}) },
    createdAt: el.createdAt ?? nowTs(),
    updatedAt: nowTs(),
  } as CanvasElementModel;
}

export function applyElementPatch(el: CanvasElementModel, patch: Partial<CanvasElementModel>): CanvasElementModel {
  const next: CanvasElementModel = {
    ...(el as any),
    ...(patch as any),
    style: patch.style ? { ...(el.style ?? {}), ...(patch.style as any) } : el.style,
    updatedAt: nowTs(),
  };
  return normalizeElement(next);
}

export function toById(list: CanvasElementModel[]): ElementsById {
  const byId: ElementsById = {};
  for (const el of list) byId[el.id] = el;
  return byId;
}

export function cryptoRandomId() {
  // Works in modern browsers; fallback to Math.random
  try {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return Math.random().toString(36).slice(2);
  }
}
