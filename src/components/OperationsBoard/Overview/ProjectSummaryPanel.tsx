import React from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';
interface ProjectSummary {
  id: number;
  title: string;
  type: string;
  progress: number;
  status: 'active' | 'completed' | 'delayed';
  date: string;
}
interface ProjectSummaryPanelProps {
  projects: ProjectSummary[];
}
export const ProjectSummaryPanel: React.FC<ProjectSummaryPanelProps> = ({
  projects
}) => {
  return;
};