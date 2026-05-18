import { getDepartmentCoverageReport } from './departmentResolver';

export interface DepartmentCoverageRow {
  key: string;
  specifiedTabs: number;
  implementedTabs: number;
  missingTabs: string[];
}

export const buildDepartmentCoverageReport = (): DepartmentCoverageRow[] => getDepartmentCoverageReport();

export const logDepartmentCoverageReport = () => {
  const rows = buildDepartmentCoverageReport();
  console.table(
    rows.map((row) => ({
      department: row.key,
      specifiedTabs: row.specifiedTabs,
      implementedTabs: row.implementedTabs,
      missingTabs: row.missingTabs.join(', ')
    }))
  );
  return rows;
};
