import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';
import { Loader2, Link2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface InviteLink {
  id: string;
  board_id: string;
  is_active: boolean;
}

interface JoinRequest {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  granted_role: string | null;
}

export const JoinBoardPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'loading' | 'input' | 'pending' | 'approved' | 'rejected' | 'invalid'>('loading');
  const [inviteLink, setInviteLink] = useState<InviteLink | null>(null);
  const [guestName, setGuestName] = useState('');
  const [sessionId] = useState(() => nanoid(16));
  const [joinRequest, setJoinRequest] = useState<JoinRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // التحقق من صلاحية الرابط
  useEffect(() => {
    const checkInviteLink = async () => {
      if (!token) {
        setStatus('invalid');
        return;
      }

      // Use secure RPC function to validate token (prevents token enumeration)
      const { data, error } = await supabase
        .rpc('validate_board_invite_token', { token_input: token })
        .maybeSingle();

      if (error || !data || !data.is_valid) {
        setStatus('invalid');
        return;
      }

      // Construct invite link from validated RPC response
      setInviteLink({
        id: data.invite_link_id,
        board_id: data.board_id,
        is_active: true
      });
      setStatus('input');
    };

    checkInviteLink();
  }, [token]);

  // الاشتراك في تحديثات حالة الطلب
  useEffect(() => {
    if (!joinRequest) return;

    const channel = supabase
      .channel(`request-${joinRequest.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'board_join_requests',
          filter: `id=eq.${joinRequest.id}`,
        },
        (payload) => {
          const updated = payload.new as JoinRequest;
          setJoinRequest(updated);
          
          if (updated.status === 'approved') {
            setStatus('approved');
            toast.success('تم قبول طلبك!');
            // الانتقال للوحة بعد ثانيتين
            setTimeout(() => {
              navigate(`/board/${inviteLink?.board_id}?guest=true&session=${sessionId}&role=${updated.granted_role}`);
            }, 2000);
          } else if (updated.status === 'rejected') {
            setStatus('rejected');
            toast.error('تم رفض طلبك');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [joinRequest, inviteLink, sessionId, navigate]);

  // إرسال طلب الانضمام
  const submitJoinRequest = async () => {
    if (!guestName.trim() || !inviteLink) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('board_join_requests')
        .insert({
          board_id: inviteLink.board_id,
          invite_link_id: inviteLink.id,
          requester_name: guestName.trim(),
          requester_session_id: sessionId,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting join request:', error);
        toast.error('فشل في إرسال الطلب');
        return;
      }

      setJoinRequest(data as JoinRequest);
      setStatus('pending');
      toast.info('تم إرسال طلبك، في انتظار موافقة المستضيف');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && guestName.trim()) {
      submitJoinRequest();
    }
  };

  return (
    <div className="min-h-screen bg-sb-panel-bg flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-8">
        {status === 'loading' && (
          <div className="text-center py-8">
            <Loader2 size={40} className="mx-auto text-sb-ink-40 animate-spin mb-4" />
            <p className="text-[14px] text-sb-ink-60">جاري التحقق من الرابط...</p>
          </div>
        )}

        {status === 'invalid' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFE1E0] flex items-center justify-center">
              <AlertCircle size={32} className="text-[#E5564D]" />
            </div>
            <h2 className="text-[18px] font-bold text-sb-ink mb-2">رابط غير صالح</h2>
            <p className="text-[13px] text-sb-ink-60 mb-6">
              هذا الرابط غير صالح أو انتهت صلاحيته.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 text-[13px] font-medium text-sb-ink bg-sb-panel-bg rounded-xl hover:bg-sb-ink-20 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        )}

        {status === 'input' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sb-panel-bg flex items-center justify-center">
              <Link2 size={28} className="text-sb-ink" />
            </div>
            <h2 className="text-[18px] font-bold text-sb-ink mb-2">انضم للجلسة</h2>
            <p className="text-[13px] text-sb-ink-60 mb-6">
              أدخل اسمك للانضمام للجلسة
            </p>
            
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اسمك"
              autoFocus
              className="w-full px-4 py-3 text-[14px] text-center border border-sb-border rounded-xl focus:outline-none focus:border-sb-ink bg-white mb-4"
            />
            
            <button
              onClick={submitJoinRequest}
              disabled={!guestName.trim() || isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sb-ink text-white text-[14px] font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'طلب الانضمام'
              )}
            </button>
          </div>
        )}

        {status === 'pending' && (
          <div className="text-center py-8">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-[#F6C445]/20 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-[#FFF4CC] flex items-center justify-center">
                <Loader2 size={28} className="text-[#F6C445] animate-spin" />
              </div>
            </div>
            <h2 className="text-[18px] font-bold text-sb-ink mb-2">في انتظار الموافقة</h2>
            <p className="text-[13px] text-sb-ink-60">
              تم إرسال طلبك إلى المستضيف. سيتم إعلامك عند الموافقة.
            </p>
          </div>
        )}

        {status === 'approved' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#BFE7D5] flex items-center justify-center">
              <CheckCircle2 size={32} className="text-[#3DBE8B]" />
            </div>
            <h2 className="text-[18px] font-bold text-sb-ink mb-2">تم قبول طلبك!</h2>
            <p className="text-[13px] text-sb-ink-60">
              جاري توجيهك للجلسة...
            </p>
          </div>
        )}

        {status === 'rejected' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFE1E0] flex items-center justify-center">
              <XCircle size={32} className="text-[#E5564D]" />
            </div>
            <h2 className="text-[18px] font-bold text-sb-ink mb-2">تم رفض الطلب</h2>
            <p className="text-[13px] text-sb-ink-60 mb-6">
              عذراً، لم يتم قبول طلب الانضمام.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 text-[13px] font-medium text-sb-ink bg-sb-panel-bg rounded-xl hover:bg-sb-ink-20 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinBoardPage;
