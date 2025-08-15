import React from 'react';
import { LucideIcon, Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { buildCardClasses, TYPOGRAPHY, COLORS, LAYOUT } from './design-system/constants';

interface ArchiveItemData {
  id: string;
  title: string;
  type?: string;
  size?: string;
  date: string;
  author?: string;
  department?: string;
  version?: string;
  classification?: string;
  tags?: string[];
  status?: string;
}

interface BaseArchiveItemProps {
  item: ArchiveItemData;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export const BaseArchiveItem: React.FC<BaseArchiveItemProps> = ({
  item,
  icon: IconComponent = FileText,
  onClick,
  className = '',
}) => {
  const getClassificationVariant = (classification?: string) => {
    switch (classification?.toLowerCase()) {
      case 'سري':
        return 'error';
      case 'محدود':
        return 'warning';
      case 'عام':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'نشط':
      case 'معتمد':
        return 'success';
      case 'معلق':
      case 'قيد المراجعة':
        return 'warning';
      case 'منتهي':
      case 'مرفوض':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div 
      className={cn(buildCardClasses('cursor-pointer hover:shadow-lg'), className)}
      onClick={onClick}
    >
      <div className={LAYOUT.FLEX_BETWEEN}>
        <div className={LAYOUT.FLEX_GAP}>
          <div className={LAYOUT.ICON_CONTAINER}>
            <IconComponent className={LAYOUT.ICON_SIZE} />
          </div>
          <div className="flex-1">
            <h3 className={`${TYPOGRAPHY.BODY_TEXT} ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} mb-2`}>
              {item.title}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
              {item.type && (
                <div>
                  <span className="font-medium">النوع: </span>
                  {item.type}
                </div>
              )}
              {item.size && (
                <div>
                  <span className="font-medium">الحجم: </span>
                  {item.size}
                </div>
              )}
              {item.author && (
                <div>
                  <span className="font-medium">المؤلف: </span>
                  {item.author}
                </div>
              )}
              {item.department && (
                <div>
                  <span className="font-medium">القسم: </span>
                  {item.department}
                </div>
              )}
            </div>

            <div className={`${LAYOUT.FLEX_GAP} flex-wrap gap-2`}>
              {item.classification && (
                <BaseBadge variant={getClassificationVariant(item.classification)} size="sm">
                  {item.classification}
                </BaseBadge>
              )}
              {item.status && (
                <BaseBadge variant={getStatusVariant(item.status)} size="sm">
                  {item.status}
                </BaseBadge>
              )}
              {item.version && (
                <BaseBadge variant="info" size="sm">
                  {item.version}
                </BaseBadge>
              )}
            </div>
          </div>
        </div>
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className={`${LAYOUT.FLEX_GAP} mt-3 pt-3 border-t border-black/10`}>
          <FileText className="w-4 h-4 text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag, index) => (
              <span 
                key={index} 
                className={`text-xs px-2 py-1 ${COLORS.TRANSPARENT_BACKGROUND} rounded-full ${COLORS.BORDER_COLOR} ${TYPOGRAPHY.ARABIC_FONT}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={`${LAYOUT.FLEX_GAP} mt-3 pt-3 border-t border-black/10`}>
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className={`text-sm text-gray-600 ${TYPOGRAPHY.ARABIC_FONT}`}>{item.date}</span>
      </div>
    </div>
  );
};