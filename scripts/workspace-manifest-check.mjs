import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const specs = [
  'docs/ArchiveWorkspace-tabs-boxes-backend.md',
  'docs/DepartmentsWorkspace-tabs-boxes-backend.md',
  'docs/ProjectManagementBoard-tabs-boxes-backend.md',
  'docs/SettingsWorkspace-tabs-boxes-backend.md',
];

const implSources = {
  ArchiveWorkspace: ['src/components/ArchiveWorkspace.tsx', 'src/components/ArchiveSidebar.tsx'],
  DepartmentsWorkspace: ['src/components/DepartmentsWorkspace.tsx', 'src/components/DepartmentPanel.tsx'],
  ProjectManagementBoard: ['src/components/ProjectManagement/ProjectManagementBoard.tsx', 'src/components/ProjectManagement/ProjectTabs.tsx'],
  SettingsWorkspace: ['src/components/SettingsSidebar.tsx', 'src/components/SettingsPanel/CategoryPanelFactory.tsx'],
};

const requiredServiceHints = ['Service:', '.service', 'service'];

function sectionTable(md, title) {
  const idx = md.indexOf(`## ${title}`);
  if (idx < 0) return [];
  const slice = md.slice(idx).split('\n');
  const rows = [];
  let started = false;
  for (const line of slice) {
    if (!line.startsWith('|')) {
      if (started) break;
      continue;
    }
    started = true;
    const cols = line.split('|').slice(1, -1).map((c) => c.trim());
    rows.push(cols);
  }
  if (rows.length < 3) return [];
  const headers = rows[0];
  return rows.slice(2).map((cols) => Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? ''])));
}

function includesAny(text, needles) {
  const low = text.toLowerCase();
  return needles.some((n) => low.includes(n.toLowerCase()));
}

const manifest = { generatedAt: new Date().toISOString(), workspaces: {} };
const failures = [];
const workspaceReports = [];

for (const spec of specs) {
  const md = fs.readFileSync(path.join(ROOT, spec), 'utf8');
  const tabs = sectionTable(md, 'تبويبات اللوحة');
  const boxes = sectionTable(md, 'صناديق التبويبات');
  const dashboards = sectionTable(md, 'قائمة اللوحات');
  const workspace = tabs[0]?.Dashboard || boxes[0]?.Dashboard || path.basename(spec, '.md');
  const files = implSources[workspace] ?? [];
  const code = files.map((f) => fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '').join('\n');

  const manifestTabs = tabs.map((t) => t['Tab Code']).filter(Boolean);
  const manifestBoxes = boxes.map((b) => b['Box Ref']).filter(Boolean);

  const implementedTabs = manifestTabs.filter((tab) => code.includes(`'${tab}'`) || code.includes(`\"${tab}\"`) || code.includes(`.${tab}`));
  const missingTabs = manifestTabs.filter((tab) => !implementedTabs.includes(tab));

  const sidebarFactoryCheck = workspace === 'SettingsWorkspace'
    ? (() => {
      const sidebar = fs.existsSync('src/components/SettingsSidebar.tsx') ? fs.readFileSync('src/components/SettingsSidebar.tsx', 'utf8') : '';
      const factory = fs.existsSync('src/components/SettingsPanel/CategoryPanelFactory.tsx') ? fs.readFileSync('src/components/SettingsPanel/CategoryPanelFactory.tsx', 'utf8') : '';
      const missingInSidebar = manifestTabs.filter((tab) => !sidebar.includes(tab));
      const missingInFactory = manifestTabs.filter((tab) => !factory.includes(tab));
      return { ok: missingInSidebar.length === 0 && missingInFactory.length === 0, missingInSidebar, missingInFactory };
    })()
    : { ok: true, missingInSidebar: [], missingInFactory: [] };

  const implementedBoxes = manifestBoxes.filter((box) => code.includes(box) || code.includes(box.split('.').pop()));
  const missingBoxes = manifestBoxes.filter((box) => !implementedBoxes.includes(box));

  const services = new Set();
  const permissions = new Set();
  for (const b of boxes) {
    const backend = b['ارتباطات الباك اند'] || '';
    const perms = (backend.match(/Permissions:\s*([^|]+)/i)?.[1] || '')
      .split('/').map((x) => x.trim()).filter(Boolean);
    perms.forEach((p) => permissions.add(p));
    const svc = backend.match(/Service:\s*([^|]+)/i)?.[1]?.trim();
    if (svc) services.add(svc);
  }
  for (const d of dashboards) {
    (d['Permissions'] || '').split('/').map((x) => x.trim()).filter(Boolean).forEach((p) => permissions.add(p));
    if (d['Service']) services.add(d['Service']);
  }

  const serviceBound = [...services].every((s) => includesAny(code, [s, ...requiredServiceHints]));
  const permissionBound = [...permissions].every((p) => p.length < 2 || code.includes(p));

  if (!sidebarFactoryCheck.ok) failures.push(`${workspace}: sidebar/factory key mismatch`);
  if (missingTabs.length) failures.push(`${workspace}: missing tabs (${missingTabs.slice(0, 8).join(', ')})`);
  if (missingBoxes.length) failures.push(`${workspace}: missing boxes (${missingBoxes.slice(0, 8).join(', ')})`);
  if (!serviceBound) failures.push(`${workspace}: missing service bindings`);
  if (!permissionBound) failures.push(`${workspace}: missing permission bindings`);

  const coverageScore = (manifestTabs.length - missingTabs.length + manifestBoxes.length - missingBoxes.length) /
    Math.max(1, manifestTabs.length + manifestBoxes.length);
  const status = coverageScore === 1 && serviceBound && permissionBound
    ? 'implemented'
    : coverageScore >= 0.5 ? 'partial' : 'missing';

  workspaceReports.push(`| ${workspace} | ${status} | ${manifestTabs.length} | ${implementedTabs.length} | ${manifestBoxes.length} | ${implementedBoxes.length} | ${serviceBound ? 'yes' : 'no'} | ${permissionBound ? 'yes' : 'no'} |`);

  manifest.workspaces[workspace] = {
    spec,
    files,
    tabs: { total: manifestTabs.length, implemented: implementedTabs.length, missing: missingTabs },
    boxes: { total: manifestBoxes.length, implemented: implementedBoxes.length, missing: missingBoxes },
    services: [...services],
    permissions: [...permissions],
    bindings: { serviceBound, permissionBound },
    sidebarsFactories: sidebarFactoryCheck,
    status,
  };
}

fs.writeFileSync(path.join(ROOT, 'docs/delivery/workspace-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
const report = [
  '# Workspace Implementation Report',
  '',
  '| Workspace | Status | Tabs (spec) | Tabs (implemented) | Boxes (spec) | Boxes (implemented) | Service bound | Permission bound |',
  '| --- | --- | ---: | ---: | ---: | ---: | --- | --- |',
  ...workspaceReports,
  '',
].join('\n');
fs.writeFileSync(path.join(ROOT, 'docs/delivery/workspace-implementation-report.md'), report);

if (failures.length) {
  console.error('Workspace manifest verification failed:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log('Workspace manifest verification passed.');
