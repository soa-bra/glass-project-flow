/**
 * Shared Formatters
 * دوال تنسيق مشتركة
 */

/**
 * تنسيق العملة بالريال السعودي
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * تنسيق التاريخ بالعربية
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ar-SA');
}

/**
 * تنسيق التاريخ والوقت بالعربية
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ar-SA');
}

/**
 * تنسيق النسبة المئوية
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * تنسيق الأرقام بالعربية
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ar-SA').format(value);
}
