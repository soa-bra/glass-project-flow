import React, { useEffect } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { Telemetry } from '@/infra/telemetry';

type BoxStatus = 'data' | 'empty' | 'loading' | 'error';

interface ManagedBoxProps {
  boxRef: string;
  title: string;
  status: BoxStatus;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  emptyState?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const ManagedBox: React.FC<ManagedBoxProps> = ({
  boxRef,
  title,
  status,
  loading,
  error,
  emptyState,
  actions,
  children,
  className,
}) => {
  useEffect(() => {
    if (status === 'error') {
      Telemetry.reportError(new Error('box_load_failed'), { boxRef, status });
    }
  }, [boxRef, status]);

  const header = (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-lg font-semibold text-black">{title}</h3>
      {actions ? <div>{actions}</div> : null}
    </div>
  );

  return (
    <BaseBox header={header} className={className}>
      {status === 'loading' ? loading ?? <div>جاري التحميل...</div> : null}
      {status === 'error' ? error ?? <div>حدث خطأ أثناء التحميل.</div> : null}
      {status === 'empty' ? emptyState ?? <div>لا توجد بيانات.</div> : null}
      {status === 'data' ? children : null}
    </BaseBox>
  );
};

export type { BoxStatus, ManagedBoxProps };
