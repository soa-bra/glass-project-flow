import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

export type BoardInviteRole = 'viewer' | 'editor' | 'commenter';
export type BoardEmailInviteStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

export interface BoardEmailInvite {
  id: string;
  board_id: string;
  email: string;
  role: BoardInviteRole;
  status: BoardEmailInviteStatus;
  invited_by: string;
  created_at: string;
  accepted_at: string | null;
}

export interface InviteLink {
  id: string;
  board_id: string;
  token: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface JoinRequest {
  id: string;
  board_id: string;
  invite_link_id: string;
  requester_name: string;
  requester_session_id: string;
  status: 'pending' | 'approved' | 'rejected';
  granted_role: BoardInviteRole | null;
  created_at: string;
}

interface UseBoardInvitesOptions {
  boardId: string | null;
  isHost: boolean;
}

interface SendEmailInviteInput {
  email: string;
  role: BoardInviteRole;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isValidEmail = (email: string) => EMAIL_PATTERN.test(normalizeEmail(email));

export const useBoardInvites = ({ boardId, isHost }: UseBoardInvitesOptions) => {
  const [activeLink, setActiveLink] = useState<InviteLink | null>(null);
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
  const [recentEmailInvites, setRecentEmailInvites] = useState<BoardEmailInvite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emailInviteError, setEmailInviteError] = useState<string | null>(null);
  const [emailInviteSuccess, setEmailInviteSuccess] = useState<string | null>(null);

  // جلب الرابط النشط لمسارات legacy فقط؛ تجربة الدعوة الأساسية تستخدم البريد.
  const fetchActiveLink = useCallback(async () => {
    if (!boardId) return;
    
    const { data, error } = await supabase
      .from('board_invite_links')
      .select('*')
      .eq('board_id', boardId)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching invite link:', error);
      return;
    }

    setActiveLink(data);
  }, [boardId]);

  // جلب الدعوات البريدية الأخيرة للمضيف.
  const fetchRecentEmailInvites = useCallback(async () => {
    if (!boardId || !isHost) return;

    const { data, error } = await (supabase as any)
      .from('board_email_invites')
      .select('*')
      .eq('board_id', boardId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching board email invites:', error);
      return;
    }

    setRecentEmailInvites(((data || []) as unknown) as BoardEmailInvite[]);
  }, [boardId, isHost]);

  // جلب طلبات الانضمام المعلقة
  const fetchPendingRequests = useCallback(async () => {
    if (!boardId || !isHost) return;

    const { data, error } = await supabase
      .from('board_join_requests')
      .select('*')
      .eq('board_id', boardId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching join requests:', error);
      return;
    }

    setPendingRequests((data || []) as JoinRequest[]);
  }, [boardId, isHost]);

  const sendEmailInvite = useCallback(async ({ email, role }: SendEmailInviteInput) => {
    setEmailInviteError(null);
    setEmailInviteSuccess(null);

    if (!boardId) {
      const message = 'لا توجد لوحة نشطة لإرسال الدعوة';
      setEmailInviteError(message);
      toast.error(message);
      return null;
    }

    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      const message = 'يرجى إدخال بريد إلكتروني صالح';
      setEmailInviteError(message);
      toast.error(message);
      return null;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const message = 'يجب تسجيل الدخول أولاً';
        setEmailInviteError(message);
        toast.error(message);
        return null;
      }

      const { data, error } = await (supabase as any)
        .from('board_email_invites')
        .insert({
          board_id: boardId,
          email: normalizedEmail,
          role,
          invited_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending board email invite:', error);
        const message = 'فشل في حفظ الدعوة';
        setEmailInviteError(message);
        toast.error(message);
        return null;
      }

      const invite = (data as unknown) as BoardEmailInvite;
      setRecentEmailInvites(prev => [invite, ...prev.filter(item => item.id !== invite.id)].slice(0, 10));
      const message = 'تم تسجيل الدعوة. يحتاج إرسال البريد الفعلي إلى تكامل بريد.';
      setEmailInviteSuccess(message);
      toast.success(message);
      return invite;
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  // إنشاء رابط دعوة جديد لمسارات legacy الخارجية فقط.
  const createInviteLink = useCallback(async () => {
    if (!boardId) return null;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('يجب تسجيل الدخول أولاً');
        return null;
      }

      // إلغاء أي روابط سابقة
      await supabase
        .from('board_invite_links')
        .update({ is_active: false })
        .eq('board_id', boardId);

      // إنشاء رابط جديد
      const token = nanoid(12);
      const { data, error } = await supabase
        .from('board_invite_links')
        .insert({
          board_id: boardId,
          token,
          created_by: user.id,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating invite link:', error);
        toast.error('فشل في إنشاء رابط الدعوة');
        return null;
      }

      setActiveLink(data);
      toast.success('تم إنشاء رابط الدعوة');
      return data;
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  // إلغاء رابط الدعوة (عند إغلاق الجلسة) لمسارات legacy الخارجية فقط.
  const deactivateLink = useCallback(async () => {
    if (!activeLink) return;

    const { error } = await supabase
      .from('board_invite_links')
      .update({ is_active: false })
      .eq('id', activeLink.id);

    if (error) {
      console.error('Error deactivating link:', error);
      return;
    }

    setActiveLink(null);
    toast.info('تم إلغاء رابط الدعوة');
  }, [activeLink]);

  // معالجة طلب الانضمام (موافقة/رفض)
  const handleJoinRequest = useCallback(async (
    requestId: string, 
    action: 'approved' | 'rejected',
    role?: BoardInviteRole
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updateData: {
      status: string;
      processed_by: string;
      processed_at: string;
      granted_role?: string;
    } = {
      status: action,
      processed_by: user.id,
      processed_at: new Date().toISOString(),
    };

    if (action === 'approved' && role) {
      updateData.granted_role = role;
    }

    const { error } = await supabase
      .from('board_join_requests')
      .update(updateData)
      .eq('id', requestId);

    if (error) {
      console.error('Error handling join request:', error);
      toast.error('فشل في معالجة الطلب');
      return;
    }

    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    toast.success(action === 'approved' ? 'تم قبول الطلب' : 'تم رفض الطلب');
  }, []);

  // الاشتراك في التحديثات الفورية لطلبات الانضمام
  useEffect(() => {
    if (!boardId || !isHost) return;

    const channel = supabase
      .channel(`join-requests-${boardId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'board_join_requests',
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          const newRequest = payload.new as JoinRequest;
          if (newRequest.status === 'pending') {
            setPendingRequests(prev => [newRequest, ...prev]);
            toast.info(`${newRequest.requester_name} يطلب الانضمام`, {
              duration: 10000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, isHost]);

  // جلب البيانات عند التحميل
  useEffect(() => {
    fetchActiveLink();
    fetchPendingRequests();
    fetchRecentEmailInvites();
  }, [fetchActiveLink, fetchPendingRequests, fetchRecentEmailInvites]);

  // الحصول على رابط كامل لمسارات legacy الخارجية فقط.
  const getInviteUrl = useCallback(() => {
    if (!activeLink) return null;
    return `${window.location.origin}/join/${activeLink.token}`;
  }, [activeLink]);

  return {
    activeLink,
    pendingRequests,
    recentEmailInvites,
    isLoading,
    emailInviteError,
    emailInviteSuccess,
    sendEmailInvite,
    createInviteLink,
    deactivateLink,
    handleJoinRequest,
    getInviteUrl,
    refetch: () => {
      fetchActiveLink();
      fetchPendingRequests();
      fetchRecentEmailInvites();
    },
  };
};
