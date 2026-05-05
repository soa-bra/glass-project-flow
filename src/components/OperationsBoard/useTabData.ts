
import { useState, useEffect } from 'react';
import { TabData } from './types';
import { getMockData } from './mockData';
import { supabase } from '@/integrations/supabase/client';

/**
 * P3 — Hook بيانات التبويبات.
 * تبويب `overview` يحسب إحصائياته من جداول DB المركزية حقيقة.
 * بقية التبويبات (finance/projects/marketing/...) لا تزال تستهلك design-data
 * من `mockData.ts` كوحدات مرئية بحتة (لا تعكس بيانات حقيقية بعد).
 * النية: استبدال كل تبويب على حدة بـ aggregates حقيقية في P3.b/P5.b.
 */
export const useTabData = (activeTab: string, isVisible: boolean) => {
  const [tabData, setTabData] = useState<TabData>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTabData = async (tabName: string) => {
    setLoading(true);
    try {
      const mockData = getMockData();
      let next = mockData[tabName as keyof typeof mockData];

      // Overview: aggregate من DB
      if (tabName === 'overview') {
        const [projectsRes, tasksRes] = await Promise.all([
          supabase.from('projects').select('id, state, budget, due_date'),
          supabase.from('tasks').select('id, state, due_date'),
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
        const overdueTasks = tasks.filter(
          (t) => t.due_date && new Date(t.due_date).getTime() < now && t.state !== 'completed',
        ).length;

        next = {
          ...(next as object),
          stats: {
            ...((next as { stats?: Record<string, unknown> })?.stats ?? {}),
            expectedRevenue,
            delayedProjects,
            complaints: overdueTasks, // مؤقت: نعرض المهام المتأخرة كـ proxy للشكاوى حتى تُربط CRM
          },
        } as typeof next;
      }

      setTabData((prev) => ({ ...prev, [tabName]: next }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      void fetchTabData(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isVisible]);

  return { tabData, loading };
};
