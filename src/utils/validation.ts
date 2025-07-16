import { z } from 'zod';

// Input sanitization utilities
export class InputSanitizer {
  static sanitizeText(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove basic XSS vectors
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim().substring(0, 254);
  }

  static sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return '';
      }
      return parsed.toString();
    } catch {
      return '';
    }
  }

  static sanitizeNumeric(input: string): string {
    return input.replace(/[^\d.-]/g, '').substring(0, 20);
  }
}

// Rate limiting for client-side actions
export class RateLimiter {
  private static attempts: Map<string, number[]> = new Map();
  
  static isAllowed(key: string, maxAttempts = 5, windowMs = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }
  
  static getRemainingAttempts(key: string, maxAttempts = 5, windowMs = 60000): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const validAttempts = attempts.filter(time => now - time < windowMs);
    return Math.max(0, maxAttempts - validAttempts.length);
  }
}

// Common validation schemas
export const ValidationSchemas = {
  email: z.string().email('البريد الإلكتروني غير صالح').max(254),
  
  password: z.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير')
    .regex(/[a-z]/, 'كلمة المرور يجب أن تحتوي على حرف صغير')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم')
    .regex(/[^A-Za-z0-9]/, 'كلمة المرور يجب أن تحتوي على رمز خاص'),
  
  name: z.string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(50, 'الاسم لا يمكن أن يتجاوز 50 حرف')
    .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z\s]+$/, 'الاسم يحتوي على أحرف غير صالحة'),
  
  phone: z.string()
    .regex(/^(\+966|0)?[5][0-9]{8}$/, 'رقم الهاتف غير صالح (يجب أن يبدأ بـ 05 أو +9665)'),
  
  url: z.string().url('الرابط غير صالح').optional().or(z.literal('')),
  
  currency: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'المبلغ غير صالح')
    .refine(val => parseFloat(val) >= 0, 'المبلغ يجب أن يكون موجب'),
  
  text: z.string()
    .max(1000, 'النص لا يمكن أن يتجاوز 1000 حرف')
    .transform(InputSanitizer.sanitizeText),
  
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'تاريخ غير صالح (يجب أن يكون YYYY-MM-DD)')
    .refine(val => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date.getFullYear() >= 1900;
    }, 'التاريخ غير صالح'),

  contractValue: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'قيمة العقد غير صالحة')
    .refine(val => parseFloat(val) > 0, 'قيمة العقد يجب أن تكون أكبر من صفر')
    .refine(val => parseFloat(val) <= 10000000, 'قيمة العقد لا يمكن أن تتجاوز 10 مليون'),
};

// Form validation helper
export class FormValidator {
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => err.message)
        };
      }
      return {
        success: false,
        errors: ['خطأ في التحقق من البيانات']
      };
    }
  }

  static validateField<T>(schema: z.ZodSchema<T>, value: unknown): string | null {
    try {
      schema.parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || 'خطأ في التحقق';
      }
      return 'خطأ في التحقق من البيانات';
    }
  }
}