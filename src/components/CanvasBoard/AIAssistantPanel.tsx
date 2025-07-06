import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Zap, MessageSquare, Bot } from 'lucide-react';
import { toast } from 'sonner';

const AIAssistantPanel: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('يرجى كتابة رسالة');
      return;
    }
    toast.success('تم إرسال الرسالة للمساعد الذكي');
    setMessage('');
  };

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-sm rounded-[40px] border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Bot className="w-5 h-5" />
          مساعد الذكاء الاصطناعي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">اقتراح ذكي</span>
            </div>
            <p className="text-sm text-blue-700">
              يمكنني مساعدتك في تنظيم المهام وإنشاء جدول زمني للمشروع
            </p>
          </div>
          
          <Textarea
            placeholder="اسأل المساعد الذكي..."
            className="resize-none"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <Button className="w-full" onClick={handleSendMessage}>
            <MessageSquare className="w-4 h-4 mr-2" />
            إرسال
          </Button>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-black">اختصارات سريعة</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                تحليل المشروع
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                تقسيم المهام
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistantPanel;