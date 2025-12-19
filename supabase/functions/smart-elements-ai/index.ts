import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.1";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

// SECURITY: Allowed origins for CORS (Defense in Depth)
const ALLOWED_ORIGINS = [
  'https://zdqkrrehlivayconjcgm.supabase.co',
  'https://lovable.dev',
  'https://www.lovable.dev',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:3000',
];

// Dynamic CORS headers based on origin
function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || origin.endsWith('.lovable.app') || origin.endsWith('.lovable.dev')
  );
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin! : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
}

// Input validation schemas
const RequestSchema = z.object({
  prompt: z.string().min(1, 'الأمر مطلوب').max(4000, 'الأمر طويل جداً (الحد الأقصى 4000 حرف)').optional(),
  action: z.enum(['generate', 'analyze', 'transform']).optional(),
  selectedElements: z.array(z.any()).max(100, 'الحد الأقصى 100 عنصر').optional(),
  context: z.object({
    preferredType: z.string().optional(),
    targetType: z.string().optional(),
  }).optional(),
});

// Rate limiting: Simple in-memory tracking (for edge function)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_REQUESTS = 20; // requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || userLimit.resetAt < now) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (userLimit.count >= RATE_LIMIT_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: userLimit.resetAt - now };
  }
  
  userLimit.count++;
  return { allowed: true, remaining: RATE_LIMIT_REQUESTS - userLimit.count, resetIn: userLimit.resetAt - now };
}

// Sanitize input to remove control characters
function sanitizeInput(input: string): string {
  return input.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
}

// Smart Element Types supported
const SMART_ELEMENT_TYPES = [
  'thinking_board', 'kanban', 'voting', 'brainstorming',
  'timeline', 'decisions_matrix', 'gantt', 'interactive_sheet',
  'mind_map', 'project_card', 'finance_card', 'csr_card', 'crm_card', 'root_connector'
] as const;

// Tool definitions for structured output extraction
const tools = [
  {
    type: "function",
    function: {
      name: "generate_smart_elements",
      description: "Generate smart elements structure from natural language description. Analyzes the input to identify entities, relationships, and appropriate element types.",
      parameters: {
        type: "object",
        properties: {
          elements: {
            type: "array",
            description: "Array of smart elements to create",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: SMART_ELEMENT_TYPES,
                  description: "The type of smart element to create"
                },
                title: {
                  type: "string",
                  description: "Title of the element in Arabic or as specified"
                },
                description: {
                  type: "string",
                  description: "Description of the element purpose"
                },
                data: {
                  type: "object",
                  description: "Element-specific data structure",
                  properties: {
                    // Kanban specific
                    columns: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          title: { type: "string" },
                          color: { type: "string" },
                          cards: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                title: { type: "string" },
                                description: { type: "string" },
                                priority: { type: "string", enum: ["low", "medium", "high", "urgent"] }
                              },
                              required: ["id", "title"]
                            }
                          }
                        },
                        required: ["id", "title"]
                      }
                    },
                    // Timeline specific
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          title: { type: "string" },
                          startDate: { type: "string" },
                          endDate: { type: "string" },
                          color: { type: "string" }
                        },
                        required: ["id", "title"]
                      }
                    },
                    // Mind Map specific
                    nodes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          label: { type: "string" },
                          parentId: { type: "string" },
                          color: { type: "string" }
                        },
                        required: ["id", "label"]
                      }
                    },
                    // Voting specific
                    options: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          label: { type: "string" },
                          votes: { type: "number" }
                        },
                        required: ["id", "label"]
                      }
                    },
                    // Brainstorming specific
                    ideas: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          content: { type: "string" },
                          author: { type: "string" },
                          groupId: { type: "string" }
                        },
                        required: ["id", "content"]
                      }
                    },
                    // Gantt specific
                    tasks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          startDate: { type: "string" },
                          endDate: { type: "string" },
                          progress: { type: "number" },
                          dependencies: { type: "array", items: { type: "string" } }
                        },
                        required: ["id", "name"]
                      }
                    },
                    // Decisions Matrix specific
                    rows: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          label: { type: "string" }
                        },
                        required: ["id", "label"]
                      }
                    },
                    matrixColumns: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          label: { type: "string" },
                          weight: { type: "number" }
                        },
                        required: ["id", "label"]
                      }
                    },
                    cells: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          rowId: { type: "string" },
                          columnId: { type: "string" },
                          value: { type: "number" }
                        },
                        required: ["rowId", "columnId", "value"]
                      }
                    }
                  }
                },
                position: {
                  type: "object",
                  properties: {
                    x: { type: "number" },
                    y: { type: "number" }
                  },
                  description: "Suggested position on canvas"
                },
                connections: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      targetIndex: { type: "number", description: "Index of target element in the elements array" },
                      label: { type: "string" },
                      type: { type: "string", enum: ["leads_to", "depends_on", "related_to", "contains"] }
                    }
                  },
                  description: "Connections to other elements"
                }
              },
              required: ["type", "title", "data"]
            }
          },
          layout: {
            type: "string",
            enum: ["horizontal", "vertical", "radial", "grid", "freeform"],
            description: "Suggested layout for positioning elements"
          },
          summary: {
            type: "string",
            description: "Brief Arabic summary of what was generated"
          }
        },
        required: ["elements", "layout", "summary"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "analyze_selection",
      description: "Analyze selected canvas elements and suggest smart element transformations",
      parameters: {
        type: "object",
        properties: {
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                targetType: {
                  type: "string",
                  enum: SMART_ELEMENT_TYPES,
                  description: "Suggested smart element type"
                },
                confidence: {
                  type: "number",
                  description: "Confidence score 0-1"
                },
                reasoning: {
                  type: "string",
                  description: "Why this transformation is suggested (in Arabic)"
                },
                preview: {
                  type: "object",
                  description: "Preview of the transformed element structure"
                }
              },
              required: ["targetType", "confidence", "reasoning"]
            }
          },
          entities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                type: { type: "string", enum: ["person", "process", "system", "concept", "value", "goal", "task", "milestone"] },
                importance: { type: "string", enum: ["primary", "secondary", "tertiary"] }
              }
            },
            description: "Extracted entities from the selection"
          },
          relationships: {
            type: "array",
            items: {
              type: "object",
              properties: {
                from: { type: "string" },
                to: { type: "string" },
                type: { type: "string" }
              }
            },
            description: "Relationships between entities"
          }
        },
        required: ["suggestions", "entities"]
      }
    }
  }
];

// System prompt for SoaBra context
const systemPrompt = `أنت مساعد ذكي متخصص في نظام سوبرا (SoaBra) لإنشاء العناصر الذكية على لوحة الكانفاس التفاعلية.

## دورك:
- تحليل الأوامر النصية باللغة العربية أو الإنجليزية
- استخراج الكيانات والعلاقات من النصوص
- اقتراح أنسب أنواع العناصر الذكية
- توليد هياكل بيانات جاهزة للإدراج في الكانفاس

## أنواع العناصر الذكية المتاحة:

### عناصر التعاون:
- **thinking_board**: لوحة لتجميع الأفكار والمكونات
- **kanban**: لوحة كانبان لتنظيم المهام بأعمدة
- **voting**: نظام تصويت تفاعلي
- **brainstorming**: محرك العصف الذهني

### عناصر التخطيط:
- **timeline**: خط زمني لتنظيم الأحداث
- **decisions_matrix**: مصفوفة لتقييم القرارات

### عناصر التحليل:
- **gantt**: مخطط جانت للمشاريع
- **interactive_sheet**: جدول بيانات تفاعلي
- **mind_map**: خريطة ذهنية

### البطاقات الذكية:
- **project_card**: بطاقة مشروع
- **finance_card**: بطاقة مالية
- **csr_card**: بطاقة المسؤولية الاجتماعية
- **crm_card**: بطاقة علاقات العملاء

### عناصر الربط:
- **root_connector**: رابط ذكي بين المكونات

## قواعد التوليد:
1. دائماً استخدم اللغة العربية في العناوين والوصف إلا إذا طُلب غير ذلك
2. أنشئ معرفات فريدة (IDs) لكل عنصر
3. رتب العناصر بشكل منطقي على الكانفاس
4. حدد العلاقات بين العناصر عند وجودها
5. استخدم ألوان متناسقة من نظام التصميم

## أمثلة الأوامر:
- "أنشئ لوحة كانبان لإدارة مشروع التسويق"
- "حوّل هذه الأفكار إلى خريطة ذهنية"
- "أنشئ مخطط جانت لخطة الإطلاق"
- "صمم خط زمني لمراحل المشروع"

استخدم الأدوات المتاحة لتوليد هياكل البيانات المطلوبة.`;

// Helper function to authenticate user
async function authenticateUser(req: Request): Promise<{ user: any; error: string | null }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { user: null, error: 'Missing authorization header' };
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[smart-elements-ai] Missing Supabase configuration');
    return { user: null, error: 'Server configuration error' };
  }

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  
  if (authError || !user) {
    console.error('[smart-elements-ai] Authentication failed:', authError?.message);
    return { user: null, error: 'Unauthorized' };
  }

  return { user, error: null };
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const { user, error: authError } = await authenticateUser(req);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: authError || 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[smart-elements-ai] Authenticated user: ${user.id}`);

    // SECURITY: Check rate limit
    const rateLimit = checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      console.warn(`[smart-elements-ai] Rate limit exceeded for user: ${user.id}`);
      return new Response(
        JSON.stringify({ 
          error: 'تجاوزت الحد المسموح. حاول مرة أخرى بعد دقيقة.',
          code: 'RATE_LIMIT',
          retryAfter: Math.ceil(rateLimit.resetIn / 1000)
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
            'X-RateLimit-Limit': String(RATE_LIMIT_REQUESTS),
            'X-RateLimit-Remaining': '0'
          } 
        }
      );
    }

    // SECURITY: Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'بيانات JSON غير صالحة', code: 'INVALID_JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SECURITY: Validate input with Zod schema
    const validationResult = RequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.warn(`[smart-elements-ai] Validation failed for user: ${user.id}`, validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'بيانات غير صالحة: ' + validationResult.error.errors.map(e => e.message).join(', '),
          code: 'VALIDATION_ERROR'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt: rawPrompt, action, selectedElements, context } = validationResult.data;
    
    // SECURITY: Sanitize prompt input
    const prompt = rawPrompt ? sanitizeInput(rawPrompt) : undefined;
    
    // Log token estimation for monitoring
    const estimatedTokens = prompt ? Math.round(prompt.length * 0.75) : 0;
    if (estimatedTokens > 2000) {
      console.warn(`[smart-elements-ai] High token request: ${estimatedTokens} tokens, user: ${user.id}`);
    }
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('[smart-elements-ai] LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'خطأ في إعداد الخدمة. يرجى التواصل مع الدعم.', code: 'CONFIG_ERROR' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the user message based on action type
    let userMessage = '';
    let selectedTool = 'generate_smart_elements';
    
    if (action === 'generate') {
      userMessage = `أنشئ عناصر ذكية بناءً على الوصف التالي:\n${prompt}`;
      if (context?.preferredType) {
        userMessage += `\n\nنوع العنصر المفضل: ${context.preferredType}`;
      }
    } else if (action === 'analyze') {
      selectedTool = 'analyze_selection';
      userMessage = `حلل العناصر المحددة التالية واقترح تحويلها إلى عناصر ذكية:\n${JSON.stringify(selectedElements, null, 2)}`;
      if (prompt) {
        userMessage += `\n\nتعليمات إضافية: ${prompt}`;
      }
    } else if (action === 'transform') {
      userMessage = `حوّل العناصر التالية إلى ${context?.targetType || 'عنصر ذكي مناسب'}:\n${JSON.stringify(selectedElements, null, 2)}`;
      if (prompt) {
        userMessage += `\n\nتفاصيل إضافية: ${prompt}`;
      }
    } else {
      // Default: treat as generation prompt
      userMessage = prompt;
    }

    console.log(`[smart-elements-ai] User: ${user.id}, Action: ${action}, Tool: ${selectedTool}`);
    console.log(`[smart-elements-ai] User message: ${userMessage.substring(0, 200)}...`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        tools: tools,
        tool_choice: { type: 'function', function: { name: selectedTool } }
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const errorText = await response.text();
      console.error(`[smart-elements-ai] AI Gateway error: ${status}`, errorText);
      
      if (status === 429) {
        return new Response(JSON.stringify({ 
          error: 'تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً',
          code: 'RATE_LIMIT_EXCEEDED'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (status === 402) {
        return new Response(JSON.stringify({ 
          error: 'يرجى إضافة رصيد للمحفظة لاستخدام الذكاء الاصطناعي',
          code: 'PAYMENT_REQUIRED'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${status}`);
    }

    const data = await response.json();
    console.log('[smart-elements-ai] Response received');

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      // Fallback to message content if no tool call
      return new Response(JSON.stringify({
        success: true,
        result: {
          elements: [],
          layout: 'freeform',
          summary: data.choices?.[0]?.message?.content || 'لم يتم توليد عناصر'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const toolResult = JSON.parse(toolCall.function.arguments);
    
    // Generate unique IDs for elements if not provided
    if (toolResult.elements) {
      toolResult.elements = toolResult.elements.map((el: any, index: number) => ({
        ...el,
        id: el.id || `smart-${Date.now()}-${index}`,
        position: el.position || calculatePosition(index, toolResult.elements.length, toolResult.layout)
      }));
    }

    console.log(`[smart-elements-ai] User: ${user.id}, Generated ${toolResult.elements?.length || 0} elements`);

    return new Response(JSON.stringify({
      success: true,
      result: toolResult,
      action: action || 'generate'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[smart-elements-ai] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
      code: 'INTERNAL_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Calculate position for elements based on layout
function calculatePosition(index: number, total: number, layout: string): { x: number; y: number } {
  const baseX = 100;
  const baseY = 100;
  const spacing = 350;
  
  switch (layout) {
    case 'horizontal':
      return { x: baseX + (index * spacing), y: baseY };
    case 'vertical':
      return { x: baseX, y: baseY + (index * spacing) };
    case 'grid': {
      const cols = Math.ceil(Math.sqrt(total));
      return {
        x: baseX + (index % cols) * spacing,
        y: baseY + Math.floor(index / cols) * spacing
      };
    }
    case 'radial': {
      const angle = (2 * Math.PI * index) / total;
      const radius = 300;
      return {
        x: baseX + 400 + Math.cos(angle) * radius,
        y: baseY + 300 + Math.sin(angle) * radius
      };
    }
    default:
      return { x: baseX + (index * 50), y: baseY + (index * 50) };
  }
}
