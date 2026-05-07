#!/usr/bin/env node
import fs from 'node:fs';

const required = [
  'docs/recovery/step-10-baseline-schema.md',
  'docs/recovery/step-10-schema-inventory.tsv',
  'supabase/migrations/20260430160310_91fd3b59-915f-463d-8e01-63b1c31b6330.sql'
];

const missing = required.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error('Schema baseline check failed. Missing files:');
  for (const f of missing) console.error(` - ${f}`);
  process.exit(1);
}

const inv = fs.readFileSync('docs/recovery/step-10-schema-inventory.tsv', 'utf8');
if (!inv.includes('CREATE TABLE public.projects') || !inv.includes('CREATE TABLE public.tasks')) {
  console.error('Schema baseline check failed: expected core tables not found in inventory.');
  process.exit(1);
}

console.log('Schema baseline check passed.');
