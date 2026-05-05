# Zero-reference Allowlist

استخدم هذا الملف لحجز الملفات التي تظهر كـ zero-reference لكن لديها استدعاء غير مباشر (dynamic import / registry / config / runtime loader).

| File | Reason | Owner | Date |
|---|---|---|---|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ |

## Rules
1. أي ملف في allowlist يجب أن يملك سببًا تقنيًا واضحًا.
2. أي إدخال بلا سبب واضح يعود إلى `delete-review`.
3. راجع allowlist بعد كل sprint ونظف الإدخالات القديمة.
