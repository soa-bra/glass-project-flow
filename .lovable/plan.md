

# Fix: Task List Scrolling in Project Management Board

## Problem
The task list container has the correct ScrollArea structure but scrolling doesn't work because the parent grid cell has no fixed height constraint. The CSS Grid uses `gridAutoRows: minmax(140px, auto)` — the `auto` keyword lets rows grow infinitely to fit content, so the task list expands to show all tasks instead of scrolling.

The ProjectsColumn works because it sits in a `position: fixed` container with an explicit viewport-relative height (`h-[calc(100vh-...)]`), giving ScrollArea a concrete height to scroll within.

## Root Cause
`AppGridItem` with `rowSpan={4}` in a grid with `auto`-height rows = no height cap = no scroll.

## Fix (2 changes)

### 1. `ProjectCardGrid.tsx` — Give the task list grid item an explicit max height
Add a `minHeight` and constrain the grid item so the task list cell has a concrete height that triggers scroll behavior. Alternatively, set a fixed `viewportHeight` or override the row height for this specific grid.

**Approach**: Set `minRowHeight="140px"` to `minmax(140px, 1fr)` instead of `minmax(140px, auto)` when a `viewportHeight` is provided, OR more simply: add a max-height style to the TaskListCard's AppGridItem so the cell doesn't grow beyond a fixed size.

Simplest fix: Add `className="max-h-[620px]"` to the task list `AppGridItem` (4 rows × ~140px + gaps ≈ 580-620px), which caps the cell and lets ScrollArea activate.

### 2. `TaskListContainer.tsx` — Ensure height chain is unbroken
The container already has `h-full` and `flex-col` with `overflow-hidden`, which is correct. No change needed here if the parent gets a height cap.

## Files Changed
1. **`src/components/ProjectManagement/ProjectCardGrid.tsx`** — Add `className="max-h-[620px]"` to the task list `AppGridItem`

This is the minimal, non-breaking fix that makes ScrollArea activate without touching the grid system or other layouts.

