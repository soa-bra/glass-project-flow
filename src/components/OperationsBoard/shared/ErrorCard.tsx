import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { COLORS, TYPOGRAPHY } from '@/components/shared/design-system/constants';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  title = "حدث خطأ",
  message = "لا يمكن تحميل البيانات في الوقت الحالي",
  onRetry
}) => {
  return (
    <BaseBox>
      <div className="h-32 flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <div className="text-center">
            <h3 className={`${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} font-medium`}>
              {title}
            </h3>
            <p className={`${COLORS.SECONDARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} text-sm mt-1`}>
              {message}
            </p>
          </div>
        </div>
        {onRetry && (
          <BaseActionButton
            variant="outline"
            size="sm"
            onClick={onRetry}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            إعادة المحاولة
          </BaseActionButton>
        )}
      </div>
    </BaseBox>
  );
};
