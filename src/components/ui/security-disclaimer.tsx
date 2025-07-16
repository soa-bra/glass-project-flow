import React from 'react';
import { AlertTriangle, Info, Shield, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from './alert';

interface SecurityDisclaimerProps {
  type: 'demo' | 'mock' | 'frontend-only' | 'info';
  feature?: string;
  className?: string;
}

export const SecurityDisclaimer: React.FC<SecurityDisclaimerProps> = ({ 
  type, 
  feature,
  className = ''
}) => {
  const getContent = () => {
    switch (type) {
      case 'demo':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          title: 'ميزة تجريبية',
          description: `${feature || 'هذه الميزة'} معروضة لأغراض التوضيح فقط. للحصول على أمان حقيقي، قم بربط التطبيق مع خدمة مصادقة آمنة.`,
          variant: 'default' as const
        };
      
      case 'mock':
        return {
          icon: <Info className="h-4 w-4" />,
          title: 'واجهة مستخدم فقط',
          description: `${feature || 'هذه الميزة'} تعرض الواجهة فقط بدون وظائف أمنية حقيقية. يتطلب تفعيل هذه الميزة خدمة خلفية آمنة.`,
          variant: 'default' as const
        };
      
      case 'frontend-only':
        return {
          icon: <Shield className="h-4 w-4" />,
          title: 'تطبيق واجهة أمامية فقط',
          description: 'هذا التطبيق يعمل في المتصفح فقط. البيانات محفوظة محلياً ومشفرة بتشفير أساسي. للحصول على أمان عالي المستوى، استخدم خدمة قاعدة بيانات آمنة.',
          variant: 'default' as const
        };
      
      case 'info':
        return {
          icon: <Info className="h-4 w-4" />,
          title: 'معلومات مهمة',
          description: feature || 'هذه معلومات مهمة حول الأمان.',
          variant: 'default' as const
        };
      
      default:
        return {
          icon: <Info className="h-4 w-4" />,
          title: 'ملاحظة',
          description: 'معلومات إضافية حول هذه الميزة.',
          variant: 'default' as const
        };
    }
  };

  const content = getContent();

  return (
    <Alert variant={content.variant} className={`border-warning/20 bg-warning/5 ${className}`}>
      <div className="flex items-start gap-2">
        <div className="text-warning mt-0.5">
          {content.icon}
        </div>
        <div className="flex-1">
          <div className="font-medium text-warning mb-1">
            {content.title}
          </div>
          <AlertDescription className="text-muted-foreground text-sm">
            {content.description}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export const SecuritySetupPrompt: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Alert className={`border-primary/20 bg-primary/5 ${className}`}>
      <Shield className="h-4 w-4 text-primary" />
      <div className="ml-2">
        <div className="font-medium text-primary mb-1">
          هل تريد تفعيل الأمان الحقيقي؟
        </div>
        <AlertDescription className="text-muted-foreground text-sm mb-2">
          قم بربط التطبيق مع Supabase للحصول على مصادقة آمنة، قاعدة بيانات مشفرة، وإدارة مستخدمين حقيقية.
        </AlertDescription>
        <button className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1">
          ابدأ الإعداد
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </Alert>
  );
};