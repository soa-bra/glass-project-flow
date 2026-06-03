/**
 * AuthPage — صفحة تسجيل الدخول (Email + Password عبر Supabase).
 * إنشاء الحسابات يتم حصراً عبر لوحة الإعدادات بواسطة Owner.
 */
import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { isAuthBypassEnabled } from "@/lib/authBypass";

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
      <Card className="w-full max-w-md">
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
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
              دخول
            </Button>
            <p className="text-center text-xs text-muted-foreground pt-2">
              إنشاء الحسابات يتم حصراً عبر لوحة الإعدادات بواسطة المالك (Owner).
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
