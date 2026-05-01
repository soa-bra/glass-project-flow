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

// ⚠️ تعطيل مؤقّت للمصادقة أثناء التطوير — يجب إعادة التفعيل قبل الإطلاق.
const AUTH_DISABLED_FOR_DEV = true;

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (AUTH_DISABLED_FOR_DEV) {
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
