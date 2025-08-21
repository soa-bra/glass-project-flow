// src/app/page.tsx
import React from 'react';
import { PlanningWorkspace } from '@/features/planning/PlanningWorkspace';

export const metadata = {
  title: 'سـوبــرا | لوحة التخطيط التضامني',
};

export default function Page() {
  return <PlanningWorkspace />;
}
