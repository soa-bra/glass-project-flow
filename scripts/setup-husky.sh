#!/usr/bin/env sh
set -e

echo "📦 إعداد Husky git hooks..."

# تهيئة Husky
npx husky install

# إضافة صلاحيات التنفيذ للـ hooks (إذا كانت موجودة)
if [ -f ".husky/pre-commit" ]; then
  chmod +x .husky/pre-commit
fi

if [ -f ".husky/commit-msg" ]; then
  chmod +x .husky/commit-msg
fi

echo "✅ تم إعداد git hooks بنجاح!"
echo ""
echo "الآن عند كل commit سيتم:"
echo "  1) ✅ فحص قواعد ESLint للمعمارية (pre-commit)"
echo "  2) ✅ التحقق من صيغة رسالة الـ commit (commit-msg)"
echo ""
echo "📖 الوثائق:"
echo "  - المعمارية: src/features/planning/ARCHITECTURE.md"
echo "  - Conventional Commits: https://conventionalcommits.org"
