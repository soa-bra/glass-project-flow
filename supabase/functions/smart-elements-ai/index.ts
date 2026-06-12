import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  sanitizeSelectedElementsForAI,
  type ServerAIContextRole,
  type ServerAIDataPermissions,
} from './sanitizer.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Smart Element Types supported
const SMART_ELEMENT_TYPES = [
  'thinking_board', 'kanban', 'voting', 'brainstorming',
  'timeline', 'decisions_matrix', 'gantt', 'interactive_sheet',
  'mind_map', 'project_card', 'task_card', 'finance_card', 'csr_card', 'crm_card', 'root_connector'
] as const;

const VALID_ACTIONS = ['generate', 'analyze', 'transform'] as const;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const AUTO_APPROVE_CONFIDENCE_THRESHOLD = 0.85;
const REVIEW_CONFIDENCE_THRESHOLD = 0.6;
const SENSITIVE_TRANSFORMATION_KEYWORDS = [
  'financial', 'finance', 'budget', 'invoice', 'payment', 'salary', 'payroll',
  'contract', 'legal', 'compliance', 'gdpr', 'pii', 'ssn',
  'medical', 'health', 'hr', 'employee', 'confidential', 'security'
];

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
- **task_card**: بطاقة مهمة
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
    // ✅ 1. MANDATORY JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized', code: 'UNAUTHORIZED' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized', code: 'UNAUTHORIZED' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.claims.sub;
    console.log(`[smart-elements-ai] Authenticated user: ${userId}`);

    // ✅ 2. Parse and validate input
    const body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return new Response(JSON.stringify({ error: 'Invalid request body', code: 'INVALID_INPUT' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { prompt, action, selectedElements } = body;
    const contextValidation = validateAiContext(body.context);
    if (!contextValidation.valid) {
      return new Response(JSON.stringify({ error: contextValidation.error, code: 'INVALID_INPUT' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const context = contextValidation.context;

    // Validate action
    if (action && !VALID_ACTIONS.includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid action', code: 'INVALID_INPUT' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate prompt length
    if (prompt && (typeof prompt !== 'string' || prompt.length > 5000)) {
      return new Response(JSON.stringify({ error: 'Prompt too long (max 5000 chars)', code: 'INVALID_INPUT' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate selectedElements size
    if (selectedElements && (!Array.isArray(selectedElements) || selectedElements.length > 50)) {
      return new Response(JSON.stringify({ error: 'Too many selected elements (max 50)', code: 'INVALID_INPUT' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let selectedTool = 'generate_smart_elements';
    if (action === 'analyze') {
      selectedTool = 'analyze_selection';
    }

    const userDataPermissions = await loadUserAIDataPermissions(supabaseClient, userId, context);
    const sanitizedSelection = sanitizeSelectedElementsForAI(userId, selectedElements, {
      permissions: userDataPermissions,
    });
    const sanitizedSelectedElements = sanitizedSelection.selectedElements;
    const sanitizedPrompt = typeof prompt === 'string' ? prompt : undefined;

    const permissionCheck = await checkAiPermission(supabaseClient, userId, context);
    if (!permissionCheck.allowed) {
      await storeExplainabilityTrace(supabaseClient, {
        userId,
        action: action || 'generate',
        selectedTool,
        model: 'google/gemini-2.5-flash',
        prompt: sanitizedPrompt,
        selectedElements: sanitizedSelectedElements,
        targetType: context?.targetType,
        confidenceSummary: null,
        escalation: 'permission_denied',
        sensitivity: { isSensitive: false, score: 0, reasons: [`Missing permission: ${permissionCheck.permissionCode}`] },
        approval: {
          required: false,
          provided: false,
          approverId: null,
          approvedAt: null
        },
        outputSummary: null,
        dataPermissions: userDataPermissions,
        redactionSummary: sanitizedSelection.redactionSummary,
        denial: {
          code: 'AI_PERMISSION_DENIED',
          requiredPermission: permissionCheck.permissionCode,
          boardId: context?.boardId ?? null,
          projectId: context?.projectId ?? null,
        }
      });

      return new Response(JSON.stringify({
        success: false,
        code: 'AI_PERMISSION_DENIED',
        error: 'ليست لديك صلاحية استخدام الذكاء الاصطناعي في هذا السياق',
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build the user message based on action type
    let userMessage = '';
    
    if (action === 'generate') {
      userMessage = `أنشئ عناصر ذكية بناءً على الوصف التالي:\n${sanitizedPrompt || ''}`;
      if (context?.preferredType) {
        userMessage += `\n\nنوع العنصر المفضل: ${context.preferredType}`;
      }
    } else if (action === 'analyze') {
      userMessage = `حلل العناصر المحددة التالية واقترح تحويلها إلى عناصر ذكية:\n${JSON.stringify(sanitizedSelectedElements, null, 2)}`;
      if (sanitizedPrompt) {
        userMessage += `\n\nتعليمات إضافية: ${sanitizedPrompt}`;
      }
    } else if (action === 'transform') {
      userMessage = `حوّل العناصر التالية إلى ${context?.targetType || 'عنصر ذكي مناسب'}:\n${JSON.stringify(sanitizedSelectedElements, null, 2)}`;
      if (sanitizedPrompt) {
        userMessage += `\n\nتفاصيل إضافية: ${sanitizedPrompt}`;
      }
    } else {
      userMessage = sanitizedPrompt || '';
    }

    console.log(`[smart-elements-ai] Action: ${action}, Tool: ${selectedTool}`);

    const sensitivityAssessment = assessTransformationSensitivity({
      action: action || 'generate',
      prompt: sanitizedPrompt,
      selectedElements: sanitizedSelectedElements,
      targetType: context?.targetType
    });
    const humanApprovalProvided = context?.humanApproval?.approved === true;
    const approvalReason = typeof context?.humanApproval?.approvalReason === 'string'
      ? context.humanApproval.approvalReason.slice(0, 500)
      : null;

    // Enforce human approval for sensitive transformations before model execution
    if (action === 'transform' && sensitivityAssessment.isSensitive && !humanApprovalProvided) {
      await storeExplainabilityTrace(supabaseClient, {
        userId,
        action: action || 'generate',
        selectedTool,
        model: 'google/gemini-2.5-flash',
        prompt: sanitizedPrompt,
        selectedElements: sanitizedSelectedElements,
        targetType: context?.targetType,
        confidenceSummary: null,
        escalation: 'blocked_pending_human_approval',
        sensitivity: sensitivityAssessment,
        approval: {
          required: true,
          provided: false,
          approverId: null,
          approvedAt: null,
          approvalReason: null
        },
        outputSummary: null,
        dataPermissions: userDataPermissions,
        redactionSummary: sanitizedSelection.redactionSummary
      });

      return new Response(JSON.stringify({
        success: false,
        code: 'HUMAN_APPROVAL_REQUIRED',
        error: 'التحويل حساس ويتطلب موافقة بشرية صريحة قبل التنفيذ',
        approvalRequired: true,
        sensitivity: sensitivityAssessment,
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
      console.error(`[smart-elements-ai] AI Gateway error: ${status}`);
      
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

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
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
    const confidenceSummary = getConfidenceSummary(toolResult);
    const escalation = determineEscalationGate(confidenceSummary);
    
    // Generate unique IDs for elements if not provided
    if (toolResult.elements) {
      toolResult.elements = toolResult.elements.map((el: any, index: number) => ({
        ...el,
        id: el.id || `smart-${Date.now()}-${index}`,
        position: el.position || calculatePosition(index, toolResult.elements.length, toolResult.layout)
      }));
    }

    console.log(`[smart-elements-ai] Generated ${toolResult.elements?.length || 0} elements`);

    await storeExplainabilityTrace(supabaseClient, {
      userId,
      action: action || 'generate',
      selectedTool,
      model: 'google/gemini-2.5-flash',
      prompt: sanitizedPrompt,
      selectedElements: sanitizedSelectedElements,
      targetType: context?.targetType,
      confidenceSummary,
      escalation,
      sensitivity: sensitivityAssessment,
      approval: {
        required: action === 'transform' ? sensitivityAssessment.isSensitive : false,
        provided: humanApprovalProvided,
        approverId: context?.humanApproval?.approverId ?? null,
        approvedAt: context?.humanApproval?.approvedAt ?? null,
        approvalReason
      },
      outputSummary: summarizeOutput(toolResult),
      dataPermissions: userDataPermissions,
      redactionSummary: sanitizedSelection.redactionSummary
    });

    if (action === 'transform' && humanApprovalProvided) {
      await storeHumanApprovalAuditEvent(supabaseClient, {
        userId,
        selectedTool,
        targetType: context?.targetType,
        selectedElements: sanitizedSelectedElements,
        sensitivity: sensitivityAssessment,
        approvedAt: context?.humanApproval?.approvedAt ?? null,
        approverId: context?.humanApproval?.approverId ?? null,
        approvalReason,
        dataPermissions: userDataPermissions,
        redactionSummary: sanitizedSelection.redactionSummary
      });
    }

    return new Response(JSON.stringify({
      success: true,
      result: toolResult,
      action: action || 'generate',
      safety: {
        confidenceThresholds: {
          autoApprove: AUTO_APPROVE_CONFIDENCE_THRESHOLD,
          review: REVIEW_CONFIDENCE_THRESHOLD
        },
        escalation,
        sensitivity: sensitivityAssessment
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[smart-elements-ai] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'حدث خطأ أثناء المعالجة',
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


type ValidatedAiContext = {
  boardId?: string;
  projectId?: string;
  preferredType?: typeof SMART_ELEMENT_TYPES[number];
  targetType?: typeof SMART_ELEMENT_TYPES[number];
  humanApproval?: {
    approved: boolean;
    approverId?: string;
    approvedAt?: string;
    approvalReason?: string;
  };
};

function validateAiContext(context: unknown): { valid: true; context?: ValidatedAiContext } | { valid: false; error: string } {
  if (context === undefined || context === null) {
    return { valid: true, context: undefined };
  }

  if (typeof context !== 'object' || Array.isArray(context)) {
    return { valid: false, error: 'Invalid context' };
  }

  const rawContext = context as Record<string, unknown>;
  const allowedKeys = new Set(['boardId', 'projectId', 'preferredType', 'targetType', 'humanApproval']);
  for (const key of Object.keys(rawContext)) {
    if (key.toLowerCase().includes('role')) {
      return { valid: false, error: 'Client-supplied roles are not accepted' };
    }
    if (!allowedKeys.has(key)) {
      return { valid: false, error: `Unsupported context field: ${key}` };
    }
  }

  const boardId = validateOptionalUuid(rawContext.boardId, 'boardId');
  if (!boardId.valid) return boardId;

  const projectId = validateOptionalUuid(rawContext.projectId, 'projectId');
  if (!projectId.valid) return projectId;

  if (boardId.value && projectId.value) {
    return { valid: false, error: 'Provide either boardId or projectId, not both' };
  }

  const preferredType = validateOptionalSmartElementType(rawContext.preferredType, 'preferredType');
  if (!preferredType.valid) return preferredType;

  const targetType = validateOptionalSmartElementType(rawContext.targetType, 'targetType');
  if (!targetType.valid) return targetType;

  const humanApproval = validateOptionalHumanApproval(rawContext.humanApproval);
  if (!humanApproval.valid) return humanApproval;

  return {
    valid: true,
    context: {
      ...(boardId.value ? { boardId: boardId.value } : {}),
      ...(projectId.value ? { projectId: projectId.value } : {}),
      ...(preferredType.value ? { preferredType: preferredType.value } : {}),
      ...(targetType.value ? { targetType: targetType.value } : {}),
      ...(humanApproval.value ? { humanApproval: humanApproval.value } : {}),
    }
  };
}

function validateOptionalUuid(value: unknown, fieldName: string): { valid: true; value?: string } | { valid: false; error: string } {
  if (value === undefined || value === null) return { valid: true };
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
    return { valid: false, error: `Invalid ${fieldName}` };
  }
  return { valid: true, value };
}

function validateOptionalSmartElementType(
  value: unknown,
  fieldName: string
): { valid: true; value?: typeof SMART_ELEMENT_TYPES[number] } | { valid: false; error: string } {
  if (value === undefined || value === null) return { valid: true };
  if (typeof value !== 'string' || !SMART_ELEMENT_TYPES.includes(value as typeof SMART_ELEMENT_TYPES[number])) {
    return { valid: false, error: `Invalid ${fieldName}` };
  }
  return { valid: true, value: value as typeof SMART_ELEMENT_TYPES[number] };
}

function validateOptionalHumanApproval(
  value: unknown
): { valid: true; value?: ValidatedAiContext['humanApproval'] } | { valid: false; error: string } {
  if (value === undefined || value === null) return { valid: true };
  if (typeof value !== 'object' || Array.isArray(value)) {
    return { valid: false, error: 'Invalid humanApproval' };
  }

  const rawApproval = value as Record<string, unknown>;
  const allowedKeys = new Set(['approved', 'approverId', 'approvedAt', 'approvalReason']);
  for (const key of Object.keys(rawApproval)) {
    if (key.toLowerCase().includes('role')) {
      return { valid: false, error: 'Client-supplied roles are not accepted' };
    }
    if (!allowedKeys.has(key)) {
      return { valid: false, error: `Unsupported humanApproval field: ${key}` };
    }
  }

  if (typeof rawApproval.approved !== 'boolean') {
    return { valid: false, error: 'Invalid humanApproval.approved' };
  }

  if (rawApproval.approverId !== undefined && rawApproval.approverId !== null) {
    if (typeof rawApproval.approverId !== 'string' || rawApproval.approverId.length > 128) {
      return { valid: false, error: 'Invalid humanApproval.approverId' };
    }
  }

  if (rawApproval.approvedAt !== undefined && rawApproval.approvedAt !== null) {
    if (typeof rawApproval.approvedAt !== 'string' || Number.isNaN(Date.parse(rawApproval.approvedAt))) {
      return { valid: false, error: 'Invalid humanApproval.approvedAt' };
    }
  }

  if (rawApproval.approvalReason !== undefined && rawApproval.approvalReason !== null) {
    if (typeof rawApproval.approvalReason !== 'string' || rawApproval.approvalReason.length > 500) {
      return { valid: false, error: 'Invalid humanApproval.approvalReason' };
    }
  }

  return {
    valid: true,
    value: {
      approved: rawApproval.approved,
      ...(typeof rawApproval.approverId === 'string' ? { approverId: rawApproval.approverId } : {}),
      ...(typeof rawApproval.approvedAt === 'string' ? { approvedAt: rawApproval.approvedAt } : {}),
      ...(typeof rawApproval.approvalReason === 'string' ? { approvalReason: rawApproval.approvalReason } : {}),
    }
  };
}

async function checkAiPermission(
  supabaseClient: ReturnType<typeof createClient>,
  userId: string,
  context?: ValidatedAiContext
): Promise<{ allowed: boolean; permissionCode: 'canvas.ai.use' | 'project.ai.use' }> {
  const permissionCode = context?.projectId ? 'project.ai.use' : 'canvas.ai.use';
  const { data, error } = await supabaseClient.rpc('has_permission', {
    _user_id: userId,
    _permission_code: permissionCode,
  });

  if (error) {
    console.error(`[smart-elements-ai] Failed to check permission ${permissionCode}:`, error);
    return { allowed: false, permissionCode };
  }

  return { allowed: data === true, permissionCode };
}

async function loadUserAIDataPermissions(
  supabaseClient: ReturnType<typeof createClient>,
  userId: string,
  context?: ValidatedAiContext
): Promise<ServerAIDataPermissions> {
  const role = await loadUserAIContextRole(supabaseClient, userId, context);
  const [canViewFinancialByPermission, canViewLegalByPermission, canViewSensitive] = await Promise.all([
    hasAnyPermission(supabaseClient, userId, ['financial.read', 'finance.read', 'finance.view']),
    hasAnyPermission(supabaseClient, userId, ['legal.read', 'legal.view']),
    hasAnyPermission(supabaseClient, userId, ['ai.sensitive.read', 'sensitive.read', 'sensitive.view']),
  ]);

  return {
    role,
    canViewFinancial: role === 'host' || canViewFinancialByPermission,
    canViewLegal: role === 'host' || canViewLegalByPermission,
    canViewSensitive,
  };
}

async function loadUserAIContextRole(
  supabaseClient: ReturnType<typeof createClient>,
  userId: string,
  context?: ValidatedAiContext
): Promise<ServerAIContextRole> {
  if (context?.boardId) {
    const { data, error } = await supabaseClient.rpc('get_user_board_role', {
      board_id: context.boardId,
      user_id: userId,
    });

    if (!error && (data === 'host' || data === 'editor' || data === 'viewer')) {
      return data;
    }

    if (error) {
      console.error('[smart-elements-ai] Failed to load board role from database:', error);
    }

    return 'guest';
  }

  const isOwner = await hasAnyPermission(supabaseClient, userId, ['rbac.manage']);
  if (isOwner) return 'host';

  const canUseProjectAI = context?.projectId
    ? await hasAnyPermission(supabaseClient, userId, ['project.ai.use'])
    : false;
  const canUseCanvasAI = await hasAnyPermission(supabaseClient, userId, ['canvas.ai.use']);

  return canUseProjectAI || canUseCanvasAI ? 'editor' : 'guest';
}

async function hasAnyPermission(
  supabaseClient: ReturnType<typeof createClient>,
  userId: string,
  permissionCodes: string[],
): Promise<boolean> {
  for (const permissionCode of permissionCodes) {
    const { data, error } = await supabaseClient.rpc('has_permission', {
      _user_id: userId,
      _permission_code: permissionCode,
    });

    if (error) {
      console.error(`[smart-elements-ai] Failed to check permission ${permissionCode}:`, error);
      continue;
    }

    if (data === true) return true;
  }

  return false;
}

type ExplainabilityTraceInput = {
  userId: string;
  action: string;
  selectedTool: string;
  model: string;
  prompt?: string;
  selectedElements?: unknown[];
  targetType?: string;
  confidenceSummary: {
    min: number;
    max: number;
    average: number;
    count: number;
  } | null;
  escalation: 'auto_apply' | 'review_recommended' | 'human_escalation_required' | 'blocked_pending_human_approval' | 'permission_denied';
  sensitivity: {
    isSensitive: boolean;
    score: number;
    reasons: string[];
  };
  approval: {
    required: boolean;
    provided: boolean;
    approverId: string | null;
    approvedAt: string | null;
    approvalReason: string | null;
  };
  outputSummary: {
    elementsCount: number;
    suggestionsCount: number;
    entityCount: number;
    relationshipCount: number;
  } | null;
  dataPermissions?: ServerAIDataPermissions;
  redactionSummary?: {
    financial: number;
    legal: number;
    sensitive: number;
  };
  denial?: {
    code: string;
    requiredPermission: string;
    boardId: string | null;
    projectId: string | null;
  };
};

function assessTransformationSensitivity(input: {
  action: string;
  prompt?: string;
  selectedElements?: unknown[];
  targetType?: string;
}): { isSensitive: boolean; score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  if (input.action !== 'transform') {
    return { isSensitive: false, score: 0, reasons: [] };
  }

  const blob = JSON.stringify({
    prompt: input.prompt || '',
    selectedElements: input.selectedElements || [],
    targetType: input.targetType || '',
  }).toLowerCase();

  const keywordHits = SENSITIVE_TRANSFORMATION_KEYWORDS.filter((keyword) => blob.includes(keyword));
  if (keywordHits.length > 0) {
    score += Math.min(0.7, keywordHits.length * 0.15);
    reasons.push(`Sensitive keywords detected: ${keywordHits.join(', ')}`);
  }

  const elementCount = Array.isArray(input.selectedElements) ? input.selectedElements.length : 0;
  if (elementCount >= 10) {
    score += 0.2;
    reasons.push('Large-scale transformation (10+ elements)');
  }

  if (input.targetType === 'finance_card' || input.targetType === 'crm_card' || input.targetType === 'task_card') {
    score += 0.2;
    reasons.push(`Sensitive target type: ${input.targetType}`);
  }

  const boundedScore = Math.min(1, Number(score.toFixed(2)));
  return { isSensitive: boundedScore >= 0.5, score: boundedScore, reasons };
}

function getConfidenceSummary(toolResult: any): ExplainabilityTraceInput['confidenceSummary'] {
  const scores = (toolResult?.suggestions || [])
    .map((s: any) => typeof s?.confidence === 'number' ? s.confidence : null)
    .filter((v: number | null): v is number => v !== null)
    .map((score: number) => Math.max(0, Math.min(1, score)));

  if (scores.length === 0) return null;

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const average = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
  return {
    min: Number(min.toFixed(3)),
    max: Number(max.toFixed(3)),
    average: Number(average.toFixed(3)),
    count: scores.length
  };
}

function determineEscalationGate(
  confidenceSummary: ExplainabilityTraceInput['confidenceSummary']
): ExplainabilityTraceInput['escalation'] {
  if (!confidenceSummary) return 'review_recommended';
  if (confidenceSummary.min >= AUTO_APPROVE_CONFIDENCE_THRESHOLD) return 'auto_apply';
  if (confidenceSummary.average >= REVIEW_CONFIDENCE_THRESHOLD) return 'review_recommended';
  return 'human_escalation_required';
}

async function storeHumanApprovalAuditEvent(
  supabaseClient: ReturnType<typeof createClient>,
  input: {
    userId: string;
    selectedTool: string;
    targetType?: string;
    selectedElements?: unknown[];
    sensitivity: ExplainabilityTraceInput['sensitivity'];
    approvedAt: string | null;
    approverId: string | null;
    approvalReason: string | null;
    dataPermissions?: ServerAIDataPermissions;
    redactionSummary?: {
      financial: number;
      legal: number;
      sensitive: number;
    };
  }
) {
  const { error } = await supabaseClient.from('audit_events').insert({
    actor_id: input.userId,
    action: 'smart_elements.transform.approved',
    resource_type: 'smart_elements_transform',
    decision: 'allowed',
    reason: input.approvalReason || 'Human approval confirmed for sensitive smart element transformation',
    metadata: {
      selectedTool: input.selectedTool,
      targetType: input.targetType || null,
      selectedElementsCount: Array.isArray(input.selectedElements) ? input.selectedElements.length : 0,
      sensitivity: input.sensitivity,
      dataPermissions: input.dataPermissions,
      redactionSummary: input.redactionSummary,
      humanApproval: {
        approvedAt: input.approvedAt,
        approverId: input.approverId,
        approvalReason: input.approvalReason,
      }
    }
  });

  if (error) {
    console.error('[smart-elements-ai] Failed to store human approval audit event:', error);
  }
}

function summarizeOutput(toolResult: any): ExplainabilityTraceInput['outputSummary'] {
  return {
    elementsCount: Array.isArray(toolResult?.elements) ? toolResult.elements.length : 0,
    suggestionsCount: Array.isArray(toolResult?.suggestions) ? toolResult.suggestions.length : 0,
    entityCount: Array.isArray(toolResult?.entities) ? toolResult.entities.length : 0,
    relationshipCount: Array.isArray(toolResult?.relationships) ? toolResult.relationships.length : 0,
  };
}

async function storeExplainabilityTrace(supabaseClient: ReturnType<typeof createClient>, input: ExplainabilityTraceInput) {
  const tracePayload = {
    user_id: input.userId,
    action: input.action,
    selected_tool: input.selectedTool,
    model: input.model,
    prompt_excerpt: (input.prompt || '').slice(0, 500),
    selected_elements_count: Array.isArray(input.selectedElements) ? input.selectedElements.length : 0,
    target_type: input.targetType || null,
    confidence_min: input.confidenceSummary?.min ?? null,
    confidence_max: input.confidenceSummary?.max ?? null,
    confidence_avg: input.confidenceSummary?.average ?? null,
    confidence_count: input.confidenceSummary?.count ?? 0,
    escalation_gate: input.escalation,
    sensitivity_score: input.sensitivity.score,
    sensitivity_reasons: input.sensitivity.reasons,
    approval_required: input.approval.required,
    approval_provided: input.approval.provided,
    approver_id: input.approval.approverId,
    approved_at: input.approval.approvedAt,
    output_summary: input.outputSummary || {},
    explainability_payload: {
      action: input.action,
      selectedTool: input.selectedTool,
      thresholds: {
        autoApprove: AUTO_APPROVE_CONFIDENCE_THRESHOLD,
        review: REVIEW_CONFIDENCE_THRESHOLD,
      },
      confidenceSummary: input.confidenceSummary,
      sensitivity: input.sensitivity,
      approval: input.approval,
      approvalReason: input.approval.approvalReason,
      outputSummary: input.outputSummary,
      dataPermissions: input.dataPermissions,
      redactionSummary: input.redactionSummary,
      denial: input.denial,
    }
  };

  const { error } = await supabaseClient.from('ai_command_traces').insert(tracePayload);
  if (error) {
    console.error('[smart-elements-ai] Failed to store explainability trace:', error);
  }
}
