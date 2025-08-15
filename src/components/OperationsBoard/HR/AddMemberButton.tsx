
import React from 'react';
import { UserPlus } from 'lucide-react';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { TYPOGRAPHY, LAYOUT } from '@/components/shared/design-system/constants';

export const AddMemberButton: React.FC = () => {
  return (
    <div className={`${LAYOUT.FLEX_CENTER} mt-6`}>
      <BaseActionButton variant="primary" size="md" icon={<UserPlus className="h-5 w-5" />}>
        إضافة عضو جديد
      </BaseActionButton>
    </div>
  );
};
