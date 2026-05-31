# Route/navigation entry audit — 2026-05-07

## Scope

Requested inspection scope:

- `src/App.tsx`
- `src/pages/*`
- `src/contexts/NavigationContext.tsx`
- route/navigation configuration inside `src`

Requested symbols:

- `HRLiteMainPanel`
- `KnowledgeBaseMainPanel`
- `SurveysMainPanel`
- `KnowledgeBaseOverview`

## Routing and navigation findings

- `src/App.tsx` only registers `/auth`, `/join/:token`, `/`, `/departments`, `/departments/:departmentId`, and the catch-all route. None of the requested symbols are imported or mounted there.
- `src/pages/DepartmentRoutePage.tsx` allows department route keys `financial`, `legal`, `marketing`, `hr`, `crm`, `social`, `training`, `research`, and `brand`; it maps the URL parameter into `NavigationContext` state rather than mounting standalone panel components.
- `src/contexts/NavigationContext.tsx` stores `activeSection`, `selectedDepartment`, and `selectedCustomer`; it contains no component registry and no route string for the requested symbols.
- Department navigation is driven by `src/components/DepartmentsSidebar.tsx`, `src/components/DepartmentPanel/DepartmentPanel.tsx`, `src/components/DepartmentPanel/FeatureDepartmentPanel.tsx`, and `src/components/DepartmentPanel/BaseDepartmentPanel.tsx`.
- The active knowledge/research entry is `selectedDepartment === "research"`, which renders `KMPADashboard`; it is not the deleted `KnowledgeBaseMainPanel` or `KnowledgeBaseOverview` path.

## Classification

| File / symbol | Last known path | Status | Classification | Route task |
|---|---|---:|---|---|
| `HRLiteMainPanel` | `src/components/HRLite/HRLiteMainPanel.tsx` | absent from working tree | `delete-approved` | none |
| `KnowledgeBaseMainPanel` | `src/components/KnowledgeBase/KnowledgeBaseMainPanel.tsx` | absent from working tree | `delete-approved` | none |
| `SurveysMainPanel` | `src/components/Surveys/SurveysMainPanel.tsx` | absent from working tree | `delete-approved` | none |
| `KnowledgeBaseOverview` | `src/components/kb/KnowledgeBaseOverview.tsx` | absent from working tree | `delete-approved` | none |

## Route-link tasks

No `route-missing` items were created in this audit because the four requested files are already absent and the existing routing model does not require those legacy component entry points. If a future product decision reinstates HR Lite, Surveys, or a standalone Knowledge Base entry, create a new feature-route task against the current department/navigation shell instead of restoring these deleted component paths.

## Final deletion list

The final deletion list for this audit remains the already-approved deleted paths:

- `src/components/HRLite/HRLiteMainPanel.tsx`
- `src/components/KnowledgeBase/KnowledgeBaseMainPanel.tsx`
- `src/components/Surveys/SurveysMainPanel.tsx`
- `src/components/kb/KnowledgeBaseOverview.tsx`

## Verification commands

```bash
rg -n "HRLiteMainPanel|KnowledgeBaseMainPanel|SurveysMainPanel|KnowledgeBaseOverview" src || true
find src/pages -maxdepth 1 -type f -print | sort
rg -n "departmentKeys|Route path|BrowserRouter|Routes|selectedDepartment|setSelectedDepartment|KMPADashboard|research" src/App.tsx src/pages src/contexts/NavigationContext.tsx src/components/DepartmentsSidebar.tsx src/components/DepartmentPanel
```
