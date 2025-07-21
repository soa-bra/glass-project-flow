/**
 * @fileoverview Smart Assistant Panel - AI-powered canvas assistance
 * @author AI Assistant  
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Brain, Lightbulb, Zap, MessageSquare } from 'lucide-react';
import AIService from '@/services/aiService';

interface SmartAssistantPanelProps {
  onAddSmartElement: (type: string, config: any) => void;
  elements: any[];
}

/**
 * Smart Assistant Panel Component
 * Provides AI-powered assistance for canvas creation and management
 */
const SmartAssistantPanel: React.FC<SmartAssistantPanelProps> = ({
  onAddSmartElement,
  elements
}) => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('assist');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await AIService.analyzeCanvas(elements);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateElement = async () => {
    if (!prompt) return;
    
    try {
      const element = await AIService.generateSmartElement('think_board', prompt);
      onAddSmartElement(element.type, element);
      setPrompt('');
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <Card className="h-full glass-section">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-primary" />
          المساعد الذكي
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assist">مساعدة</TabsTrigger>
            <TabsTrigger value="generate">إنشاء</TabsTrigger>
            <TabsTrigger value="analyze">تحليل</TabsTrigger>
          </TabsList>

          <TabsContent value="assist" className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                اقتراحات ذكية
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                    {suggestion}
                  </div>
                ))}
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? 'جارٍ التحليل...' : 'احصل على اقتراحات'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                إنشاء عنصر ذكي
              </h4>
              <Input
                placeholder="اكتب وصفاً لما تريد إنشاؤه..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button 
                onClick={handleGenerateElement}
                disabled={!prompt}
                className="w-full"
              >
                إنشاء بالذكاء الاصطناعي
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                تحليل الكانفاس
              </h4>
              <div className="text-sm text-muted-foreground">
                عدد العناصر: {elements.length}
              </div>
              <Button onClick={handleAnalyze} className="w-full">
                تحليل شامل
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartAssistantPanel;