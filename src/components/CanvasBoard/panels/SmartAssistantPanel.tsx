import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bot, Lightbulb, Wand2, Zap, Loader2 } from 'lucide-react';
import { AIService } from '@/services/aiService';
import { toast } from 'sonner';
interface SmartAssistantPanelProps {
  onAddSmartElement?: (type: string, config: any) => void;
  elements?: any[];
}
const SmartAssistantPanel: React.FC<SmartAssistantPanelProps> = ({
  onAddSmartElement,
  elements = []
}) => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // تحليل الكانفاس عند تغيير العناصر
  useEffect(() => {
    if (elements.length > 0) {
      analyzeCanvas();
    }
  }, [elements]);
  const analyzeCanvas = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await AIService.analyzeCanvas(elements);
      setSuggestions(analysis.suggestions);
    } catch (error) {
      console.error('خطأ في تحليل الكانفاس:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  const generateSmartElement = async (type: string) => {
    if (!prompt.trim()) {
      toast.error('يرجى إدخال وصف للعنصر المطلوب');
      return;
    }
    setIsGenerating(true);
    try {
      const element = await AIService.generateSmartElement(type, prompt);
      onAddSmartElement?.(type, element);
      setPrompt('');
      toast.success('تم إنشاء العنصر الذكي بنجاح');
    } catch (error) {
      console.error('خطأ في إنشاء العنصر:', error);
      toast.error('فشل في إنشاء العنصر الذكي');
    } finally {
      setIsGenerating(false);
    }
  };
  return <Card className="backdrop-blur-md shadow-sm border border-gray-300 rounded-[20px]w-60 h-full bg-[#ffffff]/95 py-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot size={18} className="text-primary" />
          المساعد الذكي
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* تحليل الكانفاس */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Lightbulb size={14} />
              اقتراحات ذكية
            </h4>
            <Button size="sm" variant="outline" onClick={analyzeCanvas} disabled={isAnalyzing || elements.length === 0} className="h-6 px-2 text-xs">
              {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : 'تحليل'}
            </Button>
          </div>
          
          {suggestions.length > 0 ? <div className="space-y-1">
              {suggestions.slice(0, 3).map((suggestion, index) => <Badge key={index} variant="secondary" className="text-xs p-1 w-full justify-start">
                  {suggestion}
                </Badge>)}
            </div> : <p className="text-xs text-muted-foreground">
              أضف عناصر للحصول على اقتراحات ذكية
            </p>}
        </div>

        <Separator />

        {/* إنشاء عناصر ذكية */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Wand2 size={14} />
            إنشاء عنصر ذكي
          </h4>
          
          <Textarea placeholder="اكتب وصفاً للعنصر الذي تريد إنشاؤه..." value={prompt} onChange={e => setPrompt(e.target.value)} className="min-h-[60px] text-sm" />

          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={() => generateSmartElement('mindmap')} disabled={isGenerating || !prompt.trim()} className="text-xs">
              {isGenerating ? <Loader2 size={12} className="animate-spin mr-1" /> : <Zap size={12} className="mr-1" />}
              خريطة ذهنية
            </Button>
            
            <Button size="sm" variant="outline" onClick={() => generateSmartElement('flowchart')} disabled={isGenerating || !prompt.trim()} className="text-xs">
              {isGenerating ? <Loader2 size={12} className="animate-spin mr-1" /> : <Zap size={12} className="mr-1" />}
              مخطط تدفق
            </Button>
            
            <Button size="sm" variant="outline" onClick={() => generateSmartElement('kanban')} disabled={isGenerating || !prompt.trim()} className="text-xs">
              {isGenerating ? <Loader2 size={12} className="animate-spin mr-1" /> : <Zap size={12} className="mr-1" />}
              لوحة كانبان
            </Button>
            
            <Button size="sm" variant="outline" onClick={() => generateSmartElement('timeline')} disabled={isGenerating || !prompt.trim()} className="text-xs">
              {isGenerating ? <Loader2 size={12} className="animate-spin mr-1" /> : <Zap size={12} className="mr-1" />}
              جدول زمني
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default SmartAssistantPanel;