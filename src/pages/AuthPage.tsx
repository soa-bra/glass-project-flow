/**
 * AuthPage — صفحة تسجيل الدخول (Email + Password عبر Supabase).
 * جاهز لإنجاز اليوم؟

 */
import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ActionButton } from "@/components/box-kit/primitives/action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { isAuthBypassEnabled } from "@/lib/authBypass";
import { PageMeta } from "@/components/seo/PageMeta";

const SOABRA_LOGO_SRC = "/lovable-uploads/9a8b8ed4-b3d6-4ecf-b62c-e6c1eba8c3d4.png";

export default function AuthPage() {
  if (isAuthBypassEnabled()) {
    return <Navigate to="/" replace />;
  }
  const { user, loading, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) {
    const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);

    if (result.error) {
      setAuthError(result.error.message || "تعذر تسجيل الدخول. تحقق من البيانات وحاول مرة أخرى.");
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (authError) setAuthError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (authError) setAuthError(null);
  };

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-background px-4">
      <PageMeta
        title="تسجيل الدخول — منصة سـوبــرا"
        description="سجّل الدخول إلى منصة سـوبــرا للوصول إلى لوحات إدارة المشاريع والعمليات والأقسام والتخطيط والأرشيف."
        path="/auth"
      />
      <Card className="w-full max-w-md rounded-[32px] border border-[#3e494c]/15 bg-white/95 shadow-[0_24px_70px_rgba(25,35,38,0.14)] backdrop-blur-xl">
        <CardHeader className="space-y-0 px-8 pb-6 pt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center justify-end">
              <img
                src={SOABRA_LOGO_SRC}
                alt="شعار سوبرا"
                className="h-12 w-auto max-w-[160px] object-contain"
              />
            </div>
            <CardDescription className="max-w-[180px] text-left text-sm leading-6 text-[#3e494c]">
              تسجيل الدخول إلى حسابك
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">البريد الإلكتروني</Label>
              <Input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                autoComplete="email"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">كلمة المرور</Label>
              <Input
                id="signin-password"
                type="password"
                required
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                autoComplete="current-password"
                dir="ltr"
                aria-invalid={authError ? true : undefined}
                aria-describedby={authError ? "signin-error" : undefined}
              />
            </div>
            {authError && (
              <p id="signin-error" role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-right text-sm leading-6 text-red-700">
                {authError}
              </p>
            )}
            <ActionButton
              componentRef="ACT-BTN-P01"
              type="submit"
              className="w-full"
              disabled={submitting}
              icon={submitting ? <Loader2 className="animate-spin" /> : undefined}
            >
              دخول
            </ActionButton>
            <p className="pt-2 text-center text-xs text-muted-foreground">
              جاهز لإنجاز اليوم؟
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
