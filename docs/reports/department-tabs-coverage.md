# Department Tabs Coverage Report

Generated from `departmentsSpecification` مقابل `departmentResolver` implementations.

| Department Key | Dashboard (Spec) | Tabs in Spec | Tabs Implemented | Missing Tabs | Dashboard Implemented |
|---|---|---:|---:|---|---|
| financial | FinancialDashboard | 8 | 8 | — | ✅ |
| legal | LegalDashboard | 7 | 7 | — | ✅ |
| hr | HRDashboard | 7 | 7 | — | ✅ |
| crm | CRMDashboard | 7 | 7 | — | ✅ |
| marketing | MarketingDashboard | 8 | 8 | — | ✅ |
| partnerships | PartnershipsDashboard | 6 | 0 | overview, partners, opportunities, agreements, templates, reports | ❌ |
| social | CSRDashboard | 6 | 6 | — | ✅ |
| training | TrainingDashboard | 6 | 6 | — | ✅ |
| research | ResearchPublishingDashboard | 6 | 6 | — | ✅ |
| knowledge | KnowledgeBaseDashboard | 6 | 0 | overview, repository, taxonomy, access, templates, reports | ❌ |
| brand | BrandDashboard | 6 | 6 | — | ✅ |
| brand-community | BrandCommunityDashboard | 6 | 0 | overview, members, engagement, events, templates, reports | ❌ |

## Notes
- `research` key is currently mapped to `KMPADashboard` as a temporary تنفيذ حتى توفر شاشة `ResearchPublishingDashboard` الفعلية.
- Any unresolved key or missing dashboard implementation is surfaced in runtime through explicit `console.error` and user-facing red state in `FeatureDepartmentPanel`.
