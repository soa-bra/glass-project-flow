import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // قواعد حوكمة معمارية Planning Feature
  // ═══════════════════════════════════════════════════════════

  // قاعدة 1: UI Layer لا تستورد من engine أو core مباشرة
  {
    files: ["src/features/planning/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/engine/**", "@/engine/**"],
              message:
                "❌ UI layer لا يمكنها استيراد من engine مباشرة. استخدم canvas/ أو adapters/ بدلاً من ذلك.",
            },
            {
              group: ["**/core/**", "@/core/**", "src/core/**"],
              message: "❌ UI layer لا يمكنها استيراد من core مباشرة. استخدم canvas/ أو state/.",
            },
          ],
        },
      ],
    },
  },

  // قاعدة 2: Engine Layer لا تستخدم React
  {
    files: ["src/engine/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-dom", "react-*", "@radix-ui/*", "framer-motion"],
              message:
                "❌ Engine layer يجب أن تكون خالية من React. استخدم TypeScript/JavaScript فقط.",
            },
          ],
        },
      ],
    },
  },

  // قاعدة 3: State Layer (slices) reducers فقط - لا business logic ولا engine imports
  {
    files: ["src/features/planning/state/slices/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/engine/**", "@/engine/**"],
              message:
                "❌ State slices يجب أن تكون reducers فقط. ضع business logic في domain/commands و domain/policies.",
            },
          ],
        },
      ],
    },
  },

  // قاعدة 4: Elements Layer لا تستورد من UI
  {
    files: ["src/features/planning/elements/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/features/planning/ui/**",
                "@/features/planning/ui/**",
                "**/ui/panels/**",
                "**/ui/toolbars/**",
                "**/ui/overlays/**",
              ],
              message:
                "❌ Elements layer لا يمكنها استيراد من UI (panels/toolbars/overlays). استخدم props أو callbacks أو context.",
            },
          ],
        },
      ],
    },
  },

  // قاعدة 5: Canvas Layer لا تستورد من Integration
  {
    files: ["src/features/planning/canvas/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/features/planning/integration/**", "@/features/planning/integration/**", "**/integration/**"],
              message:
                "❌ Canvas layer لا يمكنها استيراد من integration مباشرة. استخدم state/ أو hooks/adapters.",
            },
          ],
        },
      ],
    },
  },

  // قاعدة 6: منع استيراد من components/Planning القديم (ERROR)
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/components/Planning/**", "@/components/Planning/**"],
              message: "❌ مسار محذوف! استخدم @/features/planning/ بدلاً من @/components/Planning/",
            },
          ],
        },
      ],
    },
  },

  // قاعدة 7: منع الاستيراد العميق من Planning (Public API فقط)
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/features/planning/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/planning/ui/**",
                "@/features/planning/canvas/**",
                "@/features/planning/elements/**",
                "@/features/planning/domain/**",
                "@/features/planning/state/**",
                "@/features/planning/integration/**",
              ],
              message: "❌ استخدم @/features/planning فقط (Public API)",
            },
          ],
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════
  // قواعد حوكمة معمارية Invoice Feature
  // ═══════════════════════════════════════════════════════════

  // قاعدة 8: Invoice UI لا تستورد من integration مباشرة
  {
    files: ["src/features/invoice/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/features/invoice/integration/**", "@/features/invoice/integration/**"],
              message: "❌ UI لا تستورد من integration. استخدم state/ أو hooks.",
            },
          ],
        },
      ],
    },
  },

  // قاعدة 9: Invoice Domain خالية من React
  {
    files: ["src/features/invoice/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-dom", "@radix-ui/*", "framer-motion"],
              message: "❌ Domain يجب أن تكون pure TypeScript بدون React.",
            },
          ],
        },
      ],
    },
  },

  // قاعدة 10: منع الاستيراد العميق من Invoice (Public API فقط)
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/features/invoice/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/invoice/ui/**",
                "@/features/invoice/domain/**",
                "@/features/invoice/state/**",
                "@/features/invoice/integration/**",
              ],
              message: "❌ استخدم @/features/invoice فقط (Public API)",
            },
          ],
        },
      ],
    },
  }
);
