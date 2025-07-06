import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Zap, MessageSquare } from 'lucide-react';

const AIAssistantPanel: React.FC = () => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-black/10">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-black mb-4">مساعد الذكاء الاصطناعي</h3>
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
          />
          
          <Button className="w-full">
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