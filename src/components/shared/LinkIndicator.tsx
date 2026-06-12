import React, { useEffect, useState } from 'react';
import { Link2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';

export interface DataLinkSummary {
  id: string;
  label: string | null;
  link_kind: string;
  metadata: Json;
  source_element_id: string | null;
  target_element_id: string | null;
  project_id: string | null;
}

interface LinkIndicatorProps {
  projectId?: string | number | null;
  sourceElementId?: string | number | null;
  targetElementId?: string | number | null;
  links?: DataLinkSummary[];
  className?: string;
  label?: string;
  compact?: boolean;
}

const normalizeId = (value: string | number | null | undefined) => (value == null ? null : String(value));

export const LinkIndicator: React.FC<LinkIndicatorProps> = ({
  projectId,
  sourceElementId,
  targetElementId,
  links: providedLinks,
  className,
  label = 'روابط تشغيلية',
  compact = false,
}) => {
  const [links, setLinks] = useState<DataLinkSummary[]>(providedLinks ?? []);

  useEffect(() => {
    if (providedLinks) {
      setLinks(providedLinks);
      return;
    }

    const project = normalizeId(projectId);
    const source = normalizeId(sourceElementId);
    const target = normalizeId(targetElementId);

    if (!project && !source && !target) return;

    let cancelled = false;

    const loadLinks = async () => {
      let query = supabase
        .from('data_links')
        .select('id,label,link_kind,metadata,source_element_id,target_element_id,project_id')
        .limit(20);

      if (project) query = query.eq('project_id', project);
      if (source) query = query.eq('source_element_id', source);
      if (target) query = query.eq('target_element_id', target);

      const { data, error } = await query;
      if (!cancelled) {
        setLinks(error ? [] : ((data ?? []) as DataLinkSummary[]));
      }
    };

    void loadLinks();

    return () => {
      cancelled = true;
    };
  }, [projectId, providedLinks, sourceElementId, targetElementId]);

  if (links.length === 0) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/50 px-2 py-1 text-xs font-medium text-black/70 font-arabic',
        className,
      )}
      title={links.map((link) => link.label || link.link_kind).join('، ')}
    >
      <Link2 className="h-3.5 w-3.5" />
      {compact ? links.length : `${label}: ${links.length}`}
    </span>
  );
};
