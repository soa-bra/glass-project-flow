import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

const workspaceSpecs = [
  { workspace: 'SettingsWorkspace', file: 'docs/SettingsWorkspace-tabs-boxes-backend.md', kind: 'settings' },
  { workspace: 'ProjectManagementBoard', file: 'docs/ProjectManagementBoard-tabs-boxes-backend.md', kind: 'project' },
  { workspace: 'ArchiveWorkspace', file: 'docs/ArchiveWorkspace-tabs-boxes-backend.md', kind: 'archive' },
  { workspace: 'DepartmentsWorkspace', file: 'docs/DepartmentsWorkspace-tabs-boxes-backend.md', kind: 'departments' }
];

const sectionContent = (md, heading) => {
  const start = md.indexOf(`## ${heading}`);
  if (start === -1) return '';
  const rest = md.slice(start);
  const next = rest.indexOf('\n## ', 1);
  return next === -1 ? rest : rest.slice(0, next);
};

const parseMarkdownRows = (section) => {
  const lines = section.split('\n').filter((line) => line.trim().startsWith('|'));
  if (lines.length < 3) return [];
  const headers = lines[0].split('|').map((c) => c.trim()).filter(Boolean);
  return lines.slice(2).map((line) => {
    const cols = line.split('|').map((c) => c.trim());
    const values = cols.slice(1, -1);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
};

const extractManifest = (spec) => {
  const md = fs.readFileSync(path.join(repoRoot, spec.file), 'utf8');
  const tabRows = parseMarkdownRows(sectionContent(md, 'تبويبات اللوحة'));
  const boxRows = parseMarkdownRows(sectionContent(md, 'صناديق التبويبات'));
  const boardRows = parseMarkdownRows(sectionContent(md, 'قائمة اللوحات'));
  const tabs = [...new Set(tabRows.map((r) => r['Tab Code']).filter(Boolean))];
  const boxes = [...new Set(boxRows.map((r) => r['Box Ref']).filter(Boolean))];
  const services = [...new Set(boardRows.flatMap((r) => String(r['Service'] || '').split('/')).map((s) => s.trim()).filter(Boolean))];
  const permissions = [...new Set(boardRows.flatMap((r) => String(r['Permissions'] || '').split('/')).map((p) => p.trim()).filter(Boolean))];
  return { workspace: spec.workspace, source: spec.file, tabs, boxes, services, permissions };
};

const read = (f) => fs.readFileSync(path.join(repoRoot, f), 'utf8');
const extractQuotedValues = (text) => [...text.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);

const implemented = {
  settingsSidebar: [...new Set(extractQuotedValues(read('src/components/SettingsSidebar.tsx')))],
  settingsFactory: [...new Set(extractQuotedValues(read('src/components/SettingsPanel/CategoryPanelFactory.tsx')))],
  settingsTabs: [...new Set(extractQuotedValues(read('src/api/settings/types.ts')))],
  archiveSidebar: [...new Set(extractQuotedValues(read('src/components/ArchiveSidebar.tsx')))],
  archiveFactory: [...new Set(extractQuotedValues(read('src/components/ArchivePanel/CategoryPanelFactory.tsx')))],
  archiveTabs: [...new Set(extractQuotedValues(read('src/api/archive/types.ts')))],
  projectTabs: [...new Set([...read('src/components/ProjectManagement/ProjectManagementBoard.tsx').matchAll(/tabCode:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]))],
  departmentDashboards: [...new Set([...read('src/components/DepartmentTabs/shared/departmentDataModel.ts').matchAll(/dashboard:\s*'([^']+)'/g)].map((m) => m[1]))],
  departmentServices: [...new Set([...read('src/components/DepartmentTabs/shared/departmentDataModel.ts').matchAll(/scope:\s*'([^']+)'/g)].map((m) => m[1]))]
};

const manifest = workspaceSpecs.map(extractManifest);

const setDiff = (expected, actual) => ({
  missing: expected.filter((x) => !actual.includes(x)),
  extra: actual.filter((x) => !expected.includes(x))
});

const checks = manifest.map((m) => {
  if (m.workspace === 'SettingsWorkspace') {
    return {
      workspace: m.workspace,
      tabs_sidebar: setDiff(m.tabs, implemented.settingsSidebar),
      tabs_factory: setDiff(m.tabs, implemented.settingsFactory),
      tabs_api: setDiff(m.tabs, implemented.settingsTabs),
      service_binding_missing: m.services.filter((s) => !read('src/components/SettingsPanel/SettingsCategoryPanel.tsx').includes(s.split(' ')[0])),
      permission_binding_missing: m.permissions.filter((p) => !read('src/components/SettingsPanel/SettingsCategoryPanel.tsx').includes('SETTINGS_ACCESS')),
      boxes_missing: []
    };
  }
  if (m.workspace === 'ArchiveWorkspace') {
    return {
      workspace: m.workspace,
      tabs_sidebar: setDiff(m.tabs, implemented.archiveSidebar),
      tabs_factory: setDiff(m.tabs, implemented.archiveFactory),
      tabs_api: setDiff(m.tabs, implemented.archiveTabs),
      service_binding_missing: [],
      permission_binding_missing: m.permissions.length ? ['archive permissions not bound in code'] : [],
      boxes_missing: []
    };
  }
  if (m.workspace === 'ProjectManagementBoard') {
    return {
      workspace: m.workspace,
      tabs_dashboard: setDiff(m.tabs, implemented.projectTabs),
      service_binding_missing: m.services.filter((s) => !read('src/components/ProjectManagement/ProjectManagementBoard.tsx').includes(s.split(' ')[0])),
      permission_binding_missing: m.permissions.filter((p) => !read('src/components/ProjectManagement/ProjectManagementBoard.tsx').includes(p.split(' ')[0])),
      boxes_missing: []
    };
  }
  return {
    workspace: m.workspace,
    tabs_dashboard: setDiff([...new Set(m.tabs.map((t) => t.split('.')[0]))], implemented.departmentDashboards.map((d) => d.replace('ResearchPublishingDashboard', 'KMPADashboard').replace('PartnershipsDashboard', 'InstitutionalPartnershipsDashboard').replace('BrandCommunityDashboard', 'BrandCommunityDashboard'))),
    service_binding_missing: m.services.filter((s) => !implemented.departmentServices.some((ds) => s.includes(ds.split('.')[0]))),
    permission_binding_missing: m.permissions.filter((p) => !p || p === '-'),
    boxes_missing: []
  };
});

const workspaceStatus = checks.map((c) => {
  const misses = Object.values(c).flatMap((v) => (v && typeof v === 'object' && 'missing' in v) ? v.missing : Array.isArray(v) ? v : []).filter(Boolean);
  const status = misses.length === 0 ? 'implemented' : misses.length <= 5 ? 'partial' : 'missing';
  return { workspace: c.workspace, status, missingCount: misses.length };
});

const report = { generatedAt: new Date().toISOString(), manifest, checks, workspaceStatus };
fs.mkdirSync(path.join(repoRoot, 'artifacts'), { recursive: true });
fs.mkdirSync(path.join(repoRoot, 'docs/reports'), { recursive: true });
fs.writeFileSync(path.join(repoRoot, 'artifacts/workspace-manifest-report.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(repoRoot, 'docs/reports/workspace-manifest.json'), JSON.stringify(manifest, null, 2));

const hasHardFailures = checks.some((c) => {
  const missTabs = Object.values(c).some((v) => v && typeof v === 'object' && 'missing' in v && v.missing.length > 0);
  const missBindings = (c.service_binding_missing?.length ?? 0) > 0 || (c.permission_binding_missing?.length ?? 0) > 0;
  return missTabs || missBindings;
});

if (hasHardFailures) {
  console.error('Workspace manifest checks failed. See artifacts/workspace-manifest-report.json');
  process.exit(1);
}

console.log('Workspace manifest checks passed.');
