/**
 * InvoiceForm Widget
 * نموذج إنشاء وتعديل الفواتير
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, XCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { 
  Invoice, 
  InvoiceFormData, 
  InvoiceLine,
  calculateTotal,
  VAT_RATE,
} from '../../domain';
import { formatCurrency } from '@/shared';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const emptyLine = (): InvoiceLine => ({
  description: '',
  quantity: 1,
  unitPrice: 0,
  taxCode: 'VAT15',
});

export function InvoiceForm({ invoice, onSubmit, onCancel, loading }: InvoiceFormProps) {
  const isEdit = !!invoice;
  
  const [formData, setFormData] = useState<InvoiceFormData>({
    accountId: invoice?.accountId || '',
    accountName: invoice?.accountName || '',
    projectId: invoice?.projectId || '',
    dueDate: invoice?.dueDate 
      ? (typeof invoice.dueDate === 'string' ? invoice.dueDate : format(invoice.dueDate, 'yyyy-MM-dd'))
      : '',
    lines: invoice?.lines?.length 
      ? invoice.lines.map(l => ({
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          taxCode: l.taxCode,
        }))
      : [emptyLine()],
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.dueDate ? new Date(formData.dueDate) : undefined
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate totals
  const subtotal = formData.lines.reduce(
    (sum, line) => sum + (line.quantity * line.unitPrice), 
    0
  );
  const tax = subtotal * VAT_RATE;
  const total = subtotal + tax;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({ ...prev, dueDate: format(date, 'yyyy-MM-dd') }));
    }
  };

  const addLine = () => {
    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, emptyLine()],
    }));
  };

  const removeLine = (index: number) => {
    if (formData.lines.length > 1) {
      setFormData(prev => ({
        ...prev,
        lines: prev.lines.filter((_, i) => i !== index),
      }));
    }
  };

  const updateLine = (index: number, field: keyof InvoiceLine, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      ),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'اسم العميل مطلوب';
    }
    
    const validLines = formData.lines.filter(
      l => l.description.trim() && l.quantity > 0 && l.unitPrice > 0
    );
    
    if (validLines.length === 0) {
      newErrors.lines = 'يجب إضافة بند واحد على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    await onSubmit(formData);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accountName">اسم العميل *</Label>
          <Input
            id="accountName"
            value={formData.accountName}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              accountName: e.target.value,
              accountId: prev.accountId || `account-${Date.now()}`,
            }))}
            placeholder="أدخل اسم العميل"
            className={errors.accountName ? 'border-destructive' : ''}
          />
          {errors.accountName && (
            <p className="text-xs text-destructive">{errors.accountName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>تاريخ الاستحقاق</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-right font-normal',
                  !selectedDate && 'text-muted-foreground'
                )}
              >
                <Calendar className="ml-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, 'PPP', { locale: ar })
                ) : (
                  <span>اختر التاريخ</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className="p-3 pointer-events-auto"
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Project (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="projectId">رقم المشروع (اختياري)</Label>
        <Input
          id="projectId"
          value={formData.projectId}
          onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
          placeholder="أدخل رقم المشروع إن وجد"
        />
      </div>

      {/* Invoice Lines */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>بنود الفاتورة *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addLine}>
            <Plus className="w-4 h-4 ml-1" />
            إضافة بند
          </Button>
        </div>

        {errors.lines && (
          <p className="text-xs text-destructive">{errors.lines}</p>
        )}

        <div className="space-y-3">
          {formData.lines.map((line, index) => (
            <motion.div 
              key={index}
              className="grid grid-cols-12 gap-2 items-end p-3 bg-muted/50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="col-span-5">
                <Label className="text-xs text-muted-foreground">الوصف</Label>
                <Input
                  placeholder="وصف البند"
                  value={line.description}
                  onChange={(e) => updateLine(index, 'description', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground">الكمية</Label>
                <Input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => updateLine(index, 'quantity', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground">السعر</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={line.unitPrice}
                  onChange={(e) => updateLine(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-2 text-center">
                <Label className="text-xs text-muted-foreground">المجموع</Label>
                <p className="text-sm font-medium py-2">
                  {formatCurrency(line.quantity * line.unitPrice)}
                </p>
              </div>
              <div className="col-span-1 flex justify-center">
                {formData.lines.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLine(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ضريبة القيمة المضافة ({VAT_RATE * 100}%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>الإجمالي</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء الفاتورة'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </motion.form>
  );
}
