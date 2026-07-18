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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { isAuthBypassEnabled } from "@/lib/authBypass";
import { PageMeta } from "@/components/seo/PageMeta";


export default function AuthPage() {
  if (isAuthBypassEnabled()) {
    return <Navigate to="/" replace />;
  }
  const { user, loading, signIn } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);

    if (result.error) {
      toast({
        title: "فشل تسجيل الدخول",
        description: result.error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-background px-4">
      <PageMeta
        title="تسجيل الدخول — منصة سـوبــرا"
        description="سجّل الدخول إلى منصة سـوبــرا للوصول إلى لوحات إدارة المشاريع والعمليات والأقسام والتخطيط والأرشيف."
        path="/auth"
      />
      <Card
        className="w-full max-w-md border bg-white"
        style={{
          borderColor: "#DADCE0",
          borderRadius: "24px 24px 6px 6px",
          boxShadow:
            "0 1px 1px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">سـوبــرا</CardTitle>
          <CardDescription>تسجيل الدخول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">البريد الإلكتروني</Label>
              <Input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                dir="ltr"
              />
            </div>
            <ActionButton
              componentRef="ACT-BTN-P01"
              type="submit"
              className="w-full"
              disabled={submitting}
              icon={submitting ? <Loader2 className="animate-spin" /> : undefined}
            >
              دخول
            </ActionButton>
            <p className="text-center text-xs text-muted-foreground pt-2">
              جاهز لإنجاز اليوم؟
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
