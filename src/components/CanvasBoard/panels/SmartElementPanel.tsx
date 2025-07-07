import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, GitBranch, MessageSquare, Clock, Brain, 
  Lightbulb, Target, Network, Upload, Calendar
} from 'lucide-react';

interface SmartElementPanelProps {
  onAddSmartElement: (type: string, config: any) => void;
}

const SmartElementPanel: React.FC<SmartElementPanelProps> = ({ onAddSmartElement }) => {
  const [activeElement, setActiveElement] = useState<string>('root');
  const [timelineStart, setTimelineStart] = useState('');
  const [timelineEnd, setTimelineEnd] = useState('');
  const [brainstormMode, setBrainstormMode] = useState('normal');
  const [mindMapInput, setMindMapInput] = useState('');
  const [mindMapMethod, setMindMapMethod] = useState('manual');

  const smartElements = [
    {
      id: 'root',
      label: 'الجذر',
      icon: GitBranch,
      description: 'أداة للربط بين العناصر مع خطوط ذكية',
      color: 'text-blue-500'
    },
    {
      id: 'brainstorm',
      label: 'محرك العصف الذهني',
      icon: Lightbulb,
      description: 'عمود دردشة مخصص للعصف الذهني',
      color: 'text-yellow-500'
    },
    {
      id: 'timeline',
      label: 'الخط الزمني',
      icon: Clock,
      description: 'إضافة خط زمني ومخططات جانت',
      color: 'text-green-500'
    },
    {
      id: 'mindmap',
      label: 'الخرائط الذهنية',
      icon: Target,
      description: 'رسم الخرائط الذهنية يدوياً أو بالذكاء الاصطناعي',
      color: 'text-purple-500'
    },
    {
      id: 'thinkboard',
      label: 'ثنكبورد الذكية',
      icon: Network,
      description: 'جمع العناصر وتوليد الروابط بينها',
      color: 'text-indigo-500'
    }
  ];

  const brainstormModes = [
    { id: 'normal', label: 'عادي', description: 'دردشة جماعية عادية' },
    { id: 'ghost', label: 'المشاركة الشبحية', description: 'كتابة دون رؤية رسائل الآخرين' },
    { id: 'oneWord', label: 'الكلمة الواحدة', description: 'كلمة واحدة فقط لكل رسالة' },
    { id: 'tree', label: 'التفرع الشجري', description: 'ربط الرسائل بعنصر مرجعي' }
  ];

  const mindMapMethods = [
    { id: 'manual', label: 'يدوي', description: 'رسم يدوي كامل' },
    { id: 'ai', label: 'ذكاء اصطناعي', description: 'توليد تلقائي بالكامل' },
    { id: 'hybrid', label: 'مختلط', description: 'دمج العمل اليدوي والذكي' }
  ];

  const handleAddElement = () => {
    let config = {};

    switch (activeElement) {
      case 'root':
        config = { connectionType: 'curved', snapEnabled: true };
        break;
      case 'brainstorm':
        config = { mode: brainstormMode, aiAnalysis: true };
        break;
      case 'timeline':
        config = { startDate: timelineStart, endDate: timelineEnd, type: 'timeline' };
        break;
      case 'mindmap':
        config = { method: mindMapMethod, input: mindMapInput };
        break;
      case 'thinkboard':
        config = { autoLink: true, aiSuggestions: true };
        break;
    }

    onAddSmartElement(activeElement, config);
  };

  const renderElementConfig = () => {
    switch (activeElement) {
      case 'root':
        return (
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
              <h5 className="text-sm font-medium font-arabic mb-2">كيفية الاستخدام:</h5>
              <div className="text-xs text-blue-800 font-arabic space-y-1">
                <div>1. انقر على العنصر الأول</div>
                <div>2. حرك الماوس للعنصر الثاني</div>
                <div>3. انقر لإنشاء الرابط</div>
                <div>4. اكتب التعليق أو المطالبة</div>
              </div>
            </div>
          </div>
        );

      case 'brainstorm':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-arabic mb-2 block">وضع العصف الذهني</label>
              <Select value={brainstormMode} onValueChange={setBrainstormMode}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brainstormModes.map(mode => (
                    <SelectItem key={mode.id} value={mode.id} className="font-arabic">
                      <div>
                        <div className="font-medium">{mode.label}</div>
                        <div className="text-xs text-gray-500">{mode.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-arabic mb-2 block">تاريخ البداية</label>
              <Input
                type="date"
                value={timelineStart}
                onChange={(e) => setTimelineStart(e.target.value)}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div>
              <label className="text-xs font-arabic mb-2 block">تاريخ النهاية</label>
              <Input
                type="date"
                value={timelineEnd}
                onChange={(e) => setTimelineEnd(e.target.value)}
                className="rounded-xl border-gray-200"
              />
            </div>
          </div>
        );

      case 'mindmap':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-arabic mb-2 block">طريقة الإنشاء</label>
              <Select value={mindMapMethod} onValueChange={setMindMapMethod}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mindMapMethods.map(method => (
                    <SelectItem key={method.id} value={method.id} className="font-arabic">
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
                <label className="text-xs font-arabic mb-2 block">النص المدخل</label>
                <Textarea
                  value={mindMapInput}
                  onChange={(e) => setMindMapInput(e.target.value)}
                  placeholder="أدخل النص أو المحتوى لتحليله..."
                  className="font-arabic text-sm rounded-xl border-gray-200 resize-none"
                  rows={3}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs font-arabic rounded-xl"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  رفع ملف
                </Button>
              </div>
            )}
          </div>
        );

      case 'thinkboard':
        return (
          <div className="space-y-3">
            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200">
              <h5 className="text-sm font-medium font-arabic mb-2">ثنكبورد الذكية:</h5>
              <div className="text-xs text-indigo-800 font-arabic space-y-1">
                <div>• جمع العناصر من أماكن مختلفة</div>
                <div>• توليد روابط ذكية بينها</div>
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
          العناصر الذكية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* اختيار العنصر الذكي */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3">نوع العنصر الذكي</h4>
          <div className="space-y-2">
            {smartElements.map(element => {
              const Icon = element.icon;
              return (
                <button
                  key={element.id}
                  onClick={() => setActiveElement(element.id)}
                  className={`w-full p-3 rounded-xl border text-sm text-right font-arabic transition-colors ${
                    activeElement === element.id 
                      ? 'bg-orange-500 text-white border-orange-500' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{element.label}</div>
                      <div className="text-xs opacity-80">{element.description}</div>
                    </div>
                    <Icon className={`w-4 h-4 ${activeElement === element.id ? 'text-white' : element.color}`} />
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

        {/* إضافة العنصر */}
        <Button
          onClick={handleAddElement}
          className="w-full text-sm font-arabic rounded-xl bg-orange-500 hover:bg-orange-600"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          إضافة العنصر الذكي
        </Button>

        {/* معلومات إضافية */}
        <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
          <div className="text-xs text-orange-800 font-arabic space-y-1">
            <div>🧠 العناصر الذكية تستخدم الذكاء الاصطناعي</div>
            <div>🔗 تتفاعل مع العناصر الأخرى تلقائياً</div>
            <div>📊 تحلل البيانات وتقترح التحسينات</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartElementPanel;