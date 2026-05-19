/**
 * useSpecBoxData — resolves real `slotProps` (keyed by box ref → componentRef → props)
 * for spec-driven dashboards.
 *
 * Wiring contract documented in P5 plan: when a key in this map matches the
 * current dashboard, the SpecDrivenDashboard forwards `boxData` into TabRenderer,
 * which replaces the "بانتظار ربط البيانات" placeholder with the live primitives.
 *
 * @specRef
 *  - P5.2 — Projects (ProjectManagementBoard)
 *  - P5.3 — Departments جديدة (BCM / Partnerships / Knowledge)
 *  - P5.5 — Archive (ArchiveWorkspace) + Settings (SettingsWorkspace.account)
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BcmMembers,
  PartnershipAgreements,
  KnowledgeArticles,
} from '@/hooks/departments';
import { useProjects } from '@/hooks/central/useCentral';
import { supabase } from '@/integrations/supabase/client';
import { archiveService, type ArchiveCategory } from '@/services/archive/archiveService';
import { useSettings } from '@/hooks/settings/useSettings';

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
        'DAV-TBL-01': {
          columns: [
            { key: 'name', header: 'الاسم' },
            { key: 'segment', header: 'الشريحة' },
            { key: 'status', header: 'الحالة' },
            { key: 'joined_at', header: 'تاريخ الانضمام', render: (r: { joined_at?: string | null }) => fmtDate(r.joined_at) },
          ],
          rows: members.slice(0, 20),
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

// ── Projects (P5.2) ─────────────────────────────────────────────────────────
const ARCHIVE_CATEGORIES: ArchiveCategory[] = [
  'documents', 'projects', 'hr', 'financial', 'legal',
  'organizational', 'knowledge', 'templates', 'policies',
];

function useProjectsBoxData(): SpecBoxData {
  const { data: projects = [] } = useProjects();
  const { data: taskAgg = { total: 0, byState: {} as Record<string, number> } } = useQuery({
    queryKey: ['spec', 'tasks-aggregate'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('state')
        .limit(1000);
      if (error) throw error;
      const byState: Record<string, number> = {};
      ((data ?? []) as Array<{ state: string | null }>).forEach((t) => {
        const k = t.state ?? 'unknown';
        byState[k] = (byState[k] ?? 0) + 1;
      });
      return { total: data?.length ?? 0, byState };
    },
  });

  return useMemo(() => {
    const active = projects.filter((p) => p.state === 'active').length;
    const completed = projects.filter((p) => p.state === 'completed').length;
    const archived = projects.filter((p) => p.state === 'archived').length;

    return {
      'ProjectManagementBoard.overview.project-summary': {
        'DAV-KPI-01': {
          items: [
            { label: 'إجمالي المشاريع', value: projects.length },
            { label: 'نشطة', value: active, tone: 'positive' as const },
            { label: 'مكتملة', value: completed },
            { label: 'مؤرشفة', value: archived, tone: 'neutral' as const },
          ],
        },
      },
      'ProjectManagementBoard.overview.cards-grid': {
        'DAV-LST-01': {
          items: projects.slice(0, 8).map((p) => ({
            id: p.id,
            primary: (p as { name?: string; title?: string }).name ?? (p as { title?: string }).title ?? '—',
            secondary: `${p.state ?? '—'} • محدّث ${fmtDate(p.updated_at as string)}`,
            trailing: p.state,
          })),
        },
      },
      'ProjectManagementBoard.overview.phase-progress': {
        'DAV-KPI-01': {
          items: [
            { label: 'نسبة المكتمل', value: projects.length ? `${Math.round((completed / projects.length) * 100)}%` : '0%' },
            { label: 'النشط الآن', value: active },
          ],
        },
      },
      'ProjectManagementBoard.tasks.tasks-kpis': {
        'DAV-KPI-01': {
          items: [
            { label: 'إجمالي المهام', value: taskAgg.total },
            { label: 'منجزة', value: taskAgg.byState.completed ?? 0, tone: 'positive' as const },
            { label: 'نشطة', value: taskAgg.byState.active ?? 0 },
            { label: 'متوقفة', value: (taskAgg.byState.blocked ?? 0) + (taskAgg.byState.paused ?? 0), tone: 'critical' as const },
          ],
        },
      },
    };
  }, [projects, taskAgg]);
}

// ── Archive (P5.5) ──────────────────────────────────────────────────────────
function useArchiveBoxData(): SpecBoxData {
  const { data: byCategory = {} } = useQuery({
    queryKey: ['spec', 'archive-all'],
    queryFn: async () => {
      const out: Record<string, Array<{ id: string; title: string; updated_at: string; version: string | null; status: string }>> = {};
      await Promise.all(
        ARCHIVE_CATEGORIES.map(async (c) => {
          try {
            const rows = await archiveService.listByCategory(c);
            out[c] = rows.slice(0, 10).map((r) => ({
              id: r.id,
              title: r.title,
              updated_at: r.updated_at,
              version: r.version,
              status: r.status,
            }));
          } catch {
            out[c] = [];
          }
        }),
      );
      return out;
    },
  });

  return useMemo(() => {
    const map: SpecBoxData = {};
    ARCHIVE_CATEGORIES.forEach((c) => {
      const rows = byCategory[c] ?? [];
      map[`ArchiveWorkspace.${c}.records-list`] = {
        'DAV-LST-01': {
          items: rows.map((r) => ({
            id: r.id,
            primary: r.title,
            secondary: `${r.version ?? 'v1'} • محدّث ${fmtDate(r.updated_at)}`,
            trailing: r.status,
          })),
        },
        'DAV-TBL-01': {
          columns: [
            { key: 'title', header: 'العنوان' },
            { key: 'version', header: 'الإصدار' },
            { key: 'status', header: 'الحالة' },
            { key: 'updated_at', header: 'آخر تحديث', render: (r: { updated_at: string }) => fmtDate(r.updated_at) },
          ],
          rows,
        },
      };
    });
    return map;
  }, [byCategory]);
}

// ── Settings (P5.5) ─────────────────────────────────────────────────────────
function useSettingsBoxData(): SpecBoxData {
  const { data: account } = useSettings('account');
  const { data: security } = useSettings('security');

  return useMemo(() => {
    const accountPayload = (account?.payload ?? {}) as Record<string, unknown>;
    const securityPayload = (security?.payload ?? {}) as Record<string, unknown>;

    return {
      'SettingsWorkspace.account.account-stats': {
        'DAV-KPI-01': {
          items: [
            { label: 'الحساب', value: account ? 'محفوظ' : 'افتراضي' },
            { label: 'آخر تحديث', value: account ? fmtDate(account.updated_at) : '—' },
          ],
        },
        'DAV-TAG-01': {
          tags: Object.keys(accountPayload).slice(0, 6),
        },
      },
      'SettingsWorkspace.security.status-card': {
        'DAV-KPI-01': {
          items: [
            { label: 'MFA', value: securityPayload.mfa ? 'مفعّل' : 'غير مفعّل' },
            { label: 'آخر تحديث', value: security ? fmtDate(security.updated_at) : '—' },
          ],
        },
      },
    };
  }, [account, security]);
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
  const projects = useProjectsBoxData();
  const archive = useArchiveBoxData();
  const settings = useSettingsBoxData();

  if (dashboardKey === 'bcm') return bcm;
  if (dashboardKey === 'partnerships') return partnerships;
  if (dashboardKey === 'knowledge') return knowledge;
  if (dashboardKey === 'projects') return projects;
  if (dashboardKey === 'archive') return archive;
  if (dashboardKey === 'settings') return settings;
  return EMPTY;
}
