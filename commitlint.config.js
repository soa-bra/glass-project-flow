/**
 * Commitlint Configuration
 * إعدادات التحقق من رسائل الـ Commit
 *
 * @see https://commitlint.js.org/
 */
export default {
  extends: ["@commitlint/config-conventional"],

  rules: {
    // نوع الـ commit إلزامي
    "type-enum": [
      2,
      "always",
      [
        "feat", // ميزة جديدة
        "fix", // إصلاح خطأ
        "docs", // تحديث وثائق
        "style", // تنسيق (لا يؤثر على المنطق)
        "refactor", // إعادة هيكلة
        "perf", // تحسين أداء
        "test", // إضافة اختبارات
        "build", // تغييرات بناء
        "ci", // تغييرات CI/CD
        "chore", // مهام صيانة
        "revert", // التراجع عن commit
        "wip", // عمل قيد التنفيذ
      ],
    ],

    // النطاق (اختياري لكن مفيد)
    "scope-enum": [
      1, // warning فقط
      "always",
      [
        // Planning Feature
        "planning",
        "canvas",
        "elements",
        "smart",
        "mindmap",
        "diagram",
        "state",
        "ui",

        // Other Features
        "auth",
        "api",
        "db",
        "storage",

        // General
        "deps",
        "config",
        "docs",
        "tests",
      ],
    ],

    // طول العنوان
    "header-max-length": [2, "always", 100],

    // العنوان لا يبدأ بحرف كبير
    "subject-case": [2, "always", "lower-case"],

    // العنوان لا ينتهي بنقطة
    "subject-full-stop": [2, "never", "."],

    // نوع الـ commit بحروف صغيرة
    "type-case": [2, "always", "lower-case"],
  },

  // رسائل مخصصة بالعربية
  prompt: {
    messages: {
      skip: "(اضغط Enter للتخطي)",
      max: "الحد الأقصى %d حرف",
      min: "الحد الأدنى %d حرف",
      emptyWarning: "لا يمكن أن يكون فارغاً",
      upperLimitWarning: "أكثر من الحد الأقصى",
      lowerLimitWarning: "أقل من الحد الأدنى",
    },
    questions: {
      type: {
        description: "اختر نوع التغيير:",
      },
      scope: {
        description: "ما هو نطاق التغيير (اختياري):",
      },
      subject: {
        description: "اكتب وصفاً مختصراً للتغيير:",
      },
      body: {
        description: "اكتب وصفاً تفصيلياً (اختياري):",
      },
    },
  },
};
