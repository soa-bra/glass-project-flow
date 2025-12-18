-- إضافة نوع 'smart' إلى board_object_type enum
ALTER TYPE public.board_object_type ADD VALUE IF NOT EXISTS 'smart';

-- إنشاء جدول العناصر الذكية
CREATE TABLE public.smart_element_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_object_id UUID NOT NULL REFERENCES public.board_objects(id) ON DELETE CASCADE,
    smart_type TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- فهرس فريد لضمان عنصر ذكي واحد لكل كائن لوحة
    UNIQUE(board_object_id)
);

-- إنشاء فهارس للأداء
CREATE INDEX idx_smart_element_data_board_object_id ON public.smart_element_data(board_object_id);
CREATE INDEX idx_smart_element_data_smart_type ON public.smart_element_data(smart_type);
CREATE INDEX idx_smart_element_data_data ON public.smart_element_data USING GIN(data);

-- تفعيل Row Level Security
ALTER TABLE public.smart_element_data ENABLE ROW LEVEL SECURITY;

-- سياسة العرض: المستخدمون المصرح لهم يمكنهم عرض بيانات العناصر الذكية
CREATE POLICY "Users can view smart element data"
ON public.smart_element_data
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.board_objects bo
        WHERE bo.id = smart_element_data.board_object_id
        AND user_has_board_role(bo.board_id, auth.uid(), 'viewer'::board_role)
    )
);

-- سياسة الإنشاء: المحررون يمكنهم إنشاء بيانات العناصر الذكية
CREATE POLICY "Editors can create smart element data"
ON public.smart_element_data
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.board_objects bo
        WHERE bo.id = smart_element_data.board_object_id
        AND user_has_board_role(bo.board_id, auth.uid(), 'editor'::board_role)
    )
);

-- سياسة التحديث: المحررون يمكنهم تحديث بيانات العناصر الذكية
CREATE POLICY "Editors can update smart element data"
ON public.smart_element_data
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.board_objects bo
        WHERE bo.id = smart_element_data.board_object_id
        AND user_has_board_role(bo.board_id, auth.uid(), 'editor'::board_role)
    )
);

-- سياسة الحذف: المحررون يمكنهم حذف بيانات العناصر الذكية
CREATE POLICY "Editors can delete smart element data"
ON public.smart_element_data
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.board_objects bo
        WHERE bo.id = smart_element_data.board_object_id
        AND user_has_board_role(bo.board_id, auth.uid(), 'editor'::board_role)
    )
);

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE TRIGGER update_smart_element_data_updated_at
BEFORE UPDATE ON public.smart_element_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();