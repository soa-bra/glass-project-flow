
import React from 'react';
import { UserPlus } from 'lucide-react';
import { UnifiedButton } from '@/components/ui/UnifiedButton';

export const AddMemberButton: React.FC = () => {
  return (
    <div className="flex justify-center mt-6">
      <UnifiedButton variant="primary" size="md" className="font-arabic">
        <UserPlus className="h-5 w-5 ml-2" />
        إضافة عضو جديد
      </UnifiedButton>
    </div>
  );
};
