export type DepartmentWave = 1 | 2 | 3;

export interface DepartmentDataModel {
  overviewMetrics: string[];
  recordsList: string[];
  actions: string[];
  reports: string[];
  templates: string[];
}

export interface DepartmentServiceContract {
  scope: string;
  baseEndpoint: string;
  tabEndpoints: Record<string, string>;
}

export interface DepartmentSpecification {
  key: string;
  label: string;
  dashboard: string;
  wave: DepartmentWave;
  service: DepartmentServiceContract;
  dataModel: DepartmentDataModel;
}

const defaultDataModel: DepartmentDataModel = {
  overviewMetrics: ['kpi', 'trend', 'alerts'],
  recordsList: ['table', 'filters', 'detail-view'],
  actions: ['create', 'update', 'approve'],
  reports: ['library', 'generator', 'export'],
  templates: ['catalog', 'preview', 'governance']
};

const endpointMap = (base: string, tabs: string[]): Record<string, string> =>
  tabs.reduce<Record<string, string>>((acc, tab) => {
    acc[tab] = `${base}/${tab}`;
    return acc;
  }, {});

export const departmentsSpecification: DepartmentSpecification[] = [
  { key: 'financial', label: 'إدارة العمليات المالية', dashboard: 'FinancialDashboard', wave: 1, service: { scope: 'financial.service', baseEndpoint: '/api/financial', tabEndpoints: endpointMap('/api/financial', ['overview','budgets','transactions','invoices','analysis','settings','templates','reports']) }, dataModel: defaultDataModel },
  { key: 'legal', label: 'إدارة الشؤون القانونية', dashboard: 'LegalDashboard', wave: 1, service: { scope: 'legal.service', baseEndpoint: '/api/legal', tabEndpoints: endpointMap('/api/legal', ['overview','contracts','compliance','risks','licenses','templates','reports']) }, dataModel: defaultDataModel },
  { key: 'hr', label: 'إدارة الموارد البشرية', dashboard: 'HRDashboard', wave: 1, service: { scope: 'hr.service', baseEndpoint: '/api/hr', tabEndpoints: endpointMap('/api/hr', ['overview','workforce','recruitment','performance','payroll','templates','reports']) }, dataModel: defaultDataModel },
  { key: 'crm', label: 'إدارة علاقات العملاء', dashboard: 'CRMDashboard', wave: 1, service: { scope: 'crm.service', baseEndpoint: '/api/crm', tabEndpoints: endpointMap('/api/crm', ['overview','customers','opportunities','service','analytics','templates','reports']) }, dataModel: defaultDataModel },
  { key: 'marketing', label: 'إدارة الأنشطة التسويقية', dashboard: 'MarketingDashboard', wave: 2, service: { scope: 'marketing.service', baseEndpoint: '/api/marketing', tabEndpoints: endpointMap('/api/marketing', ['overview','campaigns','content','analytics','budgets','pr','templates','reports']) }, dataModel: defaultDataModel },
  { key: 'partnerships', label: 'إدارة الشراكات', dashboard: 'PartnershipsDashboard', wave: 2, service: { scope: 'partnerships.service', baseEndpoint: '/api/partnerships', tabEndpoints: endpointMap('/api/partnerships', ['overview','partners','opportunities','agreements','templates','reports']) }, dataModel: defaultDataModel },
  { key: 'social', label: 'إدارة المسؤولية الاجتماعية', dashboard: 'CSRDashboard', wave: 2, service: { scope: 'csr.service', baseEndpoint: '/api/csr', tabEndpoints: endpointMap('/api/csr', ['overview','initiatives','impact','stakeholders','templates','reports']) }, dataModel: defaultDataModel },
  { key: 'training', label: 'إدارة التدريب والتطوير', dashboard: 'TrainingDashboard', wave: 2, service: { scope: 'training.service', baseEndpoint: '/api/training', tabEndpoints: endpointMap('/api/training', ['overview','programs','attendance','assessments','templates','reports']) }, dataModel: defaultDataModel },
  { key: 'research', label: 'إدارة البحث والنشر', dashboard: 'ResearchPublishingDashboard', wave: 3, service: { scope: 'research.service', baseEndpoint: '/api/research', tabEndpoints: endpointMap('/api/research', ['overview','projects','publications','peer-review','templates','reports']) }, dataModel: defaultDataModel },
  { key: 'knowledge', label: 'إدارة قاعدة المعرفة', dashboard: 'KnowledgeBaseDashboard', wave: 3, service: { scope: 'knowledge.service', baseEndpoint: '/api/knowledge', tabEndpoints: endpointMap('/api/knowledge', ['overview','repository','taxonomy','access','templates','reports']) }, dataModel: defaultDataModel },
  { key: 'brand', label: 'إدارة العلامة والهوية', dashboard: 'BrandDashboard', wave: 3, service: { scope: 'brand.service', baseEndpoint: '/api/brand', tabEndpoints: endpointMap('/api/brand', ['overview','assets','guidelines','compliance','templates','reports']) }, dataModel: defaultDataModel },
  { key: 'brand-community', label: 'إدارة مجتمع العلامة', dashboard: 'BrandCommunityDashboard', wave: 3, service: { scope: 'brand-community.service', baseEndpoint: '/api/brand-community', tabEndpoints: endpointMap('/api/brand-community', ['overview','members','engagement','events','templates','reports']) }, dataModel: defaultDataModel }
];

export const departmentsSpecByKey = Object.fromEntries(departmentsSpecification.map((d) => [d.key, d]));
