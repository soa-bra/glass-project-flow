

# Unified Surface System + Grid Architecture — Execution Plan

## Scope Summary

Two phases executed together as one architectural refactor:
- **Phase 1**: Surface System Pass — enforce white/gray/black static surface philosophy
- **Phase 2**: Grid System Pass — unified 12-column grid with presets

Applies to: Operations, Project Dashboard, Departments, Archive, Settings.

**Explicitly excluded**: KPIStatsSection, chart internals, modal redesign, action logic, canvas/planning surfaces.

---

## Audit — Current Violations Found

### Surface Violations (confirmed via codebase search)

| Violation | Count | Files |
|-----------|-------|-------|
| `variant="glass"` on static cards | 12 uses | 10 files in OperationsBoard/Overview + Legal |
| `glass-enhanced` on static content | 91 matches | 8 files (Finance, Reports, Clients, StatusBox) |
| `rounded-[41px]` non-standard radius | 489 matches | 24 files (Settings, TaskDetails, index.css `sb-surface-box`) |
| `rounded-[40px]` non-standard radius | 266 matches | 22 files (Archive, Settings, Reports) |
| `GenericCard` still exists | 1 component | No active consumers found beyond its own file |
| `InnerCard` with `rounded-[41px]` | 2 consumers | HRLiteMainPanel, HR/TeamFillProgress |
| `sb-surface-box` CSS class uses `rounded-[41px]` | 1 CSS rule | index.css line 342 |
| Hand-built `ring-1` + CSS var cards | ~50+ instances | All Settings panels, Archive panels |
| `bg-white/20`, `bg-white/30` on static surfaces | scattered | Multiple files |

### Grid Violations

| Violation | Scope |
|-----------|-------|
| Settings panels: no grid system, manual `grid-cols-*` | 8 panels |
| Archive panels: no grid system, manual layouts | 9 panels |
| Project dashboard: no grid system | ProjectManagementBoard, ProjectCardGrid |
| Operations sub-tabs (Finance, Reports, Clients): manual grids | ~6 files |

### What Already Works

- `SURFACE_CLASSES.STATIC_CARD` token: correctly defined but unused in components
- `surface-tokens.ts`: complete spec with STATIC/OVERLAY separation
- `AppDashboardGrid` + `AppGridItem`: functional, RTL-safe (`dir="rtl"`)
- Some Operations Overview + Department tabs already migrated to grid

---

## Execution Steps

### Step 1 — Fix Foundation: CSS + BaseBox

**1a. Fix `sb-surface-box` in `index.css`**
- Change `rounded-[41px]` → `rounded-[24px]` in the `.sb-surface-box` rule
- Same fix for `.sb-surface-task-card`

**1b. Normalize BaseBox variants**
- Default `rounded` from `'xl'` (40px) → `'lg'` (24px)
- Update `roundedClasses.xl` from `rounded-[40px]` → `rounded-[24px]` (or remove `xl` entirely)
- Change `standard` variant to use `SURFACE_CLASSES.STATIC_CARD` directly
- Merge `operations`, `unified`, `legal` into one `standard` variant (they're nearly identical)
- Add JSDoc deprecation on `glass` for static use
- Keep `glass` variant code intact for overlay contexts

### Step 2 — Create Surface Primitives

Create `src/components/shared/surfaces/` with:

**`AppCardSurface.tsx`**
- Props: `density` (compact|standard|spacious), `interactive` (static|hoverable|selectable), `role`, `overflow`, `className`, `children`, `header`, `footer`
- Renders: `bg-white border border-[#DADCE0] rounded-[24px]` + shadow + padding per density
- No glass, no transparency

**`AppSectionSurface.tsx`**
- Flatter grouping surface: `bg-white border border-[#DADCE0] rounded-[18px]`, no shadow

**`AppCardHeader.tsx`**
- Props: `title`, `icon`, `actions`, `size`
- Standardized spacing, title hierarchy, action alignment

**`AppCardBody.tsx`**
- Content wrapper with overflow control

**`AppCardFooter.tsx`**
- Action bar with standardized button alignment

**`AppActionGroup.tsx`**
- Inline action cluster (primary/secondary/icon-only)

**`index.ts`** — barrel export

### Step 3 — Enhance Grid System

**3a. Extend `AppGridItem`**
- Add props: `desktopSpan`, `mobileSpan`, `mobileOrder`, `density`, `priority`, `variant`, `fullWidth`
- `fullWidth` = shorthand for `colSpan={12}`

**3b. Create `AppGridSection.tsx`**
- Full-width labeled section row within a grid (optional title spanning 12 cols)

**3c. Add `minRowHeight` to `AppDashboardGrid`**
- New prop: `minRowHeight` (default `'140px'`)
- Applied as `grid-auto-rows: minmax(${minRowHeight}, auto)`

**3d. Create `GridLayoutPreset` types + presets**

File: `src/components/shared/layout/presets.ts`

```text
operations:  density=default, minRowHeight=140px
project:     density=default, minRowHeight=160px
departments: density=spacious, minRowHeight=140px
archive:     density=compact, minRowHeight=120px
settings:    density=spacious, minRowHeight=auto
```

Each preset defines: density, minRowHeight, default footprint patterns.

**3e. Row Model — Role-Based Height Rules**

```text
KPI/stat tile:      minHeight 140px, rowSpan=1
Summary card:       minHeight 160px, rowSpan=1
Chart card shell:   minHeight 280px, rowSpan=2
Table/list card:    minHeight 320px, rowSpan=2
Feature card:       minHeight 200px, rowSpan=1
Detail card:        minHeight auto, rowSpan varies
```

### Step 4 — Migrate Operations Dashboard

**4a. Overview** (10 files)
- Replace all `variant="glass"` → `variant="standard"` (or wrap in `AppCardSurface`)
- Remove inline `style={{ backgroundColor: '#ffffff' }}` overrides
- Remove `neonRing` from static cards where inappropriate

Files: `FinancialOverviewBox`, `AlertsBox`, `TimelineBox`, `ProjectSummaryBox`, `ContractsBox`, `AISuggestedBox`, `ExtraBoxOne-Four`

**4b. Sub-tabs** (8 files)
- Finance: `ProjectBudgetChart`, `OverBudgetAlert` — remove `glass-enhanced`, fix `rounded-[40px]`
- Reports: `TemplatesList`, `ReportLibrary`, `CustomReportForm` — remove `glass-enhanced`, migrate to `AppCardSurface`
- Clients: `ClientSentiment`, `ClientPortfolioHealth` — remove `glass-enhanced`, fix cards
- Legal: `UpcomingContracts` — remove `variant="glass"`

### Step 5 — Migrate Settings Panels

All 8 panels follow the same pattern: replace hand-built `rounded-[41px] p-6 ring-1 style={{ background: 'var(--sb-box-standard)' }}` with `AppCardSurface`.

- `AccountSettingsPanel` — also fix `rounded-[40px]` inner cards
- `SecuritySettingsPanel` — 6+ hand-built cards
- `AISettingsPanel` — 5+ hand-built cards
- `ThemeSettingsPanel`, `NotificationsSettingsPanel`, `IntegrationsSettingsPanel`, `DataGovernanceSettingsPanel`, `UsersRolesSettingsPanel`
- `SettingsPanelLayout` — replace `var(--sb-bg-00)` background with `bg-white`
- Wrap content in `AppDashboardGrid` with settings preset

### Step 6 — Migrate Archive Panels

All 9 category panels: replace `rounded-[40px] ring-1 ring-[#DADCE0]` hand-built cards with `AppCardSurface`.

- `ArchivePanelLayout` — replace `var(--sb-column-3-bg)` with `bg-white`
- `PoliciesArchivePanel`, `OrganizationalArchivePanel` — fix search bars + list items
- `FinancialArchivePanel`, `ProjectsArchivePanel`, `HRArchivePanel`, `LegalArchivePanel`, `KnowledgeArchivePanel`, `TemplatesArchivePanel`, `DocumentsArchivePanel`
- Wrap in `AppDashboardGrid` with archive preset

### Step 7 — Migrate Project Dashboard

- `ProjectManagementBoard` — wrap tab content in `AppDashboardGrid`
- `ProjectCardGrid` — migrate cards to `AppCardSurface`
- `TaskDetailsPanel` — fix `rounded-[41px]` → `rounded-[24px]`
- `TaskDetailsBox` — fix `rounded-[41px]`

### Step 8 — Verify Departments Consistency

- Scan all department tabs for remaining `glass`, `rounded-[41px]`, `rounded-[40px]`
- Fix any local wrappers not yet aligned

### Step 9 — Cleanup Deprecated Components

- Delete `GenericCard.tsx` (no active consumers found)
- Migrate `InnerCard` consumers (2 files: `HRLiteMainPanel`, `TeamFillProgress`) to `AppCardSurface`, then delete or deprecate `InnerCard`
- Remove `glass-enhanced` CSS class if no remaining consumers
- Clean `BaseBox` variant list: remove redundant `operations`, `unified`, `legal` (all → `standard`)

### Step 10 — Responsive + RTL Verification

Verify across all 5 major screens:
- Desktop (12-col), Tablet (6-col), Mobile (stacked)
- RTL: header alignment, action zones, grid placement, section titles, icon alignment
- No hidden LTR assumptions in grid or surface primitives

---

## Estimated File Changes

| Category | Estimated Files |
|----------|----------------|
| New surface primitives | 7 files |
| Grid system enhancements | 3 files |
| Grid presets | 1 file |
| `index.css` fix | 1 file |
| `BaseBox.tsx` normalization | 1 file |
| Operations Overview | 10 files |
| Operations sub-tabs | 8 files |
| Settings panels + layout | 9 files |
| Archive panels + layout | 10 files |
| Project dashboard | 4 files |
| Department verification | ~3-5 files |
| Deprecated cleanup | 3 files |
| **Total** | **~60-65 files** |

---

## Phase Protection Rules

Will NOT touch in this pass:
- KPIStatsSection internals
- Chart/data-visualization internals
- Modal/dialog internals
- Tooltip systems
- z-index overhaul
- Action button logic
- Form redesign
- Canvas/planning surfaces

Will ONLY touch:
- Surface shells (bg, border, radius, shadow)
- Grid layout wrappers
- Structural migration
- Removing static glass violations
- Keeping overlays glass without redesigning them

