import type { Database } from '@/integrations/supabase/types';
import type { CanvasElement } from '@/features/planning/domain/types';
import type { ProjectIntelligenceDepartment } from './project-intelligence.types';

export type DataLinkRow = Database['public']['Tables']['data_links']['Row'];
export type DataLinkInsert = Database['public']['Tables']['data_links']['Insert'];
export type DataLinkUpdate = Database['public']['Tables']['data_links']['Update'];

export interface DataLinkEndpoint {
  department: ProjectIntelligenceDepartment;
  elementId?: CanvasElement['id'] | string | null;
  entityTable?: string;
  entityId?: string | null;
}

export interface DataLinkImpact {
  link: DataLinkRow;
  source: DataLinkEndpoint;
  target: DataLinkEndpoint;
  impactLevel: 'low' | 'medium' | 'high';
  reason: string;
}

export interface CrossDepartmentLinkQuery {
  projectId?: string;
  boardId?: string;
  sourceDepartment?: ProjectIntelligenceDepartment;
  targetDepartment?: ProjectIntelligenceDepartment;
  limit?: number;
}
