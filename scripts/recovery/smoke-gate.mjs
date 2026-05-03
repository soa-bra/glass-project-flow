#!/usr/bin/env node
import fs from 'node:fs';

const requiredFiles = [
  'src/components/auth/ProtectedRoute.tsx',
  'src/services/central/projects.service.ts',
  'src/services/central/tasks.service.ts',
  'src/services/invoices/invoices.service.ts',
  'src/services/central/departments.service.ts'
];

const missing = requiredFiles.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error('Smoke gate failed: missing required active-path files:');
  for (const f of missing) console.error(` - ${f}`);
  process.exit(1);
}

console.log('Smoke gate passed: core active-path files exist.');
