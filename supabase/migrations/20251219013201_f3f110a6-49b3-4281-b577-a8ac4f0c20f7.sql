-- Fix 1: board_join_requests - Privacy Violation (CRITICAL)
-- Remove overly permissive SELECT policy that allows ANY user to see ALL requests
DROP POLICY IF EXISTS "Anyone can view their own requests by session" ON public.board_join_requests;

-- Create proper policy: Board hosts can view join requests for their boards
CREATE POLICY "Board hosts can view join requests"
ON public.board_join_requests
FOR SELECT
USING (
  board_id IN (
    SELECT id FROM public.boards 
    WHERE owner_id = auth.uid()
  )
);

-- Fix 2: project_tasks - Add missing DELETE policy (MEDIUM)
-- Owners should be able to delete their project tasks
CREATE POLICY "Owners can delete project tasks"
ON public.project_tasks
FOR DELETE
USING (
  project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  )
);