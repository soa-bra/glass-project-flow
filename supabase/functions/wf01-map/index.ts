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

    // التحقق من وجود OpenAI API Key للتحسينات الاختيارية
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const aiEnhancementsEnabled = !!openAIApiKey;

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

    // تحسين اسم ووصف المشروع بالذكاء الاصطناعي (اختياري)
    let projectName = `مشروع مُحوّل من ${snapshot.name}`;
    let projectDescription = `تم تحويله من snapshot: ${snapshot.id}`;

    if (aiEnhancementsEnabled) {
      try {
        const enhancement = await enhanceProjectNaming(openAIApiKey, snapshot);
        projectName = enhancement.name || projectName;
        projectDescription = enhancement.description || projectDescription;
        console.log('AI enhancement applied to project naming');
      } catch (aiError) {
        console.warn('AI enhancement failed, using default naming:', aiError.message);
      }
    }

    // إنشاء مشروع جديد
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: projectName,
        description: projectDescription,
        owner_id: user.id,
        status: 'planning',
        settings: {
          source_snapshot_id: snapshot.id,
          mapped_at: new Date().toISOString(),
          ai_enhanced: aiEnhancementsEnabled
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
            // تحسين عنوان ووصف المهمة بالذكاء الاصطناعي (اختياري)
            let taskTitle = element.content || `مهمة من ${elementType}`;
            let taskDescription = `تم تحويلها من عنصر ${elementType} في الـcanvas`;

            if (aiEnhancementsEnabled && element.content) {
              try {
                const enhancement = await enhanceTaskDetails(openAIApiKey, element.content, elementType);
                taskTitle = enhancement.title || taskTitle;
                taskDescription = enhancement.description || taskDescription;
              } catch (aiError) {
                console.warn(`AI task enhancement failed for ${element.id}:`, aiError.message);
              }
            }

            const { data: task, error: taskError } = await supabase
              .from('project_tasks')
              .insert({
                project_id: project.id,
                title: taskTitle,
                description: taskDescription,
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
            // تحسين اسم ووصف المرحلة بالذكاء الاصطناعي (اختياري)
            let phaseName = element.content || `مرحلة من ${elementType}`;
            let phaseDescription = `تم تحويلها من عنصر ${elementType} في الـcanvas`;

            if (aiEnhancementsEnabled && element.content) {
              try {
                const enhancement = await enhancePhaseDetails(openAIApiKey, element.content, elementType);
                phaseName = enhancement.name || phaseName;
                phaseDescription = enhancement.description || phaseDescription;
              } catch (aiError) {
                console.warn(`AI phase enhancement failed for ${element.id}:`, aiError.message);
              }
            }

            const { data: phase, error: phaseError } = await supabase
              .from('project_phases')
              .insert({
                project_id: project.id,
                name: phaseName,
                description: phaseDescription,
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

// دوال تحسين الذكاء الاصطناعي (اختيارية)
async function enhanceProjectNaming(apiKey: string, snapshot: any): Promise<{name?: string, description?: string}> {
  const prompt = `
  بناءً على محتويات snapshot التالي، اقترح اسماً ووصفاً أفضل للمشروع:
  
  اسم الـSnapshot: ${snapshot.name}
  عدد العناصر: ${snapshot.data.elements.length}
  عينة من المحتوى: ${snapshot.data.elements.slice(0, 3).map(e => e.content).join(', ')}
  
  أرجع JSON بهذا الشكل:
  {"name": "اسم المشروع المحسّن", "description": "وصف مفصل للمشروع"}
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: 'أنت مساعد متخصص في إدارة المشاريع. أرجع JSON صالح فقط.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.5,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function enhanceTaskDetails(apiKey: string, content: string, elementType: string): Promise<{title?: string, description?: string}> {
  const prompt = `
  حسّن عنوان ووصف هذه المهمة:
  
  المحتوى الأصلي: ${content}
  نوع العنصر: ${elementType}
  
  أرجع JSON: {"title": "العنوان المحسّن", "description": "الوصف المفصل"}
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: 'أنت مساعد متخصص في إدارة المهام. أرجع JSON صالح فقط.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.3,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function enhancePhaseDetails(apiKey: string, content: string, elementType: string): Promise<{name?: string, description?: string}> {
  const prompt = `
  حسّن اسم ووصف هذه المرحلة:
  
  المحتوى الأصلي: ${content}
  نوع العنصر: ${elementType}
  
  أرجع JSON: {"name": "الاسم المحسّن", "description": "الوصف المفصل"}
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: 'أنت مساعد متخصص في إدارة المشاريع. أرجع JSON صالح فقط.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.3,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}