import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, Search, Brush, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

interface SmartAssistantPanelProps {
  visible?: boolean;
}

const SmartAssistantPanel: React.FC<SmartAssistantPanelProps> = ({ visible = true }) => {
  const [message, setMessage] = useState('');

  const handleSmartAction = (action: string) => {
    switch (action) {
      case 'quick-finish':
        toast.success('تم تشغيل أداة الإنهاء الذكي');
        break;
      case 'smart-review':
        toast.success('تم تشغيل أداة المراجعة الذكية');
        break;
      case 'smart-clean':
        toast.success('تم تشغيل أداة التنظيف الذكية');
        break;
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('يرجى كتابة رسالة');
      return;
    }
    toast.success('تم إرسال الرسالة للمساعد الذكي');
    setMessage('');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50" style={{ width: '6%' }}>
      <Card className="bg-soabra-new-canvas-floating-panels rounded-[32px] shadow-sm border-0">
        <CardContent className="p-6 space-y-4">
          {/* أزرار الأوامر الذكية */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-soabra-new-canvas-text font-arabic">
              الأوامر الذكية
            </h3>
            
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 rounded-2xl border-gray-200 hover:bg-soabra-new-canvas-palette-6 text-soabra-new-canvas-text"
                onClick={() => handleSmartAction('quick-finish')}
              >
                <Play className="w-4 h-4" />
                <span className="text-xs">التشغيل السريع</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 rounded-2xl border-gray-200 hover:bg-soabra-new-canvas-palette-3 text-soabra-new-canvas-text"
                onClick={() => handleSmartAction('smart-review')}
              >
                <Search className="w-4 h-4" />
                <span className="text-xs">المراجعة الذكية</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 rounded-2xl border-gray-200 hover:bg-soabra-new-canvas-palette-8 text-soabra-new-canvas-text"
                onClick={() => handleSmartAction('smart-clean')}
              >
                <Brush className="w-4 h-4" />
                <span className="text-xs">التنظيف الذكي</span>
              </Button>
            </div>
          </div>

          {/* صندوق الحوار التفاعلي */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-soabra-new-canvas-text font-arabic">
              المحادثة التفاعلية
            </h3>
            
            <Textarea
              placeholder="اسأل المساعد الذكي..."
              className="resize-none rounded-2xl border-gray-200 text-soabra-new-canvas-text"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            
            <Button 
              className="w-full rounded-2xl bg-soabra-new-canvas-active-tab text-white hover:bg-opacity-80"
              onClick={handleSendMessage}
            >
              <Send className="w-4 h-4 mr-2" />
              إرسال
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartAssistantPanel;