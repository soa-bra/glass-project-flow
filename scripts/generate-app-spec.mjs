#!/usr/bin/env node
/**
 * Generate src/config/app-spec.ts from the 4 spec workbooks under docs/specs/.
 *
 * Source of truth: docs/specs/master-spec-ar.md + 4 .xlsx workbooks
 * Output: src/config/app-spec.ts (frozen `as const`)
 *
 * Run: node scripts/generate-app-spec.mjs
 */
import { readFileSync } from 'node:fs';
import XLSX from 'xlsx';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SPECS = resolve(ROOT, 'docs/specs');
const OUT = resolve(ROOT, 'src/config/app-spec.ts');

const FILES = {
  departments: 'departments-spec.xlsx',
  projectManagement: 'project-management-spec.xlsx',
  archive: 'archive-spec.xlsx',
  settings: 'settings-spec.xlsx',
};

const sheetName = (wb, keywords) => {
  for (const name of wb.SheetNames) {
    if (keywords.some((k) => name.includes(k))) return name;
  }
  return null;
};

const readSheet = (path, keywords) => {
  const wb = XLSX.read(readFileSync(path), { type: 'buffer' });
  const name = sheetName(wb, keywords);
  if (!name) throw new Error(`No sheet matching ${keywords} in ${path}`);
  return XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: null });
};

const splitRefs = (s) =>
  s ? String(s).split('|').map((x) => x.trim()).filter(Boolean) : [];

const loadWorkspace = (surface, file, listKw, isMulti) => {
  const path = resolve(SPECS, file);
  const list = readSheet(path, ['قائمة']);
  const tabs = readSheet(path, ['تبويب', 'تبويبات']);
  const boxes = readSheet(path, ['صناديق']);
  const popups = readSheet(path, ['منبثقة', 'نوافذ']);

  const dashboards = list.map((row) => {
    const dashboardKey = row['Dashboard'];
    const dashTabs = tabs.filter((t) => t['Dashboard'] === dashboardKey);
    const dashBoxes = boxes.filter((b) => b['Dashboard'] === dashboardKey);
    const dashPopups = popups.filter((p) => p['Dashboard'] === dashboardKey);

    const tabsBuilt = dashTabs
      .sort((a, b) => (a['ترتيب التبويب'] || 0) - (b['ترتيب التبويب'] || 0))
      .map((t) => {
        const tabCode = String(t['Tab Code']);
        const tabRef = `${dashboardKey}.${tabCode}`;
        const tabBoxes = dashBoxes
          .filter((b) => b['Tab Code'] === tabCode)
          .sort((a, b) => (a['ترتيب الصندوق'] || 0) - (b['ترتيب الصندوق'] || 0))
          .map((b) => ({
            ref: b['Box Ref'],
            name: b['اسم الصندوق'],
            kind: b['صورة الصندوق'],
            purpose: b['الوظيفة الأساسية'],
            backend: b['ارتباطات الباك اند'],
            componentRefs: splitRefs(b['المكونات المرجعية للصندوق']),
            state: b['الحالة'],
          }));
        const tabPopups = dashPopups
          .filter((p) => p['Tab Code'] === tabCode)
          .sort((a, b) => (a['ترتيب النافذة'] || 0) - (b['ترتيب النافذة'] || 0))
          .map((p) => ({
            ref: p['Popup Ref'],
            name: p['اسم النافذة المنبثقة'],
            purpose: p['الوظيفة/الدور/الهدف'],
            trigger: p['الزر الذي تنبثق منه'],
            componentRefs: splitRefs(p['الأرقام المرجعية لمكونات النافذة']),
            backend: p['ارتباطات الباك اند'],
          }));
        return {
          code: tabCode,
          name: t['اسم التبويب'],
          description: t['وصف واضح للتبويب'],
          backendScope: t['نطاق الباك اند الحاكم'],
          ref: tabRef,
          boxes: tabBoxes,
          popups: tabPopups,
        };
      });

    const orderKey = isMulti ? 'ترتيب الإدارة' : 'ترتيب اللوحة';
    const titleKey = isMulti ? 'الإدارة' : 'اللوحة';

    return {
      order: row[orderKey],
      key: row['Domain'],
      dashboard: dashboardKey,
      title: row[titleKey],
      domain: row['Domain'],
      service: row['Service'],
      permissions: row['Permissions'],
      entities: row['Entities'],
      tabsCount: row['عدد التبويبات'],
      tabs: tabsBuilt,
    };
  });

  return { surface, dashboards };
};

const workspaces = [
  loadWorkspace('departments', FILES.departments, ['قائمة'], true),
  loadWorkspace('projects', FILES.projectManagement, ['قائمة'], false),
  loadWorkspace('archive', FILES.archive, ['قائمة'], false),
  loadWorkspace('settings', FILES.settings, ['قائمة'], false),
];

// Counts
const counts = workspaces.reduce(
  (acc, ws) => {
    for (const d of ws.dashboards) {
      acc.dashboards += 1;
      for (const t of d.tabs) {
        acc.tabs += 1;
        acc.boxes += t.boxes.length;
        acc.popups += t.popups.length;
      }
    }
    return acc;
  },
  { dashboards: 0, tabs: 0, boxes: 0, popups: 0 }
);

const header = `/**
 * AUTO-GENERATED — do not edit by hand.
 * Source: docs/specs/*.xlsx
 * Generated: ${new Date().toISOString()}
 * Master reference: docs/specs/master-spec-ar.md
 *
 * Counts: dashboards=${counts.dashboards} tabs=${counts.tabs} boxes=${counts.boxes} popups=${counts.popups}
 * Re-run via: node scripts/generate-app-spec.mjs
 */
/* eslint-disable */
`;

const body = `export const APP_SPEC = ${JSON.stringify(
  { counts, workspaces },
  null,
  2
)} as const;

export type AppSpec = typeof APP_SPEC;
export type WorkspaceSpec = AppSpec['workspaces'][number];
export type WorkspaceSurface = WorkspaceSpec['surface'];
export type DashboardSpec = WorkspaceSpec['dashboards'][number];
export type TabSpec = DashboardSpec['tabs'][number];
export type BoxSpec = TabSpec['boxes'][number];
export type PopupSpec = TabSpec['popups'][number];

export const APP_SPEC_COUNTS = APP_SPEC.counts;
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, header + body, 'utf8');
console.log(`✅ Wrote ${OUT}`);
console.log(`   ${JSON.stringify(counts)}`);
