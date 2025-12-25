import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ✅ 1. Optional JWT authentication (works without login)
    const authHeader = req.headers.get('Authorization');
    let userId = 'anonymous';
    
    if (authHeader && authHeader !== `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`) {
      // Try to get authenticated user if a real token is provided
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
      
      if (supabaseUrl && supabaseAnonKey) {
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: { Authorization: authHeader },
          },
        });

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        
        if (!authError && user) {
          userId = user.id;
          console.log(`[smart-elements-ai] Authenticated user: ${userId}`);
        } else {
          console.log('[smart-elements-ai] Using anonymous mode (no valid session)');
        }
      }
    } else {
      console.log('[smart-elements-ai] Using anonymous mode');
    }

    const { prompt, action, selectedElements, context } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
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

    console.log(`[smart-elements-ai] Action: ${action}, Tool: ${selectedTool}`);
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

    console.log(`[smart-elements-ai] Generated ${toolResult.elements?.length || 0} elements`);

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
      error: error instanceof Error ? error.message : 'خطأ غير متوقع',
      code: 'INTERNAL_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to calculate element positions based on layout
function calculatePosition(index: number, total: number, layout: string): { x: number; y: number } {
  const baseX = 100;
  const baseY = 100;
  const spacing = 300;

  switch (layout) {
    case 'horizontal':
      return { x: baseX + (index * spacing), y: baseY };
    case 'vertical':
      return { x: baseX, y: baseY + (index * spacing) };
    case 'grid': {
      const cols = Math.ceil(Math.sqrt(total));
      const row = Math.floor(index / cols);
      const col = index % cols;
      return { x: baseX + (col * spacing), y: baseY + (row * spacing) };
    }
    case 'radial': {
      const angle = (2 * Math.PI * index) / total;
      const radius = 250;
      return {
        x: baseX + 300 + Math.cos(angle) * radius,
        y: baseY + 300 + Math.sin(angle) * radius
      };
    }
    default:
      return { x: baseX + (index * 50), y: baseY + (index * 50) };
  }
}
