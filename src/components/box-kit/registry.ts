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
  AlertBlock,
  Timeline,
} from './primitives/data-view';
import { SearchInput, SelectFilter, DateRangeFilter, ToggleGroup, TextField, TextAreaField } from './primitives/input-filter';
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
  'DAV-ALR-01': AlertBlock,
  'DAV-TML-01': Timeline,
  // IPF-* (input/filter)
  'IPF-SRH-01': SearchInput,
  'IPF-SLT-01': SelectFilter,
  'IPF-DAT-01': DateRangeFilter,
  'IPF-TGL-01': ToggleGroup,
  'IPF-TXT-01': TextField,
  'IPF-TXA-01': TextAreaField,
  // ACT-* (new action reference family)
  'ACT-BTN-P01': ActionButton,
  'ACT-BTN-P02': ActionButton,
  'ACT-BTN-P03': ActionButton,
  'ACT-BTN-S01': ActionButton,
  'ACT-BTN-S02': ActionButton,
  'ACT-BTN-S03': ActionButton,
  'ACT-BTN-PSA01': ActionButton,
  'ACT-BTN-PSA02': ActionButton,
  'ACT-BTN-PSA03': ActionButton,
  'ACT-BTN-SSA01': ActionButton,
  'ACT-BTN-SSA02': ActionButton,
  'ACT-BTN-SSA03': ActionButton,
  'ACT-MNU-W01': ActionMenu,
  'ACT-MNU-B01': ActionMenu,
  'ACT-STS-S01': StatusChip,
  'ACT-STS-S02': StatusChip,
  'ACT-STS-W01': StatusChip,
  'ACT-STS-W02': StatusChip,
  'ACT-STS-E01': StatusChip,
  'ACT-STS-E02': StatusChip,
  'ACT-STS-I01': StatusChip,
  'ACT-STS-I02': StatusChip,
  'ACT-STS-AN01': StatusChip,
  'ACT-STS-AN02': StatusChip,
  'ACT-STS-P01': StatusChip,
  'ACT-STS-SC01': StatusChip,
  'ACT-STS-O01': StatusChip,
  // Legacy ACT-* aliases kept during migration.
  'ACT-BTN-01': ActionButton,
  'ACT-BTN-02': ActionButton,
  'ACT-MNU-01': ActionMenu,
  'ACT-STS-01': StatusChip,
  // MDL-* (modal)
  'MDL-WND-D01': ModalShell,
  'MDL-WND-01': ModalShell,
  'MDL-HDR-01': ModalHeader as unknown as BoxKitComponent,
};

export function resolveBoxKitComponent(ref: string): BoxKitComponent | null {
  return BOX_KIT_REGISTRY[ref] ?? null;
}

export function listKnownRefs(): string[] {
  return Object.keys(BOX_KIT_REGISTRY);
}
