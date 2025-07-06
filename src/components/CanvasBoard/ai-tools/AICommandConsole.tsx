import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Terminal, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AICommandConsoleProps {
  selectedTool: string;
  onCommand: (prompt: string, result: any) => void;
}

export const AICommandConsole: React.FC<AICommandConsoleProps> = ({ 
  selectedTool, 
  onCommand 
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{prompt: string, result: string, timestamp: Date}>>([]);

  if (selectedTool !== 'ai-console') return null;

  const predefinedCommands = [
    'أنشئ جدول زمني من العناصر المحددة',
    'اربط العناصر المتشابهة تلقائياً',
    'اقترح مهام جديدة بناءً على المحتوى',
    'حلل الفجوات في المخطط الحالي',
    'اقترح تحسينات على التصميم'
  ];

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error('يرجى إدخال أمر');
      return;
    }

    setLoading(true);
    try {
      // محاكاة معالجة الأمر
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = await processCommand(prompt);
      
      // إضافة إلى التاريخ
      setHistory(prev => [{
        prompt: prompt.trim(),
        result: result.message,
        timestamp: new Date()
      }, ...prev.slice(0, 4)]);
      
      onCommand(prompt, result);
      setPrompt('');
      toast.success('تم تنفيذ الأمر بنجاح');
    } catch (error) {
      toast.error('فشل في تنفيذ الأمر');
    } finally {
      setLoading(false);
    }
  };

  const processCommand = async (command: string) => {
    // محاكاة معالجة الأوامر المختلفة
    if (command.includes('جدول زمني')) {
      return {
        type: 'timeline',
        message: 'تم إنشاء جدول زمني يتضمن 5 مراحل رئيسية',
        data: { phases: 5, duration: '3 أشهر' }
      };
    } else if (command.includes('اربط')) {
      return {
        type: 'connections',
        message: 'تم ربط 8 عناصر متشابهة تلقائياً',
        data: { connections: 8 }
      };
    } else if (command.includes('مهام')) {
      return {
        type: 'tasks',
        message: 'تم اقتراح 12 مهمة جديدة بناءً على المحتوى',
        data: { tasks: 12 }
      };
    } else if (command.includes('فجوات')) {
      return {
        type: 'analysis',
        message: 'تم تحديد 3 فجوات رئيسية تحتاج لمعالجة',
        data: { gaps: 3 }
      };
    } else {
      return {
        type: 'general',
        message: 'تم معالجة طلبك وتنفيذ التحسينات المقترحة',
        data: {}
      };
    }
  };

  return (
    <ToolPanelContainer title="وحدة التحكم الذكية">
      <div className="space-y-4">
        {/* سطر الأوامر */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">أدخل أمراً ذكياً</label>
          <div className="flex gap-2">
            <Input
              placeholder="مثال: أنشئ جدول زمني من العناصر المحددة"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
              disabled={loading}
              className="font-arabic"
            />
            <Button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              size="sm"
              className="rounded-full px-3"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* أوامر سريعة */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">أوامر سريعة</label>
          <div className="grid gap-1">
            {predefinedCommands.map((command, index) => (
              <button
                key={index}
                onClick={() => setPrompt(command)}
                disabled={loading}
                className="text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded text-right font-arabic border border-gray-200 disabled:opacity-50"
              >
                <Terminal className="w-3 h-3 inline mr-2" />
                {command}
              </button>
            ))}
          </div>
        </div>

        {/* تاريخ الأوامر */}
        {history.length > 0 && (
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">آخر الأوامر</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {history.map((entry, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded border text-xs">
                  <div className="font-arabic mb-1">
                    <Terminal className="w-3 h-3 inline mr-1" />
                    {entry.prompt}
                  </div>
                  <div className="text-green-600 mb-1">✓ {entry.result}</div>
                  <div className="text-gray-400 text-[10px]">
                    {entry.timestamp.toLocaleTimeString('ar')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-3">
          <div className="text-xs text-gray-500 font-arabic">
            💡 نصيحة: استخدم أوامر واضحة ومحددة للحصول على أفضل النتائج
          </div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};