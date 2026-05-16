import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { audit } from '@/services/audit';
import type { TabData } from './types';

/**
 * P3.b — Operations sub-tabs wired to real central + department tables.
 * Each tab aggregates from Supabase directly (no mock fallback).
 * Visual sections that have no underlying source yet render with empty arrays
 * (UI shows empty states). Adding rows in the corresponding department CRUD
 * populates these views automatically.
 */
export const useTabData = (activeTab: string, isVisible: boolean) => {
  const [tabData, setTabData] = useState<TabData>({});
  const [loading, setLoading] = useState(false);

  const fetchTabData = async (tabName: string) => {
    setLoading(true);
    try {
      const next = await loaders[tabName as keyof typeof loaders]?.();
      if (next !== undefined) {
        setTabData((prev) => ({ ...prev, [tabName]: next }));
      }
    } catch (err) {
      console.error(`[OperationsBoard] failed to load ${tabName}`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) void fetchTabData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isVisible]);

  return { tabData, loading };
};

// ──────────────────────────────────────────────────────────────────────────────
// Loaders per tab — real aggregations from central / domain tables.
// ──────────────────────────────────────────────────────────────────────────────

const monthKey = (d: Date) =>
  d.toLocaleDateString('ar-SA-u-nu-latn', { month: 'long' });

const last6Months = (): { key: string; start: Date; end: Date }[] => {
  const out: { key: string; start: Date; end: Date }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    out.push({ key: monthKey(start), start, end });
  }
  return out;
};

const loaders = {
  overview: async () => {
    const [projectsRes, tasksRes, customersRes, ticketsRes] = await Promise.all([
      supabase.from('projects').select('id, state, budget, due_date'),
      supabase.from('tasks').select('id, state, due_date'),
      supabase.from('crm_customers').select('id'),
      supabase.from('crm_service_tickets').select('id, status'),
    ]);
    const projects = projectsRes.data ?? [];
    const tasks = tasksRes.data ?? [];
    const now = Date.now();
    const expectedRevenue = Math.round(
      projects.reduce((s, p) => s + (Number(p.budget) || 0), 0) / 1000,
    );
    const delayedProjects = projects.filter(
      (p) => p.due_date && new Date(p.due_date).getTime() < now && p.state !== 'completed',
    ).length;
    const complaints = (ticketsRes.data ?? []).filter((t) => t.status !== 'closed').length;
    const overdueTasks = tasks.filter(
      (t) => t.due_date && new Date(t.due_date).getTime() < now && t.state !== 'completed',
    ).length;
    return {
      stats: {
        expectedRevenue,
        delayedProjects,
        complaints: complaints || overdueTasks,
        totalCustomers: (customersRes.data ?? []).length,
      },
    };
  },

  finance: async () => {
    const [budgetsRes, txRes, invoicesRes] = await Promise.all([
      supabase.from('financial_budgets').select('planned_amount, spent_amount, period'),
      supabase.from('financial_transactions').select('amount, kind, date'),
      supabase.from('invoices').select('total_amount, status, issue_date'),
    ]);
    const budgets = budgetsRes.data ?? [];
    const tx = txRes.data ?? [];
    const invoices = invoicesRes.data ?? [];

    const totalBudget = budgets.reduce((s, b) => s + Number(b.planned_amount || 0), 0);
    const totalSpent = budgets.reduce((s, b) => s + Number(b.spent_amount || 0), 0);

    const months = last6Months();
    const monthlyBudget = months.map(({ key, start, end }) => {
      const txInMonth = tx.filter((t) => {
        const d = new Date(t.date);
        return d >= start && d <= end;
      });
      const actual = txInMonth
        .filter((t) => t.kind === 'expense')
        .reduce((s, t) => s + Number(t.amount || 0), 0);
      const monthlyPlan = totalBudget / 12;
      return {
        month: key,
        budget: Math.round(monthlyPlan),
        actual: Math.round(actual),
        variance: Math.round(actual - monthlyPlan),
      };
    });

    let cumulative = 0;
    const cashFlow = months.map(({ key, start, end }) => {
      const inflow = tx
        .filter((t) => {
          const d = new Date(t.date);
          return d >= start && d <= end && t.kind === 'income';
        })
        .reduce((s, t) => s + Number(t.amount || 0), 0);
      const outflow = tx
        .filter((t) => {
          const d = new Date(t.date);
          return d >= start && d <= end && t.kind === 'expense';
        })
        .reduce((s, t) => s + Number(t.amount || 0), 0);
      const net = inflow - outflow;
      cumulative += net;
      return { date: key, inflow, outflow, netFlow: net, cumulativeBalance: cumulative };
    });

    const paidInvoices = invoices
      .filter((i) => i.status === 'paid')
      .reduce((s, i) => s + Number(i.total_amount || 0), 0);

    const kpis = [
      {
        id: 'revenue',
        title: 'الإيرادات المحصّلة',
        value: Math.round(paidInvoices),
        target: Math.round(totalBudget || paidInvoices * 1.1),
        trend: 'up' as const,
        format: 'currency' as const,
      },
      {
        id: 'spent-ratio',
        title: 'نسبة الصرف',
        value: totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0,
        target: 80,
        trend: 'stable' as const,
        format: 'percentage' as const,
      },
    ];

    return {
      monthlyBudget,
      cashFlow,
      kpis,
      totalBudget,
      totalSpent,
      forecastAccuracy: totalBudget
        ? Math.max(0, Math.round(100 - Math.abs((totalSpent - totalBudget) / totalBudget) * 100))
        : 0,
    };
  },

  projects: async () => {
    const projectsRes = await supabase
      .from('projects')
      .select('id, name, state, start_date, due_date, priority, metadata')
      .order('created_at', { ascending: false });
    const projects = projectsRes.data ?? [];
    const now = Date.now();
    const status = (p: typeof projects[number]): 'on-track' | 'at-risk' | 'delayed' => {
      if (p.state === 'completed') return 'on-track';
      const due = p.due_date ? new Date(p.due_date).getTime() : null;
      if (due && due < now) return 'delayed';
      if (due && due - now < 7 * 86400_000) return 'at-risk';
      return 'on-track';
    };
    const priorityMap = (p: string): 'high' | 'medium' | 'low' => {
      if (p === 'critical' || p === 'high') return 'high';
      if (p === 'low') return 'low';
      return 'medium';
    };
    const criticalProjects = projects.slice(0, 12).map((p) => {
      const meta = (p.metadata as Record<string, unknown> | null) ?? {};
      const progress = Number(meta.progress) || (p.state === 'completed' ? 100 : 0);
      return {
        id: p.id,
        name: p.name,
        startDate: (p.start_date as string) ?? '',
        endDate: (p.due_date as string) ?? '',
        progress,
        status: status(p),
        priority: priorityMap(String(p.priority ?? 'medium')),
      };
    });
    const total = projects.length;
    const onTrack = criticalProjects.filter((p) => p.status === 'on-track').length;
    const atRisk = criticalProjects.filter((p) => p.status === 'at-risk').length;
    const delayed = criticalProjects.filter((p) => p.status === 'delayed').length;
    return {
      criticalProjects,
      delayedMilestones: [],
      summary: {
        totalProjects: total,
        onTrack,
        atRisk,
        delayed,
        completionRate: total ? Math.round((onTrack / total) * 100) : 0,
      },
      aiAdvice: [],
    };
  },

  marketing: async () => {
    const [campaignsRes, leadsRes] = await Promise.all([
      supabase
        .from('marketing_campaigns')
        .select('id, name, channel, status, budget, spent, start_date, end_date'),
      supabase.from('marketing_leads').select('id, source, status, score, campaign_id'),
    ]);
    const campaigns = campaignsRes.data ?? [];
    const leads = leadsRes.data ?? [];
    const totalSpent = campaigns.reduce((s, c) => s + Number(c.spent || 0), 0);
    const totalBudget = campaigns.reduce((s, c) => s + Number(c.budget || 0), 0);
    const wonLeads = leads.filter((l) => l.status === 'won' || l.status === 'qualified').length;
    const totalRevenue = wonLeads * 5000; // estimated until invoice→lead linkage exists

    const channels = Array.from(new Set(campaigns.map((c) => c.channel).filter(Boolean))) as string[];
    const roasData = channels.map((channel) => {
      const inv = campaigns
        .filter((c) => c.channel === channel)
        .reduce((s, c) => s + Number(c.spent || 0), 0);
      const rev = leads
        .filter((l) => {
          const c = campaigns.find((cc) => cc.id === l.campaign_id);
          return c?.channel === channel && (l.status === 'won' || l.status === 'qualified');
        }).length * 5000;
      return {
        channel,
        investment: inv,
        revenue: rev,
        roas: inv ? +(rev / inv).toFixed(2) : 0,
        trend: 'stable' as const,
      };
    });

    return {
      roasData,
      campaigns: campaigns.map((c) => ({
        id: c.id,
        name: c.name,
        channel: c.channel ?? '',
        status: c.status,
        budget: Number(c.budget || 0),
        spent: Number(c.spent || 0),
        startDate: c.start_date ?? '',
        endDate: c.end_date ?? '',
      })),
      attribution: [],
      kpis: [],
      totalROAS: totalSpent ? +(totalRevenue / totalSpent).toFixed(2) : 0,
      totalSpent,
      totalRevenue,
      totalBudget,
    };
  },

  hr: async () => {
    const [empRes, attRes, reviewsRes] = await Promise.all([
      supabase.from('hr_employees').select('id, status, role, metadata'),
      supabase.from('hr_attendance').select('status, date'),
      supabase.from('hr_performance_reviews').select('score'),
    ]);
    const employees = empRes.data ?? [];
    const attendance = attRes.data ?? [];
    const reviews = reviewsRes.data ?? [];

    const active = employees.filter((e) => e.status === 'active').length;
    const onLeave = employees.filter((e) => e.status === 'on_leave' || e.status === 'leave').length;
    const vacancies = employees.filter((e) => e.status === 'vacant').length;
    const totalEmployees = employees.length;
    const performanceScore = reviews.length
      ? +(reviews.reduce((s, r) => s + Number(r.score || 0), 0) / reviews.length).toFixed(1)
      : 0;
    const presentToday = attendance.filter(
      (a) =>
        a.status === 'present' &&
        new Date(a.date as string).toDateString() === new Date().toDateString(),
    ).length;
    const avgUtilization = totalEmployees
      ? Math.round((presentToday / totalEmployees) * 100)
      : 0;

    return {
      resourceUtilization: [],
      skillGaps: [],
      workloadBalance: [],
      stats: {
        totalEmployees,
        activeProjects: 0,
        avgUtilization,
        skillGaps: 0,
        performanceScore,
        retentionRate: 0,
        active,
        onLeave,
        vacancies,
      },
    };
  },

  clients: async () => {
    const [customersRes, oppsRes, ticketsRes, contractsRes] = await Promise.all([
      supabase.from('crm_customers').select('id, status'),
      supabase.from('crm_opportunities').select('id, stage, value, probability'),
      supabase.from('crm_service_tickets').select('id, status, priority'),
      supabase.from('legal_contracts').select('id, status, signed_at, expires_at'),
    ]);
    const customers = customersRes.data ?? [];
    const opps = oppsRes.data ?? [];
    const contracts = contractsRes.data ?? [];

    const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'won'];
    const opportunityFunnel = stages.map((stage) => {
      const inStage = opps.filter((o) => o.stage === stage);
      return {
        stage,
        count: inStage.length,
        value: inStage.reduce((s, o) => s + Number(o.value || 0), 0),
        conversionRate: opps.length ? Math.round((inStage.length / opps.length) * 100) : 0,
      };
    });

    const activeContracts = contracts.filter((c) => c.status === 'active' || c.status === 'signed').length;
    const avgValue = opps.length
      ? opps.reduce((s, o) => s + Number(o.value || 0), 0) / opps.length
      : 0;

    return {
      opportunityFunnel,
      npsScores: [],
      sentimentData: [],
      portfolioHealth: {
        totalClients: customers.length,
        activeContracts,
        renewalRate: 0,
        churnRate: customers.length
          ? Math.round(
              (customers.filter((c) => c.status === 'churned' || c.status === 'inactive').length /
                customers.length) *
                100,
            )
          : 0,
        avgContractValue: Math.round(avgValue),
        clientSatisfaction: 0,
      },
      tickets: ticketsRes.data ?? [],
    };
  },

  reports: async () => {
    const [docsRes, projectsRes, invoicesRes] = await Promise.all([
      supabase.from('kmpa_documents').select('id, category, status, updated_at'),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('invoices').select('id', { count: 'exact', head: true }),
    ]);
    const docs = docsRes.data ?? [];
    const categories: Record<string, number> = {};
    docs.forEach((d) => {
      const k = (d.category as string) ?? 'عام';
      categories[k] = (categories[k] ?? 0) + 1;
    });
    const popularCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return {
      templates: docs.slice(0, 10).map((d) => ({
        id: d.id,
        name: (d.category as string) ?? 'تقرير',
        category: (d.category as string) ?? 'عام',
        lastUpdated: (d.updated_at as string) ?? '',
        status: (d.status as string) ?? 'draft',
      })),
      statistics: {
        totalReports: docs.length,
        monthlyDownloads: 0,
        customReports: docs.filter((d) => d.status === 'published').length,
        scheduledReports: 0,
        popularCategories,
        totalProjects: projectsRes.count ?? 0,
        totalInvoices: invoicesRes.count ?? 0,
      },
      aiSuggestions: [],
    };
  },
} as const;
