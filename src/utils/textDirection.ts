/**
 * Text Direction Utilities - أدوات كشف اتجاه النص
 * 
 * دوال للتعرف على اللغة العربية وتحديد اتجاه النص (RTL/LTR)
 * وتنظيف علامات الاتجاه الغريبة التي قد تسبب مشاكل في العرض
 */

// نطاقات Unicode للأحرف العربية والفارسية والأردية
const ARABIC_RANGE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;

// علامات التحكم في الاتجاه (Bidirectional Control Characters)
const DIRECTIONAL_MARKERS = /[\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2066\u2067\u2068\u2069]/g;

/**
 * التحقق إذا كان النص يحتوي على نسبة عالية من الأحرف العربية
 * @param text النص المراد فحصه
 * @param threshold الحد الأدنى لنسبة الأحرف العربية (افتراضي 0.3 = 30%)
 * @returns true إذا كان النص عربياً
 */
export function isArabicText(text: string, threshold: number = 0.3): boolean {
  if (!text || typeof text !== 'string') return false;
  
  // إزالة الفراغات والأرقام والرموز للحساب
  const cleanText = text.replace(/[\s\d\W]/g, '');
  if (cleanText.length === 0) return false;
  
  // حساب عدد الأحرف العربية
  const arabicMatches = cleanText.match(ARABIC_RANGE);
  const arabicCount = arabicMatches ? arabicMatches.length : 0;
  
  // حساب النسبة
  const ratio = arabicCount / cleanText.length;
  
  return ratio >= threshold;
}

/**
 * تحديد اتجاه النص بناءً على محتواه
 * @param text النص المراد تحديد اتجاهه
 * @returns 'rtl' للنص العربي، 'ltr' للنص الإنجليزي
 */
export function detectTextDirection(text: string): 'rtl' | 'ltr' {
  if (!text || typeof text !== 'string') return 'rtl'; // الافتراضي RTL
  
  // البحث عن أول حرف غير فراغ
  const trimmedText = text.trim();
  if (trimmedText.length === 0) return 'rtl';
  
  // فحص الأحرف الأولى لتحديد الاتجاه الأساسي
  const firstChars = trimmedText.slice(0, Math.min(50, trimmedText.length));
  
  // إذا كان النص يبدأ بأحرف عربية أو نسبة عالية من العربية
  if (isArabicText(firstChars, 0.2)) {
    return 'rtl';
  }
  
  // فحص النص الكامل
  if (isArabicText(trimmedText, 0.3)) {
    return 'rtl';
  }
  
  return 'ltr';
}

/**
 * تنظيف النص من علامات التحكم في الاتجاه
 * هذه العلامات قد تسبب سلوكاً غريباً في عرض النص
 * @param text النص المراد تنظيفه
 * @returns النص بدون علامات التحكم في الاتجاه
 */
export function cleanDirectionalMarkers(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  return text.replace(DIRECTIONAL_MARKERS, '');
}

/**
 * تحديد المحاذاة المناسبة بناءً على اتجاه النص
 * @param direction اتجاه النص
 * @returns 'right' للـ RTL، 'left' للـ LTR
 */
export function getAlignmentForDirection(direction: 'rtl' | 'ltr'): 'right' | 'left' {
  return direction === 'rtl' ? 'right' : 'left';
}

/**
 * تحضير النص للصق في المحرر
 * - تنظيف علامات الاتجاه
 * - الحفاظ على الأسطر الجديدة
 * @param text النص الملصوق
 * @returns النص المنظف
 */
export function prepareTextForPaste(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  // تنظيف علامات الاتجاه
  let cleanedText = cleanDirectionalMarkers(text);
  
  // تحويل أنواع مختلفة من الأسطر الجديدة إلى صيغة موحدة
  cleanedText = cleanedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  return cleanedText;
}

/**
 * التحقق إذا كان النص فارغاً (بعد إزالة الفراغات والـ HTML tags)
 * @param text النص المراد فحصه
 * @returns true إذا كان النص فارغاً
 */
export function isTextEmpty(text: string | null | undefined): boolean {
  if (!text) return true;
  
  // إزالة HTML tags
  const withoutTags = text.replace(/<[^>]*>/g, '');
  
  // إزالة الفراغات والأسطر الجديدة
  const trimmed = withoutTags.replace(/&nbsp;/g, ' ').trim();
  
  return trimmed.length === 0;
}
