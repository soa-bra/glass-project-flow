/**
 * Box-Kit registry — single mapping from spec componentRef → React component.
 * The renderer rejects any ref not present here, surfacing missing primitives early.
 *
 * @specRef mem://spec/box-kit-vocabulary
 */
import type { ComponentType } from 'react';
import {
  BoxTitle,
  KpiCluster,
  TagStrip,
  DetailList,
  DataTable,
  DataList,
  ChartFrame,
} from './primitives/data-view';
import { SearchInput, SelectFilter, DateRangeFilter, ToggleGroup } from './primitives/input-filter';
import { ActionButton, ActionMenu, StatusChip } from './primitives/action';
import { ModalShell, ModalHeader } from './primitives/modal';

export type BoxKitComponent = ComponentType<any>;

export const BOX_KIT_REGISTRY: Record<string, BoxKitComponent> = {
  // DAV-* (data view)
  'DAV-TTL-01': BoxTitle,
  'DAV-KPI-01': KpiCluster,
  'DAV-TAG-01': TagStrip,
  'DAV-DTL-01': DetailList,
  'DAV-TBL-01': DataTable,
  'DAV-LST-01': DataList,
  'DAV-CHT-01': ChartFrame,
  // IPF-* (input/filter)
  'IPF-SRH-01': SearchInput,
  'IPF-SLT-01': SelectFilter,
  'IPF-DAT-01': DateRangeFilter,
  'IPF-TGL-01': ToggleGroup,
  // ACT-* (action)
  'ACT-BTN-01': ActionButton,
  'ACT-BTN-02': ActionButton,
  'ACT-MNU-01': ActionMenu,
  'ACT-STS-01': StatusChip,
  // MDL-* (modal)
  'MDL-WND-01': ModalShell,
  'MDL-HDR-01': ModalHeader as unknown as BoxKitComponent,
};

export function resolveBoxKitComponent(ref: string): BoxKitComponent | null {
  return BOX_KIT_REGISTRY[ref] ?? null;
}

export function listKnownRefs(): string[] {
  return Object.keys(BOX_KIT_REGISTRY);
}
