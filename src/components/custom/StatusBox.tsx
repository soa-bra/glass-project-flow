import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { AlertTriangle, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface StatusBoxProps {
  title: string;
  status: 'success' | 'warning' | 'error' | 'default';
  children: React.ReactNode;
}

export const StatusBox: React.FC<StatusBoxProps> = ({ title, status, children }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-500',
          badgeColor: 'bg-green-100 text-green-800',
          badgeText: 'ممتاز'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          badgeColor: 'bg-yellow-100 text-yellow-800',
          badgeText: 'تحذير'
        };
      case 'error':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-500',
          badgeColor: 'bg-red-100 text-red-800',
          badgeText: 'خطر'
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-500',
          badgeColor: 'bg-blue-100 text-blue-800',
          badgeText: 'معلومات'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className="glass-enhanced rounded-[40px] border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-right font-arabic text-lg flex items-center gap-2">
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
            {title}
          </CardTitle>
          <BaseBadge variant="secondary" className={config.badgeColor}>
            {config.badgeText}
          </BaseBadge>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};