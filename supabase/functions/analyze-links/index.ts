import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeLinksRequest {
  elements: Array<{
    id: string;
    type: string;
    content?: string;
    position: { x: number; y: number };
    metadata?: Record<string, any>;
  }>;
  links: Array<{
    id: string;
    from_object_id: string;
    to_object_id: string;
    style?: Record<string, any>;
  }>;
}

interface SmartSuggestion {
  elementType: string;
  payload: Record<string, any>;
  score: number;
  rationale: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { elements, links }: AnalyzeLinksRequest = await req.json();

    if (!elements || !Array.isArray(elements)) {
      throw new Error('Missing or invalid elements array');
    }

    // محاولة استخدام AI أولاً، مع fallback إذا فشل
    let suggestions: SmartSuggestion[] = [];

    if (!openAIApiKey) {
      console.warn('OPENAI_API_KEY not found, using fallback suggestions');
      suggestions = generateFallbackSuggestions(elements, links);
    } else {
      try {
        suggestions = await generateAISuggestions(openAIApiKey, elements, links);
      } catch (aiError) {
        console.error('AI generation failed, using fallback:', aiError);
        suggestions = generateFallbackSuggestions(elements, links);
      }
    }

    console.log(`Generated ${suggestions.length} suggestions`);

    return new Response(JSON.stringify({
      success: true,
      suggestions: suggestions,
      analysis_metadata: {
        elements_analyzed: elements.length,
        links_analyzed: links?.length || 0,
        suggestions_generated: suggestions.length,
        ai_used: !!openAIApiKey,
        model_used: openAIApiKey ? 'gpt-4.1-2025-04-14' : 'fallback'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-links function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      suggestions: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// دالة إنشاء اقتراحات AI
async function generateAISuggestions(
  apiKey: string, 
  elements: any[], 
  links: any[]
): Promise<SmartSuggestion[]> {
  const analysisPrompt = `
  تحليل العناصر والروابط وإعطاء اقتراحات ذكية لعناصر جديدة:
  
  العناصر: ${JSON.stringify(elements, null, 2)}
  الروابط: ${JSON.stringify(links, null, 2)}
  
  اقترح عناصر ذكية جديدة من الأنواع التالية:
  - ThinkingBoard: لوحة تفكير تفاعلية
  - KanbanBoard: لوحة كانبان لإدارة المهام
  - MindMap: خريطة ذهنية
  - Timeline: جدول زمني
  - FlowChart: مخطط انسيابي
  
  لكل اقتراح، أرجع:
  {
    "elementType": "نوع العنصر",
    "payload": {"title": "العنوان", "description": "الوصف", "config": {}},
    "score": 0.8,
    "rationale": "السبب وراء هذا الاقتراح"
  }
  
  أرجع JSON array فقط، بدون أي نص إضافي.
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
        {
          role: 'system',
          content: 'أنت مساعد ذكي متخصص في تحليل البيانات المرئية. أرجع JSON صالح فقط.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  try {
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
    
    return suggestions.filter((s: any) => 
      s.elementType && s.payload && typeof s.score === 'number' && s.rationale
    );
  } catch (parseError) {
    throw new Error('Failed to parse AI response');
  }
}

// دالة إنشاء اقتراحات افتراضية
function generateFallbackSuggestions(elements: any[], links: any[]): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];

  // تحليل بسيط بناءً على عدد العناصر
  if (elements.length > 5) {
    suggestions.push({
      elementType: "KanbanBoard",
      payload: {
        title: "لوحة كانبان لإدارة المهام",
        description: "تنظيم العناصر الكثيرة في مراحل واضحة",
        config: { columns: ["جديد", "جاري", "مكتمل"] }
      },
      score: 0.8,
      rationale: "عدد كبير من العناصر يحتاج إلى تنظيم أفضل"
    });
  }

  if (links && links.length > 3) {
    suggestions.push({
      elementType: "FlowChart",
      payload: {
        title: "مخطط انسيابي",
        description: "توضيح العلاقات بين العناصر",
        config: { direction: "top-to-bottom" }
      },
      score: 0.7,
      rationale: "وجود روابط كثيرة يتطلب مخططاً انسيابياً"
    });
  }

  // اقتراح عام دائماً
  suggestions.push({
    elementType: "ThinkingBoard",
    payload: {
      title: "لوحة التفكير",
      description: "مساحة إبداعية لتطوير الأفكار",
      config: { mode: "brainstorm" }
    },
    score: 0.6,
    rationale: "لوحة التفكير مفيدة في جميع السيناريوهات"
  });

  return suggestions;
}