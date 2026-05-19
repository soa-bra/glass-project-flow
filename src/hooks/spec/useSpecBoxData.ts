/**
 * useSpecBoxData — resolves real `slotProps` (keyed by box ref → componentRef → props)
 * for the spec-driven dashboards added in P2 (bcm, partnerships, knowledge).
 *
 * Wiring contract documented in P5 plan: when a key in this map matches the
 * current dashboard, the SpecDrivenDashboard forwards `boxData` into TabRenderer,
 * which replaces the "بانتظار ربط البيانات" placeholder with the live primitives.
 *
 * @specRef P5.3 — Departments جديدة (BCM / Partnerships / Knowledge)
 */
import { useMemo } from 'react';
import {
  BcmMembers,
  PartnershipAgreements,
  KnowledgeArticles,
} from '@/hooks/departments';

export type SpecBoxData = Record<string, Record<string, Record<string, unknown>>>;

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('ar-SA-u-nu-latn', { dateStyle: 'medium' }) : '—';

// ── BCM ─────────────────────────────────────────────────────────────────────
function useBcmBoxData(): SpecBoxData {
  const { data: members = [] } = BcmMembers.useList({
    orderBy: { column: 'created_at', ascending: false },
    limit: 50,
  });

  return useMemo(() => {
    const active = members.filter((m) => m.status === 'active').length;
    const segments = new Set(members.map((m) => m.segment).filter(Boolean));
    const recentItems = members.slice(0, 5).map((m) => ({
      id: m.id,
      primary: m.name,
      secondary: `${m.segment ?? 'بدون شريحة'} • انضم ${fmtDate(m.joined_at as string)}`,
      trailing: m.status,
    }));
    const atRisk = members.filter((m) => m.status === 'at_risk' || m.status === 'churn').length;

    return {
      'BCMDashboard.overview.summary': {
        'DAV-KPI-01': {
          items: [
            { label: 'إجمالي الأعضاء', value: members.length },
            { label: 'النشطون', value: active, tone: 'positive' as const },
            { label: 'الشرائح', value: segments.size },
          ],
        },
        'DAV-TAG-01': { tags: Array.from(segments).slice(0, 6) as string[] },
      },
      'BCMDashboard.overview.health': {
        'DAV-ALR-01': {
          tone: atRisk > 0 ? ('warning' as const) : ('success' as const),
          title: atRisk > 0 ? `${atRisk} عضو بحاجة متابعة` : 'لا توجد تنبيهات',
          message: atRisk > 0 ? 'يُنصح بمراجعة الأعضاء ذوي مؤشر الانسحاب.' : 'صحة المجتمع مستقرة.',
        },
      },
      'BCMDashboard.overview.recent': {
        'DAV-LST-01': { items: recentItems },
      },
      'BCMDashboard.members.table': {
        'DAV-LST-01': {
          items: members.slice(0, 10).map((m) => ({
            id: m.id,
            primary: m.name,
            secondary: m.email ?? '—',
            trailing: m.status,
          })),
        },
      },
    };
  }, [members]);
}

// ── Partnerships ────────────────────────────────────────────────────────────
function usePartnershipsBoxData(): SpecBoxData {
  const { data: agreements = [] } = PartnershipAgreements.useList({
    orderBy: { column: 'created_at', ascending: false },
    limit: 50,
  });

  return useMemo(() => {
    const active = agreements.filter((a) => a.status === 'active').length;
    const totalValue = agreements.reduce((s, a) => s + Number(a.value ?? 0), 0);
    const expiringSoon = agreements.filter((a) => {
      if (!a.end_date) return false;
      const days = (new Date(a.end_date).getTime() - Date.now()) / 86400_000;
      return days >= 0 && days <= 60;
    });
    const types = new Set(agreements.map((a) => a.type).filter(Boolean));

    return {
      'InstitutionalPartnershipsDashboard.overview.summary': {
        'DAV-KPI-01': {
          items: [
            { label: 'الاتفاقيات', value: agreements.length },
            { label: 'النشطة', value: active, tone: 'positive' as const },
            { label: 'القيمة الإجمالية', value: totalValue.toLocaleString('ar-SA-u-nu-latn') },
          ],
        },
        'DAV-TAG-01': { tags: Array.from(types).slice(0, 6) as string[] },
      },
      'InstitutionalPartnershipsDashboard.overview.health': {
        'DAV-ALR-01': {
          tone: expiringSoon.length > 0 ? ('warning' as const) : ('success' as const),
          title:
            expiringSoon.length > 0
              ? `${expiringSoon.length} اتفاقية تنتهي خلال 60 يومًا`
              : 'لا توجد اتفاقيات قاربت الانتهاء',
          items: expiringSoon.slice(0, 5).map((a) => ({
            id: a.id,
            text: `${a.name} — ${fmtDate(a.end_date as string)}`,
          })),
        },
      },
      'InstitutionalPartnershipsDashboard.overview.recent': {
        'DAV-LST-01': {
          items: agreements.slice(0, 5).map((a) => ({
            id: a.id,
            primary: a.name,
            secondary: `${a.partner_name ?? '—'} • ${a.type ?? '—'}`,
            trailing: a.status,
          })),
        },
      },
    };
  }, [agreements]);
}

// ── Knowledge ───────────────────────────────────────────────────────────────
function useKnowledgeBoxData(): SpecBoxData {
  const { data: articles = [] } = KnowledgeArticles.useList({
    orderBy: { column: 'updated_at', ascending: false },
    limit: 50,
  });

  return useMemo(() => {
    const published = articles.filter((a) => a.status === 'published').length;
    const drafts = articles.filter((a) => a.status === 'draft').length;
    const categories = new Set(articles.map((a) => a.category).filter(Boolean));
    const allTags = Array.from(new Set(articles.flatMap((a) => a.tags ?? []))).slice(0, 8);

    return {
      'KnowledgeBaseDashboard.overview.summary': {
        'DAV-KPI-01': {
          items: [
            { label: 'إجمالي المقالات', value: articles.length },
            { label: 'منشورة', value: published, tone: 'positive' as const },
            { label: 'مسودات', value: drafts, tone: 'neutral' as const },
            { label: 'التصنيفات', value: categories.size },
          ],
        },
        'DAV-TAG-01': { tags: allTags },
      },
      'KnowledgeBaseDashboard.overview.health': {
        'DAV-ALR-01': {
          tone: drafts > published ? ('warning' as const) : ('info' as const),
          title:
            drafts > published
              ? 'عدد المسودات يتجاوز المنشور — يُنصح بمراجعة قائمة الانتظار'
              : 'حالة المعرفة جيدة',
        },
      },
      'KnowledgeBaseDashboard.overview.recent': {
        'DAV-LST-01': {
          items: articles.slice(0, 5).map((a) => ({
            id: a.id,
            primary: a.title,
            secondary: `${a.category ?? '—'} • v${a.version}`,
            trailing: a.status,
          })),
        },
      },
    };
  }, [articles]);
}

const EMPTY: SpecBoxData = {};

/**
 * Returns the slot props map for a given dashboard key.
 * Hooks for each dashboard are called unconditionally to keep the order stable
 * across renders; only the matching map is returned.
 */
export function useSpecBoxData(dashboardKey: string): SpecBoxData {
  const bcm = useBcmBoxData();
  const partnerships = usePartnershipsBoxData();
  const knowledge = useKnowledgeBoxData();

  if (dashboardKey === 'bcm') return bcm;
  if (dashboardKey === 'partnerships') return partnerships;
  if (dashboardKey === 'knowledge') return knowledge;
  return EMPTY;
}
