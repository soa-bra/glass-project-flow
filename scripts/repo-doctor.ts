#!/usr/bin/env ts-node
// Repo Doctor - تشخيص تلقائي لهيكل الملفات

import fs from 'fs';
import path from 'path';

interface FileReport {
  path: string;
  exists: boolean;
  size: number;
  lastModified: string;
  exports: string[];
  testIds: string[];
  status: 'OK' | 'MISSING' | 'OUTDATED';
}

const REQUIRED_FILES = [
  'src/apps/brain/canvas/CollaborativeCanvas.tsx',
  'src/pages/operations/solidarity/IntegratedPlanningCanvasCard.tsx',
  'src/components/Whiteboard/WhiteboardRoot.tsx',
  'src/components/Whiteboard/WhiteboardTopbar.tsx',
  'src/components/Whiteboard/PropertiesPanel.tsx',
  'src/components/Whiteboard/StatusBar.tsx',
  'src/components/smart-elements/smart-elements-panel.tsx',
  'src/apps/brain/realtime/ySupabaseProvider.ts',
  'supabase/functions/analyze-links/index.ts',
  'supabase/functions/wf01-map/index.ts',
  'supabase/sql/001_schema.sql'
];

const REQUIRED_TEST_IDS = [
  'integrated-planning-canvas',
  'canvas-stage',
  'btn-smart-tool',
  'btn-wf01',
  'status-realtime',
  'status-fps'
];

function analyzeFile(filePath: string): FileReport {
  const fullPath = path.resolve(filePath);
  
  if (!fs.existsSync(fullPath)) {
    return {
      path: filePath,
      exists: false,
      size: 0,
      lastModified: '',
      exports: [],
      testIds: [],
      status: 'MISSING'
    };
  }

  const stats = fs.statSync(fullPath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  
  // Extract exports
  const exportMatches = content.match(/export\s+(default\s+)?(\w+|{[^}]+})/g) || [];
  const exports = exportMatches.map(m => m.replace(/export\s+(default\s+)?/, ''));
  
  // Extract test IDs
  const testIdMatches = content.match(/data-test-id=['"`]([^'"`]+)['"`]/g) || [];
  const testIds = testIdMatches.map(m => m.match(/data-test-id=['"`]([^'"`]+)['"`]/)?.[1]).filter(Boolean) as string[];
  
  // Determine status
  let status: 'OK' | 'MISSING' | 'OUTDATED' = 'OK';
  const daysSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceModified > 7) {
    status = 'OUTDATED';
  }
  
  if (exports.length === 0 && filePath.endsWith('.tsx')) {
    status = 'OUTDATED';
  }

  return {
    path: filePath,
    exists: true,
    size: stats.size,
    lastModified: stats.mtime.toISOString(),
    exports,
    testIds,
    status
  };
}

function generateReport(): string {
  const reports = REQUIRED_FILES.map(analyzeFile);
  
  let markdown = `# 🔍 Repo Doctor Report\n\n`;
  markdown += `تم إنتاج التقرير في: ${new Date().toLocaleString('ar-SA')}\n\n`;
  
  // File Status Summary
  markdown += `## 📊 ملخص الحالة\n\n`;
  const okCount = reports.filter(r => r.status === 'OK').length;
  const missingCount = reports.filter(r => r.status === 'MISSING').length;
  const outdatedCount = reports.filter(r => r.status === 'OUTDATED').length;
  
  markdown += `- ✅ سليم: ${okCount}\n`;
  markdown += `- ❌ مفقود: ${missingCount}\n`;
  markdown += `- ⚠️ قديم: ${outdatedCount}\n\n`;
  
  // Detailed File Analysis
  markdown += `## 📁 تحليل الملفات التفصيلي\n\n`;
  
  reports.forEach(report => {
    const statusIcon = report.status === 'OK' ? '✅' : report.status === 'MISSING' ? '❌' : '⚠️';
    markdown += `### ${statusIcon} \`${report.path}\`\n\n`;
    
    if (report.exists) {
      markdown += `- **الحجم**: ${(report.size / 1024).toFixed(2)} KB\n`;
      markdown += `- **آخر تعديل**: ${new Date(report.lastModified).toLocaleString('ar-SA')}\n`;
      markdown += `- **التصديرات**: ${report.exports.length > 0 ? report.exports.join(', ') : 'لا يوجد'}\n`;
      markdown += `- **معرفات الاختبار**: ${report.testIds.length > 0 ? report.testIds.join(', ') : 'لا يوجد'}\n`;
    } else {
      markdown += `**🚨 الملف غير موجود**\n`;
    }
    markdown += `\n`;
  });
  
  // Test IDs Coverage
  markdown += `## 🧪 تغطية معرفات الاختبار\n\n`;
  
  const foundTestIds = new Set<string>();
  reports.forEach(r => r.testIds.forEach(id => foundTestIds.add(id)));
  
  REQUIRED_TEST_IDS.forEach(testId => {
    const found = foundTestIds.has(testId);
    const icon = found ? '✅' : '❌';
    markdown += `- ${icon} \`${testId}\`${found ? '' : ' - مفقود'}\n`;
  });
  
  // Recommendations
  markdown += `\n## 💡 التوصيات\n\n`;
  
  if (missingCount > 0) {
    markdown += `- أنشئ الملفات المفقودة\n`;
  }
  
  if (outdatedCount > 0) {
    markdown += `- حدّث الملفات القديمة\n`;
  }
  
  const missingTestIds = REQUIRED_TEST_IDS.filter(id => !foundTestIds.has(id));
  if (missingTestIds.length > 0) {
    markdown += `- أضف معرفات الاختبار المفقودة: ${missingTestIds.join(', ')}\n`;
  }
  
  markdown += `\n---\n*تم إنتاج التقرير بواسطة Repo Doctor*`;
  
  return markdown;
}

function main() {
  console.log('🔍 بدء تشخيص المشروع...');
  
  const report = generateReport();
  
  // Ensure docs directory exists
  const docsDir = path.resolve('docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  const reportPath = path.resolve('docs/RepoReport.md');
  fs.writeFileSync(reportPath, report, 'utf-8');
  
  console.log(`✅ تم إنشاء التقرير: ${reportPath}`);
  console.log('\n📋 ملخص سريع:');
  
  const reports = REQUIRED_FILES.map(analyzeFile);
  reports.forEach(r => {
    const statusIcon = r.status === 'OK' ? '✅' : r.status === 'MISSING' ? '❌' : '⚠️';
    console.log(`  ${statusIcon} ${r.path}`);
  });
}

if (require.main === module) {
  main();
}