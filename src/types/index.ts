
// مركز الأنواع للتطبيق
export interface Project {
  id: string;
  title: string;
  description: string;
  daysLeft: number;
  tasksCount: number;
  status: 'success' | 'warning' | 'error' | 'info';
  date: string;
  owner: string;
  value: string;
  isOverBudget?: boolean;
  hasOverdueTasks?: boolean;
}

export interface SidebarMenuItem {
  icon: React.ComponentType<any>;
  label: string;
  active: boolean;
}

export interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  department: string;
  color: string;
  description?: string;
  time?: string;
  type?: 'meeting' | 'deadline' | 'milestone' | 'event';
  priority?: 'high' | 'medium' | 'low';
  status?: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
}

export interface TabItem {
  value: string;
  label: string;
}

export interface TabData {
  [key: string]: any;
}

// أنواع البيانات للتبويبات المختلفة
export interface FinanceData {
  projects: ProjectBudget[];
  overBudget: OverBudgetProject[];
}

export interface ProjectBudget {
  id: number;
  name: string;
  budget: number;
  spent: number;
}

export interface OverBudgetProject {
  id: number;
  name: string;
  percentage: number;
}

export interface LegalData {
  contracts: ContractCount;
  upcoming: UpcomingContract[];
}

export interface ContractCount {
  signed: number;
  pending: number;
  expired: number;
}

export interface UpcomingContract {
  id: number;
  title: string;
  date: string;
  client: string;
}

export interface HRData {
  stats: HRStats;
  distribution: ProjectDistribution[];
}

export interface HRStats {
  active: number;
  onLeave: number;
  vacancies: number;
}

export interface ProjectDistribution {
  project: string;
  members: number;
}

export interface ClientsData {
  active: ActiveClient[];
  nps: NPSScore[];
}

export interface ActiveClient {
  id: number;
  name: string;
  projects: number;
}

export interface NPSScore {
  id: number;
  score: number;
  client: string;
}

export interface ImageState {
  error: boolean;
  loaded: boolean;
}
