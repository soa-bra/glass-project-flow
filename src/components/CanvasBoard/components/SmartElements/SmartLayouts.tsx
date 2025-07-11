import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Layout, 
  Grid, 
  Zap, 
  RefreshCw, 
  Maximize, 
  AlignCenter,
  AlignLeft,
  AlignRight,
  Layers,
  RotateCcw,
  Sparkles,
  Brain
} from 'lucide-react';
import { CanvasElement } from '../../types';

interface SmartLayoutsProps {
  elements: CanvasElement[];
  onApplyLayout: (layoutType: string, config: any) => void;
  isProcessing?: boolean;
}

interface LayoutOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'smart' | 'basic' | 'advanced';
  aiPowered: boolean;
}

const layoutOptions: LayoutOption[] = [
  {
    id: 'smart-auto',
    name: 'التخطيط الذكي التلقائي',
    description: 'يحلل المحتوى ويرتب العناصر بالطريقة الأمثل',
    icon: Brain,
    category: 'smart',
    aiPowered: true
  },
  {
    id: 'grid-smart',
    name: 'الشبكة الذكية',
    description: 'شبكة متكيفة تتناسب مع حجم وأهمية العناصر',
    icon: Grid,
    category: 'smart',
    aiPowered: true
  },
  {
    id: 'flow-optimized',
    name: 'التدفق المُحسَّن',
    description: 'ترتيب يحسن تدفق القراءة والتفاعل',
    icon: Zap,
    category: 'smart',
    aiPowered: true
  },
  {
    id: 'hierarchy-smart',
    name: 'التسلسل الهرمي الذكي',
    description: 'ترتيب هرمي يبرز الأولويات والعلاقات',
    icon: Layers,
    category: 'smart',
    aiPowered: true
  },
  {
    id: 'center-align',
    name: 'توسيط',
    description: 'محاذاة جميع العناصر في المنتصف',
    icon: AlignCenter,
    category: 'basic',
    aiPowered: false
  },
  {
    id: 'left-align',
    name: 'محاذاة يسار',
    description: 'ترتيب العناصر من اليسار',
    icon: AlignLeft,
    category: 'basic',
    aiPowered: false
  },
  {
    id: 'distribute-even',
    name: 'التوزيع المتساوي',
    description: 'توزيع العناصر بمسافات متساوية',
    icon: Maximize,
    category: 'advanced',
    aiPowered: false
  }
];

export const SmartLayouts: React.FC<SmartLayoutsProps> = ({
  elements,
  onApplyLayout,
  isProcessing = false
}) => {
  const [selectedLayout, setSelectedLayout] = useState<string>('smart-auto');
  const [layoutConfig, setLayoutConfig] = useState({
    spacing: [20],
    preserveSize: true,
    respectLocks: true,
    animateTransition: true,
    smartGrouping: true
  });
  const [analysisResults, setAnalysisResults] = useState({
    complexity: 'متوسط',
    suggestedLayout: 'smart-auto',
    confidence: 85,
    improvements: ['تحسين المسافات', 'تجميع العناصر المترابطة', 'تحسين التسلسل البصري']
  });

  useEffect(() => {
    // Simulate AI analysis of current canvas state
    if (elements.length > 0) {
      // Analyze elements and provide insights
      const complexity = elements.length > 10 ? 'معقد' : elements.length > 5 ? 'متوسط' : 'بسيط';
      setAnalysisResults(prev => ({
        ...prev,
        complexity,
        confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
      }));
    }
  }, [elements]);

  const handleApplyLayout = () => {
    onApplyLayout(selectedLayout, {
      ...layoutConfig,
      spacing: layoutConfig.spacing[0]
    });
  };

  const getLayoutsByCategory = (category: string) => {
    return layoutOptions.filter(option => option.category === category);
  };

  const renderLayoutOption = (option: LayoutOption) => (
    <Card 
      key={option.id}
      className={`p-3 cursor-pointer transition-all ${
        selectedLayout === option.id 
          ? 'ring-2 ring-primary bg-primary/5' 
          : 'hover:shadow-md'
      }`}
      onClick={() => setSelectedLayout(option.id)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          option.aiPowered ? 'bg-gradient-to-br from-primary/20 to-primary/10' : 'bg-muted'
        }`}>
          <option.icon className={`w-5 h-5 ${option.aiPowered ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{option.name}</h4>
            {option.aiPowered && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                <Sparkles className="w-3 h-3 mr-1" />
                ذكي
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {option.description}
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-primary" />
          التخطيطات الذكية
          <Badge variant="outline" className="mr-auto">
            {elements.length} عنصر
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Analysis */}
        <Card className="p-3 bg-gradient-to-r from-primary/5 to-primary/10">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            تحليل اللوحة
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">التعقيد:</span>
              <span className="font-medium mr-1">{analysisResults.complexity}</span>
            </div>
            <div>
              <span className="text-muted-foreground">الثقة:</span>
              <span className="font-medium mr-1 text-primary">{analysisResults.confidence}%</span>
            </div>
          </div>
          
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">التخطيط المقترح:</span>
            <span className="text-xs font-medium mr-1">
              {layoutOptions.find(l => l.id === analysisResults.suggestedLayout)?.name}
            </span>
          </div>
        </Card>

        {/* Smart Layouts */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            التخطيطات الذكية
          </h4>
          <div className="space-y-2">
            {getLayoutsByCategory('smart').map(renderLayoutOption)}
          </div>
        </div>

        {/* Basic Layouts */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">التخطيطات الأساسية</h4>
          <div className="space-y-2">
            {getLayoutsByCategory('basic').map(renderLayoutOption)}
          </div>
        </div>

        {/* Advanced Layouts */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">التخطيطات المتقدمة</h4>
          <div className="space-y-2">
            {getLayoutsByCategory('advanced').map(renderLayoutOption)}
          </div>
        </div>

        {/* Configuration */}
        <Card className="p-3">
          <h4 className="text-sm font-medium mb-3">إعدادات التخطيط</h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">المسافة بين العناصر</Label>
              <Slider
                value={layoutConfig.spacing}
                onValueChange={(value) => setLayoutConfig(prev => ({ ...prev, spacing: value }))}
                max={50}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground text-center">
                {layoutConfig.spacing[0]} بكسل
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">الحفاظ على الأحجام</Label>
                <Switch
                  checked={layoutConfig.preserveSize}
                  onCheckedChange={(checked) => 
                    setLayoutConfig(prev => ({ ...prev, preserveSize: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs">احترام العناصر المقفلة</Label>
                <Switch
                  checked={layoutConfig.respectLocks}
                  onCheckedChange={(checked) => 
                    setLayoutConfig(prev => ({ ...prev, respectLocks: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs">حركة انتقالية ناعمة</Label>
                <Switch
                  checked={layoutConfig.animateTransition}
                  onCheckedChange={(checked) => 
                    setLayoutConfig(prev => ({ ...prev, animateTransition: checked }))
                  }
                />
              </div>
              
              {selectedLayout.includes('smart') && (
                <div className="flex items-center justify-between">
                  <Label className="text-xs">التجميع الذكي</Label>
                  <Switch
                    checked={layoutConfig.smartGrouping}
                    onCheckedChange={(checked) => 
                      setLayoutConfig(prev => ({ ...prev, smartGrouping: checked }))
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Apply Button */}
        <Button 
          onClick={handleApplyLayout}
          disabled={isProcessing || elements.length === 0}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              جاري التطبيق...
            </>
          ) : (
            <>
              <Layout className="w-4 h-4 mr-2" />
              تطبيق التخطيط
            </>
          )}
        </Button>

        {/* Improvements */}
        {analysisResults.improvements.length > 0 && (
          <Card className="p-3 bg-muted/30">
            <h4 className="text-xs font-medium mb-2">اقتراحات للتحسين</h4>
            <ul className="space-y-1">
              {analysisResults.improvements.map((improvement, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  {improvement}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};