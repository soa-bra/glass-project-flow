import React, { useState } from 'react';
import { Receipt, FileText, ExternalLink, CreditCard, Edit, Download } from 'lucide-react';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { buildTitleClasses, COLORS, TYPOGRAPHY, SPACING } from '@/components/shared/design-system/constants';
import { Reveal } from '@/components/shared/motion';
import { cn } from '@/lib/utils';
import { formatCurrency, getStatusText } from './utils';
import { ClientInfoBox, getClientData } from './ClientInfoBox';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { downloadAsCSV } from '../shared/downloadUtils';
import { toast } from 'sonner';
import { useInvoices, useCreateInvoice, useUpdateInvoice } from '@/hooks/useInvoices';

export const InvoicesTab: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const { data: invoices = [], isLoading, error } = useInvoices();
  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoice();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [viewingInvoice, setViewingInvoice] = useState<any>(null);

  const createFields: FormField[] = [
    { name: 'client', label: 'اسم العميل', type: 'text', required: true, placeholder: 'أدخل اسم العميل' },
    { name: 'projectName', label: 'اسم المشروع', type: 'text', required: true, placeholder: 'أدخل اسم المشروع' },
    { name: 'totalAmount', label: 'المبلغ الإجمالي', type: 'number', required: true, placeholder: '0' },
    { name: 'paymentAmount', label: 'مبلغ الدفعة', type: 'number', required: true, placeholder: '0' },
    { name: 'dueDate', label: 'تاريخ الاستحقاق', type: 'date', required: true },
    { name: 'status', label: 'الحالة', type: 'select', required: true, options: [
      { value: 'draft', label: 'مسودة' },
      { value: 'pending', label: 'معلقة' },
      { value: 'paid', label: 'مدفوعة' },
    ]},
    { name: 'notes', label: 'ملاحظات', type: 'textarea', placeholder: 'ملاحظات إضافية...' },
  ];

  const handleCreateInvoice = (data: Record<string, string>) => {
    const newInvoice = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      client: data.client,
      projectId: `PRJ-${Date.now().toString().slice(-3)}`,
      projectName: data.projectName,
      totalAmount: Number(data.totalAmount),
      paymentAmount: Number(data.paymentAmount),
      paymentNumber: 1,
      totalPayments: 1,
      paymentPercentage: (Number(data.paymentAmount) / Number(data.totalAmount)) * 100,
      dueDate: data.dueDate,
      status: data.status as any,
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const handleEditInvoice = (data: Record<string, string>) => {
    if (!editingInvoice) return;
    setInvoices(prev => prev.map(inv => 
      inv.id === editingInvoice.id ? {
        ...inv,
        client: data.client,
        projectName: data.projectName,
        totalAmount: Number(data.totalAmount),
        paymentAmount: Number(data.paymentAmount),
        dueDate: data.dueDate,
        status: data.status as any,
        paymentPercentage: (Number(data.paymentAmount) / Number(data.totalAmount)) * 100,
      } : inv
    ));
    setEditingInvoice(null);
  };

  const handleDownloadInvoice = (invoice: any) => {
    downloadAsCSV(
      ['رقم الفاتورة', 'العميل', 'المشروع', 'المبلغ', 'الدفعة', 'الاستحقاق', 'الحالة'],
      [[invoice.id, invoice.client, invoice.projectName, String(invoice.totalAmount), String(invoice.paymentAmount), invoice.dueDate, getStatusText(invoice.status)]],
      `فاتورة-${invoice.id}`
    );
    toast.success(`تم تنزيل الفاتورة ${invoice.id}`);
  };

  const getInvoiceStatusVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      case 'draft': return 'info';
      default: return 'default';
    }
  };

  const handleClientClick = (clientName: string) => {
    const clientData = getClientData(clientName);
    setSelectedClient(clientData);
  };

  const handleProjectClick = (projectName: string) => {
    toast.info(`الانتقال إلى مشروع: ${projectName}`);
  };

  const editFields = editingInvoice ? createFields.map(f => ({
    ...f,
    defaultValue: String(editingInvoice[f.name] || ''),
  })) : createFields;

  return (
    <BaseTabContent value="invoices">
      <Reveal>
        <div className={cn('flex justify-between items-center', SPACING.SECTION_MARGIN)}>
          <h3 className={buildTitleClasses()}>الفواتير والمدفوعات</h3>
          <BaseActionButton variant="primary" icon={<Receipt className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
            إنشاء فاتورة
          </BaseActionButton>
        </div>
      </Reveal>

      <BaseBox title="جدول الفواتير">
        <div className="grid grid-cols-2 gap-4">
          {invoices.map(invoice => (
            <Reveal key={invoice.id} delay={0.1}>
              <div className={cn(
                'flex items-center justify-between p-4 rounded-lg',
                COLORS.BORDER_COLOR,
                'bg-transparent border'
              )}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(TYPOGRAPHY.BODY, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                        {invoice.id}
                      </h4>
                    </div>
                    <button 
                      onClick={() => handleClientClick(invoice.client)}
                      className={cn(TYPOGRAPHY.SMALL, COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT, 'hover:text-blue-600 hover:underline transition-colors')}
                    >
                      {invoice.client}
                    </button>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleProjectClick(invoice.projectName)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-arabic flex items-center gap-1 hover:underline"
                      >
                        <span>{invoice.projectName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <p className={cn(TYPOGRAPHY.SMALL, 'text-gray-400')}>
                      تاريخ الاستحقاق: {invoice.dueDate}
                    </p>
                  </div>
                </div>
                <div className="text-left space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className={cn(TYPOGRAPHY.SMALL, 'text-gray-500')}>إجمالي المبلغ:</p>
                      <p className={cn(TYPOGRAPHY.BODY, 'font-bold', COLORS.PRIMARY_TEXT)}>
                        {formatCurrency(invoice.totalAmount)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className={cn(TYPOGRAPHY.SMALL, 'text-gray-500')}>مبلغ الدفعة:</p>
                      <p className={cn(TYPOGRAPHY.SMALL, 'font-semibold', COLORS.PRIMARY_TEXT)}>
                        {formatCurrency(invoice.paymentAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className={cn(TYPOGRAPHY.SMALL, 'text-gray-500')}>رقم الدفعة:</p>
                      <p className={cn(TYPOGRAPHY.SMALL, 'font-medium')}>
                        {invoice.paymentNumber} / {invoice.totalPayments}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className={cn(TYPOGRAPHY.SMALL, 'text-gray-500')}>نسبة الدفع:</p>
                      <p className={cn(TYPOGRAPHY.SMALL, 'font-medium', 'text-green-600')}>
                        {invoice.paymentPercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <BaseBadge variant={getInvoiceStatusVariant(invoice.status)} size="sm">
                      {getStatusText(invoice.status)}
                    </BaseBadge>
                    <div className="flex items-center gap-2">
                      <BaseActionButton variant="edit" size="sm" icon={<Edit className="w-4 h-4" />} onClick={() => setEditingInvoice(invoice)} />
                      <BaseActionButton variant="download" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => handleDownloadInvoice(invoice)} />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </BaseBox>

      {selectedClient && (
        <Reveal>
          <ClientInfoBox client={selectedClient} onClose={() => setSelectedClient(null)} />
        </Reveal>
      )}

      <GenericFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="إنشاء فاتورة جديدة"
        fields={createFields}
        onSubmit={handleCreateInvoice}
        submitLabel="إنشاء الفاتورة"
        successMessage="تم إنشاء الفاتورة بنجاح"
      />

      {editingInvoice && (
        <GenericFormModal
          isOpen={!!editingInvoice}
          onClose={() => setEditingInvoice(null)}
          title={`تعديل الفاتورة ${editingInvoice.id}`}
          fields={editFields}
          onSubmit={handleEditInvoice}
          submitLabel="حفظ التعديلات"
          successMessage="تم تحديث الفاتورة بنجاح"
        />
      )}
    </BaseTabContent>
  );
};
