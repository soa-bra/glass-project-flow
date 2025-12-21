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
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  // ═══════════════════════════════════════════════════════════
  // قواعد حوكمة معمارية Planning Feature
  // ═══════════════════════════════════════════════════════════
  
  // قاعدة 1: UI Layer لا تستورد من engine مباشرة
  {
    files: ["src/features/planning/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/engine/**", "@/engine/**", "../../../engine/**"],
              message: "❌ UI layer لا يمكنها استيراد من engine مباشرة. استخدم canvas/ أو adapters/ بدلاً من ذلك."
            },
            {
              group: ["**/core/**", "@/core/**"],
              message: "❌ UI layer لا يمكنها استيراد من core مباشرة. استخدم طبقة canvas/ أو state/."
            }
          ]
        }
      ]
    }
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
              message: "❌ Engine layer يجب أن تكون خالية من React. استخدم TypeScript/JavaScript فقط."
            }
          ]
        }
      ]
    }
  },
  
  // قاعدة 3: State Layer (slices) تحتوي reducers فقط - لا business logic
  {
    files: ["src/features/planning/state/slices/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/engine/**", "@/engine/**"],
              message: "❌ State slices يجب أن تحتوي على reducers فقط. ضع business logic في domain/."
            }
          ]
        }
      ]
    }
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
              group: ["**/ui/panels/**", "**/ui/toolbars/**", "**/ui/overlays/**"],
              message: "❌ Elements layer لا يمكنها استيراد من UI panels/toolbars. استخدم props أو context."
            }
          ]
        }
      ]
    }
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
              group: ["**/integration/**"],
              message: "❌ Canvas layer لا يمكنها استيراد من integration مباشرة. استخدم state/ أو hooks."
            }
          ]
        }
      ]
    }
  },
  
  // قاعدة 6: منع استيراد من components/Planning القديم
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["**/components/Planning/**", "@/components/Planning/**"],
              message: "⚠️ مسار قديم! استخدم @/features/planning/ بدلاً من @/components/Planning/"
            }
          ]
        }
      ]
    }
  }
);
