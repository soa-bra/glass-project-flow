import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanningStore } from '@/stores/planningStore';
import { PageMeta } from '@/components/seo/PageMeta';

/**
 * Public entry point for board deep links.
 *
 * Two flows land here:
 *  1. Guests approved via `/join/:token` — arrive with
 *     `?guest=true&session=...&role=...`. They are not authenticated;
 *     access is scoped by the join-request row.
 *  2. Authenticated members opening a board by id.
 *
 * The page attempts to load the board and hand off to the standard
 * planning workspace. If the board cannot be loaded (RLS, missing row,
 * no session), a clear message is shown instead of a 404.
 */
const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { setCurrentBoard } = usePlanningStore();

  const isGuest = searchParams.get('guest') === 'true';
  const [state, setState] = useState<'loading' | 'ready' | 'unauthorized' | 'not_found' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!boardId) {
      setState('not_found');
      return;
    }

    // Authenticated users: try to load from planning_boards and hand off
    // to the main workspace which reads currentBoard from the store.
    if (user && !isGuest) {
      (async () => {
        const { data, error } = await supabase
          .from('planning_boards')
          .select('*')
          .eq('id', boardId)
          .maybeSingle();

        if (error) {
          setErrorMsg(error.message);
          setState('error');
          return;
        }
        if (!data) {
          setState('not_found');
          return;
        }

        setCurrentBoard({
          id: data.id,
          name: data.name,
          description: data.description ?? undefined,
          type: 'blank',
          status: data.state === 'archived' ? 'archived' : data.state === 'draft' ? 'draft' : 'active',
          lastModified: new Date(data.updated_at),
          createdAt: new Date(data.created_at),
          owner: data.owner_id,
        });
        navigate('/', { replace: true });
      })();
      return;
    }

    // Guest flow: no auth session available for reads. We can't safely
    // hydrate the full canvas without a dedicated guest-session RPC, so
    // show a clear message instead of routing into a broken canvas.
    setState(isGuest ? 'unauthorized' : 'unauthorized');
  }, [authLoading, boardId, isGuest, user, setCurrentBoard, navigate]);

  return (
    <div className="min-h-screen bg-sb-panel-bg flex items-center justify-center p-4" dir="rtl">
      <PageMeta title="فتح اللوحة" description="فتح جلسة اللوحة" path={`/board/${boardId ?? ''}`} />
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-8 text-center">
        {state === 'loading' && (
          <>
            <Loader2 size={40} className="mx-auto text-sb-ink-40 animate-spin mb-4" />
            <p className="text-[14px] text-sb-ink-60">جاري فتح اللوحة...</p>
          </>
        )}

        {state === 'not_found' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFE1E0] flex items-center justify-center">
              <AlertCircle size={32} className="text-[#E5564D]" />
            </div>
            <h2 className="text-[18px] font-bold text-sb-ink mb-2">اللوحة غير موجودة</h2>
            <p className="text-[13px] text-sb-ink-60 mb-6">قد تكون اللوحة قد حُذفت أو أن الرابط غير صحيح.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 text-[13px] font-medium text-sb-ink bg-sb-panel-bg rounded-xl hover:bg-sb-ink-20 transition-colors"
            >
              العودة للرئيسية
            </button>
          </>
        )}

        {state === 'unauthorized' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sb-panel-bg flex items-center justify-center">
              <LogIn size={28} className="text-sb-ink" />
            </div>
            <h2 className="text-[18px] font-bold text-sb-ink mb-2">
              {isGuest ? 'تم قبول طلبك' : 'يلزم تسجيل الدخول'}
            </h2>
            <p className="text-[13px] text-sb-ink-60 mb-6">
              {isGuest
                ? 'تم قبول طلب انضمامك للوحة. الوصول كضيف للجلسة المباشرة غير متاح حالياً في هذا الإصدار — يُرجى تسجيل الدخول أو التواصل مع المستضيف.'
                : 'يجب تسجيل الدخول لعرض هذه اللوحة.'}
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2.5 text-[13px] font-medium text-white bg-sb-ink rounded-xl hover:opacity-90 transition-opacity"
            >
              تسجيل الدخول
            </button>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFE1E0] flex items-center justify-center">
              <AlertCircle size={32} className="text-[#E5564D]" />
            </div>
            <h2 className="text-[18px] font-bold text-sb-ink mb-2">تعذّر فتح اللوحة</h2>
            {errorMsg && (
              <p className="mt-3 mb-4 rounded-lg bg-red-50 px-3 py-2 font-mono text-xs text-red-800" dir="ltr">
                {errorMsg}
              </p>
            )}
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 text-[13px] font-medium text-sb-ink bg-sb-panel-bg rounded-xl hover:bg-sb-ink-20 transition-colors"
            >
              العودة للرئيسية
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BoardPage;
