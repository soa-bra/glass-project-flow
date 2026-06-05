import { describe, expect, it } from 'vitest';
import { formatElementPersistenceStatusLabel } from './CanvasToolbar';

describe('formatElementPersistenceStatusLabel', () => {
  it.each([
    ['disabled', 'حفظ العناصر للقراءة فقط'],
    ['idle', 'حفظ العناصر جاهز'],
    ['pending', 'تغييرات عناصر بانتظار الحفظ'],
    ['saving', 'جارٍ حفظ العناصر'],
    ['saved', 'العناصر محفوظة'],
    ['error', 'فشل حفظ العناصر'],
  ] as const)('formats %s', (status, label) => {
    expect(formatElementPersistenceStatusLabel(status)).toBe(label);
  });
});
