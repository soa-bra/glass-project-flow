import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Download, FileText, Calendar, Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExportOptionsPanelProps {
  selectedTool: string;
  projectId: string;
  layers: any[];
}

export const ExportOptionsPanel: React.FC<ExportOptionsPanelProps> = ({ 
  selectedTool, 
  projectId, 
  layers 
}) => {
  const [loading, setLoading] = useState<string | null>(null);

  if (selectedTool !== 'export') return null;

  const exportOptions = [
    {
      format: 'pdf',
      label: 'PDF',
      description: 'ملف PDF للطباعة والمشاركة',
      icon: FileText,
      color: 'text-red-600'
    },
    {
      format: 'gantt',
      label: 'مخطط جانت',
      description: 'جدول زمني تفاعلي للمشروع',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      format: 'notion',
      label: 'صفحة Notion',
      description: 'تصدير منظم لـ Notion',
      icon: Globe,
      color: 'text-gray-600'
    }
  ];

  const handleExport = async (format: string) => {
    if (layers.length === 0) {
      toast.error('لا توجد عناصر للتصدير');
      return;
    }

    setLoading(format);
    try {
      // محاكاة عملية التصدير
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // إنشاء ملف وهمي للتحميل
      const content = JSON.stringify({
        projectId,
        format,
        layers,
        exportedAt: new Date().toISOString(),
        totalElements: layers.length
      }, null, 2);
      
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-${projectId}-${format}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`تم تصدير المشروع بصيغة ${format.toUpperCase()}`);
    } catch (error) {
      // Error handled silently
      toast.error('فشل في عملية التصدير');
    } finally {
      setLoading(null);
    }
  };

  return (
    <ToolPanelContainer title="خيارات التصدير">
      <div className="space-y-3">
        <p className="text-xs text-gray-600 font-arabic mb-4">
          اختر صيغة التصدير المناسبة لاحتياجاتك
        </p>
        
        {exportOptions.map(option => {
          const Icon = option.icon;
          const isLoading = loading === option.format;
          
          return (
            <Button
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={isLoading || layers.length === 0}
              variant="outline"
              className="w-full h-auto p-4 justify-start text-right"
            >
              <div className="flex items-center w-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${option.color}`} />
                    <span className="font-medium font-arabic">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-arabic">
                    {option.description}
                  </p>
                </div>
                
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                  <Download className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </Button>
          );
        })}

        {layers.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 font-arabic">
              أضف عناصر إلى اللوحة لتتمكن من التصدير
            </p>
          </div>
        )}
        
        <div className="border-t pt-3 mt-4">
          <div className="text-xs text-gray-500 font-arabic space-y-1">
            <div>• عدد العناصر: {layers.length}</div>
            <div>• تاريخ آخر تعديل: {new Date().toLocaleDateString('ar')}</div>
          </div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};