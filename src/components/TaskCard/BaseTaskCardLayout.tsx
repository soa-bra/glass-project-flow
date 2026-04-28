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
      className={`font-arabic min-h-[144px] h-auto overflow-hidden grid grid-cols-1 grid-rows-[minmax(98px,_66%)_minmax(40px,_34%)] sm:grid-rows-[minmax(106px,_66%)_minmax(40px,_34%)] lg:grid-rows-[minmax(112px,_64%)_minmax(44px,_36%)] gap-2 ${className}`}
      style={getCardStyle()}
      data-task-card-id={id}
    >
      <div className="min-h-0 overflow-hidden">{headerSection}</div>
      <div className="min-h-0 overflow-hidden">{footerSection}</div>
      {extraSections.length > 0 ? (
        <div className="min-h-0 overflow-hidden">{extraSections}</div>
      ) : null}
    </div>
  );
};

export default BaseTaskCardLayout;
