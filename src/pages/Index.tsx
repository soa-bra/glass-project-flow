// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // ✅ يمنع وجود نسختين React (السبب الأشهر لخطأ ReactCurrentDispatcher/useState = null)
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    // ✅ يساعد Vite يثبت نفس نسخة React وقت الـ pre-bundle
    include: ["react", "react-dom"],
  },
});
