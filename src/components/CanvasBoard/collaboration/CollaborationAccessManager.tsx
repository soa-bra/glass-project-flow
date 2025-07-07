import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Users, Link as LinkIcon, Copy, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface CollaborationAccessManagerProps {
  selectedTool: string;
  projectId: string;
  onInviteGenerated: (inviteData: {
    link: string;
    permissions: string;
    expiry: string;
  }) => void;
}

export const CollaborationAccessManager: React.FC<CollaborationAccessManagerProps> = ({
  selectedTool,
  projectId,
  onInviteGenerated
}) => {
  const [permissions, setPermissions] = useState('viewer');
  const [expiry, setExpiry] = useState('24h');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  if (selectedTool !== 'collab-access') return null;

  const permissionLevels = [
    {
      value: 'viewer',
      label: 'مشاهد',
      description: 'يمكنه مشاهدة المحتوى فقط',
      icon: '👁️'
    },
    {
      value: 'commenter',
      label: 'معلق',
      description: 'يمكنه المشاهدة وإضافة التعليقات',
      icon: '💬'
    },
    {
      value: 'editor',
      label: 'محرر',
      description: 'يمكنه التعديل والتحرير',
      icon: '✏️'
    },
    {
      value: 'admin',
      label: 'مدير',
      description: 'صلاحيات كاملة في المشروع',
      icon: '👑'
    }
  ];

  const expiryOptions = [
    { value: '1h', label: 'ساعة واحدة' },
    { value: '6h', label: '6 ساعات' },
    { value: '24h', label: '24 ساعة' },
    { value: '7d', label: 'أسبوع' },
    { value: '30d', label: 'شهر' },
    { value: 'never', label: 'بدون انتهاء' }
  ];

  const generateInviteLink = () => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const link = `https://supra.app/join/${projectId}/${randomId}?perm=${permissions}&exp=${expiry}&t=${timestamp}`;
    
    setGeneratedLink(link);
    
    const inviteData = {
      link,
      permissions,
      expiry
    };
    
    onInviteGenerated(inviteData);
    toast.success('تم إنشاء رابط الدعوة بنجاح');
  };

  const copyToClipboard = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink);
      toast.success('تم نسخ الرابط إلى الحافظة');
    } catch (error) {
      toast.error('فشل في نسخ الرابط');
    }
  };

  const getExpiryLabel = (value: string) => {
    return expiryOptions.find(opt => opt.value === value)?.label || value;
  };

  return (
    <ToolPanelContainer title="إدارة صلاحيات التعاون">
      <div className="space-y-4">
        {/* مستوى الصلاحيات */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">مستوى الصلاحية</label>
          <div className="grid gap-2">
            {permissionLevels.map(level => (
              <button
                key={level.value}
                onClick={() => setPermissions(level.value)}
                className={`p-3 rounded-lg border text-sm text-right font-arabic transition-colors ${
                  permissions === level.value 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{level.label}</div>
                    <div className="text-xs opacity-80">{level.description}</div>
                  </div>
                  <span className="text-lg">{level.icon}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* مدة الصلاحية */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">مدة صلاحية الرابط</label>
          <Select value={expiry} onValueChange={setExpiry}>
            <SelectTrigger className="font-arabic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {expiryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span className="font-arabic">{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* توليد الرابط */}
        <Button
          onClick={generateInviteLink}
          className="w-full rounded-full"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          إنشاء رابط دعوة
        </Button>

        {/* الرابط المولد */}
        {generatedLink && (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-medium font-arabic mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                رابط الدعوة الجديد
              </h4>
              
              <div className="bg-white border rounded p-2 mb-2">
                <div className="text-xs font-mono break-all text-gray-700">
                  {generatedLink}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  نسخ
                </Button>
              </div>
            </div>

            {/* معلومات الدعوة */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium font-arabic mb-2">تفاصيل الدعوة</h4>
              <div className="text-sm font-arabic space-y-1">
                <div>الصلاحية: <span className="font-medium">
                  {permissionLevels.find(p => p.value === permissions)?.label}
                </span></div>
                <div>مدة الصلاحية: <span className="font-medium">
                  {getExpiryLabel(expiry)}
                </span></div>
                <div>معرف المشروع: <span className="font-mono text-xs">{projectId}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* المستخدمون النشطون */}
        <div className="border-t pt-4">
          <h4 className="font-medium font-arabic mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            المستخدمون النشطون
          </h4>
          <div className="text-sm text-gray-500 font-arabic">
            لا يوجد مستخدمون نشطون حالياً
          </div>
        </div>

        {/* تحذيرات الأمان */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h4 className="text-sm font-medium font-arabic mb-1">⚠️ تنبيهات الأمان</h4>
          <ul className="text-xs font-arabic text-yellow-800 space-y-1">
            <li>• لا تشارك الروابط مع أشخاص غير موثوقين</li>
            <li>• يمكن إلغاء الدعوات في أي وقت</li>
            <li>• تُسجل جميع الأنشطة للمراجعة</li>
          </ul>
        </div>
      </div>
    </ToolPanelContainer>
  );
};