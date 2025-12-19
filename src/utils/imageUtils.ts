/**
 * Image Utilities - أدوات معالجة الصور
 */

/**
 * تحويل صورة URL إلى Base64
 */
export async function imageToBase64(src: string): Promise<string> {
  // إذا كانت الصورة بالفعل Base64
  if (src.startsWith('data:image')) {
    return src;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('فشل إنشاء Canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL('image/png');
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error(`فشل تحميل الصورة: ${src}`));
    };
    
    img.src = src;
  });
}

/**
 * الحصول على أبعاد صورة من Base64
 */
export function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      reject(new Error('فشل قراءة أبعاد الصورة'));
    };
    
    img.src = base64;
  });
}

/**
 * ضغط صورة Base64
 */
export async function compressImage(
  base64: string,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<string> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;
      
      // حساب الأبعاد الجديدة مع الحفاظ على النسبة
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('فشل إنشاء Canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    
    img.onerror = () => reject(new Error('فشل ضغط الصورة'));
    img.src = base64;
  });
}

/**
 * استخراج نوع الصورة من Base64
 */
export function getImageFormat(base64: string): 'PNG' | 'JPEG' | 'GIF' | 'WEBP' | 'UNKNOWN' {
  if (base64.includes('image/png')) return 'PNG';
  if (base64.includes('image/jpeg') || base64.includes('image/jpg')) return 'JPEG';
  if (base64.includes('image/gif')) return 'GIF';
  if (base64.includes('image/webp')) return 'WEBP';
  return 'UNKNOWN';
}

/**
 * التحقق من صحة صورة Base64
 */
export function isValidBase64Image(base64: string): boolean {
  return /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/.test(base64);
}
