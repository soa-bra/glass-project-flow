import React from 'react';
import { SoaPanel } from '@/components/ui/SoaPanel';
import { SoaTypography } from '@/components/ui/SoaTypography';
import { SoaMotion } from '@/components/ui/SoaMotion';

export const EmptyDepartmentState: React.FC = () => {
  return (
    <SoaPanel className="h-full flex items-center justify-center">
      <SoaMotion variant="fade" delay={0.1}>
        <div className="text-center">
          <SoaTypography variant="display-m" className="text-soabra-ink-60 mb-2">
            اختر إدارة للبدء
          </SoaTypography>
          <SoaTypography variant="body" className="text-soabra-ink-30">
            قم بتحديد إدارة من القائمة الجانبية لعرض المحتوى
          </SoaTypography>
        </div>
      </SoaMotion>
    </SoaPanel>
  );
};