/**
 * Unified connector appearance & routing.
 * المظهر ثابت لجميع الموصلات: اللون والعرض والحركة موحدة.
 * @specRef connectors.spec.v2
 */

export const CONNECTOR_COLOR_START = '#3DBE8B'; // نفس تدرّج الأنكر
export const CONNECTOR_COLOR_END = '#3DA8F5';
export const CONNECTOR_SOLID_FALLBACK = '#3DA8F5';

export const CONNECTOR_BASE_WIDTH = 2.5;
export const CONNECTOR_HOVER_WIDTH = 4;
export const CONNECTOR_SELECTED_WIDTH = 4;

export const CONNECTOR_STUB = 24;   // المسافة العرضية القصيرة عند الخروج/الوصول
export const CONNECTOR_CORNER = 10; // نصف قطر تدوير الزوايا

export type AnchorSide = 'top' | 'bottom' | 'left' | 'right';

export function mirrorAnchor(a: AnchorSide): AnchorSide {
  return ({ left: 'right', right: 'left', top: 'bottom', bottom: 'top' } as const)[a];
}

export function getConnectorStrokeWidth(state: {
  isHovered?: boolean;
  isSelected?: boolean;
}): number {
  if (state.isHovered) return CONNECTOR_HOVER_WIDTH;
  if (state.isSelected) return CONNECTOR_SELECTED_WIDTH;
  return CONNECTOR_BASE_WIDTH;
}

const DIRS: Record<AnchorSide, { x: number; y: number }> = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
};

/**
 * مسار متعامد ذو زوايا مدوّرة، مع "stub" عرضي قصير من الأنكر.
 * الخطوات: start → stub بعيداً عن الحافة → ممر متعامد → stub داخل الهدف → end.
 */
export function buildConnectorPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
  startAnchor: AnchorSide,
  endAnchor: AnchorSide,
  stub: number = CONNECTOR_STUB,
  radius: number = CONNECTOR_CORNER,
): string {
  const s = DIRS[startAnchor];
  const e = DIRS[endAnchor];
  const s1 = { x: start.x + s.x * stub, y: start.y + s.y * stub };
  const e1 = { x: end.x + e.x * stub, y: end.y + e.y * stub };

  const isStartH = startAnchor === 'left' || startAnchor === 'right';
  const isEndH = endAnchor === 'left' || endAnchor === 'right';

  let waypoints: { x: number; y: number }[];
  if (isStartH && isEndH) {
    const mx = (s1.x + e1.x) / 2;
    waypoints = [s1, { x: mx, y: s1.y }, { x: mx, y: e1.y }, e1];
  } else if (!isStartH && !isEndH) {
    const my = (s1.y + e1.y) / 2;
    waypoints = [s1, { x: s1.x, y: my }, { x: e1.x, y: my }, e1];
  } else if (isStartH) {
    waypoints = [s1, { x: e1.x, y: s1.y }, e1];
  } else {
    waypoints = [s1, { x: s1.x, y: e1.y }, e1];
  }

  const pts = [start, ...waypoints, end];
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const next = pts[i + 1];
    const v1x = curr.x - prev.x;
    const v1y = curr.y - prev.y;
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;
    const len1 = Math.hypot(v1x, v1y);
    const len2 = Math.hypot(v2x, v2y);
    if (len1 < 0.5 || len2 < 0.5) {
      d += ` L ${curr.x} ${curr.y}`;
      continue;
    }
    const r = Math.min(radius, len1 / 2, len2 / 2);
    if (r < 1) {
      d += ` L ${curr.x} ${curr.y}`;
      continue;
    }
    const p1 = { x: curr.x - (v1x / len1) * r, y: curr.y - (v1y / len1) * r };
    const p2 = { x: curr.x + (v2x / len2) * r, y: curr.y + (v2y / len2) * r };
    d += ` L ${p1.x} ${p1.y} Q ${curr.x} ${curr.y} ${p2.x} ${p2.y}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

/** يستخدم كـ id فريد لتعريف gradient/glow داخل SVG defs */
export function connectorGradientIds(scopeId: string) {
  return {
    gradientId: `connector-grad-${scopeId}`,
    glowId: `connector-glow-${scopeId}`,
  };
}

/** أنواع العناصر التي تُعدّ موصلات */
export const CONNECTOR_ELEMENT_TYPES = new Set([
  'mindmap_connector',
  'visual_connector',
]);
