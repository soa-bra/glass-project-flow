
import React from 'react';
import { Upload } from 'lucide-react';
import { BaseActionButton } from '@/components/shared/BaseActionButton';

export const UploadButton: React.FC = () => {
  return (
    <div className="flex justify-center mt-6">
      <BaseActionButton variant="primary" icon={<Upload className="h-5 w-5" />}>
        رفع عقد جديد
      </BaseActionButton>
    </div>
  );
};
