import React from 'react';
import { Settings } from 'lucide-react';
export const EmptySettingsState: React.FC = () => {
  return <div style={{
    background: 'var(--backgrounds-workspace-bg)',
    transition: 'all var(--animation-duration-main) var(--animation-easing)'
  }} className="w-full h-full rounded-3xl flex items-center justify-center bg-[b7cccc]">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
          <Settings className="w-12 h-12 text-soabra-text-secondary" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-soabra-text-primary">
            مرحباً بك في الإعدادات
          </h3>
          <p className="text-soabra-text-secondary leading-relaxed">
            اختر فئة من الشريط الجانبي لبدء تخصيص إعدادات النظام حسب احتياجاتك
          </p>
        </div>
        
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
          <p className="text-sm text-soabra-text-secondary">
            💡 <strong>نصيحة:</strong> يمكنك البدء بإعدادات الملف الشخصي أو الأمان والخصوصية
          </p>
        </div>
      </div>
    </div>;
};