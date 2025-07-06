import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface SmartProjectGeneratorProps {
  projectId: string;
  layers: any[];
  visible: boolean;
  onGenerated: (preview: any) => void;
}

export const SmartProjectGenerator: React.FC<SmartProjectGeneratorProps> = ({ 
  projectId, 
  layers, 
  visible, 
  onGenerated 
}) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (layers.length === 0) {
      toast.error('لا توجد عناصر لتحويلها إلى مشروع');
      return;
    }

    setLoading(true);
    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const preview = {
        title: 'مشروع مولد ذكياً',
        tasks: layers.map((layer, index) => ({
          id: `task-${index}`,
          title: layer.content || `مهمة ${index + 1}`,
          status: 'pending',
          priority: 'medium'
        })),
        timeline: `${layers.length} مهام تم توليدها`,
        estimated_duration: `${layers.length * 2} أسابيع`
      };
      
      onGenerated(preview);
      toast.success('تم توليد المشروع بنجاح');
    } catch (error) {
      toast.error('فشل في توليد المشروع');
      console.error('فشل في توليد المشروع:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <ToolPanelContainer title="مولد المشاريع الذكي">
      <div className="space-y-3">
        <p className="text-xs text-gray-600 font-arabic">
          تحويل العناصر في اللوحة إلى مشروع منظم بمهام وجدول زمني
        </p>
        
        <Button 
          onClick={handleGenerate} 
          disabled={loading || layers.length === 0}
          className="w-full rounded-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري التحويل...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              تحويل إلى مشروع
            </>
          )}
        </Button>
        
        {layers.length === 0 && (
          <p className="text-xs text-red-500 font-arabic">
            أضف عناصر إلى اللوحة أولاً
          </p>
        )}
      </div>
    </ToolPanelContainer>
  );
};