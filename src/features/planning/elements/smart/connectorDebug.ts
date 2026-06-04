/**
 * @specRef planning/smart-connectors
 * Connector anchor configuration + debug mode.
 *
 * - ANCHOR_OFFSET: configurable offset of the single drag anchor relative to
 *   the selected element's top-right corner. Tunable for all node layouts.
 * - useConnectorDebug: localStorage-backed toggle, also enabled via
 *   `?debugConnectors=1` URL flag. Exposes window.__connectorDebug for quick
 *   toggling from devtools.
 */
import { useEffect, useState } from 'react';

export const ANCHOR_OFFSET = {
  /** Pixels from the element's right edge, outward. */
  x: 14,
  /** Pixels from the element's top edge, downward. */
  y: 12,
  /** Visible circle radius. */
  visibleRadius: 6,
  /** Invisible hit-area radius (larger for easier grabbing). */
  hitRadius: 18,
};

const STORAGE_KEY = 'sb.connector.debug';

function readInitial(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (new URLSearchParams(window.location.search).get('debugConnectors') === '1') return true;
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

type Listener = (v: boolean) => void;
const listeners = new Set<Listener>();
let current = readInitial();

export function setConnectorDebug(v: boolean) {
  current = v;
  try {
    window.localStorage.setItem(STORAGE_KEY, v ? '1' : '0');
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(v));
}

export function getConnectorDebug() {
  return current;
}

if (typeof window !== 'undefined') {
  (window as unknown as { __connectorDebug?: unknown }).__connectorDebug = {
    enable: () => setConnectorDebug(true),
    disable: () => setConnectorDebug(false),
    toggle: () => setConnectorDebug(!current),
    get: () => current,
  };
}

export function useConnectorDebug(): [boolean, (v: boolean) => void] {
  const [v, setV] = useState(current);
  useEffect(() => {
    const l: Listener = (next) => setV(next);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return [v, setConnectorDebug];
}
