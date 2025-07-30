import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  Wand2, 
  Sparkles,
  Target,
  FileText,
  Calendar,
  Users,
  BarChart3,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';
import { AIService } from '@/services/aiService';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface SmartAssistantPanelProps {
  onAddSmartElement?: (type: string, config: any) => void;
  elements?: any[];
  projectContext?: {
    projectId?: string;
    projectName?: string;
    teamMembers?: string[];
  };
}

interface SmartSuggestion {
  id: string;
  type: 'analysis' | 'optimization' | 'task' | 'insight';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

export const SmartAssistantPanel: React.FC<SmartAssistantPanelProps> = ({
  onAddSmartElement,
  elements = [],
  projectContext
}) => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  
  const { analyzeText, isAnalyzing: isAIAnalyzing } = useAIAnalysis();

  const smartSuggestions: SmartSuggestion[] = [
    {
      id: '1',
      type: 'analysis',
      title: 'تحليل تدفق العمل',
      description: 'تحليل العناصر الحالية وتحديد نقاط التحسين في تدفق العمل',
      action: 'بدء التحليل',
      priority: 'high',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: '2',
      type: 'optimization',
      title: 'تحسين التنظيم',
      description: 'اقتراح ترتيب أفضل للعناصر وتجميعها منطقياً',
      action: 'تطبيق التحسين',
      priority: 'medium',
      icon: <Target className="w-4 h-4" />
    },
    {
      id: '3',
      type: 'task',
      title: 'إنشاء مهام ذكية',
      description: 'توليد مهام تلقائية بناءً على العناصر الموجودة',
      action: 'إنشاء المهام',
      priority: 'high',
      icon: <Users className="w-4 h-4" />
    }
  ];

  const analyzeCanvas = useCallback(async () => {
    if (elements.length === 0) {
      toast.error('لا توجد عناصر للتحليل');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await AIService.analyzeCanvas(elements);
      
      const newSuggestions: SmartSuggestion[] = result.suggestions.map((suggestion, index) => ({
        id: `suggestion-${index}`,
        type: 'insight',
        title: suggestion,
        description: `اقتراح مبني على تحليل العناصر الحالية`,
        action: 'تطبيق',
        priority: index === 0 ? 'high' : 'medium',
        icon: <Lightbulb className="w-4 h-4" />
      }));

      setSuggestions(newSuggestions);
      toast.success('تم تحليل الكانفاس بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء التحليل');
    } finally {
      setIsAnalyzing(false);
    }
  }, [elements]);

  const generateSmartElement = useCallback(async (type: string) => {
    if (!prompt.trim()) {
      toast.error('يرجى كتابة وصف للعنصر المطلوب');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await AIService.generateSmartElement(type, prompt);
      
      if (onAddSmartElement) {
        onAddSmartElement(type, result);
      }
      
      toast.success(`تم إنشاء ${type} بنجاح`);
      setPrompt('');
    } catch (error) {
      toast.error('حدث خطأ أثناء الإنشاء');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, onAddSmartElement]);

  const handleChatSubmit = useCallback(async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setPrompt('');
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Analyze user input with AI
      const analysis = await analyzeText(userMessage, {
        context: projectContext ? `المشروع: ${projectContext.projectName}` : undefined
      });

      // Simulate AI response (replace with actual AI service call)
      const aiResponse = `تم تحليل طلبك. يمكنني مساعدتك في: إنشاء العناصر، تحليل البيانات، وتقديم الاقتراحات.`;
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      toast.success('تم الرد من المساعد الذكي');
    } catch (error) {
      toast.error('حدث خطأ في المحادثة');
    }
  }, [prompt, analyzeText, projectContext]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <Card className="w-full max-w-lg bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Bot className="w-5 h-5 text-primary" />
          المساعد الذكي
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">متصل</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-full">
            <TabsTrigger value="suggestions" className="rounded-full">اقتراحات</TabsTrigger>
            <TabsTrigger value="chat" className="rounded-full">محادثة</TabsTrigger>
            <TabsTrigger value="generate" className="rounded-full">إنشاء</TabsTrigger>
          </TabsList>

          {/* Smart Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">الاقتراحات الذكية</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={analyzeCanvas}
                disabled={isAnalyzing}
                className="rounded-full"
              >
                <Brain className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'يحلل...' : 'تحليل'}
              </Button>
            </div>

            <div className="space-y-3">
              {(suggestions.length > 0 ? suggestions : smartSuggestions).slice(0, 4).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {suggestion.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {suggestion.title}
                          </h5>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(suggestion.priority)}`}
                          >
                            {suggestion.priority === 'high' ? 'عالي' : suggestion.priority === 'medium' ? 'متوسط' : 'منخفض'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="rounded-full text-xs"
                      onClick={() => toast.success(`تم تنفيذ: ${suggestion.title}`)}
                    >
                      {suggestion.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="h-40 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    ابدأ محادثة مع المساعد الذكي
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-3 p-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-4'
                          : 'bg-white dark:bg-gray-700 mr-4'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  placeholder="اسأل المساعد الذكي..."
                  className="resize-none rounded-2xl"
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSubmit();
                    }
                  }}
                />
                <Button 
                  onClick={handleChatSubmit}
                  disabled={!prompt.trim() || isAIAnalyzing}
                  className="rounded-2xl"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-4 mt-4">
            <div className="space-y-4">
              <Textarea
                placeholder="صف العنصر الذي تريد إنشاؤه..."
                className="resize-none rounded-2xl"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSmartElement('mindmap')}
                  disabled={isGenerating || !prompt.trim()}
                  className="rounded-full"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  خريطة ذهنية
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSmartElement('flowchart')}
                  disabled={isGenerating || !prompt.trim()}
                  className="rounded-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  مخطط انسيابي
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSmartElement('kanban')}
                  disabled={isGenerating || !prompt.trim()}
                  className="rounded-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  لوحة كانبان
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSmartElement('timeline')}
                  disabled={isGenerating || !prompt.trim()}
                  className="rounded-full"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  الجدول الزمني
                </Button>
              </div>

              {isGenerating && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Wand2 className="w-4 h-4 animate-spin" />
                    جاري الإنشاء...
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};