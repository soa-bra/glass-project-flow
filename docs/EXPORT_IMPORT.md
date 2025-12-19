# Export & Import System - نظام التصدير والاستيراد

## نظرة عامة

يوفر نظام التصدير والاستيراد إمكانية تحويل محتوى الكانفاس إلى صيغ متعددة واستيراد ملفات من مصادر خارجية.

## صيغ التصدير المدعومة

### 1. PDF
```typescript
interface PDFExportOptions {
  format: 'pdf';
  pageSize?: 'A4' | 'A3' | 'Letter' | 'custom';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  includeBackground?: boolean;
  quality?: 'draft' | 'standard' | 'high';
  multiPage?: boolean;
}
```

**الميزات:**
- دعم الصفحات المتعددة تلقائياً
- تضمين الخطوط العربية (IBM Plex Sans Arabic)
- دعم RTL الكامل
- ضغط الصور

### 2. PNG
```typescript
interface PNGExportOptions {
  format: 'png';
  scale?: 1 | 2 | 3 | 4;
  transparent?: boolean;
  includeBackground?: boolean;
  cropToSelection?: boolean;
}
```

**الميزات:**
- دعم Scale 1x-4x للدقة العالية
- خلفية شفافة اختيارية
- قص للعناصر المحددة فقط

### 3. SVG
```typescript
interface SVGExportOptions {
  format: 'svg';
  embedFonts?: boolean;
  embedImages?: boolean;
  optimizePaths?: boolean;
}
```

**الميزات:**
- تضمين الخطوط والصور
- تحسين المسارات
- قابل للتحرير في Illustrator/Figma

### 4. JSON (Native Format)
```typescript
interface JSONExportOptions {
  format: 'json';
  includeMetadata?: boolean;
  includeHistory?: boolean;
  pretty?: boolean;
}
```

**الميزات:**
- الصيغة الأصلية للنظام
- استعادة كاملة مع الـ metadata
- يمكن تضمين تاريخ التعديلات

## استخدام التصدير

```typescript
import { exportEngine } from '@/core/exportEngine';

// تصدير PDF
const pdfBlob = await exportEngine.export(elements, {
  format: 'pdf',
  filename: 'my-canvas',
  pageSize: 'A4',
  orientation: 'landscape'
});

// تصدير PNG بدقة عالية
const pngBlob = await exportEngine.export(elements, {
  format: 'png',
  filename: 'canvas-export',
  scale: 2,
  transparent: true
});

// تصدير SVG
const svgBlob = await exportEngine.export(elements, {
  format: 'svg',
  filename: 'vector-export',
  embedFonts: true
});

// تصدير JSON
const jsonBlob = await exportEngine.export(elements, {
  format: 'json',
  filename: 'backup',
  includeMetadata: true
});
```

## صيغ الاستيراد المدعومة

### 1. JSON (Native)
```typescript
const result = await importEngine.import(file);
// result: { elements: CanvasElement[], metadata?: ImportMetadata }
```

### 2. SVG
- تحويل paths إلى shapes
- استخراج النصوص
- الحفاظ على الألوان والأنماط

### 3. Figma (via JSON export)
```typescript
const figmaData = await importEngine.importFigma(figmaJson);
// يحول frames إلى مجموعات
// يحول components إلى عناصر
```

### 4. Miro (via JSON export)
```typescript
const miroData = await importEngine.importMiro(miroJson);
// يحول widgets إلى عناصر
// يحول connectors إلى أسهم
```

## بنية ملف JSON الأصلي

```json
{
  "version": "1.0.0",
  "exportedAt": "2024-12-15T10:30:00Z",
  "metadata": {
    "title": "My Canvas",
    "author": "User Name",
    "description": "Canvas description"
  },
  "viewport": {
    "zoom": 1,
    "pan": { "x": 0, "y": 0 }
  },
  "elements": [
    {
      "id": "el_001",
      "type": "shape",
      "shapeType": "rectangle",
      "position": { "x": 100, "y": 100 },
      "size": { "width": 200, "height": 150 },
      "rotation": 0,
      "style": {
        "fill": "#3DBE8B",
        "stroke": "#0B0F12",
        "strokeWidth": 2
      },
      "layerId": "default",
      "visible": true,
      "locked": false
    }
  ],
  "layers": [
    {
      "id": "default",
      "name": "الطبقة الرئيسية",
      "visible": true,
      "locked": false,
      "elements": ["el_001"]
    }
  ]
}
```

## معالجة الخطوط العربية

```typescript
// تضمين الخط في PDF
const fontData = await loadFont('IBM Plex Sans Arabic');
doc.addFileToVFS('IBMPlexSansArabic.ttf', fontData);
doc.addFont('IBMPlexSansArabic.ttf', 'IBMPlexSansArabic', 'normal');
doc.setFont('IBMPlexSansArabic');

// معالجة RTL
const rtlText = processRTL(text);
doc.text(rtlText, x, y, { align: 'right' });
```

## معالجة الصور

### تضمين Base64
```typescript
async function embedImages(elements: CanvasElement[]): Promise<CanvasElement[]> {
  return Promise.all(elements.map(async (el) => {
    if (el.type === 'image' && el.data?.src) {
      const base64 = await imageToBase64(el.data.src);
      return {
        ...el,
        data: { ...el.data, src: base64 }
      };
    }
    return el;
  }));
}
```

### ضغط الصور
```typescript
async function compressImage(
  base64: string,
  quality: number = 0.8
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = await loadImage(base64);
  
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  
  return canvas.toDataURL('image/jpeg', quality);
}
```

## التحقق من الصحة

```typescript
import { validateImportData } from '@/utils/importValidation';

const validation = validateImportData(data);
if (!validation.valid) {
  console.error('Import errors:', validation.errors);
  // محاولة الإصلاح التلقائي
  const fixed = autoFixImportData(data, validation.errors);
}
```

## Error Recovery

```typescript
interface ImportResult {
  success: boolean;
  elements: CanvasElement[];
  warnings: string[];
  errors: string[];
  skipped: {
    element: unknown;
    reason: string;
  }[];
}

// الاستيراد مع التعافي من الأخطاء
const result = await importEngine.importWithRecovery(data, {
  skipInvalid: true,
  attemptFix: true,
  fallbackDefaults: true
});

if (result.warnings.length > 0) {
  toast.warning(`تم الاستيراد مع ${result.warnings.length} تحذيرات`);
}

if (result.skipped.length > 0) {
  toast.info(`تم تخطي ${result.skipped.length} عناصر`);
}
```

## الأداء

### تصدير الملفات الكبيرة
```typescript
// استخدام Web Worker للتصدير
const worker = new Worker('/workers/exportWorker.js');
worker.postMessage({ elements, options });

worker.onmessage = (e) => {
  const { blob, progress } = e.data;
  if (progress) {
    setProgress(progress);
  } else {
    downloadBlob(blob, filename);
  }
};
```

### معايير الأداء
| الصيغة | 100 عنصر | 1000 عنصر |
|--------|----------|-----------|
| PNG 1x | < 500ms | < 2s |
| PNG 2x | < 1s | < 4s |
| PDF | < 1s | < 3s |
| SVG | < 200ms | < 1s |
| JSON | < 100ms | < 500ms |

---
*آخر تحديث: 2024-12*
