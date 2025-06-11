
import { PropsWithChildren } from 'react';

interface GenericCardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const GenericCard = ({
  header, 
  children, 
  footer, 
  onClick,
  className = ''
}: PropsWithChildren<GenericCardProps>) => (
  <div
    className={`glass-card glass-hover p-4 flex flex-col gap-2 cursor-pointer ${className}`}
    onClick={onClick}
  >
    {header && <div className="flex items-center justify-between">{header}</div>}
    <div className="flex-1">{children}</div>
    {footer && <div className="pt-2 border-t border-white/10">{footer}</div>}
  </div>
);

export default GenericCard;
