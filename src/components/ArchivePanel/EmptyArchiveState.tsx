
import React from 'react';
import { Archive } from 'lucide-react';
import { SoaCard } from '@/components/ui/SoaCard';
import { SoaTypography } from '@/components/ui/SoaTypography';
import { SoaIcon } from '@/components/ui/SoaIcon';
import { SoaMotion } from '@/components/ui/SoaMotion';

export const EmptyArchiveState: React.FC = () => {
  return (
    <SoaCard variant="main" className="h-full flex items-center justify-center">
      <SoaMotion variant="fade" delay={0.2}>
        <div className="text-center">
          <SoaIcon 
            icon={Archive} 
            size="lg" 
            className="text-soabra-ink-30 mx-auto mb-4 p-4 rounded-full bg-soabra-panel w-16 h-16"
          />
          <SoaTypography variant="title" className="text-soabra-ink-60 mb-2">
            اختر فئة من الأرشيف
          </SoaTypography>
          <SoaTypography variant="body" className="text-soabra-ink-30">
            قم بتحديد فئة من الشريط الجانبي لعرض محتوى الأرشيف
          </SoaTypography>
        </div>
      </SoaMotion>
    </SoaCard>
  );
};
