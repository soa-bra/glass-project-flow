/**
 * AuthPage — صفحة تسجيل الدخول (Email + Password عبر Supabase).
 * رسائل التحقق تظهر تحت الحقول بألوان الديزاين توكن (خطأ/تحذير/نجاح) بدل التنبيهات العامة.
 */
import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ActionButton } from "@/components/box-kit/primitives/action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { isAuthBypassEnabled } from "@/lib/authBypass";
import { PageMeta } from "@/components/seo/PageMeta";
import { cn } from "@/lib/utils";
import soabraLogo from "@/assets/brand/SoaBra-logo-color.svg.asset.json";


type FieldTone = "error" | "warning" | "success" | "info";

const TONE_STYLES: Record<FieldTone, { text: string; border: string; icon: typeof AlertCircle }> = {
  error: { text: "#E5564D", border: "#E5564D", icon: AlertCircle },
  warning: { text: "#F6C445", border: "#F6C445", icon: AlertCircle },
  success: { text: "#3DBE8B", border: "#3DBE8B", icon: CheckCircle2 },
  info: { text: "#3DA8F5", border: "#3DA8F5", icon: AlertCircle },
};

interface FieldMessage {
  tone: FieldTone;
  text: string;
}

function FieldHint({ message }: { message?: FieldMessage }) {
  if (!message) return null;
  const { text, icon: Icon } = TONE_STYLES[message.tone];
  return (
    <p
      className="flex items-center gap-1.5 text-xs pt-1"
      style={{ color: text }}
      role={message.tone === "error" ? "alert" : "status"}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{message.text}</span>
    </p>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapAuthError(message: string): { field: "email" | "password" | "form"; text: string } {
  const m = message.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials")) {
    return { field: "password", text: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
  }
  if (m.includes("email not confirmed")) {
    return { field: "email", text: "لم يتم تأكيد البريد الإلكتروني بعد." };
  }
  if (m.includes("rate") || m.includes("too many")) {
    return { field: "form", text: "محاولات كثيرة، حاول مجددًا بعد قليل." };
  }
  return { field: "form", text: message };
}

export default function AuthPage() {
  if (isAuthBypassEnabled()) {
    return <Navigate to="/" replace />;
  }
  const { user, loading, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailMsg, setEmailMsg] = useState<FieldMessage | undefined>();
  const [passwordMsg, setPasswordMsg] = useState<FieldMessage | undefined>();
  const [formMsg, setFormMsg] = useState<FieldMessage | undefined>();

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

  const validate = (): boolean => {
    let ok = true;
    if (!email) {
      setEmailMsg({ tone: "error", text: "البريد الإلكتروني مطلوب." });
      ok = false;
    } else if (!EMAIL_RE.test(email)) {
      setEmailMsg({ tone: "error", text: "صيغة البريد الإلكتروني غير صحيحة." });
      ok = false;
    } else {
      setEmailMsg({ tone: "success", text: "بريد إلكتروني صحيح." });
    }

    if (!password) {
      setPasswordMsg({ tone: "error", text: "كلمة المرور مطلوبة." });
      ok = false;
    } else if (password.length < 6) {
      setPasswordMsg({ tone: "warning", text: "كلمة المرور قصيرة (6 أحرف على الأقل)." });
      ok = false;
    } else {
      setPasswordMsg(undefined);
    }
    return ok;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormMsg(undefined);
    if (!validate()) return;

    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);

    if (result.error) {
      const mapped = mapAuthError(result.error.message);
      if (mapped.field === "email") setEmailMsg({ tone: "error", text: mapped.text });
      else if (mapped.field === "password") setPasswordMsg({ tone: "error", text: mapped.text });
      else setFormMsg({ tone: "error", text: mapped.text });
    }
  };

  const borderFor = (msg?: FieldMessage) =>
    msg ? { borderColor: TONE_STYLES[msg.tone].border } : undefined;

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
          boxShadow: "0 1px 1px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <img src={soabraLogo.url} alt="SoaBra" className="h-12 w-auto object-contain" />
          </div>

          <CardDescription>تسجيل الدخول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signin-email">البريد الإلكتروني</Label>
              <Input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailMsg) setEmailMsg(undefined);
                }}
                autoComplete="email"
                dir="ltr"
                aria-invalid={emailMsg?.tone === "error"}
                aria-describedby="signin-email-hint"
                className={cn(
                  "text-left",
                  emailMsg && "focus-visible:ring-0"
                )}
                style={borderFor(emailMsg)}
              />
              <div id="signin-email-hint">
                <FieldHint message={emailMsg} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">كلمة المرور</Label>
              <Input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordMsg) setPasswordMsg(undefined);
                }}
                autoComplete="current-password"
                dir="ltr"
                aria-invalid={passwordMsg?.tone === "error"}
                aria-describedby="signin-password-hint"
                className={cn(
                  "text-left",
                  passwordMsg && "focus-visible:ring-0"
                )}
                style={borderFor(passwordMsg)}
              />
              <div id="signin-password-hint">
                <FieldHint message={passwordMsg} />
              </div>
              <div className="flex justify-end pt-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormMsg({ tone: "info", text: "يرجى التواصل مع مدير النظام لإعادة تعيين كلمة المرور." });
                  }}
                  className="text-xs text-sb-ink/70 hover:text-sb-accent-blue hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent-blue/50 focus-visible:ring-offset-2 transition-colors"
                >
                  نسيت كلمة المرور؟
                </a>
              </div>
            </div>

            {formMsg && (
              <div
                className="rounded-md border px-3 py-2"
                style={{
                  borderColor: TONE_STYLES[formMsg.tone].border,
                  backgroundColor: `${TONE_STYLES[formMsg.tone].border}14`,
                }}
              >
                <FieldHint message={formMsg} />
              </div>
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
          </form>
          <p className="text-center text-xs text-muted-foreground mt-3">
            جاهز لإنجاز اليوم؟
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
