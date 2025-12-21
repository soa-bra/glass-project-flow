/**
 * InvoiceCard Widget
 * بطاقة فاتورة قابلة لإعادة الاستخدام
 */

import { ExternalLink, Calendar, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Invoice, statusColors, statusLabels, isOverdue } from '../../domain';
import { formatCurrency, formatDate } from '@/shared';
import { cn } from '@/lib/utils';

interface InvoiceCardProps {
  invoice: Invoice;
  onClick?: (invoice: Invoice) => void;
  className?: string;
}

export function InvoiceCard({ invoice, onClick, className }: InvoiceCardProps) {
  const overdue = isOverdue(invoice);
  const status = overdue && invoice.status !== 'paid' ? 'overdue' : invoice.status;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          'p-6 rounded-[24px] bg-card border border-border cursor-pointer transition-all hover:shadow-lg',
          className
        )}
        onClick={() => onClick?.(invoice)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">رقم الفاتورة</p>
            <p className="text-lg font-bold text-foreground">{invoice.number}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium',
                statusColors[status]
              )}
            >
              {statusLabels[status]}
            </span>
            <button
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="افتح التفاصيل"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Client Info */}
        {invoice.accountName && (
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{invoice.accountName}</span>
          </div>
        )}

        {/* Due Date */}
        {invoice.dueDate && (
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className={cn(
              'text-sm',
              overdue ? 'text-destructive font-medium' : 'text-muted-foreground'
            )}>
              {overdue ? 'متأخرة: ' : 'تاريخ الاستحقاق: '}
              {formatDate(invoice.dueDate)}
            </span>
          </div>
        )}

        {/* Amount */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">المبلغ الإجمالي</span>
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
