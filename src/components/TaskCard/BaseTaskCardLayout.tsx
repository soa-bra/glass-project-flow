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

      style={getCardStyle()}
      data-task-id={id}
      data-selected={isSelected || undefined}
    >
      {headerSection}
      {footerSection}
      {extraSections.length > 0 ? (
        <div className="mt-2 flex flex-col gap-2">
          {extraSections}
        </div>
      ) : null}
    </div>
  );
};

export default BaseTaskCardLayout;
