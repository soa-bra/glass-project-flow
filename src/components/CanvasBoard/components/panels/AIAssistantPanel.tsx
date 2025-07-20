import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Bot, Play, Search, Trash2, Send } from 'lucide-react';
import { toast } from 'sonner';
export const AIAssistantPanel: React.FC = () => {
  const [message, setMessage] = useState('');
  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('يرجى كتابة رسالة');
      return;
    }
    toast.success('تم إرسال الرسالة للمساعد الذكي');
    setMessage('');
  };
  const handleFinishWorkIntelligently = () => {
    toast.info('تم تشغيل أداة إنهاء العمل بذكاء');
  };
  const handleSmartReview = () => {
    toast.info('تم تشغيل أداة المراجعة الذكية');
  };
  const handleSmartCleanup = () => {
    toast.info('تم تشغيل أداة التنظيف الذكية');
  };
  return <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden py-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          
          المساعد الذكي
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 h-[calc(100%-4rem)] flex flex-col">
        {/* Smart Commands Row */}
        <div className="flex gap-2 justify-between">
          <Button onClick={handleFinishWorkIntelligently} size="sm" className="flex-1 rounded-[16px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none" title="إنهاء العمل بذكاء">
            <Play className="w-4 h-4" />
          </Button>
          <Button onClick={handleSmartReview} size="sm" className="flex-1 rounded-[16px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none" title="المراجعة الذكية">
            <Search className="w-4 h-4" />
          </Button>
          <Button onClick={handleSmartCleanup} size="sm" className="flex-1 rounded-[16px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none" title="التنظيف الذكية">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <Separator className="bg-[#d1e1ea]" />

        {/* Interactive Chat Box */}
        <div className="flex-1 flex flex-col space-y-3">
          <div className="bg-[#e9eff4] p-3 rounded-[16px] flex-1 min-h-0 py-[40px]">
            <div className="text-sm text-black font-arabic py-0">
              صندوق الحوار التفاعلي
            </div>
            <div className="text-xs text-black/70 mt-1">
              اسأل المساعد الذكي عن أي شيء تحتاجه
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="اكتب رسالتك هنا..." className="flex-1 font-arabic text-sm rounded-[16px] border-[#d1e1ea] text-black placeholder:text-black/50" onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
            <Button onClick={handleSendMessage} size="sm" className="rounded-[16px] border-none px-3 bg-[soabra-new-financial-profit] bg-black text-slate-50">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};