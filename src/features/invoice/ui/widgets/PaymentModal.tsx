/**
 * PaymentModal Widget
 * نافذة تسجيل الدفعات
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, CreditCard, Building2, Banknote, FileText } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { Invoice, Payment } from '../../domain';
import { formatCurrency } from '@/shared';

interface PaymentModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (invoiceId: string, amount: number, method: string, notes?: string) => Promise<boolean>;
}

type PaymentMethod = 'bank_transfer' | 'cash' | 'check' | 'credit_card';

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethodOption[] = [
  { id: 'bank_transfer', label: 'تحويل بنكي', icon: <Building2 className="w-5 h-5" /> },
  { id: 'cash', label: 'نقداً', icon: <Banknote className="w-5 h-5" /> },
  { id: 'check', label: 'شيك', icon: <FileText className="w-5 h-5" /> },
  { id: 'credit_card', label: 'بطاقة ائتمان', icon: <CreditCard className="w-5 h-5" /> },
];

export function PaymentModal({ invoice, open, onOpenChange, onSubmit }: PaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const remaining = invoice ? invoice.total : 0;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'المبلغ مطلوب ويجب أن يكون أكبر من صفر';
    } else if (amountNum > remaining) {
      newErrors.amount = `المبلغ يتجاوز المتبقي (${formatCurrency(remaining)})`;
    }
    
    if (!method) {
      newErrors.method = 'اختر طريقة الدفع';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoice || !validate()) return;
    
    setLoading(true);
    try {
      const success = await onSubmit(
        invoice.id,
        parseFloat(amount),
        method,
        notes || undefined
      );
      
      if (success) {
        resetForm();
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setMethod('');
    setNotes('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const setFullAmount = () => {
    setAmount(remaining.toString());
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            تسجيل دفعة
          </DialogTitle>
          <DialogDescription>
            {invoice && `فاتورة رقم ${invoice.number}`}
          </DialogDescription>
        </DialogHeader>

        {invoice && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Invoice Summary */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">العميل</span>
                <span className="font-medium">{invoice.accountName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">إجمالي الفاتورة</span>
                <span className="font-medium">{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-muted-foreground">المتبقي</span>
                <span className="font-bold text-primary">{formatCurrency(remaining)}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="amount">المبلغ المدفوع *</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={setFullAmount}
                  className="text-xs"
                >
                  المبلغ الكامل
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    'pl-12',
                    errors.amount && 'border-destructive'
                  )}
                  min={0}
                  max={remaining}
                  step={0.01}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  ر.س
                </span>
              </div>
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>طريقة الدفع *</Label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((pm) => (
                  <motion.button
                    key={pm.id}
                    type="button"
                    onClick={() => setMethod(pm.id)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg border transition-all',
                      method === pm.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {pm.icon}
                    <span className="text-sm font-medium">{pm.label}</span>
                  </motion.button>
                ))}
              </div>
              {errors.method && (
                <p className="text-xs text-destructive">{errors.method}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات (اختياري)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي ملاحظات إضافية..."
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={loading}
              >
                {loading ? 'جاري التسجيل...' : 'تسجيل الدفعة'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
              >
                إلغاء
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
