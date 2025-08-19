# API Functions Documentation

## Overview
هذا المستند يوضح دوال Supabase Edge Functions المتاحة في النظام، مع شرح للـpayloads المطلوبة والأمان والـCORS.

## Authentication & Security

جميع الدوال تتطلب مصادقة صالحة ما لم ينص على خلاف ذلك:
```bash
Authorization: Bearer <supabase_jwt_token>
```

### مطلوبات إضافية
- **OPENAI_API_KEY**: مطلوب في Supabase Secrets لتفعيل ميزات الذكاء الاصطناعي
- إذا لم يكن المفتاح موجوداً، ستعمل الدوال بنظام fallback بدون AI

### CORS Configuration
جميع الدوال تدعم CORS للوصول من المتصفح:
```javascript
{
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}
```

## 1. analyze-links

### Description
تحليل العناصر والروابط وإرجاع اقتراحات ذكية للعناصر الجديدة. يستخدم الذكاء الاصطناعي عند توفر OPENAI_API_KEY، وإلا يستخدم نظام fallback بسيط.

### Endpoint
```
POST /functions/v1/analyze-links
```

### Authentication
✅ **Required** - Bearer token مطلوب

### Request Payload
```typescript
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
```

### Response
```typescript
interface AnalyzeLinksResponse {
  success: boolean;
  suggestions: Array<{
    elementType: string; // 'ThinkingBoard' | 'KanbanBoard' | 'MindMap' | 'Timeline' | 'FlowChart'
    payload: Record<string, any>;
    score: number; // 0-1
    rationale: string;
  }>;
  analysis_metadata: {
    elements_analyzed: number;
    links_analyzed: number;
    suggestions_generated: number;
    ai_used: boolean;
    model_used: string; // 'gpt-4.1-2025-04-14' أو 'fallback'
  };
}
```

### Example Usage
```javascript
const { data, error } = await supabase.functions.invoke('analyze-links', {
  body: {
    elements: [
      {
        id: "elem-1",
        type: "sticky",
        content: "مهمة مهمة للمراجعة",
        position: { x: 100, y: 200 }
      }
    ],
    links: [
      {
        id: "link-1",
        from_object_id: "elem-1",
        to_object_id: "elem-2"
      }
    ]
  }
});
```

### Error Handling
- `400`: Missing or invalid request payload
- `401`: Unauthorized - invalid or missing authentication
- `500`: Internal server error (AI model error, etc.)

---

## 2. wf01-map

### Description
تحويل Canvas Snapshot إلى مشروع منظم حسب منهجية سـوبــرا. التحويل الأساسي يعمل دائماً، وعند توفر OPENAI_API_KEY يتم تحسين الأسماء والأوصاف تلقائياً.

### Endpoint
```
POST /functions/v1/wf01-map
```

### Authentication
✅ **Required** - Bearer token مطلوب

### Request Payload
```typescript
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
```

### Response
```typescript
interface WF01MapResponse {
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
```

### Mapping Rules (سـوبــرا Methodology)

| Canvas Element | Maps to | Logic |
|---------------|---------|-------|
| `sticky` | Task | محتوى الـSticky يصبح مهمة مع استخراج الأولوية والحالة |
| `frame` | Phase | الـFrame يصبح مرحلة مشروع |
| `connector` | Dependency | الروابط تمثل تبعيات بين المهام |

### Priority & Status Extraction
الدالة تستخرج تلقائياً من محتوى النص:

**الأولوية (Priority):**
- `urgent`: عاجل، فوري، طارئ
- `high`: مهم، عالي، أولوية  
- `low`: منخفض، بسيط، عادي
- `medium`: الافتراضي

**الحالة (Status):**
- `done`: منجز، مكتمل
- `review`: مراجعة، testing
- `in_progress`: جاري، تحت العمل
- `todo`: الافتراضي

### Example Usage
```javascript
const { data, error } = await supabase.functions.invoke('wf01-map', {
  body: {
    snapshot: {
      id: "snap-123",
      name: "خطة المشروع الجديد",
      data: {
        elements: [
          {
            id: "elem-1",
            type: "sticky",
            content: "مهمة عاجلة - تصميم الواجهة الرئيسية",
            position: { x: 100, y: 200 }
          },
          {
            id: "elem-2", 
            type: "frame",
            content: "مرحلة التصميم",
            position: { x: 50, y: 150 }
          }
        ],
        links: [
          {
            id: "link-1",
            from_object_id: "elem-2",
            to_object_id: "elem-1"
          }
        ]
      }
    }
  }
});
```

### Error Handling
- `400`: Invalid snapshot data structure
- `401`: Unauthorized - invalid or missing authentication  
- `500`: Database error or processing failure

---

## Security Considerations

### 1. Authentication
- كل الدوال تتطلب JWT token صالح من Supabase Auth
- الـTokens يتم التحقق منها قبل تنفيذ أي عملية

### 2. Data Validation
- جميع المدخلات يتم التحقق من صحتها قبل المعالجة
- حماية ضد SQL Injection من خلال استخدام Supabase Client methods

### 3. Rate Limiting
- الاعتماد على Supabase's built-in rate limiting
- مراقبة استخدام AI APIs لتجنب تجاوز الحدود

### 4. Error Handling
- عدم كشف معلومات حساسة في رسائل الخطأ
- تسجيل مفصل في server logs للتشخيص

## AI Model Integration

### Current Integration: OpenAI GPT
- **Model**: `gpt-4.1-2025-04-14`
- **Purpose**: تحليل العناصر، إنشاء اقتراحات ذكية، وتحسين التسميات
- **Security**: API Key محفوظ في Supabase Secrets (OPENAI_API_KEY)
- **Rate Limits**: مراقبة استخدام API للحفاظ على الحدود
- **Fallback**: إذا لم يكن المفتاح متوفراً، تعمل الدوال بنظام fallback آمن

### تفعيل الذكاء الاصطناعي
1. إضافة `OPENAI_API_KEY` في Supabase Edge Function Secrets
2. إعادة تشغيل الدوال تلقائياً لتفعيل AI
3. في حالة عدم وجود المفتاح، تعمل الدوال بنظام fallback بسيط

### Future Considerations
- إمكانية إضافة نماذج أخرى (Claude, local models)
- تحسين الـprompts لتحليل أفضل باللغة العربية
- إضافة cache للنتائج المتشابهة

## Development Notes

### Local Testing
```bash
# Test analyze-links
curl -X POST http://localhost:54321/functions/v1/analyze-links \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"elements": [], "links": []}'

# Test wf01-map  
curl -X POST http://localhost:54321/functions/v1/wf01-map \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"snapshot": {"id": "test", "name": "test", "data": {"elements": []}}}'
```

### Monitoring
- تحقق من Function logs في Supabase Dashboard
- مراقبة استخدام OpenAI API
- تتبع معدل نجاح التحويلات في wf01-map

---

*وثيقة محدثة: ${new Date().toISOString()}*