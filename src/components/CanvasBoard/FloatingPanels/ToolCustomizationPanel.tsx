import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MousePointer, 
  Pen, 
  ZoomIn, 
  Upload, 
  MessageCircle, 
  Type, 
  Square, 
  Lightbulb,
  Move,
  RotateCw,
  Layers,
  Circle,
  Triangle,
  Star,
  Heart,
  Hexagon
} from 'lucide-react';

interface ToolCustomizationPanelProps {
  visible?: boolean;
  selectedTool?: string;
  onToolAction?: (action: string, data?: any) => void;
}

const ToolCustomizationPanel: React.FC<ToolCustomizationPanelProps> = ({
  visible = true,
  selectedTool = 'select',
  onToolAction
}) => {
  const renderSelectionTool = () => (
    <div className="space-y-4">
      <Tabs defaultValue="arrange" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-soabra-new-canvas-palette-5 rounded-2xl">
          <TabsTrigger 
            value="arrange" 
            className="rounded-xl data-[state=active]:bg-soabra-new-canvas-active-tab data-[state=active]:text-white"
          >
            ترتيب
          </TabsTrigger>
          <TabsTrigger 
            value="transform" 
            className="rounded-xl data-[state=active]:bg-soabra-new-canvas-active-tab data-[state=active]:text-white"
          >
            تحويل
          </TabsTrigger>
        </TabsList>

        <TabsContent value="arrange" className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="rounded-xl">
              <Move className="w-4 h-4 mr-1" />
              تحريك
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Layers className="w-4 h-4 mr-1" />
              تجميع
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="transform" className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="rounded-xl">
              <RotateCw className="w-4 h-4 mr-1" />
              دوران
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl">
              قلب
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderSmartPenTool = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-soabra-new-canvas-text font-arabic">
        إعدادات القلم الذكي
      </h4>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-600">سمك الخط</label>
          <Slider defaultValue={[2]} max={10} min={1} step={1} className="mt-2" />
        </div>
        <div>
          <label className="text-xs text-gray-600">نعومة الخط</label>
          <Slider defaultValue={[50]} max={100} min={0} step={5} className="mt-2" />
        </div>
        <div className="text-xs text-gray-500 p-2 bg-soabra-new-canvas-palette-5 rounded-lg">
          النظام يتعرف تلقائياً على: الرسم الذكي، التجميع، المسح، والجذر
        </div>
      </div>
    </div>
  );

  const renderCommentsTool = () => (
    <div className="space-y-4">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-soabra-new-canvas-palette-5 rounded-2xl">
          <TabsTrigger 
            value="text" 
            className="rounded-xl data-[state=active]:bg-soabra-new-canvas-active-tab data-[state=active]:text-white"
          >
            تعليق نصي
          </TabsTrigger>
          <TabsTrigger 
            value="drawing" 
            className="rounded-xl data-[state=active]:bg-soabra-new-canvas-active-tab data-[state=active]:text-white"
          >
            رسم توضيحي
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs text-gray-600">نمط الفقاعة</label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="rounded-xl">دائرية</Button>
              <Button variant="outline" size="sm" className="rounded-xl">مربعة</Button>
              <Button variant="outline" size="sm" className="rounded-xl">سهم</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="drawing" className="space-y-3">
          <div className="text-xs text-yellow-600 p-2 bg-yellow-50 rounded-lg">
            يتطلب إذن من المضيف
          </div>
          <div className="text-xs text-gray-500 p-2 bg-soabra-new-canvas-palette-5 rounded-lg">
            تُمحى الرسومات تلقائياً عند إلغاء تحديد الأداة
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderShapesTool = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-soabra-new-canvas-text font-arabic">
        الأشكال والأيقونات
      </h4>
      <div className="grid grid-cols-4 gap-2">
        <Button variant="outline" size="sm" className="rounded-xl p-2">
          <Square className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl p-2">
          <Circle className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl p-2">
          <Triangle className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl p-2">
          <Star className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl p-2">
          <Heart className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl p-2">
          <Hexagon className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl p-2">
          <Square className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl p-2">
          <Circle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderSmartElementsTool = () => (
    <div className="space-y-4">
      <Tabs defaultValue="elements" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-soabra-new-canvas-palette-5 rounded-2xl">
          <TabsTrigger 
            value="elements" 
            className="rounded-xl data-[state=active]:bg-soabra-new-canvas-active-tab data-[state=active]:text-white"
          >
            العناصر
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="rounded-xl data-[state=active]:bg-soabra-new-canvas-active-tab data-[state=active]:text-white"
          >
            الإعدادات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="elements" className="space-y-3">
          <div className="space-y-2">
            {[
              { name: 'العناصر الجذر', icon: <Square className="w-4 h-4" /> },
              { name: 'العصف الذهني', icon: <Lightbulb className="w-4 h-4" /> },
              { name: 'الخط الزمني', icon: <Circle className="w-4 h-4" /> },
              { name: 'الخريطة الذهنية', icon: <Triangle className="w-4 h-4" /> }
            ].map((element, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="w-full justify-start gap-2 rounded-xl"
              >
                {element.icon}
                {element.name}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs text-gray-600">حجم العنصر</label>
            <Slider defaultValue={[50]} max={100} min={25} step={5} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-600">كثافة المحتوى</label>
            <Slider defaultValue={[75]} max={100} min={25} step={5} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderDefaultTool = () => (
    <div className="text-center text-gray-500 text-sm p-4">
      اختر أداة لعرض خيارات التخصيص
    </div>
  );

  const getToolContent = () => {
    switch (selectedTool) {
      case 'select': return renderSelectionTool();
      case 'smart-pen': return renderSmartPenTool();
      case 'comment': return renderCommentsTool();
      case 'shape': return renderShapesTool();
      case 'smart-element': return renderSmartElementsTool();
      case 'zoom':
      case 'upload':
        return <div className="text-center text-gray-500 text-sm p-4">تبقى كما هي</div>;
      case 'text':
        return <div className="text-center text-gray-500 text-sm p-4">أداة النص</div>;
      default: return renderDefaultTool();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 w-80 h-96">
      <Card className="bg-soabra-new-canvas-floating-panels rounded-[32px] shadow-sm border-0 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-soabra-new-canvas-text font-arabic">
            تخصيص الأدوات
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full overflow-y-auto">
          {getToolContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolCustomizationPanel;