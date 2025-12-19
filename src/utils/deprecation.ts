/**
 * Deprecation Utilities - أدوات التحذيرات للكود المُهمَل
 * 
 * يوفر هذا الملف أدوات موحدة لإدارة تحذيرات الكود المُهمَل
 */

type DeprecationSeverity = 'warning' | 'error';

interface DeprecationOptions {
  /** البديل المقترح */
  alternative?: string;
  /** إصدار الإزالة المتوقع */
  removeInVersion?: string;
  /** رابط التوثيق */
  docsUrl?: string;
  /** شدة التحذير */
  severity?: DeprecationSeverity;
  /** عرض مرة واحدة فقط لكل رسالة */
  once?: boolean;
}

// تتبع الرسائل المعروضة لمنع التكرار
const shownMessages = new Set<string>();

/**
 * عرض تحذير deprecation موحد
 * 
 * @param message - وصف ما تم إهماله
 * @param options - خيارات إضافية
 * 
 * @example
 * deprecated('screenToCanvasCoordinates', {
 *   alternative: 'canvasKernel.screenToWorld',
 *   removeInVersion: '2.0.0'
 * });
 */
export function deprecated(message: string, options: DeprecationOptions = {}): void {
  // لا تعرض في production
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  
  const {
    alternative,
    removeInVersion,
    docsUrl,
    severity = 'warning',
    once = true
  } = options;
  
  // إنشاء مفتاح فريد للرسالة
  const messageKey = `${message}|${alternative || ''}`;
  
  // تخطي إذا تم العرض سابقاً
  if (once && shownMessages.has(messageKey)) {
    return;
  }
  
  shownMessages.add(messageKey);
  
  // بناء الرسالة
  let fullMessage = `⚠️ DEPRECATED: ${message}`;
  
  if (alternative) {
    fullMessage += `\n   ➡️ Use "${alternative}" instead.`;
  }
  
  if (removeInVersion) {
    fullMessage += `\n   ⏰ Will be removed in version ${removeInVersion}.`;
  }
  
  if (docsUrl) {
    fullMessage += `\n   📖 See: ${docsUrl}`;
  }
  
  // عرض التحذير
  if (severity === 'error') {
    console.error(fullMessage);
  } else {
    console.warn(fullMessage);
  }
}

/**
 * تزيين دالة مُهمَلة
 * 
 * @param fn - الدالة الأصلية
 * @param message - وصف الإهمال
 * @param options - خيارات إضافية
 * @returns الدالة مع تحذير deprecation
 * 
 * @example
 * export const oldFunction = deprecatedFn(
 *   (x, y) => newFunction(x, y),
 *   'oldFunction',
 *   { alternative: 'newFunction' }
 * );
 */
export function deprecatedFn<T extends (...args: unknown[]) => unknown>(
  fn: T,
  message: string,
  options: DeprecationOptions = {}
): T {
  return ((...args: Parameters<T>) => {
    deprecated(message, options);
    return fn(...args);
  }) as T;
}

/**
 * تزيين property مُهمَل في كائن
 * 
 * @param obj - الكائن
 * @param prop - اسم الخاصية
 * @param message - وصف الإهمال
 * @param options - خيارات إضافية
 * 
 * @example
 * deprecatedProp(config, 'oldSetting', 'oldSetting property', {
 *   alternative: 'newSetting'
 * });
 */
export function deprecatedProp<T extends object>(
  obj: T,
  prop: keyof T,
  message: string,
  options: DeprecationOptions = {}
): void {
  const originalValue = obj[prop];
  
  Object.defineProperty(obj, prop, {
    get() {
      deprecated(message, options);
      return originalValue;
    },
    set(value) {
      deprecated(message, options);
      (obj as Record<string, unknown>)[prop as string] = value;
    },
    enumerable: true,
    configurable: true
  });
}

/**
 * مسح سجل الرسائل المعروضة
 * مفيد للاختبارات
 */
export function clearDeprecationCache(): void {
  shownMessages.clear();
}

/**
 * الحصول على عدد الرسائل المعروضة
 * مفيد للمراقبة
 */
export function getDeprecationCount(): number {
  return shownMessages.size;
}
