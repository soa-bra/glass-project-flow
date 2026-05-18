import fs from 'node:fs';

const doc = fs.readFileSync('docs/DepartmentsWorkspace-tabs-boxes-backend.md', 'utf8');
const uiConfig = fs.readFileSync('src/config/departmentDashboardTabs.ts', 'utf8');

const documented = new Map();
for (const line of doc.split('\n')) {
  if (!/^\|\s*\d+\s*\|/.test(line)) continue;
  const cols = line.split('|').map((c) => c.trim());
  const dashboard = cols[3];
  const tabCode = cols[5];
  if (!dashboard || !/^[a-z0-9-]+$/.test(tabCode)) continue;
  if (!documented.has(dashboard)) documented.set(dashboard, new Set());
  documented.get(dashboard).add(tabCode);
}

const uiMapped = new Map();
const blocks = [...uiConfig.matchAll(/(\w+Dashboard):\s*\[(.*?)\],\n/gs)];
for (const [, dashboard, block] of blocks) {
  const tabs = [...block.matchAll(/value:\s*'([^']+)'/g)].map((m) => m[1]);
  uiMapped.set(dashboard, new Set(tabs));
}

const missing = [];
for (const [dashboard, tabCodes] of documented.entries()) {
  const uiTabs = uiMapped.get(dashboard) ?? new Set();
  for (const tab of tabCodes) {
    if (!uiTabs.has(tab)) missing.push({ dashboard, tab });
  }
}

if (missing.length) {
  console.error('Missing documented tabs in UI mapping:');
  for (const m of missing) console.error(`- ${m.dashboard}.${m.tab}`);
  process.exit(1);
}

console.log(`OK: ${documented.size} dashboards validated, all documented tab codes exist in UI mapping.`);
