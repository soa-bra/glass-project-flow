import React, { useEffect, useState } from 'react';
import { Bot, CheckCircle2, Loader2, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { SmartAssistantGatewayResponse } from '../services/aiGateway.client';
import type { SmartAssistantCommand } from '../hooks/useSmartAssistant';

interface SoaBraAIAssistantProps {
  open: boolean;
  command: SmartAssistantCommand | null;
  result: SmartAssistantGatewayResponse | null;
  isLoading?: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isMobile;
}

const AssistantBody: React.FC<Pick<SoaBraAIAssistantProps, 'command' | 'result' | 'isLoading' | 'error'>> = ({
  command,
  result,
  isLoading = false,
  error,
}) => (
  <div className="flex h-full flex-col gap-4 overflow-y-auto px-1 pb-6 text-right font-arabic" dir="rtl">
    <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
        <ShieldCheck className="h-4 w-4" />
        تنفيذ آمن بالموافقة البشرية
      </div>
      <p className="mt-2 text-sm leading-6 text-blue-900/75">
        المساعد يعرض تحليلات ومسودات فقط. أي إجراء تشغيلي يبقى محميًا بتأكيد منفصل قبل الإرسال إلى بوابة الذكاء الاصطناعي.
      </p>
    </div>

    {command && (
      <section className="rounded-3xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-primary/10 p-2 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">{command.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{command.description}</p>
          </div>
        </div>
      </section>
    )}

    {isLoading && (
      <div className="flex items-center justify-center gap-2 rounded-3xl border border-dashed border-border p-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        جارٍ تشغيل الأمر عبر بوابة الذكاء الاصطناعي…
      </div>
    )}

    {error && (
      <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm leading-6 text-destructive">
        {error}
      </div>
    )}

    {result && !isLoading && (
      <section className="space-y-4 rounded-3xl border border-border bg-white p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            النتيجة المقترحة
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{result.summary}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">التوصيات</h4>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
            {result.recommendations.map((recommendation) => (
              <li key={recommendation} className="rounded-2xl bg-muted/40 p-3">{recommendation}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">إجراءات تحتاج اعتمادًا يدويًا</h4>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
            {result.proposedActions.map((action) => (
              <li key={action} className="rounded-2xl border border-border p-3">{action}</li>
            ))}
          </ul>
        </div>
      </section>
    )}
  </div>
);

export const SoaBraAIAssistant: React.FC<SoaBraAIAssistantProps> = (props) => {
  const isMobile = useIsMobile();
  const title = props.command?.title ?? 'مساعد SoaBra الذكي';

  if (isMobile) {
    return (
      <Drawer open={props.open} onOpenChange={props.onOpenChange}>
        <DrawerContent className="max-h-[88vh] px-4" dir="rtl">
          <DrawerHeader className="text-right font-arabic">
            <DrawerTitle className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2"><Bot className="h-5 w-5" />{title}</span>
              <Button variant="ghost" size="icon" onClick={() => props.onOpenChange(false)} aria-label="إغلاق المساعد">
                <X className="h-4 w-4" />
              </Button>
            </DrawerTitle>
            <DrawerDescription>Bottom Sheet للمراجعة السريعة على الجوال.</DrawerDescription>
          </DrawerHeader>
          <AssistantBody {...props} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="right" className="w-full overflow-hidden p-6 sm:max-w-xl" dir="rtl">
        <SheetHeader className="mb-5 text-right font-arabic">
          <SheetTitle className="flex items-center gap-2 text-right"><Bot className="h-5 w-5" />{title}</SheetTitle>
          <SheetDescription>Sidebar مكتبي لنتائج أوامر الذكاء الاصطناعي ومقترحاتها.</SheetDescription>
        </SheetHeader>
        <AssistantBody {...props} />
      </SheetContent>
    </Sheet>
  );
};
