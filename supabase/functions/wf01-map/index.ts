import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WF01MapRequest {
  snapshot: {
    id: string;
    name: string;
    data: {
      elements: Array<{
        id: string;
        type: string;
        content?: string;
        position: { x: number; y: number };
        size?: { width: number; height: number };
        metadata?: Record<string, any>;
      }>;
      links?: Array<{
        id: string;
        from_object_id: string;
        to_object_id: string;
        style?: Record<string, any>;
      }>;
    };
  };
}

interface MappingResult {
  success: boolean;
  mapped: Array<{
    original_id: string;
    original_type: string;
    mapped_to: 'project' | 'phase' | 'task';
    new_id: string;
    reasoning: string;
  }>;
  skipped: Array<{
    original_id: string;
    original_type: string;
    reason: string;
  }>;
  project_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    // التحقق من المصادقة
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { snapshot }: WF01MapRequest = await req.json();

    if (!snapshot || !snapshot.data || !snapshot.data.elements) {
      throw new Error('Invalid snapshot data');
    }

    console.log(`Processing snapshot: ${snapshot.name} with ${snapshot.data.elements.length} elements`);

    // قواعد التحويل حسب سـوبــرا
    const mappingRules = {
      // Sticky Notes → Tasks
      sticky: (element: any) => ({
        type: 'task',
        priority: extractPriority(element.content || ''),
        status: extractStatus(element.content || ''),
        reasoning: 'Sticky note converted to task based on سـوبــرا methodology'
      }),
      
      // Frames → Project Phases
      frame: (element: any) => ({
        type: 'phase',
        status: 'planning',
        reasoning: 'Frame converted to project phase for structured workflow'
      }),
      
      // Connectors → Dependencies
      connector: (element: any) => ({
        type: 'dependency',
        reasoning: 'Connector represents task dependency relationship'
      })
    };

    const mapped: MappingResult['mapped'] = [];
    const skipped: MappingResult['skipped'] = [];

    // إنشاء مشروع جديد أولاً
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: `مشروع مُحوّل من ${snapshot.name}`,
        description: `تم تحويله من snapshot: ${snapshot.id}`,
        owner_id: user.id,
        status: 'planning',
        settings: {
          source_snapshot_id: snapshot.id,
          mapped_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (projectError) {
      throw new Error(`Failed to create project: ${projectError.message}`);
    }

    console.log(`Created project: ${project.id}`);

    // تحويل العناصر حسب القواعد
    for (const element of snapshot.data.elements) {
      const elementType = element.type.toLowerCase();
      
      if (mappingRules[elementType]) {
        const mapping = mappingRules[elementType](element);
        
        try {
          if (mapping.type === 'task') {
            const { data: task, error: taskError } = await supabase
              .from('project_tasks')
              .insert({
                project_id: project.id,
                title: element.content || `مهمة من ${elementType}`,
                description: `تم تحويلها من عنصر ${elementType} في الـcanvas`,
                status: mapping.status || 'todo',
                priority: mapping.priority || 'medium',
                created_by: user.id,
                estimated_hours: extractEstimatedHours(element.content || ''),
              })
              .select()
              .single();

            if (taskError) {
              console.error(`Failed to create task for element ${element.id}:`, taskError);
              skipped.push({
                original_id: element.id,
                original_type: elementType,
                reason: `Database error: ${taskError.message}`
              });
            } else {
              mapped.push({
                original_id: element.id,
                original_type: elementType,
                mapped_to: 'task',
                new_id: task.id,
                reasoning: mapping.reasoning
              });
            }
          } else if (mapping.type === 'phase') {
            const { data: phase, error: phaseError } = await supabase
              .from('project_phases')
              .insert({
                project_id: project.id,
                name: element.content || `مرحلة من ${elementType}`,
                description: `تم تحويلها من عنصر ${elementType} في الـcanvas`,
                status: mapping.status || 'planning',
                order_index: mapped.filter(m => m.mapped_to === 'phase').length + 1,
              })
              .select()
              .single();

            if (phaseError) {
              console.error(`Failed to create phase for element ${element.id}:`, phaseError);
              skipped.push({
                original_id: element.id,
                original_type: elementType,
                reason: `Database error: ${phaseError.message}`
              });
            } else {
              mapped.push({
                original_id: element.id,
                original_type: elementType,
                mapped_to: 'phase',
                new_id: phase.id,
                reasoning: mapping.reasoning
              });
            }
          }
        } catch (dbError) {
          console.error(`Database operation failed for element ${element.id}:`, dbError);
          skipped.push({
            original_id: element.id,
            original_type: elementType,
            reason: `Database operation failed: ${dbError.message}`
          });
        }
      } else {
        skipped.push({
          original_id: element.id,
          original_type: elementType,
          reason: `No mapping rule defined for type: ${elementType}`
        });
      }
    }

    const result: MappingResult = {
      success: true,
      mapped,
      skipped,
      project_id: project.id
    };

    console.log(`Mapping completed: ${mapped.length} mapped, ${skipped.length} skipped`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in wf01-map function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      mapped: [],
      skipped: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// دوال مساعدة لاستخراج البيانات من المحتوى
function extractPriority(content: string): 'low' | 'medium' | 'high' | 'urgent' {
  const lowKeywords = ['منخفض', 'بسيط', 'عادي', 'low'];
  const highKeywords = ['مهم', 'عالي', 'أولوية', 'high', 'urgent'];
  const urgentKeywords = ['عاجل', 'فوري', 'طارئ', 'urgent'];
  
  const lowerContent = content.toLowerCase();
  
  if (urgentKeywords.some(keyword => lowerContent.includes(keyword))) return 'urgent';
  if (highKeywords.some(keyword => lowerContent.includes(keyword))) return 'high';
  if (lowKeywords.some(keyword => lowerContent.includes(keyword))) return 'low';
  
  return 'medium';
}

function extractStatus(content: string): 'todo' | 'in_progress' | 'review' | 'done' {
  const todoKeywords = ['جديد', 'للعمل', 'todo', 'new'];
  const progressKeywords = ['جاري', 'تحت العمل', 'progress', 'working'];
  const reviewKeywords = ['مراجعة', 'review', 'testing'];
  const doneKeywords = ['منجز', 'مكتمل', 'done', 'complete'];
  
  const lowerContent = content.toLowerCase();
  
  if (doneKeywords.some(keyword => lowerContent.includes(keyword))) return 'done';
  if (reviewKeywords.some(keyword => lowerContent.includes(keyword))) return 'review';
  if (progressKeywords.some(keyword => lowerContent.includes(keyword))) return 'in_progress';
  
  return 'todo';
}

function extractEstimatedHours(content: string): number | null {
  // البحث عن أنماط الساعات في النص
  const hourPatterns = [
    /(\d+)\s*ساعة/g,
    /(\d+)\s*س/g,
    /(\d+)\s*hour/g,
    /(\d+)h/g
  ];
  
  for (const pattern of hourPatterns) {
    const match = content.match(pattern);
    if (match) {
      const hours = parseInt(match[1]);
      if (!isNaN(hours) && hours > 0) {
        return hours;
      }
    }
  }
  
  return null;
}