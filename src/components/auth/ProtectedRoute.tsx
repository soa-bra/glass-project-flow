/**
 * ProtectedRoute — يحرس الصفحات التي تتطلب جلسة مصادقة.
 * عند انعدام الجلسة يحوّل إلى /auth مع حفظ المسار المقصود.
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * تعطيل المصادقة مسموح فقط عبر متغيّر بيئة صريح ضمن وضع التطوير.
 * - الافتراضي: المصادقة مفعَّلة (الإنتاج وأي بيئة بدون المتغيّر).
 * - للتعطيل المؤقّت محليًا فقط: ضع `VITE_DISABLE_AUTH=true` في `.env.local`.
 * - شرط `import.meta.env.DEV` يضمن استحالة التعطيل في build إنتاجي.
 */
const AUTH_DISABLED =
  import.meta.env.DEV && import.meta.env.VITE_DISABLE_AUTH === "true";

if (AUTH_DISABLED) {
  // eslint-disable-next-line no-console
  console.warn(
    "[ProtectedRoute] ⚠️ AUTH DISABLED via VITE_DISABLE_AUTH=true — dev only. Never enable in production.",
  );
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (AUTH_DISABLED) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
