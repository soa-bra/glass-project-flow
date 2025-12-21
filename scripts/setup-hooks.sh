#!/usr/bin/env sh
# 🔧 Husky Setup Script
# شغّل هذا الملف مرة واحدة بعد استنساخ المشروع

echo "📦 إعداد Husky git hooks..."

# تهيئة husky
npx husky install

# إضافة صلاحيات التنفيذ للـ hook
chmod +x .husky/pre-commit

echo "✅ تم إعداد pre-commit hook بنجاح!"
echo ""
echo "الآن عند كل commit سيتم:"
echo "  1. فحص قواعد ESLint للمعمارية"
echo "  2. منع الـ commit إذا وُجدت انتهاكات"
echo ""
echo "📖 راجع: src/features/planning/ARCHITECTURE.md"
