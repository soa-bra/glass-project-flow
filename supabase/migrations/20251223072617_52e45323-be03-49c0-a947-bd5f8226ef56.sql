-- =====================================================
-- FIX 1: Secure board_join_requests INSERT policy
-- Require valid invite token + add input validation
-- =====================================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can create join requests" ON public.board_join_requests;

-- Create secure policy requiring valid invite token
CREATE POLICY "Users with valid tokens can create join requests"
ON public.board_join_requests
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.board_invite_links bil
    WHERE bil.id = board_join_requests.invite_link_id
    AND bil.board_id = board_join_requests.board_id
    AND bil.is_active = true
    AND (bil.expires_at IS NULL OR bil.expires_at > NOW())
  )
);

-- Add input validation trigger for requester_name
CREATE OR REPLACE FUNCTION public.validate_join_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate requester_name length
  IF LENGTH(TRIM(NEW.requester_name)) < 2 THEN
    RAISE EXCEPTION 'Name must be at least 2 characters';
  END IF;
  
  IF LENGTH(NEW.requester_name) > 100 THEN
    RAISE EXCEPTION 'Name too long';
  END IF;
  
  -- Strip HTML/script tags from name (XSS prevention)
  NEW.requester_name := regexp_replace(
    TRIM(NEW.requester_name), 
    '<[^>]*>',
    '',
    'g'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_join_request_trigger ON public.board_join_requests;
CREATE TRIGGER validate_join_request_trigger
BEFORE INSERT ON public.board_join_requests
FOR EACH ROW
EXECUTE FUNCTION public.validate_join_request();

-- =====================================================
-- FIX 2: Recreate views with SECURITY INVOKER
-- This ensures views use the querying user's permissions
-- =====================================================

-- Recreate project_cards_view with SECURITY INVOKER
DROP VIEW IF EXISTS public.project_cards_view;
CREATE VIEW public.project_cards_view 
WITH (security_invoker = on)
AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.status,
  p.budget,
  p.start_date,
  p.end_date,
  p.owner_id,
  p.created_at,
  p.updated_at,
  COALESCE(task_stats.total_tasks, 0) AS total_tasks,
  COALESCE(task_stats.completed_tasks, 0) AS completed_tasks,
  COALESCE(phase_stats.total_phases, 0) AS total_phases,
  COALESCE(phase_stats.completed_phases, 0) AS completed_phases,
  CASE 
    WHEN COALESCE(task_stats.total_tasks, 0) = 0 THEN 0
    ELSE ROUND((COALESCE(task_stats.completed_tasks, 0)::numeric / task_stats.total_tasks::numeric) * 100, 2)
  END AS completion_percentage,
  COALESCE(task_stats.estimated_hours, 0) AS estimated_hours,
  COALESCE(task_stats.actual_hours, 0) AS actual_hours
FROM public.projects p
LEFT JOIN (
  SELECT 
    project_id,
    COUNT(*) AS total_tasks,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed_tasks,
    SUM(COALESCE(estimated_hours, 0)) AS estimated_hours,
    SUM(COALESCE(actual_hours, 0)) AS actual_hours
  FROM public.project_tasks
  GROUP BY project_id
) task_stats ON p.id = task_stats.project_id
LEFT JOIN (
  SELECT 
    project_id,
    COUNT(*) AS total_phases,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed_phases
  FROM public.project_phases
  GROUP BY project_id
) phase_stats ON p.id = phase_stats.project_id;

-- Recreate finance_dashboard_view with SECURITY INVOKER
DROP VIEW IF EXISTS public.finance_dashboard_view;
CREATE VIEW public.finance_dashboard_view 
WITH (security_invoker = on)
AS
SELECT 
  p.id AS project_id,
  p.name AS project_name,
  p.status,
  p.budget,
  p.start_date,
  p.end_date,
  COALESCE(task_stats.total_tasks, 0) AS total_tasks,
  COALESCE(task_stats.spent_amount, 0) AS spent_amount,
  COALESCE(task_stats.estimated_cost, 0) AS estimated_cost,
  p.budget - COALESCE(task_stats.spent_amount, 0) AS remaining_budget,
  CASE 
    WHEN COALESCE(p.budget, 0) = 0 THEN 0
    ELSE ROUND((COALESCE(task_stats.spent_amount, 0)::numeric / p.budget::numeric) * 100, 2)
  END AS budget_used_percentage,
  COALESCE(task_stats.avg_task_hours, 0) AS avg_task_hours
FROM public.projects p
LEFT JOIN (
  SELECT 
    project_id,
    COUNT(*) AS total_tasks,
    SUM(COALESCE(actual_hours, 0) * 100) AS spent_amount,
    SUM(COALESCE(estimated_hours, 0) * 100) AS estimated_cost,
    AVG(COALESCE(actual_hours, 0)) AS avg_task_hours
  FROM public.project_tasks
  GROUP BY project_id
) task_stats ON p.id = task_stats.project_id;

-- Recreate crm_activities_view with SECURITY INVOKER
DROP VIEW IF EXISTS public.crm_activities_view;
CREATE VIEW public.crm_activities_view 
WITH (security_invoker = on)
AS
SELECT 
  pt.id,
  pt.title AS activity_title,
  pt.description,
  pt.status,
  pt.priority,
  pt.due_date,
  pt.assigned_to,
  pt.created_at,
  pt.updated_at,
  p.name AS project_name,
  p.owner_id AS client_id,
  CASE pt.status
    WHEN 'completed' THEN 'completed'
    WHEN 'in_progress' THEN 'active'
    ELSE 'pending'
  END AS activity_status,
  CASE pt.priority
    WHEN 'urgent' THEN 4
    WHEN 'high' THEN 3
    WHEN 'medium' THEN 2
    ELSE 1
  END AS priority_score
FROM public.project_tasks pt
JOIN public.projects p ON pt.project_id = p.id;

-- Recreate csr_requests_view with SECURITY INVOKER
DROP VIEW IF EXISTS public.csr_requests_view;
CREATE VIEW public.csr_requests_view 
WITH (security_invoker = on)
AS
SELECT 
  pt.id,
  pt.title AS request_title,
  pt.description AS request_details,
  pt.status,
  pt.priority,
  pt.created_at AS request_date,
  pt.updated_at AS last_updated,
  pt.due_date AS resolution_due,
  pt.assigned_to AS agent_id,
  p.owner_id AS customer_id,
  p.name AS project_context,
  CASE pt.priority
    WHEN 'urgent' THEN 'urgent'
    WHEN 'high' THEN 'high'
    WHEN 'medium' THEN 'medium'
    ELSE 'low'
  END AS severity_level,
  pt.due_date IS NOT NULL AND pt.due_date < NOW() AND pt.status != 'completed' AS is_overdue,
  EXTRACT(EPOCH FROM (NOW() - pt.created_at)) / 3600 AS hours_open
FROM public.project_tasks pt
JOIN public.projects p ON pt.project_id = p.id;