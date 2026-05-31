/**
 * خوارزميات التعرف على الأشكال المرسومة يدوياً
 */

export interface Point {
  x: number;
  y: number;
}

export type RecognizedShape = 
  | { type: 'circle'; center: Point; radius: number }
  | { type: 'rectangle'; x: number; y: number; width: number; height: number }
  | { type: 'line'; start: Point; end: Point }
  | { type: 'triangle'; points: [Point, Point, Point] }
  | { type: 'unknown'; points: Point[] };

/**
 * حساب المسافة بين نقطتين
 */
function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * حساب مركز مجموعة نقاط
 */
function calculateCenter(points: Point[]): Point {
  const sum = points.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 }
  );
  return { x: sum.x / points.length, y: sum.y / points.length };
}

/**
 * حساب متوسط المسافة من المركز
 */
function averageDistanceFromCenter(points: Point[], center: Point): number {
  const distances = points.map(p => distance(p, center));
  return distances.reduce((sum, d) => sum + d, 0) / distances.length;
}

/**
 * حساب الانحراف المعياري للمسافات من المركز
 */
function distanceDeviation(points: Point[], center: Point, avgDistance: number): number {
  const squaredDiffs = points.map(p => {
    const d = distance(p, center);
    return Math.pow(d - avgDistance, 2);
  });
  return Math.sqrt(squaredDiffs.reduce((sum, d) => sum + d, 0) / points.length);
}

/**
 * التعرف على دائرة
 * الدائرة لها انحراف معياري منخفض للمسافات من المركز
 */
function isCircle(points: Point[]): RecognizedShape | null {
  if (points.length < 10) return null;

  const center = calculateCenter(points);
  const avgDistance = averageDistanceFromCenter(points, center);
  const deviation = distanceDeviation(points, center, avgDistance);

  // إذا كان الانحراف المعياري أقل من 15% من المتوسط، فهو دائرة
  if (deviation / avgDistance < 0.15) {
    return {
      type: 'circle',
      center,
      radius: avgDistance
    };
  }

  return null;
}

/**
 * التعرف على مستطيل
 * المستطيل له 4 زوايا تقريبية وأضلاع متوازية
 */
function isRectangle(points: Point[]): RecognizedShape | null {
  if (points.length < 10) return null;

  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  const width = maxX - minX;
  const height = maxY - minY;

  // حساب كم نقطة قريبة من حدود المستطيل
  const threshold = Math.max(width, height) * 0.1;
  let nearEdgeCount = 0;

  points.forEach(p => {
    const nearLeft = Math.abs(p.x - minX) < threshold;
    const nearRight = Math.abs(p.x - maxX) < threshold;
    const nearTop = Math.abs(p.y - minY) < threshold;
    const nearBottom = Math.abs(p.y - maxY) < threshold;

    if ((nearLeft || nearRight) && (p.y >= minY && p.y <= maxY)) nearEdgeCount++;
    if ((nearTop || nearBottom) && (p.x >= minX && p.x <= maxX)) nearEdgeCount++;
  });

  // إذا كانت 60% من النقاط قريبة من الحدود، فهو مستطيل
  if (nearEdgeCount / points.length > 0.6) {
    return {
      type: 'rectangle',
      x: minX,
      y: minY,
      width,
      height
    };
  }

  return null;
}

/**
 * التعرف على خط مستقيم
 * الخط المستقيم له نقاط تقريباً على خط واحد
 */
function isLine(points: Point[]): RecognizedShape | null {
  if (points.length < 5) return null;

  const start = points[0];
  const end = points[points.length - 1];
  const lineLength = distance(start, end);

  // حساب الانحراف عن الخط المستقيم
  let totalDeviation = 0;
  points.forEach(p => {
    // حساب المسافة العمودية من النقطة إلى الخط
    const numerator = Math.abs(
      (end.y - start.y) * p.x - (end.x - start.x) * p.y + end.x * start.y - end.y * start.x
    );
    const denominator = lineLength;
    const perpDistance = numerator / denominator;
    totalDeviation += perpDistance;
  });

  const avgDeviation = totalDeviation / points.length;

  // إذا كان متوسط الانحراف أقل من 5% من طول الخط، فهو خط مستقيم
  if (avgDeviation / lineLength < 0.05 && lineLength > 30) {
    return {
      type: 'line',
      start,
      end
    };
  }

  return null;
}

/**
 * التعرف على مثلث
 * المثلث له 3 زوايا واضحة
 */
function isTriangle(points: Point[]): RecognizedShape | null {
  if (points.length < 8) return null;

  // البحث عن 3 نقاط زاوية (corners)
  // هذا تبسيط - في التطبيق الحقيقي نحتاج خوارزمية أكثر تعقيداً
  const corners: Point[] = [];
  const step = Math.floor(points.length / 3);

  if (step > 0) {
    corners.push(points[0]);
    corners.push(points[step]);
    corners.push(points[step * 2]);
  }

  if (corners.length === 3) {
    return {
      type: 'triangle',
      points: corners as [Point, Point, Point]
    };
  }

  return null;
}

/**
 * الدالة الرئيسية للتعرف على الأشكال
 */
export function recognizeShape(points: Point[]): RecognizedShape {
  if (points.length < 5) {
    return { type: 'unknown', points };
  }

  // المحاولة بالترتيب: خط، دائرة، مستطيل، مثلث
  const lineResult = isLine(points);
  if (lineResult) return lineResult;

  const circleResult = isCircle(points);
  if (circleResult) return circleResult;

  const rectangleResult = isRectangle(points);
  if (rectangleResult) return rectangleResult;

  const triangleResult = isTriangle(points);
  if (triangleResult) return triangleResult;

  return { type: 'unknown', points };
}

/**
 * تحويل مصفوفة النقاط إلى SVG path string
 */
export function pointsToSVGPath(points: Point[]): string {
  if (points.length === 0) return '';
  
  const pathParts = points.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    return `L ${p.x} ${p.y}`;
  });
  
  return pathParts.join(' ');
}

/**
 * تبسيط المسار - تقليل عدد النقاط مع الحفاظ على الشكل العام
 * (خوارزمية Ramer-Douglas-Peucker مبسطة)
 */
export function simplifyPath(points: Point[], tolerance: number = 2): Point[] {
  if (points.length <= 2) return points;

  const simplified: Point[] = [points[0]];
  let lastPoint = points[0];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = distance(lastPoint, points[i]);
    if (dist > tolerance) {
      simplified.push(points[i]);
      lastPoint = points[i];
    }
  }

  simplified.push(points[points.length - 1]);
  return simplified;
}
