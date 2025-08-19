import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { History, RotateCcw, Calendar, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VersionEntry {
  id: string;
  version: string;
  createdAt: Date;
  createdBy: string;
  summary: string;
  changes: number;
  size: string;
}

interface VersionHistoryPanelProps {
  selectedTool: string;
  projectId: string;
  onRestoreVersion: (versionId: string) => void;
}

export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  selectedTool,
  projectId,
  onRestoreVersion
}) => {
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  if (selectedTool !== 'versions') return null;

  useEffect(() => {
    loadVersionHistory();
  }, [selectedTool, projectId]);

  const loadVersionHistory = async () => {
    setLoading(true);
    try {
      // محاكاة تحميل تاريخ الإصدارات
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVersions: VersionEntry[] = [
        {
          id: 'v-' + Date.now(),
          version: 'v1.0.0',
          createdAt: new Date(),
          createdBy: 'أحمد محمد',
          summary: 'الإصدار الحالي - آخر التعديلات',
          changes: 0,
          size: '2.3 ميجابايت'
        },
        {
          id: 'v-' + (Date.now() - 1),
          version: 'v0.9.2',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdBy: 'فاطمة علي',
          summary: 'إضافة الجدول الزمني والمهام الفرعية',
          changes: 15,
          size: '1.8 ميجابايت'
        },
        {
          id: 'v-' + (Date.now() - 2),
          version: 'v0.9.1',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          createdBy: 'سارة أحمد',
          summary: 'تحسينات على التصميم وإضافة ملاحظات',
          changes: 8,
          size: '1.5 ميجابايت'
        },
        {
          id: 'v-' + (Date.now() - 3),
          version: 'v0.9.0',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          createdBy: 'محمد حسن',
          summary: 'الإصدار الأولي مع العناصر الأساسية',
          changes: 25,
          size: '1.2 ميجابايت'
        }
      ];
      
      setVersions(mockVersions);
    } catch (error) {
      toast.error('فشل في تحميل تاريخ الإصدارات');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return;

    const confirmed = window.confirm(
      `هل أنت متأكد من استرجاع الإصدار ${version.version}؟\n\nسيتم فقدان التغييرات الحالية غير المحفوظة.`
    );
    
    if (!confirmed) return;

    setRestoring(versionId);
    try {
      // محاكاة عملية الاسترجاع
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onRestoreVersion(versionId);
      toast.success(`تم استرجاع الإصدار ${version.version} بنجاح`);
    } catch (error) {
      toast.error('فشل في استرجاع الإصدار');
    } finally {
      setRestoring(null);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'منذ أقل من ساعة';
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    return date.toLocaleDateString('ar');
  };

  return (
    <ToolPanelContainer title="سجل الإصدارات">
      <div className="space-y-4">
        {/* زر التحديث */}
        <Button 
          onClick={loadVersionHistory}
          disabled={loading}
          variant="outline"
          size="sm"
          className="w-full rounded-full"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <History className="w-4 h-4 mr-2" />
          )}
          تحديث السجل
        </Button>

        {/* قائمة الإصدارات */}
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-gray-300 mx-auto mb-2 animate-spin" />
            <p className="text-sm text-gray-500 font-arabic">
              جاري تحميل الإصدارات...
            </p>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-arabic">
              لا توجد إصدارات محفوظة
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version, index) => (
              <div 
                key={version.id} 
                className={`border rounded-lg p-3 ${
                  index === 0 ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                {/* معلومات الإصدار */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm font-arabic">
                        {version.version}
                      </span>
                      {index === 0 && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          حالي
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 font-arabic mb-1">
                      {version.summary}
                    </p>
                    
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{version.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatTimeAgo(version.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* إحصائيات */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{version.changes} تغيير</span>
                  <span>{version.size}</span>
                </div>

                {/* زر الاسترجاع */}
                {index > 0 && (
                  <Button
                    onClick={() => handleRestoreVersion(version.id)}
                    disabled={restoring === version.id}
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full text-xs"
                  >
                    {restoring === version.id ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        جاري الاسترجاع...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3 h-3 mr-1" />
                        استرجاع هذا الإصدار
                      </>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="border-t pt-3 mt-4">
          <div className="text-xs text-gray-500 font-arabic space-y-1">
            <div>• يتم حفظ إصدار جديد تلقائياً كل 30 دقيقة</div>
            <div>• الحد الأقصى: 50 إصدار محفوظ</div>
            <div>• معرف المشروع: {projectId.slice(0, 8)}...</div>
          </div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};