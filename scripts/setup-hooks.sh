#!/usr/bin/env sh
# 🔧 Husky Setup Script
# شغّل هذا الملف مرة واحدة بعد استنساخ المشروع

echo "📦 إعداد Husky git hooks..."

# تهيئة husky
npx husky install

# إضافة صلاحيات التنفيذ للـ hooks
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

echo "✅ تم إعداد git hooks بنجاح!"
echo ""
echo "الآن عند كل commit سيتم:"
echo "  1. ✅ فحص قواعد ESLint للمعمارية (pre-commit)"
echo "  2. ✅ التحقق من صيغة رسالة الـ commit (commit-msg)"
echo ""
echo "📖 الوثائق:"
echo "  - المعمارية: src/features/planning/ARCHITECTURE.md"
echo "  - Conventional Commits: https://conventionalcommits.org"
