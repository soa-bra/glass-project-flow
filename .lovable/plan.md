# Fix: Approved guests land on 404

## Confirmed issue
After a join request is approved, `src/pages/JoinBoardPage.tsx` navigates to `/board/${board_id}?guest=true&session=...&role=...`. No such route exists in `src/App.tsx`, so guests hit `NotFound`. Additionally, `/` is wrapped in `ProtectedRoute`, so even redirecting there would bounce unauthenticated guests to `/auth`. Boards today are opened purely via in-memory state (`planningStore.setCurrentBoard`) — there is no deep-link entry point for any user.

## Proposed fix (bounded)

### 1. Add a guest-accessible board route
In `src/App.tsx`, add:
```
<Route path="/board/:boardId" element={<BoardPage />} />
```
outside `ProtectedRoute` (guests are unauthenticated). Access control is enforced by the existing invite/RLS layer.

### 2. Create `src/pages/BoardPage.tsx`
Responsibilities:
- Read `:boardId` and query params `guest`, `session`, `role`.
- Fetch the board row from Supabase by id (already RLS-protected — approved guests receive access via `board_join_requests` policy; verify policy allows read for the granted session or fall back to a `get_board_for_guest(session_id)` RPC if RLS blocks anonymous reads).
- On success: hydrate `planningStore.setCurrentBoard(board)` and render the existing planning canvas shell (same component `MainContent` uses when a board is active — extract or reuse `PlanningWorkspace`/`CanvasBoardView`).
- Pass `guestSession`/`role` down so `CanvasToolbar`, presence, and edit-lock hooks treat the user as a guest with the granted role (read-only vs editor).
- On failure (no access / bad id): show a friendly "لا تملك صلاحية الوصول" state with link back to `/`.

### 3. Verify RLS for anonymous guest reads
Confirm `canvas_boards` (or equivalent) SELECT policy allows a row when a matching approved `board_join_requests.requester_session_id` exists. If not, add a SECURITY DEFINER RPC `get_board_by_guest_session(board_id, session_id)` and call it from `BoardPage`.

### 4. Preserve authenticated flow
Signed-in users navigating to `/board/:id` should also work: same page, skip guest params, use normal RLS read.

## Files touched
- `src/App.tsx` — add route
- `src/pages/BoardPage.tsx` — new
- possibly `supabase/migrations/*` — new RPC if RLS insufficient
- optional small prop on canvas shell for `guestRole`

## Out of scope
- Redesigning how authenticated users open boards
- Changing invite/approval flow itself
