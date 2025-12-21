/**
 * InvoiceStats Widget
 * إحصائيات الفواتير
 */

import { motion } from 'framer-motion';
import { 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { InvoiceStats as InvoiceStatsType } from '../../domain';
import { formatCurrency } from '@/shared';
import { BaseCard } from '@/components/ui/BaseCard';
import { cn } from '@/lib/utils';

interface InvoiceStatsProps {
  stats: InvoiceStatsType;
  className?: string;
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'green' | 'yellow' | 'red' | 'blue' | 'default';
  delay?: number;
}

const colorVariants = {
  green: 'bg-[hsl(var(--accent-green)/0.1)] text-[hsl(var(--accent-green))]',
  yellow: 'bg-[hsl(var(--accent-yellow)/0.1)] text-[hsl(var(--accent-yellow))]',
  red: 'bg-[hsl(var(--accent-red)/0.1)] text-[hsl(var(--accent-red))]',
  blue: 'bg-[hsl(var(--accent-blue)/0.1)] text-[hsl(var(--accent-blue))]',
  default: 'bg-muted text-muted-foreground',
};

function StatCard({ title, value, icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <BaseCard className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className={cn(
            'p-3 rounded-full',
            colorVariants[color]
          )}>
            {icon}
          </div>
        </div>
      </BaseCard>
    </motion.div>
  );
}

export function InvoiceStatsWidget({ stats, className, loading }: InvoiceStatsProps) {
  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <BaseCard key={i} className="animate-pulse">
            <div className="h-20 bg-muted rounded" />
          </BaseCard>
        ))}
      </div>
    );
  }

  const statItems: Omit<StatCardProps, 'delay'>[] = [
    {
      title: 'إجمالي الإيرادات',
      value: formatCurrency(stats.totalRevenue),
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'green',
    },
    {
      title: 'المدفوعة',
      value: formatCurrency(stats.totalPaid),
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'green',
    },
    {
      title: 'المستحقة',
      value: formatCurrency(stats.totalOutstanding),
      icon: <Clock className="h-5 w-5" />,
      color: 'blue',
    },
    {
      title: 'المسودات',
      value: formatCurrency(stats.totalDraft),
      icon: <FileText className="h-5 w-5" />,
      color: 'default',
    },
    {
      title: 'فواتير متأخرة',
      value: stats.overdueCount,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: stats.overdueCount > 0 ? 'red' : 'default',
    },
    {
      title: 'متوسط قيمة الفاتورة',
      value: formatCurrency(stats.averageInvoiceValue),
      icon: <DollarSign className="h-5 w-5" />,
      color: 'blue',
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4', className)}>
      {statItems.map((item, index) => (
        <StatCard key={item.title} {...item} delay={index * 0.08} />
      ))}
    </div>
  );
}
