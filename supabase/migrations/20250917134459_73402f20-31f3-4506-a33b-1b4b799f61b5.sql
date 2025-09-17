-- إنشاء جداول الفواتير والمدفوعات

-- إنشاء نوع enum لحالة الفاتورة
CREATE TYPE invoice_status AS ENUM ('draft', 'pending', 'paid', 'overdue');

-- إنشاء نوع enum لنوع الخدمة
CREATE TYPE service_type AS ENUM (
  'brand_strategy',
  'visual_identity', 
  'digital_marketing',
  'content_creation',
  'market_research',
  'consulting',
  'training',
  'other'
);

-- جدول الفواتير الرئيسي
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_address TEXT,
  project_id UUID,
  service_type service_type NOT NULL,
  service_description TEXT,
  
  -- المبالغ المالية
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 15.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- معلومات الدفع
  payment_terms INTEGER DEFAULT 30, -- أيام الدفع
  total_payments INTEGER DEFAULT 1,
  
  -- التواريخ
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  paid_date DATE,
  
  -- الحالة
  status invoice_status NOT NULL DEFAULT 'draft',
  
  -- معلومات إضافية
  notes TEXT,
  terms_conditions TEXT,
  
  -- معلومات النظام
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول بنود الفاتورة
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  item_description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول الدفعات
CREATE TABLE public.invoice_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  payment_number INTEGER NOT NULL,
  payment_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  paid_date DATE,
  payment_method TEXT,
  transaction_reference TEXT,
  notes TEXT,
  
  status invoice_status NOT NULL DEFAULT 'pending',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تمكين RLS على الجداول
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان - الفواتير
CREATE POLICY "المستخدمون يمكنهم إنشاء فواتيرهم الخاصة"
  ON public.invoices FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "المستخدمون يمكنهم عرض فواتيرهم الخاصة"
  ON public.invoices FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "المستخدمون يمكنهم تحديث فواتيرهم الخاصة"
  ON public.invoices FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "المستخدمون يمكنهم حذف فواتيرهم الخاصة"
  ON public.invoices FOR DELETE
  USING (auth.uid() = owner_id);

-- سياسات الأمان - بنود الفاتورة
CREATE POLICY "المستخدمون يمكنهم إدارة بنود فواتيرهم"
  ON public.invoice_items FOR ALL
  USING (
    invoice_id IN (
      SELECT id FROM public.invoices WHERE owner_id = auth.uid()
    )
  );

-- سياسات الأمان - الدفعات
CREATE POLICY "المستخدمون يمكنهم إدارة مدفوعات فواتيرهم"
  ON public.invoice_payments FOR ALL
  USING (
    invoice_id IN (
      SELECT id FROM public.invoices WHERE owner_id = auth.uid()
    )
  );

-- إنشاء فهارس للأداء
CREATE INDEX idx_invoices_owner_id ON public.invoices(owner_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX idx_invoice_payments_invoice_id ON public.invoice_payments(invoice_id);

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء triggers للتحديث التلقائي
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_items_updated_at
    BEFORE UPDATE ON public.invoice_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_payments_updated_at
    BEFORE UPDATE ON public.invoice_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إنشاء دالة لحساب إجمالي الفاتورة تلقائياً
CREATE OR REPLACE FUNCTION calculate_invoice_total()
RETURNS TRIGGER AS $$
BEGIN
    -- تحديث إجمالي الفاتورة بناءً على البنود
    UPDATE public.invoices 
    SET 
        subtotal = (
            SELECT COALESCE(SUM(total_price), 0) 
            FROM public.invoice_items 
            WHERE invoice_id = NEW.invoice_id
        ),
        tax_amount = ROUND(
            (SELECT COALESCE(SUM(total_price), 0) 
             FROM public.invoice_items 
             WHERE invoice_id = NEW.invoice_id) * (tax_rate / 100), 2
        )
    WHERE id = NEW.invoice_id;
    
    -- تحديث المبلغ الإجمالي
    UPDATE public.invoices 
    SET total_amount = subtotal + tax_amount
    WHERE id = NEW.invoice_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تطبيق trigger لحساب الإجمالي
CREATE TRIGGER calculate_invoice_total_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items
    FOR EACH ROW EXECUTE FUNCTION calculate_invoice_total();

-- دالة لإنشاء رقم فاتورة تلقائي
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := 'INV-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                              LPAD(
                                  (COALESCE(
                                      (SELECT MAX(CAST(SPLIT_PART(invoice_number, '-', 3) AS INTEGER))
                                       FROM public.invoices 
                                       WHERE invoice_number LIKE 'INV-' || EXTRACT(YEAR FROM NOW()) || '-%'
                                      ), 0
                                  ) + 1)::TEXT, 
                                  4, '0'
                              );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تطبيق trigger لإنشاء رقم الفاتورة
CREATE TRIGGER generate_invoice_number_trigger
    BEFORE INSERT ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();