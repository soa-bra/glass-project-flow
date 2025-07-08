
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointer, PenTool, ZoomIn, Upload, MessageSquare, 
  Type, Square, Lightbulb, Settings, Palette, Move3D,
  Grid, Layers, Hand
} from 'lucide-react';

interface ToolCustomizationPanelProps {
  selectedTool: string;
  onToolSettingChange?: (setting: string, value: any) => void;
}

const EnhancedToolCustomizationPanel: React.FC<ToolCustomizationPanelProps> = ({
  selectedTool,
  onToolSettingChange
}) => {
  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'select': return <MousePointer className="w-5 h-5" />;
      case 'smart-pen': return <PenTool className="w-5 h-5" />;
      case 'zoom': return <ZoomIn className="w-5 h-5" />;
      case 'upload': return <Upload className="w-5 h-5" />;
      case 'comment': return <MessageSquare className="w-5 h-5" />;
      case 'text': return <Type className="w-5 h-5" />;
      case 'shape': return <Square className="w-5 h-5" />;
      case 'smart-element': return <Lightbulb className="w-5 h-5" />;
      case 'grid': return <Grid className="w-5 h-5" />;
      case 'layers': return <Layers className="w-5 h-5" />;
      case 'hand': return <Hand className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getToolName = (tool: string) => {
    switch (tool) {
      case 'select': return 'أداة التحديد';
      case 'smart-pen': return 'القلم الذكي';
      case 'zoom': return 'أداة التكبير';
      case 'upload': return 'رفع المرفقات';
      case 'comment': return 'التعليقات التفاعلية';
      case 'text': return 'أداة النص';
      case 'shape': return 'أداة الأشكال';
      case 'smart-element': return 'العناصر الذكية';
      case 'grid': return 'الشبكة';
      case 'layers': return 'الطبقات';
      case 'hand': return 'اليد';
      default: return 'أداة غير معروفة';
    }
  };

  const renderToolCustomization = () => {
    switch (selectedTool) {
      case 'select':
        return (
          <Tabs defaultValue="arrange" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/30 rounded-xl">
              <TabsTrigger value="arrange" className="rounded-xl font-arabic text-sm">ترتيب</TabsTrigger>
              <TabsTrigger value="transform" className="rounded-xl font-arabic text-sm">تحويل</TabsTrigger>
            </TabsList>
            
            <TabsContent value="arrange" className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button className="rounded-xl font-arabic text-xs">إحضار للأمام</Button>
                <Button className="rounded-xl font-arabic text-xs">إرسال للخلف</Button>
                <Button className="rounded-xl font-arabic text-xs">تجميع</Button>
                <Button className="rounded-xl font-arabic text-xs">إلغاء التجميع</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="transform" className="space-y-3 mt-4">
              <div className="grid grid-cols-3 gap-2">
                <Button className="rounded-xl font-arabic text-xs">دوران 90°</Button>
                <Button className="rounded-xl font-arabic text-xs">قلب أفقي</Button>
                <Button className="rounded-xl font-arabic text-xs">قلب عمودي</Button>
              </div>
            </TabsContent>
          </Tabs>
        );

      case 'smart-pen':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">سمك الخط</h4>
              <Slider defaultValue={[2]} max={10} min={1} step={1} className="w-full" />
            </div>
            
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">الأوضاع الذكية</h4>
              <div className="grid grid-cols-2 gap-2">
                <Badge className="p-2 justify-center rounded-xl bg-[#96d8d0] text-[#000000]">
                  رسم ذكي
                </Badge>
                <Badge className="p-2 justify-center rounded-xl bg-[#a4e2f6] text-[#000000]">
                  تجميع
                </Badge>
                <Badge className="p-2 justify-center rounded-xl bg-[#f1b5b9] text-[#000000]">
                  مسح
                </Badge>
                <Badge className="p-2 justify-center rounded-xl bg-[#bdeed3] text-[#000000]">
                  جذر
                </Badge>
              </div>
            </div>
          </div>
        );

      case 'comment':
        return (
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/30 rounded-xl">
              <TabsTrigger value="text" className="rounded-xl font-arabic text-sm">تعليق نصي</TabsTrigger>
              <TabsTrigger value="draw" className="rounded-xl font-arabic text-sm">رسم توضيحي</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-3 mt-4">
              <Input 
                placeholder="نص التعليق..." 
                className="rounded-xl border-white/30 bg-white/50 text-[#000000] font-arabic" 
              />
              <div className="grid grid-cols-3 gap-2">
                <Button className="rounded-xl font-arabic text-xs bg-[#fbe2aa]">تحذير</Button>
                <Button className="rounded-xl font-arabic text-xs bg-[#96d8d0]">معلومة</Button>
                <Button className="rounded-xl font-arabic text-xs bg-[#f1b5b9]">مهم</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="draw" className="space-y-3 mt-4">
              <div className="text-center py-4 text-gray-600 font-arabic">
                <PenTool className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">يتم تفعيل الرسم التوضيحي من قبل المضيف</p>
              </div>
            </TabsContent>
          </Tabs>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">حجم الخط</h4>
              <Slider defaultValue={[16]} max={72} min={8} step={2} className="w-full" />
            </div>
            
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">نمط النص</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button className="rounded-xl font-arabic text-xs">عادي</Button>
                <Button className="rounded-xl font-arabic text-xs font-bold">عريض</Button>
                <Button className="rounded-xl font-arabic text-xs italic">مائل</Button>
                <Button className="rounded-xl font-arabic text-xs underline">تحته خط</Button>
              </div>
            </div>
          </div>
        );

      case 'shape':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">الأشكال الأساسية</h4>
              <div className="grid grid-cols-4 gap-2">
                {/* Row 1 */}
                <Button className="aspect-square rounded-xl bg-[#96d8d0] hover:bg-[#7cc4bc]">
                  <div className="w-4 h-4 bg-[#000000] rounded-sm" />
                </Button>
                <Button className="aspect-square rounded-xl bg-[#a4e2f6] hover:bg-[#8dd5f1]">
                  <div className="w-4 h-4 bg-[#000000] rounded-full" />
                </Button>
                <Button className="aspect-square rounded-xl bg-[#f1b5b9] hover:bg-[#ed9ca1]">
                  <div className="w-4 h-2 bg-[#000000]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                </Button>
                <Button className="aspect-square rounded-xl bg-[#bdeed3] hover:bg-[#a5e6c7]">
                  <div className="w-4 h-4 bg-[#000000]" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }} />
                </Button>
                
                {/* Row 2 */}
                <Button className="aspect-square rounded-xl bg-[#d9d2fd] hover:bg-[#cfc6fc]">
                  <div className="w-4 h-4 bg-[#000000]" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
                </Button>
                <Button className="aspect-square rounded-xl bg-[#fbe2aa] hover:bg-[#f9db94]">
                  <div className="w-4 h-4 bg-[#000000]" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
                </Button>
                <Button className="aspect-square rounded-xl bg-[#e9eff4] hover:bg-[#dde7ed]">
                  <div className="w-4 h-3 bg-[#000000]" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)' }} />
                </Button>
                <Button className="aspect-square rounded-xl bg-[#d1e1ea] hover:bg-[#c5d6e1]">
                  <div className="w-4 h-1 bg-[#000000] rounded-full" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">أشكال متقدمة</h4>
              <div className="grid grid-cols-4 gap-2">
                <Button className="aspect-square rounded-xl bg-[#96d8d0] hover:bg-[#7cc4bc]">
                  ❤️
                </Button>
                <Button className="aspect-square rounded-xl bg-[#a4e2f6] hover:bg-[#8dd5f1]">
                  ⚡
                </Button>
                <Button className="aspect-square rounded-xl bg-[#f1b5b9] hover:bg-[#ed9ca1]">
                  🏠
                </Button>
                <Button className="aspect-square rounded-xl bg-[#bdeed3] hover:bg-[#a5e6c7]">
                  🔍
                </Button>
                <Button className="aspect-square rounded-xl bg-[#d9d2fd] hover:bg-[#cfc6fc]">
                  📱
                </Button>
                <Button className="aspect-square rounded-xl bg-[#fbe2aa] hover:bg-[#f9db94]">
                  💡
                </Button>
                <Button className="aspect-square rounded-xl bg-[#e9eff4] hover:bg-[#dde7ed]">
                  🎯
                </Button>
                <Button className="aspect-square rounded-xl bg-[#d1e1ea] hover:bg-[#c5d6e1]">
                  ⭐
                </Button>
              </div>
            </div>
          </div>
        );

      case 'smart-element':
        return (
          <Tabs defaultValue="elements" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/30 rounded-xl">
              <TabsTrigger value="elements" className="rounded-xl font-arabic text-sm">العناصر</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-xl font-arabic text-sm">الإعدادات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="elements" className="space-y-3 mt-4">
              <div className="space-y-2">
                <Button className="w-full justify-start rounded-xl bg-white/30 hover:bg-white/50 text-[#000000] font-arabic">
                  <div className="w-4 h-4 bg-[#96d8d0] rounded mr-2" />
                  العصف الذهني
                </Button>
                <Button className="w-full justify-start rounded-xl bg-white/30 hover:bg-white/50 text-[#000000] font-arabic">
                  <div className="w-4 h-4 bg-[#a4e2f6] rounded mr-2" />
                  الخط الزمني
                </Button>
                <Button className="w-full justify-start rounded-xl bg-white/30 hover:bg-white/50 text-[#000000] font-arabic">
                  <div className="w-4 h-4 bg-[#f1b5b9] rounded mr-2" />
                  الخرائط الذهنية
                </Button>
                <Button className="w-full justify-start rounded-xl bg-white/30 hover:bg-white/50 text-[#000000] font-arabic">
                  <div className="w-4 h-4 bg-[#bdeed3] rounded mr-2" />
                  لوحة كانبان
                </Button>
                <Button className="w-full justify-start rounded-xl bg-white/30 hover:bg-white/50 text-[#000000] font-arabic">
                  <div className="w-4 h-4 bg-[#d9d2fd] rounded mr-2" />
                  أداة التصويت
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-3 mt-4">
              <div>
                <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">حجم العنصر</h4>
                <Slider defaultValue={[100]} max={300} min={50} step={10} className="w-full" />
              </div>
              
              <div>
                <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">اللون الافتراضي</h4>
                <div className="grid grid-cols-6 gap-2">
                  {['#96d8d0', '#f1b5b9', '#a4e2f6', '#bdeed3', '#d9d2fd', '#fbe2aa'].map(color => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-lg border-2 border-white/30 hover:scale-105 transition-all"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500 font-arabic">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>لا توجد إعدادات متاحة لهذه الأداة</p>
          </div>
        );
    }
  };

  return (
    <Card className="w-80 bg-[#f2f9fb] backdrop-blur-xl shadow-sm border border-white/20 rounded-[24px]" style={{ height: '75%' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic text-[#000000] flex items-center gap-2">
          {getToolIcon(selectedTool)}
          {getToolName(selectedTool)}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="h-full overflow-y-auto">
        {renderToolCustomization()}
      </CardContent>
    </Card>
  );
};

export default EnhancedToolCustomizationPanel;
