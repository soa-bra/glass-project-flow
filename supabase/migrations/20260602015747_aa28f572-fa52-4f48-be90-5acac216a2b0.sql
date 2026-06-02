
-- Add missing enum values for central_dependency_type
ALTER TYPE public.central_dependency_type ADD VALUE IF NOT EXISTS 'depends_on';
ALTER TYPE public.central_dependency_type ADD VALUE IF NOT EXISTS 'causes';
ALTER TYPE public.central_dependency_type ADD VALUE IF NOT EXISTS 'blocks';
ALTER TYPE public.central_dependency_type ADD VALUE IF NOT EXISTS 'references';
ALTER TYPE public.central_dependency_type ADD VALUE IF NOT EXISTS 'funds';
ALTER TYPE public.central_dependency_type ADD VALUE IF NOT EXISTS 'delivers';
ALTER TYPE public.central_dependency_type ADD VALUE IF NOT EXISTS 'belongs_to';

-- Add missing planning_element_type values
ALTER TYPE public.planning_element_type ADD VALUE IF NOT EXISTS 'mindmap_connector';
ALTER TYPE public.planning_element_type ADD VALUE IF NOT EXISTS 'root_connector';
ALTER TYPE public.planning_element_type ADD VALUE IF NOT EXISTS 'visual_connector';
ALTER TYPE public.planning_element_type ADD VALUE IF NOT EXISTS 'visual_node';
