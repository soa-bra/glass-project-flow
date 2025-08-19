-- Create database views and functions for widget data sources

-- Project Cards View
CREATE OR REPLACE VIEW project_cards_view AS
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
    -- Calculated fields
    COALESCE(task_stats.total_tasks, 0) as total_tasks,
    COALESCE(task_stats.completed_tasks, 0) as completed_tasks,
    COALESCE(phase_stats.total_phases, 0) as total_phases,
    COALESCE(phase_stats.completed_phases, 0) as completed_phases,
    CASE 
        WHEN task_stats.total_tasks > 0 
        THEN ROUND((task_stats.completed_tasks::numeric / task_stats.total_tasks::numeric) * 100, 2)
        ELSE 0 
    END as completion_percentage,
    COALESCE(task_stats.total_hours, 0) as estimated_hours,
    COALESCE(task_stats.actual_hours, 0) as actual_hours
FROM projects p
LEFT JOIN (
    SELECT 
        project_id,
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
        COALESCE(SUM(estimated_hours), 0) as total_hours,
        COALESCE(SUM(actual_hours), 0) as actual_hours
    FROM project_tasks 
    GROUP BY project_id
) task_stats ON p.id = task_stats.project_id
LEFT JOIN (
    SELECT 
        project_id,
        COUNT(*) as total_phases,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_phases
    FROM project_phases 
    GROUP BY project_id
) phase_stats ON p.id = phase_stats.project_id;

-- Finance Dashboard View
CREATE OR REPLACE VIEW finance_dashboard_view AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    p.budget,
    p.status,
    -- Calculate spent amount based on actual hours
    COALESCE(SUM(pt.actual_hours), 0) * 50 as spent_amount, -- Assuming $50/hour rate
    COALESCE(SUM(pt.estimated_hours), 0) * 50 as estimated_cost,
    p.budget - (COALESCE(SUM(pt.actual_hours), 0) * 50) as remaining_budget,
    CASE 
        WHEN p.budget > 0 THEN 
            ROUND(((COALESCE(SUM(pt.actual_hours), 0) * 50) / p.budget) * 100, 2)
        ELSE 0 
    END as budget_used_percentage,
    COUNT(pt.id) as total_tasks,
    AVG(pt.actual_hours) as avg_task_hours,
    p.start_date,
    p.end_date
FROM projects p
LEFT JOIN project_tasks pt ON p.id = pt.project_id
WHERE p.budget IS NOT NULL AND p.budget > 0
GROUP BY p.id, p.name, p.budget, p.status, p.start_date, p.end_date;

-- CRM Activities View (using project tasks as customer interactions)
CREATE OR REPLACE VIEW crm_activities_view AS
SELECT 
    pt.id,
    pt.title as activity_title,
    pt.description,
    pt.status,
    pt.priority,
    pt.created_at,
    pt.updated_at,
    pt.due_date,
    pt.assigned_to,
    p.name as project_name,
    p.owner_id as client_id,
    CASE pt.priority
        WHEN 'high' THEN 3
        WHEN 'medium' THEN 2 
        ELSE 1
    END as priority_score,
    CASE pt.status
        WHEN 'completed' THEN 'closed'
        WHEN 'in_progress' THEN 'active'
        ELSE 'pending'
    END as activity_status
FROM project_tasks pt
INNER JOIN projects p ON pt.project_id = p.id
WHERE pt.assigned_to IS NOT NULL;

-- CSR (Customer Service Requests) View 
CREATE OR REPLACE VIEW csr_requests_view AS
SELECT 
    pt.id,
    pt.title as request_title,
    pt.description as request_details,
    pt.status,
    pt.priority,
    pt.created_at as request_date,
    pt.updated_at as last_updated,
    pt.due_date as resolution_due,
    pt.assigned_to as agent_id,
    pt.created_by as customer_id,
    p.name as project_context,
    CASE 
        WHEN pt.due_date < NOW() AND pt.status != 'completed' THEN true
        ELSE false 
    END as is_overdue,
    EXTRACT(EPOCH FROM (NOW() - pt.created_at))/3600 as hours_open,
    CASE pt.priority
        WHEN 'high' THEN 'urgent'
        WHEN 'medium' THEN 'normal'
        ELSE 'low'
    END as severity_level
FROM project_tasks pt
INNER JOIN projects p ON pt.project_id = p.id;

-- Function to get widget data by type and parameters
CREATE OR REPLACE FUNCTION get_widget_data(
    widget_type TEXT,
    user_id UUID DEFAULT auth.uid(),
    filters JSONB DEFAULT '{}'::jsonb,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(data JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    CASE widget_type
        WHEN 'project_cards' THEN
            RETURN QUERY
            SELECT to_jsonb(pcv.*) as data
            FROM project_cards_view pcv
            WHERE pcv.owner_id = user_id
            ORDER BY pcv.updated_at DESC
            LIMIT limit_count;
            
        WHEN 'finance_dashboard' THEN
            RETURN QUERY
            SELECT to_jsonb(fdv.*) as data
            FROM finance_dashboard_view fdv
            WHERE EXISTS (
                SELECT 1 FROM projects p 
                WHERE p.id = fdv.project_id AND p.owner_id = user_id
            )
            ORDER BY fdv.budget_used_percentage DESC
            LIMIT limit_count;
            
        WHEN 'crm_activities' THEN
            RETURN QUERY
            SELECT to_jsonb(cav.*) as data
            FROM crm_activities_view cav
            WHERE cav.assigned_to = user_id OR cav.client_id = user_id
            ORDER BY cav.priority_score DESC, cav.created_at DESC
            LIMIT limit_count;
            
        WHEN 'csr_requests' THEN
            RETURN QUERY
            SELECT to_jsonb(csv.*) as data
            FROM csr_requests_view csv
            WHERE csv.agent_id = user_id OR csv.customer_id = user_id
            ORDER BY csv.is_overdue DESC, csv.priority_score DESC, csv.request_date DESC
            LIMIT limit_count;
            
        ELSE
            RETURN QUERY SELECT '{"error": "Unknown widget type"}'::jsonb as data;
    END CASE;
END;
$$;

-- Function to get widget statistics
CREATE OR REPLACE FUNCTION get_widget_stats(
    widget_type TEXT,
    user_id UUID DEFAULT auth.uid()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stats JSONB;
BEGIN
    CASE widget_type
        WHEN 'project_cards' THEN
            SELECT jsonb_build_object(
                'total_projects', COUNT(*),
                'active_projects', COUNT(CASE WHEN status = 'active' THEN 1 END),
                'completed_projects', COUNT(CASE WHEN status = 'completed' THEN 1 END),
                'total_budget', COALESCE(SUM(budget), 0),
                'avg_completion', COALESCE(AVG(completion_percentage), 0)
            ) INTO stats
            FROM project_cards_view
            WHERE owner_id = user_id;
            
        WHEN 'finance_dashboard' THEN
            SELECT jsonb_build_object(
                'total_budget', COALESCE(SUM(budget), 0),
                'total_spent', COALESCE(SUM(spent_amount), 0),
                'total_remaining', COALESCE(SUM(remaining_budget), 0),
                'avg_budget_usage', COALESCE(AVG(budget_used_percentage), 0),
                'projects_over_budget', COUNT(CASE WHEN budget_used_percentage > 100 THEN 1 END)
            ) INTO stats
            FROM finance_dashboard_view fdv
            WHERE EXISTS (
                SELECT 1 FROM projects p 
                WHERE p.id = fdv.project_id AND p.owner_id = user_id
            );
            
        WHEN 'crm_activities' THEN
            SELECT jsonb_build_object(
                'total_activities', COUNT(*),
                'active_activities', COUNT(CASE WHEN activity_status = 'active' THEN 1 END),
                'pending_activities', COUNT(CASE WHEN activity_status = 'pending' THEN 1 END),
                'high_priority', COUNT(CASE WHEN priority = 'high' THEN 1 END),
                'avg_priority_score', COALESCE(AVG(priority_score), 0)
            ) INTO stats
            FROM crm_activities_view
            WHERE assigned_to = user_id OR client_id = user_id;
            
        WHEN 'csr_requests' THEN
            SELECT jsonb_build_object(
                'total_requests', COUNT(*),
                'overdue_requests', COUNT(CASE WHEN is_overdue THEN 1 END),
                'urgent_requests', COUNT(CASE WHEN severity_level = 'urgent' THEN 1 END),
                'avg_resolution_time', COALESCE(AVG(hours_open), 0),
                'completion_rate', ROUND((COUNT(CASE WHEN status = 'completed' THEN 1 END)::numeric / COUNT(*)::numeric) * 100, 2)
            ) INTO stats
            FROM csr_requests_view
            WHERE agent_id = user_id OR customer_id = user_id;
            
        ELSE
            stats := '{"error": "Unknown widget type"}'::jsonb;
    END CASE;
    
    RETURN COALESCE(stats, '{}'::jsonb);
END;
$$;