import { ReactNode, CSSProperties, Children } from 'react';

interface BaseTaskCardLayoutProps {
  children: ReactNode;
  id: string;
  className?: string;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isOtherSelected?: boolean;
}

const BaseTaskCardLayout = ({
  children,
  id,
  className = '',
  isSelected = false,
  isSelectionMode = false,
  isOtherSelected = false
}: BaseTaskCardLayoutProps) => {
  const getCardStyle = () => {
    const backgroundColor = '#f8f9fa';
    let opacity = 1;

    if (isSelectionMode) {
      if (isSelected) {
        opacity = 1;
      } else {
        opacity = 0.5;
      }
    }

    return {
      width: '100%',
      backgroundColor,
      borderRadius: '32px',
      paddingBlock: '12px',
      paddingInline: 'clamp(10px, 2vw, 14px)',
      direction: 'rtl',
      fontFamily: 'IBM Plex Sans Arabic',
      opacity,
      transition: 'opacity 0.2s ease-in-out'
    } as CSSProperties;
  };

  const layoutChildren = Children.toArray(children);
  const [headerSection, footerSection, ...extraSections] = layoutChildren;

  return (
    <div
      className={`font-arabic min-h-[120px] h-auto max-h-[min(52vh,320px)] overflow-hidden ${className}`}
      style={getCardStyle()}
      data-task-card-id={id}
    >
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-y-auto overflow-x-hidden">
        <div className="min-h-0 overflow-hidden">{headerSection}</div>
        <div className="min-h-0 overflow-hidden">{footerSection}</div>
        {extraSections.length > 0 ? (
          <div className="min-h-0 overflow-hidden">{extraSections}</div>
        ) : null}
      </div>
    </div>
  );
};

export default BaseTaskCardLayout;
