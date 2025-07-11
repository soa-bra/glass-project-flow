
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FastForward, Search, Trash2, Bot, Send } from 'lucide-react';
import { toast } from 'sonner';

interface AIAssistantPanelProps {
  onSmartFinish?: () => void;
  onSmartReview?: () => void;
  onSmartClean?: () => void;
  onSendMessage?: (message: string) => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  onSmartFinish,
  onSmartReview,
  onSmartClean,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', content: string}>>([
    {
      type: 'ai',
      content: 'مرحباً! أنا المساعد الذكي. كيف يمكنني مساعدتك في مشروعك اليوم؟'
    }
  ]);

  const handleSmartFinish = () => {
    onSmartFinish?.();
    toast.success('تم تشغيل أداة الإنهاء الذكي');
    setChatHistory(prev => [...prev, {
      type: 'ai',
      content: 'جاري تحليل المشروع وإكماله تلقائياً... سيتم إشعارك عند الانتهاء.'
    }]);
  };

  const handleSmartReview = () => {
    onSmartReview?.();
    toast.success('تم تشغيل أداة المراجعة الذكية');
    setChatHistory(prev => [...prev, {
      type: 'ai',
      content: 'تحليل التماسك: ممتاز ✅\nالفجوات المكتشفة: 2 نقاط تحتاج مراجعة\nالأولويات: مرتبة بشكل منطقي\nتوصيات جديدة: متوفرة'
    }]);
  };

  const handleSmartClean = () => {
    onSmartClean?.();
    toast.success('تم تشغيل أداة التنظيف الذكية');
    setChatHistory(prev => [...prev, {
      type: 'ai',
      content: 'تم عزل 3 عناصر غير مرتبطة بالخطة في ملف منفصل وإخفاؤها تلقائياً.'
    }]);
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('يرجى كتابة رسالة');
      return;
    }

    setChatHistory(prev => [...prev, {type: 'user', content: message}]);
    onSendMessage?.(message);
    
    // محاكاة رد من الذكاء الصناعي
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'ai',
        content: 'شكراً لك على سؤالك. سأقوم بتحليل طلبك وتقديم الإجابة المناسبة...'
      }]);
    }, 1000);

    setMessage('');
  };

  return (
    <Card className="w-80 bg-[#f7f8f9] backdrop-blur-xl shadow-sm border border-black/10 rounded-[30px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic text-black flex items-center gap-2">
          <Bot className="w-5 h-5" />
          المساعد الذكي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* صف الأوامر الذكية */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={handleSmartFinish}
            variant="outline"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto p-3 rounded-xl border-gray-300 hover:bg-gray-100 transition-colors"
            title="إنهاء العمل بذكاء"
          >
            <FastForward className="w-4 h-4" />
            <span className="text-xs font-arabic">إنهاء ذكي</span>
          </Button>
          
          <Button
            onClick={handleSmartReview}
            variant="outline"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto p-3 rounded-xl border-gray-300 hover:bg-gray-100 transition-colors"
            title="المراجعة الذكية"
          >
            <Search className="w-4 h-4" />
            <span className="text-xs font-arabic">مراجعة ذكية</span>
          </Button>
          
          <Button
            onClick={handleSmartClean}
            variant="outline"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto p-3 rounded-xl border-gray-300 hover:bg-gray-100 transition-colors"
            title="التنظيف الذكي"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-xs font-arabic">تنظيف ذكي</span>
          </Button>
        </div>

        {/* صندوق الحوار التفاعلي */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-200 p-3 max-h-64 overflow-y-auto">
            <div className="space-y-3">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-2 text-sm font-arabic ${
                      msg.type === 'user'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Textarea
              placeholder="اسأل المساعد الذكي..."
              className="resize-none rounded-xl border-gray-300 text-sm font-arabic"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              className="rounded-xl bg-black text-white hover:bg-gray-800 self-end"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* نصائح سريعة */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>🚀 استخدم الإنهاء الذكي لإكمال مشروعك تلقائياً</div>
            <div>🔍 المراجعة الذكية تكشف الفجوات والأولويات</div>
            <div>🧹 التنظيف الذكي يرتب العناصر غير المرتبطة</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistantPanel;
