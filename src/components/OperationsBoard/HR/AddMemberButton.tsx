
import React from 'react';
import { UserPlus } from 'lucide-react';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { TYPOGRAPHY, LAYOUT } from '@/components/shared/design-system/constants';

export const AddMemberButton: React.FC = () => {
  return (
    <div className={`${LAYOUT.FLEX_CENTER} mt-6`}>
      <UnifiedButton variant="primary" size="md" className={TYPOGRAPHY.ARABIC_FONT}>
        <UserPlus className="h-5 w-5 ml-2" />
        إضافة عضو جديد
      </UnifiedButton>
    </div>
  );
};
