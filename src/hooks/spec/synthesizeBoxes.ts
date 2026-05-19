/**
 * Generic Box-level synthesizer for spec-driven dashboards.
 *
 * For each box defined in APP_SPEC under the given dashboardKey, produces
 * baseline slotProps keyed by componentRef so the renderer never falls back
 * to the "بانتظار ربط البيانات" placeholder. Callers may override any
 * specific box via a `richProps` map; otherwise an archetype-based default
 * is generated from the supplied `records` (or empty-state hints).
 *
 * @specRef P5.3 (Departments جديدة) — extended box coverage
 */
import { APP_SPEC, type BoxSpec, type TabSpec } from '@/config/app-spec';

export type SpecBoxData = Record<string, Record<string, Record<string, unknown>>>;

export interface SynthRecord {
  id: string;
  primary: string;
  secondary?: string;
  trailing?: string | null;
  tags?: string[];
  detail?: Array<{ label: string; value: string | number | null | undefined }>;
}

export interface SynthOptions {
  dashboardKey: string;
  /** Real records used to seed list/table/detail/kpi archetypes. */
  records: SynthRecord[];
  /** Per-tab overrides: tabCode → componentRef → props (deep-merged after defaults). */
  tabOverrides?: Record<string, Record<string, Record<string, unknown>>>;
  /** Per-box overrides: full box ref → componentRef → props (highest priority). */
  boxOverrides?: SpecBoxData;
  /** Display label for empty states ("الأعضاء", "الاتفاقيات", ...). */
  noun?: string;
}

function archetypeFor(tabCode: string, boxRef: string): string {
  const suffix = boxRef.split('.').pop() ?? '';
  if (suffix === 'summary') return 'kpi-tags';
  if (suffix === 'health') return 'alert';
  if (suffix === 'recent') return 'list';
  if (suffix === 'quick-actions' || suffix === 'actions' || suffix === 'asset-actions')
    return 'actions';
  if (suffix === 'filters' || suffix === 'search-filter') return 'filters';
  if (
    suffix === 'table' ||
    suffix === 'workspace-list' ||
    suffix === 'asset-list' ||
    suffix === 'report-list' ||
    suffix === 'library' ||
    suffix === 'policy-list'
  )
    return 'list';
  if (
    suffix === 'detail' ||
    suffix === 'asset-detail' ||
    suffix === 'configuration' ||
    suffix === 'compliance-state' ||
    suffix === 'template-preview'
  )
    return 'detail';
  if (suffix === 'editor' || suffix === 'template-editor') return 'editor';
  if (suffix === 'kpi') return 'kpi-tags';
  if (suffix === 'chart') return 'chart';
  if (suffix === 'generator' || suffix === 'audit' || suffix === 'template-governance')
    return 'actions';
  return 'detail';
}

function defaultPropsFor(
  archetype: string,
  componentRef: string,
  records: SynthRecord[],
  noun: string,
): Record<string, unknown> | null {
  const isData = componentRef.startsWith('DAV-');
  const isInput = componentRef.startsWith('IPF-');
  const isAction = componentRef.startsWith('ACT-');

  if (componentRef === 'DAV-TTL-01') return null; // title handled by BaseBox

  switch (archetype) {
    case 'kpi-tags': {
      if (componentRef === 'DAV-KPI-01')
        return {
          items: [
            { label: `إجمالي ${noun}`, value: records.length },
            ...(records.length
              ? [{ label: 'الأحدث', value: records[0]?.primary ?? '—' }]
              : [{ label: 'الحالة', value: 'لا توجد بيانات بعد' }]),
          ],
        };
      if (componentRef === 'DAV-TAG-01')
        return {
          tags: Array.from(
            new Set(records.flatMap((r) => r.tags ?? []).filter(Boolean)),
          ).slice(0, 6),
        };
      break;
    }
    case 'alert': {
      if (componentRef === 'DAV-ALR-01')
        return {
          tone: 'info' as const,
          title: records.length ? 'الوضع مستقر' : `لم تُسجَّل ${noun} بعد`,
          message: records.length
            ? `يوجد ${records.length} سجلًا متاحًا للمراجعة.`
            : 'ابدأ بإضافة سجلات لتفعيل المؤشرات.',
        };
      if (componentRef === 'DAV-TAG-01')
        return { tags: records.slice(0, 4).map((r) => r.trailing ?? r.primary).filter(Boolean) as string[] };
      if (componentRef === 'DAV-DTL-01')
        return {
          items: [
            { label: 'إجمالي', value: records.length },
            { label: 'الأحدث', value: records[0]?.primary ?? '—' },
          ],
        };
      break;
    }
    case 'list': {
      if (componentRef === 'DAV-LST-01')
        return {
          items: records.slice(0, 10).map((r) => ({
            id: r.id,
            primary: r.primary,
            secondary: r.secondary,
            trailing: r.trailing,
          })),
        };
      if (componentRef === 'DAV-TBL-01')
        return {
          columns: [
            { key: 'primary', header: 'العنوان' },
            { key: 'secondary', header: 'التفاصيل' },
            { key: 'trailing', header: 'الحالة' },
          ],
          rows: records.slice(0, 20),
        };
      if (isAction) return { label: 'فتح' };
      break;
    }
    case 'detail': {
      const r = records[0];
      if (componentRef === 'DAV-DTL-01')
        return {
          items: r?.detail ?? [
            { label: 'العنوان', value: r?.primary ?? '—' },
            { label: 'التفاصيل', value: r?.secondary ?? '—' },
            { label: 'الحالة', value: r?.trailing ?? '—' },
          ],
        };
      if (componentRef === 'DAV-TAG-01')
        return { tags: r?.tags?.slice(0, 6) ?? [] };
      break;
    }
    case 'editor': {
      if (componentRef === 'IPF-TXT-01')
        return { label: 'العنوان', placeholder: 'أدخل العنوان…', value: '' };
      if (componentRef === 'IPF-TXA-01')
        return { label: 'الوصف', placeholder: 'أدخل الوصف…', value: '', rows: 4 };
      if (componentRef === 'IPF-SLT-01')
        return {
          label: 'الحالة',
          options: [
            { value: 'draft', label: 'مسودة' },
            { value: 'active', label: 'نشط' },
            { value: 'archived', label: 'مؤرشف' },
          ],
        };
      if (componentRef === 'IPF-DAT-01') return { label: 'التاريخ' };
      if (componentRef === 'ACT-BTN-01') return { label: 'حفظ', variant: 'primary' };
      if (componentRef === 'ACT-BTN-02') return { label: 'إلغاء', variant: 'secondary' };
      if (componentRef === 'ACT-STS-01')
        return { label: 'مسودة', tone: 'neutral' as const };
      break;
    }
    case 'filters': {
      if (componentRef === 'IPF-SRH-01')
        return { placeholder: `ابحث في ${noun}…`, value: '' };
      if (componentRef === 'IPF-SLT-01')
        return {
          label: 'النوع',
          options: [
            { value: 'all', label: 'الكل' },
            ...Array.from(new Set(records.map((r) => r.trailing).filter(Boolean)))
              .slice(0, 5)
              .map((v) => ({ value: String(v), label: String(v) })),
          ],
        };
      if (componentRef === 'IPF-DAT-01') return { label: 'النطاق الزمني' };
      if (isAction) return { label: 'تطبيق', variant: 'primary' };
      break;
    }
    case 'actions': {
      if (componentRef === 'ACT-BTN-01') return { label: 'إجراء أساسي', variant: 'primary' };
      if (componentRef === 'ACT-BTN-02') return { label: 'إجراء ثانوي', variant: 'secondary' };
      if (componentRef === 'ACT-MNU-01')
        return {
          items: [
            { id: 'open', label: 'فتح' },
            { id: 'edit', label: 'تعديل' },
            { id: 'archive', label: 'أرشفة' },
          ],
        };
      if (componentRef === 'ACT-STS-01') return { label: 'جاهز', tone: 'positive' as const };
      break;
    }
    case 'chart': {
      if (componentRef === 'DAV-CHT-01')
        return {
          title: 'الاتجاه',
          data: records.slice(0, 8).map((r, i) => ({ x: r.primary, y: i + 1 })),
        };
      break;
    }
  }

  // Fallback skips: unknown ref → return null so renderer ignores it
  if (isData || isInput || isAction) return {};
  return null;
}

export function synthesizeDashboardBoxData(opts: SynthOptions): SpecBoxData {
  const { dashboardKey, records, tabOverrides = {}, boxOverrides = {}, noun = 'السجلات' } = opts;
  const dashboard = APP_SPEC.workspaces
    .flatMap((w) => w.dashboards)
    .find((d) => (d as { key: string }).key === dashboardKey) as
    | { tabs: TabSpec[] }
    | undefined;
  if (!dashboard) return {};

  const out: SpecBoxData = {};
  for (const tab of dashboard.tabs) {
    for (const box of tab.boxes as BoxSpec[]) {
      const archetype = archetypeFor(tab.code, box.ref);
      const slot: Record<string, Record<string, unknown>> = {};
      for (const ref of box.componentRefs ?? []) {
        if (!/^(DAV|IPF|ACT|MDL)-/.test(ref)) continue;
        const props = defaultPropsFor(archetype, ref, records, noun);
        if (props !== null) slot[ref] = props;
      }
      // Apply tab-level overrides (e.g. real KPI items for `overview.summary`)
      const tabOv = tabOverrides[tab.code]?.[box.ref.split('.').pop()!];
      if (tabOv) {
        for (const [ref, props] of Object.entries(tabOv)) {
          slot[ref] = { ...(slot[ref] ?? {}), ...(props as Record<string, unknown>) };
        }
      }
      // Apply box-level overrides
      const boxOv = boxOverrides[box.ref];
      if (boxOv) {
        for (const [ref, props] of Object.entries(boxOv)) {
          slot[ref] = { ...(slot[ref] ?? {}), ...(props as Record<string, unknown>) };
        }
      }
      out[box.ref] = slot;
    }
  }
  return out;
}
