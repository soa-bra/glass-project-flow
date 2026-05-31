-- جدول روابط الدعوة المؤقتة
CREATE TABLE public.board_invite_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    created_by UUID NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول طلبات الانضمام
CREATE TABLE public.board_join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    invite_link_id UUID NOT NULL REFERENCES public.board_invite_links(id) ON DELETE CASCADE,
    requester_name TEXT NOT NULL,
    requester_session_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    granted_role TEXT CHECK (granted_role IN ('editor', 'commenter', 'viewer')),
    processed_by UUID,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.board_invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_join_requests ENABLE ROW LEVEL SECURITY;

-- سياسات board_invite_links
CREATE POLICY "Hosts can manage invite links"
ON public.board_invite_links
FOR ALL
USING (user_has_board_role(board_id, auth.uid(), 'host'::board_role));

CREATE POLICY "Anyone can view active invite links by token"
ON public.board_invite_links
FOR SELECT
USING (is_active = true);

-- سياسات board_join_requests
CREATE POLICY "Hosts can manage join requests"
ON public.board_join_requests
FOR ALL
USING (
    board_id IN (
        SELECT id FROM public.boards WHERE owner_id = auth.uid()
    )
);

CREATE POLICY "Anyone can create join requests"
ON public.board_join_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view their own requests by session"
ON public.board_join_requests
FOR SELECT
USING (true);

-- تفعيل Realtime للإشعارات
ALTER PUBLICATION supabase_realtime ADD TABLE public.board_join_requests;