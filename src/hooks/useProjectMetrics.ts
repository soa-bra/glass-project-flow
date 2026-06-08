/**
 * useProjectMetrics — central hook fetching tasks, budgets, transactions
 * and derived notifications/performance metrics for a given project.
 *
 * @specRef project-management/metrics
 */
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectTaskRow {
  id: string;
  name: string | null;
  state: string | null;
  priority: string | null;
  due_date: string | null;
  start_date: string | null;
  assignee_id: string | null;
  estimated_cost: number | null;
  actual_cost: number | null;
  created_at: string;
}

export interface ProjectBudgetRow {
  id: string;
  name: string;
  planned_amount: number;
  spent_amount: number;
  currency: string;
  status: string;
}

export interface ProjectTransactionRow {
  id: string;
  kind: string;
  amount: number;
  currency: string;
  date: string;
  category: string | null;
  vendor: string | null;
  notes: string | null;
}

export interface ProjectNotification {
  id: string;
  kind: 'task_overdue' | 'task_due_soon' | 'budget_alert' | 'transaction';
  title: string;
  description: string;
  time: string;
  accent: string;
}

const ACCENTS = {
  task_overdue: '#E5564D',
  task_due_soon: '#F6C445',
  budget_alert: '#E5564D',
  transaction: '#3DA8F5',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'الآن';
  if (m < 60) return `منذ ${m} دقيقة`;
  const h = Math.floor(m / 60);
  if (h < 24) return `منذ ${h} ساعة`;
  const d = Math.floor(h / 24);
  return `منذ ${d} يوم`;
}

export function useProjectMetrics(projectId: string | undefined) {
  const [tasks, setTasks] = useState<ProjectTaskRow[]>([]);
  const [budgets, setBudgets] = useState<ProjectBudgetRow[]>([]);
  const [transactions, setTransactions] = useState<ProjectTransactionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [tRes, bRes, txRes] = await Promise.all([
          supabase.from('tasks').select('id,name,state,priority,due_date,start_date,assignee_id,estimated_cost,actual_cost,created_at').eq('linked_project_id', projectId).order('created_at', { ascending: false }),
          supabase.from('financial_budgets').select('id,name,planned_amount,spent_amount,currency,status').eq('project_id', projectId),
          supabase.from('financial_transactions').select('id,kind,amount,currency,date,category,vendor,notes').eq('project_id', projectId).order('date', { ascending: false }).limit(50),
        ]);
        if (cancelled) return;
        if (tRes.error) throw tRes.error;
        if (bRes.error) throw bRes.error;
        if (txRes.error) throw txRes.error;
        setTasks((tRes.data ?? []) as ProjectTaskRow[]);
        setBudgets((bRes.data ?? []) as ProjectBudgetRow[]);
        setTransactions((txRes.data ?? []) as ProjectTransactionRow[]);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'فشل تحميل بيانات المشروع');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [projectId]);

  const budgetTotals = useMemo(() => {
    const planned = budgets.reduce((s, b) => s + Number(b.planned_amount || 0), 0);
    const spent = budgets.reduce((s, b) => s + Number(b.spent_amount || 0), 0);
    const invoicesCount = transactions.filter(t => t.kind === 'invoice' || t.kind === 'income').length;
    return {
      planned,
      spent,
      remaining: Math.max(planned - spent, 0),
      percentage: planned > 0 ? Math.min(100, (spent / planned) * 100) : 0,
      isOverBudget: planned > 0 && spent > planned,
      invoicesCount,
    };
  }, [budgets, transactions]);

  const taskStats = useMemo(() => {
    const now = Date.now();
    const done = tasks.filter(t => t.state === 'done' || t.state === 'completed').length;
    const inProgress = tasks.filter(t => t.state === 'in_progress' || t.state === 'in-progress').length;
    const overdue = tasks.filter(t => t.due_date && new Date(t.due_date).getTime() < now && t.state !== 'done' && t.state !== 'completed').length;
    const total = tasks.length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, overdue, completionRate };
  }, [tasks]);

  const teamStats = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => { if (t.assignee_id) set.add(t.assignee_id); });
    return { activeMembers: set.size };
  }, [tasks]);

  const notifications = useMemo<ProjectNotification[]>(() => {
    const items: ProjectNotification[] = [];
    const now = Date.now();
    const DAY = 86400000;

    for (const t of tasks) {
      if (!t.due_date) continue;
      const dt = new Date(t.due_date).getTime();
      const isDone = t.state === 'done' || t.state === 'completed';
      if (isDone) continue;
      if (dt < now) {
        items.push({
          id: `task-over-${t.id}`,
          kind: 'task_overdue',
          title: t.name || 'مهمة متأخرة',
          description: 'تجاوزت تاريخ الاستحقاق',
          time: timeAgo(t.due_date),
          accent: ACCENTS.task_overdue,
        });
      } else if (dt - now < 2 * DAY) {
        items.push({
          id: `task-soon-${t.id}`,
          kind: 'task_due_soon',
          title: t.name || 'مهمة قريبة',
          description: 'تستحق خلال 48 ساعة',
          time: timeAgo(new Date().toISOString()),
          accent: ACCENTS.task_due_soon,
        });
      }
    }

    if (budgetTotals.isOverBudget) {
      items.push({
        id: `budget-over`,
        kind: 'budget_alert',
        title: 'تجاوز الميزانية',
        description: `صُرف ${Math.round(budgetTotals.spent).toLocaleString()} من ${Math.round(budgetTotals.planned).toLocaleString()}`,
        time: 'الآن',
        accent: ACCENTS.budget_alert,
      });
    } else if (budgetTotals.planned > 0 && budgetTotals.percentage >= 80) {
      items.push({
        id: `budget-warn`,
        kind: 'budget_alert',
        title: 'الميزانية على وشك الاستنفاد',
        description: `${Math.round(budgetTotals.percentage)}% من الميزانية مستخدمة`,
        time: 'الآن',
        accent: '#F6C445',
      });
    }

    for (const tx of transactions.slice(0, 3)) {
      items.push({
        id: `tx-${tx.id}`,
        kind: 'transaction',
        title: tx.vendor || tx.category || (tx.kind === 'income' ? 'إيراد' : 'مصروف'),
        description: `${tx.kind === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString()} ${tx.currency}`,
        time: timeAgo(tx.date),
        accent: ACCENTS.transaction,
      });
    }

    return items.slice(0, 8);
  }, [tasks, transactions, budgetTotals]);

  return { tasks, budgets, transactions, budgetTotals, taskStats, teamStats, notifications, loading, error };
}
