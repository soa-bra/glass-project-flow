# Batch A — Initial delete list (low-risk UI leaf candidates)

المعايير المستخدمة لهذه الدفعة:
- استبعاد كل ملفات الاختبار (`*.test.ts`, `*.test.tsx`).
- استبعاد أي ملفات `workers` أو ملفات يُحتمل ربطها عبر dynamic import.
- التركيز على UI leaf components الظاهرة كمرشّحات zero-reference بدون استيراد مباشر.

## Candidates (10)

1. `src/components/OperationsBoard/Clients/AddClientButton.tsx`
   - **Reason:** Low-risk UI leaf (زر فرعي مستقل) + no direct import hits في مسح الاستيراد.

2. `src/components/OperationsBoard/Finance/OverBudgetAlert.tsx`
   - **Reason:** Low-risk UI leaf (تنبيه واجهة مستقل) + no direct import hits في مسح الاستيراد.

3. `src/components/OperationsBoard/HR/AddMemberButton.tsx`
   - **Reason:** Low-risk UI leaf (زر إجراء فرعي) + no direct import hits في مسح الاستيراد.

4. `src/components/OperationsBoard/HR/TeamFillProgress.tsx`
   - **Reason:** Low-risk UI widget (عرض تقدّم بسيط) + no direct import hits في مسح الاستيراد.

5. `src/components/OperationsBoard/shared/ErrorCard.tsx`
   - **Reason:** Low-risk presentational component + no direct import hits في مسح الاستيراد.

6. `src/components/OperationsBoard/shared/LoadingCard.tsx`
   - **Reason:** Low-risk presentational component + no direct import hits في مسح الاستيراد.

7. `src/components/custom/ClientSatisfaction.tsx`
   - **Reason:** Low-risk custom widget + no direct import hits في مسح الاستيراد.

8. `src/components/custom/UtilizationGauge.tsx`
   - **Reason:** Low-risk custom widget + no direct import hits في مسح الاستيراد.

9. `src/components/custom/ChangeRequestList.tsx`
   - **Reason:** Low-risk custom sub-widget + no direct import hits (مرشح zero-reference).

10. `src/components/custom/TemplateUploader.tsx`
    - **Reason:** Low-risk auxiliary UI component + no direct import hits (مرشح zero-reference).
