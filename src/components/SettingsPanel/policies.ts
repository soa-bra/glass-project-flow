import type { LucideIcon } from 'lucide-react';
import { User, ShieldCheck, Bell, Link2, BrainCircuit, Palette, Database, Users, ScrollText, Cpu, Network, Wrench, Crown } from 'lucide-react';

export type SettingsCategoryKey =
  | 'account' | 'security' | 'notifications' | 'integrations' | 'ai' | 'theme' | 'data-governance' | 'users-roles' | 'audit' | 'engine-jobs' | 'dependency-graph' | 'tools-marketplace' | 'admin-roles';

export const SETTINGS_POLICY: Record<SettingsCategoryKey, { label: string; icon: LucideIcon; route: string; read: string[]; write: string[]; sensitive?: boolean }> = {
  account: { label: 'الحساب الشخصي', icon: User, route: '/settings/account', read: ['settings.admin','settings.security'], write: ['settings.admin'] },
  security: { label: 'الخصوصية والأمان', icon: ShieldCheck, route: '/settings/security', read: ['settings.security'], write: ['settings.security'], sensitive: true },
  notifications: { label: 'الإشعارات', icon: Bell, route: '/settings/notifications', read: ['settings.admin'], write: ['settings.admin'] },
  integrations: { label: 'التكاملات الخارجية', icon: Link2, route: '/settings/integrations', read: ['settings.admin'], write: ['settings.admin'], sensitive: true },
  ai: { label: 'الذكاء الاصطناعي', icon: BrainCircuit, route: '/settings/ai', read: ['settings.admin'], write: ['settings.admin'], sensitive: true },
  theme: { label: 'المظهر', icon: Palette, route: '/settings/theme', read: ['settings.admin','settings.security'], write: ['settings.admin'] },
  'data-governance': { label: 'إدارة البيانات', icon: Database, route: '/settings/data-governance', read: ['settings.admin'], write: ['settings.admin'] },
  'users-roles': { label: 'المستخدمون والأدوار', icon: Users, route: '/settings/users-roles', read: ['settings.admin'], write: ['settings.admin'], sensitive: true },
  audit: { label: 'مركز التدقيق', icon: ScrollText, route: '/settings/audit', read: ['settings.security'], write: ['settings.security'] },
  'engine-jobs': { label: 'لوحة المحركات', icon: Cpu, route: '/settings/engine-jobs', read: ['settings.admin'], write: ['settings.admin'] },
  'dependency-graph': { label: 'خريطة التبعيات', icon: Network, route: '/settings/dependency-graph', read: ['settings.admin'], write: ['settings.admin'] },
  'tools-marketplace': { label: 'سوق الأدوات', icon: Wrench, route: '/settings/tools-marketplace', read: ['settings.admin'], write: ['settings.admin'] },
  'admin-roles': { label: 'إدارة الأدوار', icon: Crown, route: '/settings/admin-roles', read: ['settings.admin'], write: ['settings.admin'], sensitive: true },
};

export const SENSITIVE_TABS = new Set(Object.entries(SETTINGS_POLICY).filter(([,v]) => v.sensitive).map(([k]) => k));
