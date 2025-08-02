
import React from 'react';
import { Upload } from 'lucide-react';
import { UnifiedButton } from '@/components/ui/UnifiedButton';

export const UploadButton: React.FC = () => {
  return (
    <div className="flex justify-center mt-6">
      <UnifiedButton variant="primary">
        <Upload className="h-5 w-5 mr-2" />
        رفع عقد جديد
      </UnifiedButton>
    </div>
  );
};
