import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, GitBranch, MessageSquare, Clock, Brain, 
  Lightbulb, Target, Network, Upload, Calendar,
  Bot, Zap, Settings, Play, Pause
} from 'lucide-react';

interface EnhancedSmartElementPanelProps {
  onAddSmartElement: (type: string, config: any) => void;
  onPreviewElement: (type: string, config: any) => void;
  isAIEnabled: boolean;
  onToggleAI: (enabled: boolean) => void;
}

const EnhancedSmartElementPanel: React.FC<EnhancedSmartElementPanelProps> = ({ 
  onAddSmartElement,
  onPreviewElement,
  isAIEnabled,
  onToggleAI
}) => {
  const [activeElement, setActiveElement] = useState<string>('brainstorm');
  const [activeTab, setActiveTab] = useState('elements');
  
  // Root connector settings
  const [connectionType, setConnectionType] = useState('curved');
  const [connectionStyle, setConnectionStyle] = useState('arrow');
  const [autoRoute, setAutoRoute] = useState(true);
  
  // Brainstorm settings
  const [brainstormMode, setBrainstormMode] = useState('collaborative');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [timeLimit, setTimeLimit] = useState(30);
  const [enableAIAnalysis, setEnableAIAnalysis] = useState(true);
  
  // Timeline settings
  const [timelineStart, setTimelineStart] = useState('');
  const [timelineEnd, setTimelineEnd] = useState('');
  const [timelineType, setTimelineType] = useState('project');
  const [autoSchedule, setAutoSchedule] = useState(false);
  
  // Mindmap settings
  const [mindMapMethod, setMindMapMethod] = useState('hybrid');
  const [mindMapInput, setMindMapInput] = useState('');
  const [maxDepth, setMaxDepth] = useState(5);
  const [autoExpand, setAutoExpand] = useState(true);
  
  // Moodboard settings
  const [autoLink, setAutoLink] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [themeDetection, setThemeDetection] = useState(true);

  const smartElements = [
    {
      id: 'brainstorm',
      label: 'محرك العصف الذهني',
      icon: Lightbulb,
      description: 'عمود دردشة مخصص للعصف الذهني التفاعلي',
      color: 'text-yellow-500',
      category: 'collaborative',
      features: ['تعاون فوري', 'تحليل ذكي', 'تصنيف تلقائي']
    },
    {
      id: 'root-connector',
      label: 'الجذر الذكي',
      icon: GitBranch,
      description: 'أداة ربط متقدمة مع خطوط ذكية ومرنة',
      color: 'text-blue-500',
      category: 'connection',
      features: ['ربط تلقائي', 'مسارات ذكية', 'تحليل العلاقات']
    },
    {
      id: 'timeline',
      label: 'الخط الزمني الذكي',
      icon: Clock,
      description: 'خطوط زمنية تفاعلية مع مخططات جانت',
      color: 'text-green-500',
      category: 'planning',
      features: ['جدولة تلقائية', 'تتبع التقدم', 'تنبيهات ذكية']
    },
    {
      id: 'ai-mindmap',
      label: 'الخرائط الذهنية الذكية',
      icon: Target,
      description: 'خرائط ذهنية بالذكاء الاصطناعي',
      color: 'text-purple-500',
      category: 'analysis',
      features: ['توليد تلقائي', 'تحليل المحتوى', 'توسع ذكي']
    },
    {
      id: 'smart-moodboard',
      label: 'مودبورد ذكية',
      icon: Network,
      description: 'جمع وربط العناصر بذكاء اصطناعي',
      color: 'text-indigo-500',
      category: 'creative',
      features: ['ربط تلقائي', 'اقتراحات ذكية', 'كشف الموضوع']
    }
  ];

  const brainstormModes = [
    { id: 'collaborative', label: 'تعاوني', description: 'دردشة جماعية مفتوحة' },
    { id: 'silent', label: 'صامت', description: 'كتابة دون رؤية رسائل الآخرين' },
    { id: 'rapid', label: 'سريع', description: 'جلسة عصف ذهني سريعة' },
    { id: 'structured', label: 'منظم', description: 'عصف ذهني منظم بمراحل' }
  ];

  const connectionTypes = [
    { id: 'straight', label: 'مستقيم' },
    { id: 'curved', label: 'منحني' },
    { id: 'orthogonal', label: 'متعامد' },
    { id: 'organic', label: 'عضوي' }
  ];

  const timelineTypes = [
    { id: 'project', label: 'مشروع' },
    { id: 'milestone', label: 'معالم' },
    { id: 'gantt', label: 'جانت' },
    { id: 'roadmap', label: 'خارطة طريق' }
  ];

  const mindMapMethods = [
    { id: 'manual', label: 'يدوي', description: 'رسم يدوي كامل' },
    { id: 'ai', label: 'ذكاء اصطناعي', description: 'توليد تلقائي بالكامل' },
    { id: 'hybrid', label: 'مختلط', description: 'دمج العمل اليدوي والذكي' }
  ];

  const handleAddElement = () => {
    const configs = {
      'brainstorm': {
        mode: brainstormMode,
        maxParticipants,
        timeLimit,
        aiAnalysis: enableAIAnalysis,
        isAIEnabled
      },
      'root-connector': {
        connectionType,
        connectionStyle,
        autoRoute,
        snapEnabled: true
      },
      'timeline': {
        startDate: timelineStart,
        endDate: timelineEnd,
        type: timelineType,
        autoSchedule
      },
      'ai-mindmap': {
        method: mindMapMethod,
        input: mindMapInput,
        maxDepth,
        autoExpand
      },
      'smart-moodboard': {
        autoLink,
        aiSuggestions,
        themeDetection
      }
    };

    onAddSmartElement(activeElement, configs[activeElement as keyof typeof configs] || {});
  };

  const handlePreview = () => {
    const configs = {
      'brainstorm': { mode: brainstormMode, aiAnalysis: enableAIAnalysis },
      'root-connector': { connectionType, connectionStyle },
      'timeline': { type: timelineType, startDate: timelineStart },
      'ai-mindmap': { method: mindMapMethod, input: mindMapInput },
      'smart-moodboard': { autoLink, aiSuggestions }
    };

    onPreviewElement(activeElement, configs[activeElement as keyof typeof configs] || {});
  };

  const renderElementConfig = () => {
    switch (activeElement) {
      case 'brainstorm':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-arabic mb-2 block">وضع العصف الذهني</Label>
              <Select value={brainstormMode} onValueChange={setBrainstormMode}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brainstormModes.map(mode => (
                    <SelectItem key={mode.id} value={mode.id}>
                      <div>
                        <div className="font-medium">{mode.label}</div>
                        <div className="text-xs text-gray-500">{mode.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-arabic">المشاركون</Label>
                <Input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 10)}
                  className="rounded-xl"
                  min={2}
                  max={50}
                />
              </div>
              <div>
                <Label className="text-xs font-arabic">المدة (دقيقة)</Label>
                <Input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 30)}
                  className="rounded-xl"
                  min={5}
                  max={120}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-arabic">تحليل بالذكاء الاصطناعي</Label>
              <Switch
                checked={enableAIAnalysis}
                onCheckedChange={setEnableAIAnalysis}
              />
            </div>
          </div>
        );

      case 'root-connector':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-arabic mb-2 block">نوع الاتصال</Label>
              <Select value={connectionType} onValueChange={setConnectionType}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {connectionTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-arabic">توجيه تلقائي</Label>
              <Switch
                checked={autoRoute}
                onCheckedChange={setAutoRoute}
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-xl">
              <h5 className="text-sm font-medium font-arabic mb-2">كيفية الاستخدام:</h5>
              <div className="text-xs text-blue-800 font-arabic space-y-1">
                <div>1. انقر على العنصر الأول</div>
                <div>2. اسحب للعنصر الثاني</div>
                <div>3. اتركه لإنشاء الرابط</div>
              </div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-arabic mb-2 block">نوع الخط الزمني</Label>
              <Select value={timelineType} onValueChange={setTimelineType}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timelineTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-arabic">تاريخ البداية</Label>
                <Input
                  type="date"
                  value={timelineStart}
                  onChange={(e) => setTimelineStart(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-arabic">تاريخ النهاية</Label>
                <Input
                  type="date"
                  value={timelineEnd}
                  onChange={(e) => setTimelineEnd(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-arabic">جدولة تلقائية</Label>
              <Switch
                checked={autoSchedule}
                onCheckedChange={setAutoSchedule}
              />
            </div>
          </div>
        );

      case 'ai-mindmap':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-arabic mb-2 block">طريقة الإنشاء</Label>
              <Select value={mindMapMethod} onValueChange={setMindMapMethod}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mindMapMethods.map(method => (
                    <SelectItem key={method.id} value={method.id}>
                      <div>
                        <div className="font-medium">{method.label}</div>
                        <div className="text-xs text-gray-500">{method.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {mindMapMethod !== 'manual' && (
              <div>
                <Label className="text-xs font-arabic mb-2 block">النص المدخل</Label>
                <Textarea
                  value={mindMapInput}
                  onChange={(e) => setMindMapInput(e.target.value)}
                  placeholder="أدخل النص أو المحتوى لتحليله وتحويله إلى خريطة ذهنية..."
                  className="font-arabic text-sm rounded-xl resize-none"
                  rows={3}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-arabic">العمق الأقصى</Label>
                <Input
                  type="number"
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(parseInt(e.target.value) || 5)}
                  className="rounded-xl"
                  min={2}
                  max={10}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-arabic">توسع تلقائي</Label>
                <Switch
                  checked={autoExpand}
                  onCheckedChange={setAutoExpand}
                />
              </div>
            </div>
          </div>
        );

      case 'smart-moodboard':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-arabic">ربط تلقائي</Label>
                <Switch
                  checked={autoLink}
                  onCheckedChange={setAutoLink}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-arabic">اقتراحات ذكية</Label>
                <Switch
                  checked={aiSuggestions}
                  onCheckedChange={setAiSuggestions}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-arabic">كشف الموضوع</Label>
                <Switch
                  checked={themeDetection}
                  onCheckedChange={setThemeDetection}
                />
              </div>
            </div>

            <div className="bg-indigo-50 p-3 rounded-xl">
              <h5 className="text-sm font-medium font-arabic mb-2">مودبورد ذكية:</h5>
              <div className="text-xs text-indigo-800 font-arabic space-y-1">
                <div>• جمع العناصر من مصادر متعددة</div>
                <div>• توليد روابط ذكية تلقائياً</div>
                <div>• تطوير الأفكار إلى عناصر جديدة</div>
                <div>• تحليل العلاقات والأنماط</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          العناصر الذكية المتقدمة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="elements" className="text-xs font-arabic">العناصر</TabsTrigger>
            <TabsTrigger value="ai-settings" className="text-xs font-arabic">الذكاء الاصطناعي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="elements" className="space-y-4">
            {/* اختيار العنصر الذكي */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-3">العناصر الذكية</h4>
              <div className="space-y-2">
                {smartElements.map(element => {
                  const Icon = element.icon;
                  return (
                    <button
                      key={element.id}
                      onClick={() => setActiveElement(element.id)}
                      className={`w-full p-3 rounded-xl border transition-all ${
                        activeElement === element.id 
                          ? 'bg-orange-500 text-white border-orange-500 shadow-lg' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-right flex-1">
                          <div className="flex items-center gap-2 justify-end mb-1">
                            <div className="font-medium text-sm font-arabic">{element.label}</div>
                            <Badge variant="secondary" className="text-xs">
                              {element.category}
                            </Badge>
                          </div>
                          <div className="text-xs opacity-80 font-arabic mb-2">{element.description}</div>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {element.features.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Icon className={`w-5 h-5 flex-shrink-0 ${activeElement === element.id ? 'text-white' : element.color}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* إعدادات العنصر المحدد */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-3">
                إعدادات {smartElements.find(e => e.id === activeElement)?.label}
              </h4>
              {renderElementConfig()}
            </div>

            <Separator />

            {/* أزرار الإجراءات */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handlePreview}
                variant="outline"
                size="sm"
                className="text-xs font-arabic rounded-xl"
              >
                <Play className="w-3 h-3 mr-1" />
                معاينة
              </Button>
              <Button
                onClick={handleAddElement}
                size="sm"
                className="text-xs font-arabic rounded-xl bg-orange-500 hover:bg-orange-600"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                إضافة العنصر
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ai-settings" className="space-y-4">
            {/* حالة الذكاء الاصطناعي */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium font-arabic">الذكاء الاصطناعي</h4>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isAIEnabled}
                    onCheckedChange={onToggleAI}
                  />
                  <Badge variant={isAIEnabled ? "default" : "secondary"}>
                    {isAIEnabled ? 'نشط' : 'متوقف'}
                  </Badge>
                </div>
              </div>
              
              <div className={`p-3 rounded-xl border ${isAIEnabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 text-sm font-arabic">
                  <Bot className={`w-4 h-4 ${isAIEnabled ? 'text-green-600' : 'text-gray-500'}`} />
                  <span className={isAIEnabled ? 'text-green-800' : 'text-gray-600'}>
                    {isAIEnabled ? 'الذكاء الاصطناعي متاح' : 'الذكاء الاصطناعي متوقف'}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* إعدادات الأداء */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-3">إعدادات الأداء</h4>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-arabic rounded-xl justify-start"
                  disabled={!isAIEnabled}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  تحسين الأداء
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-arabic rounded-xl justify-start"
                  disabled={!isAIEnabled}
                >
                  <Settings className="w-3 h-3 mr-1" />
                  إعدادات متقدمة
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* معلومات إضافية */}
        <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
          <div className="text-xs text-orange-800 font-arabic space-y-1">
            <div>🧠 العناصر الذكية تتعلم من استخدامك</div>
            <div>🔗 تتفاعل مع العناصر الأخرى تلقائياً</div>
            <div>📊 تحلل البيانات وتقترح التحسينات</div>
            <div>⚡ تحديثات مستمرة للذكاء الاصطناعي</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSmartElementPanel;