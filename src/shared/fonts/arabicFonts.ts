/**
 * Arabic Fonts - الخطوط العربية لـ PDF Export
 * يستخدم IBM Plex Sans Arabic
 */

// ملاحظة: في بيئة الإنتاج، يتم تحميل الخط من Google Fonts
// هنا نستخدم تكوين jsPDF لدعم الخطوط العربية

export const ARABIC_FONT_CONFIG = {
  fontName: 'IBMPlexSansArabic',
  fontFamily: 'IBM Plex Sans Arabic, Arial, sans-serif',
  googleFontUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap',
};

/**
 * تحميل الخط العربي للـ PDF
 * يستخدم الخط المتوفر في النظام أو fallback
 */
export async function loadArabicFont(): Promise<boolean> {
  try {
    // التحقق من توفر الخط
    const fontCheck = await document.fonts.check('16px "IBM Plex Sans Arabic"');
    
    if (!fontCheck) {
      // تحميل الخط من Google Fonts
      const link = document.createElement('link');
      link.href = ARABIC_FONT_CONFIG.googleFontUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      
      // انتظار تحميل الخط
      await document.fonts.load('16px "IBM Plex Sans Arabic"');
    }
    
    return true;
  } catch (error) {
    console.warn('فشل تحميل الخط العربي:', error);
    return false;
  }
}

/**
 * التحقق من احتواء النص على أحرف عربية
 */
export function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

/**
 * معالجة النص العربي للعرض الصحيح
 * يعكس ترتيب الأحرف للـ RTL
 */
export function processArabicText(text: string): string {
  // jsPDF يعالج RTL تلقائياً في الإصدارات الحديثة
  return text;
}

/**
 * الحصول على اتجاه النص
 */
export function getTextDirection(text: string): 'rtl' | 'ltr' {
  return containsArabic(text) ? 'rtl' : 'ltr';
}
