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
  name: string;
  type: 'sticky' | 'frame' | 'connector' | 'task' | 'phase';
  payload: Record<string, any>;
  score: number;
  reasoning: string;
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

    // تحليل العناصر والروابط باستخدام الذكاء الاصطناعي
    const analysisPrompt = `
    تحليل العناصر والروابط التالية وإعطاء اقتراحات ذكية:
    
    العناصر: ${JSON.stringify(elements, null, 2)}
    الروابط: ${JSON.stringify(links, null, 2)}
    
    قم بتحليل هذه البيانات واقترح عناصر ذكية جديدة قد تكون مفيدة.
    لكل اقتراح، قدم:
    - name: اسم العنصر المقترح
    - type: نوع العنصر (sticky, frame, connector, task, phase)
    - payload: البيانات المرتبطة بالعنصر
    - score: درجة الثقة (0-1)
    - reasoning: السبب وراء هذا الاقتراح
    
    أرجع النتائج كـ JSON array.
    `;

    console.log('Sending request to OpenAI for analysis');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'أنت مساعد ذكي متخصص في تحليل البيانات المرئية واقتراح عناصر تفاعلية مفيدة. أرجع إجاباتك بصيغة JSON صالحة فقط.'
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
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // محاولة استخراج JSON من الاستجابة
    let suggestions: SmartSuggestion[];
    try {
      // إزالة أي نص إضافي قبل أو بعد JSON
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        suggestions = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // إنشاء اقتراح افتراضي في حالة فشل التحليل
      suggestions = [{
        name: 'عنصر مقترح',
        type: 'sticky',
        payload: { content: 'اقتراح تم إنشاؤه تلقائياً بناءً على التحليل' },
        score: 0.5,
        reasoning: 'تم إنشاء هذا الاقتراح كبديل بسبب خطأ في تحليل الاستجابة'
      }];
    }

    // التحقق من صحة البيانات المُرجعة
    const validSuggestions = suggestions.filter((suggestion: any) => 
      suggestion && 
      typeof suggestion.name === 'string' &&
      typeof suggestion.type === 'string' &&
      typeof suggestion.score === 'number' &&
      suggestion.score >= 0 && suggestion.score <= 1
    );

    console.log(`Generated ${validSuggestions.length} valid suggestions`);

    return new Response(JSON.stringify({
      success: true,
      suggestions: validSuggestions,
      analysis_metadata: {
        elements_analyzed: elements.length,
        links_analyzed: links?.length || 0,
        suggestions_generated: validSuggestions.length,
        model_used: 'gpt-4.1-2025-04-14'
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