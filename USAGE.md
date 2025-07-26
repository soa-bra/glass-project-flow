# دليل الاستخدام - نظام سوبرا المتكامل

## نظرة عامة

يوفر هذا الدليل أمثلة عملية لاستخدام مكونات النظام الثلاثة الرئيسية:
- **Event Bus**: نظام الأحداث والتكاملات
- **Observability**: المراقبة والتتبع 
- **Feature Store**: مخزن الميزات

## Event Bus - نظام الأحداث

### إرسال الأحداث

```typescript
import { emitEvent, culturalEvents, projectEvents } from '@/core/events/emitter';

// إرسال حدث قياس تأثير ثقافي
await culturalEvents.impactMeasured({
  brand_id: 'brand-uuid-123',
  metric_code: 'belonging_index',
  period_start: '2025-07-01',
  period_end: '2025-07-31', 
  value: 0.73,
  method: 'survey-v1',
  confidence: 0.85
}, 'CIM:brand-123:2025-07');

// إرسال حدث إنشاء مشروع
await projectEvents.created({
  project_id: 'proj-uuid-456',
  name: 'استراتيجية العلامة التجارية لشركة المستقبل',
  client_id: 'client-uuid-789',
  project_type: 'cultural-strategy',
  budget: 150000,
  start_date: '2025-08-01',
  end_date: '2025-12-01',
  assigned_team: ['emp-1', 'emp-2', 'emp-3'],
  created_by: 'manager-uuid'
});
```

### تسجيل معالجات الأحداث

```typescript
import { handlerRegistry } from '@/core/events/handlers';

// معالج مخصص لأحداث التأثير الثقافي
handlerRegistry.register({
  eventName: 'CulturalImpactMeasured',
  version: 1,
  handler: async (payload, metadata) => {
    console.log(`قياس تأثير ثقافي: ${payload.metric_code} = ${payload.value}`);
    
    // منطق العمل المخصص
    if (payload.value < 0.5) {
      await sendLowImpactAlert(payload.brand_id);
    }
    
    await updateDashboard(payload);
  },
  options: {
    retries: 2,
    timeout: 10000,
  }
});
```

### تشغيل مرسل Outbox

```bash
# تشغيل مرسل الأحداث مع إعادة المحاولة
node scripts/outbox-relay.ts

# أو مع متغيرات البيئة
OUTBOX_INTERVAL_MS=3000 OUTBOX_BATCH_SIZE=20 node scripts/outbox-relay.ts
```

## Observability - المراقبة والتتبع

### استخدام Logger

```typescript
import { logger, createModuleLogger, withPerformanceLogging } from '@/infra/logger';

// Logger أساسي
logger.info({ msg: 'بدء معالجة طلب جديد', userId: 'user-123' });
logger.error({ msg: 'خطأ في قاعدة البيانات', error: error.message });

// Logger خاص بوحدة
const culturalLogger = createModuleLogger('cultural-analysis');
culturalLogger.debug({ msg: 'بدء تحليل التأثير الثقافي', brandId: 'brand-123' });

// Logger مع قياس الأداء
await withPerformanceLogging('cultural-analysis', async () => {
  return await analyzeCulturalImpact(brandId);
}, { brandId, analysisType: 'belonging_index' });
```

### جمع المقاييس

```typescript
import { metrics } from '@/infra/metrics';

// عدادات مخصصة
metrics.counter('cultural_analyses_total', {
  brand_type: 'startup',
  analysis_type: 'belonging_index'
}).inc();

// هيستوغرام للأوقات
metrics.histogram('analysis_duration_seconds', {
  analysis_type: 'cultural_resonance'
}).observe(duration);

// مؤشرات الحالة الحالية
metrics.gauge('active_projects_count', {
  project_type: 'cultural-strategy'
}).set(activeCount);
```

### التتبع المتقدم

```typescript
import { withTracing, businessTracing, traced } from '@/infra/tracing';

// تتبع عملية كاملة
await withTracing('cultural-impact-analysis', async (span) => {
  span.setAttributes({ brandId, metricType: 'belonging_index' });
  
  const data = await collectSurveyData(brandId);
  const analysis = await performAnalysis(data);
  
  return analysis;
});

// تتبع تلقائي للدوال
class CulturalAnalyzer {
  @traced('cultural-analyzer.analyze')
  async analyze(brandId: string, metricCode: string) {
    // منطق التحليل
    return await performDeepAnalysis(brandId, metricCode);
  }
}

// تتبع العمليات التجارية
const span = businessTracing.culturalImpact(brandId, 'belonging_index');
try {
  const result = await measureBelongingIndex(brandId);
  span.setStatus({ code: SpanStatusCode.OK });
  return result;
} finally {
  span.end();
}
```

## Feature Store - مخزن الميزات

### كتابة الميزات

```typescript
import { writeFeatures, featureStore } from '@/core/feature-store/fs.service';

// كتابة ميزات ثقافية لعلامة تجارية
await featureStore.writeCulturalFeatures('brand-uuid-123', {
  belongingIndex: 0.73,
  meaningShift: 0.12,
  culturalResonance: 0.68,
  identityStrength: 0.82
}, { ttlDays: 365 });

// كتابة ميزات أداء موظف
await featureStore.writeEmployeeFeatures('emp-uuid-456', {
  performanceScore: 4.2,
  culturalFit: 4.7,
  technicalSkill: 3.8,
  leadershipPotential: 4.1
}, { ttlDays: 1095 });

// كتابة مخصصة
await writeFeatures({
  namespace: 'client-engagement',
  entity: 'client',
  entityId: 'client-uuid-789',
  features: {
    satisfaction_score: 8.5,
    retention_likelihood: 0.92,
    referral_potential: 0.71,
    project_complexity_preference: 'high'
  },
  ttlDays: 730
});
```

### قراءة الميزات

```typescript
import { readLatest, readTimeSeries } from '@/core/feature-store/fs.service';

// قراءة أحدث ميزات
const culturalFeatures = await readLatest('cultural', 'brand', 'brand-uuid-123');
console.log(`مؤشر الانتماء: ${culturalFeatures?.belongingIndex}`);

// قراءة ميزات بتاريخ محدد
const historicalFeatures = await readLatest('cultural', 'brand', 'brand-uuid-123', {
  asOf: new Date('2025-06-01'),
  includeExpired: false
});

// قراءة سلسلة زمنية
const timeSeries = await readTimeSeries(
  'cultural',
  'brand', 
  'brand-uuid-123',
  new Date('2025-01-01'),
  new Date('2025-07-31')
);

timeSeries.forEach(({ timestamp, features }) => {
  console.log(`${timestamp}: مؤشر الانتماء = ${features.belongingIndex}`);
});
```

## أمثلة التكامل الكامل

### سيناريو: قياس وتخزين التأثير الثقافي

```typescript
import { emitEvent } from '@/core/events/emitter';
import { featureStore } from '@/core/feature-store/fs.service';
import { withTracing } from '@/infra/tracing';
import { logger } from '@/infra/logger';

async function measureAndStoreCulturalImpact(brandId: string, surveyData: any) {
  return await withTracing('cultural-impact-full-cycle', async (span) => {
    span.setAttributes({ brandId, surveyCount: surveyData.responses.length });
    
    // 1. تحليل البيانات
    const analysis = await analyzeSurveyData(surveyData);
    
    // 2. تخزين الميزات
    await featureStore.writeCulturalFeatures(brandId, {
      belongingIndex: analysis.belongingIndex,
      meaningShift: analysis.meaningShift,
      culturalResonance: analysis.culturalResonance,
      identityStrength: analysis.identityStrength
    });
    
    // 3. إرسال حدث
    await emitEvent({
      name: 'CulturalImpactMeasured',
      version: 1,
      payload: {
        brand_id: brandId,
        metric_code: 'belonging_index',
        period_start: analysis.periodStart,
        period_end: analysis.periodEnd,
        value: analysis.belongingIndex,
        method: 'survey-v1',
        confidence: analysis.confidence
      },
      dedupKey: `CIM:${brandId}:${analysis.periodStart}`
    });
    
    logger.info({
      msg: 'Cultural impact measurement completed',
      brandId,
      belongingIndex: analysis.belongingIndex,
      confidence: analysis.confidence
    });
    
    return analysis;
  });
}
```

### سيناريو: معالج متكامل للأحداث

```typescript
import { handlerRegistry } from '@/core/events/handlers';
import { readLatest } from '@/core/feature-store/fs.service';
import { logger } from '@/infra/logger';

// معالج يستخدم Feature Store لاتخاذ قرارات ذكية
handlerRegistry.register({
  eventName: 'ProjectStatusChanged',
  version: 1,
  handler: async (payload, metadata) => {
    if (payload.new_status === 'completed') {
      // قراءة ميزات المشروع
      const projectFeatures = await readLatest('projects', 'project', payload.project_id);
      
      if (projectFeatures) {
        const satisfaction = projectFeatures.clientSatisfaction || 0;
        const efficiency = projectFeatures.budgetEfficiency || 0;
        
        // إرسال تنبيه إذا كان الأداء ممتاز
        if (satisfaction > 0.9 && efficiency > 0.85) {
          await emitEvent({
            name: 'ProjectExcellenceAchieved',
            version: 1,
            payload: {
              project_id: payload.project_id,
              satisfaction_score: satisfaction,
              efficiency_score: efficiency,
              completed_by: payload.changed_by
            }
          });
        }
      }
      
      logger.info({
        msg: 'Project completion processed with feature analysis',
        projectId: payload.project_id,
        features: projectFeatures
      });
    }
  }
});
```

## متغيرات البيئة المطلوبة

```bash
# النظام الأساسي
SERVICE_NAME=supra-system
SERVICE_VERSION=1.0.0
NODE_ENV=production
LOG_LEVEL=info

# قاعدة البيانات
DATABASE_URL=postgresql://...

# التتبع والمراقبة
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://jaeger:4318/v1/traces
OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://prometheus:4318/v1/metrics
OTEL_AUTH_HEADER=Bearer your-auth-token

# Outbox والأحداث
OUTBOX_INTERVAL_MS=5000
OUTBOX_BATCH_SIZE=10

# Webhooks (اختياري)
ENABLE_CULTURAL_WEBHOOKS=true
CULTURAL_IMPACT_WEBHOOK_URL=https://external-system.com/webhooks/cultural
WEBHOOK_SECRET=your-webhook-secret

# Slack (اختياري)
ENABLE_SLACK_NOTIFICATIONS=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

## أفضل الممارسات

### للأحداث
- استخدم `dedupKey` لتجنب الأحداث المكررة
- اجعل أسماء الأحداث وصفية ومفهومة
- احرص على تطبيق العقود (Contracts) بدقة
- استخدم مستويات إعادة المحاولة المناسبة

### للمراقبة
- أضف context مفيد للـ logs
- استخدم structured logging
- قس العمليات الحرجة فقط
- تجنب إفراط في التتبع

### لمخزن الميزات
- اختر TTL مناسب للبيانات
- استخدم namespaces منظمة
- فكر في أنماط الاستعلام مسبقاً
- نظف البيانات القديمة دورياً

## الاستكشاف والإصلاح

### مشاكل الأحداث الشائعة
```bash
# فحص Outbox المعلقة
SELECT * FROM event_outbox WHERE status = 'pending' ORDER BY created_at;

# فحص DLQ
SELECT * FROM event_dlq ORDER BY created_at DESC LIMIT 10;

# إعادة إرسال حدث من DLQ
INSERT INTO event_outbox (event_name, event_version, payload, retry_count)
SELECT event_name, event_version, payload, 0 FROM event_dlq WHERE id = 'dlq-id';
```

### مراقبة الأداء
```bash
# فحص المقاييس
curl http://localhost:3000/metrics

# فحص الصحة
curl http://localhost:3000/health
```

هذا الدليل يوفر الأساسيات للبدء مع النظام. راجع كود المصدر للتفاصيل التقنية الإضافية.