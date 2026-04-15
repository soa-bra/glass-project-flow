

# Fix: Task Details Box Scroll Not Working

## Problem
Same root cause as the project board task list: the parent container chain has no concrete height constraint, so `h-full` on the ScrollArea resolves to "auto" (infinite), and the list grows to fit all items instead of scrolling.

The parent `TaskManagementTab` uses `overflow-auto` on the outer wrapper (line 35), which lets the entire page scroll instead of the task list column scrolling internally.

## Fix

### `TaskDetailsBox.tsx` — Add viewport-relative max-height to the task list column

**Line 46**: Change `<div className="w-1/3 min-w-0">` to `<div className="w-1/3 min-w-0 max-h-[60vh]">`.

This gives the task list column a concrete height cap, enabling the ScrollArea inside to activate its scroll behavior while the header stays fixed at the top.

### Files Changed
1. **`src/components/ProjectManagement/TaskManagement/TaskDetailsBox.tsx`** — Add `max-h-[60vh]` to the task list column wrapper (line 46)

