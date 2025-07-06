import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, FileText, Eye, Users, Search, MousePointer, Copy, ZoomIn, Hand, 
  File, MessageSquare, Shapes, Type, Upload, Lightbulb, Clock, GitBranch,
  Target, Layout, Building, TrendingUp, Calendar, Settings, Share,
  Grid, Move, RotateCcw, Save, Download, Filter, Layers
} from 'lucide-react';

interface CanvasBoardContentsProps {
  projectId?: string;
  userId?: string;
}

interface CanvasElement {
  id: string;
  type: 'text' | 'shape' | 'sticky' | 'timeline' | 'mindmap' | 'smart';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: string;
  style?: Record<string, any>;
  locked?: boolean;
}

interface Tool {
  id: string;
  label: string;
  icon: any;
  category: 'basic' | 'smart' | 'file';
}

const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = ({ 
  projectId = 'default', 
  userId = 'user1' 
}) => {
  // إدارة الحالة الأساسية
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [showDefaultView, setShowDefaultView] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoom, setZoom] = useState<number>(100);
  const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // الأدوات الأساسية
  const tools: Tool[] = [
    { id: 'select', label: 'تحديد', icon: MousePointer, category: 'basic' },
    { id: 'repeat', label: 'تكرار', icon: Copy, category: 'basic' },
    { id: 'zoom', label: 'زوم', icon: ZoomIn, category: 'basic' },
    { id: 'hand', label: 'كف', icon: Hand, category: 'basic' },
    { id: 'file', label: 'ملف', icon: File, category: 'file' },
    { id: 'project-convert', label: 'تحويل لمشروع', icon: Target, category: 'smart' },
    { id: 'upload', label: 'رفع ملف', icon: Upload, category: 'file' },
    { id: 'comment', label: 'تعليق', icon: MessageSquare, category: 'basic' },
    { id: 'text', label: 'نص', icon: Type, category: 'basic' },
    { id: 'shape', label: 'شكل', icon: Shapes, category: 'basic' },
    { id: 'smart-element', label: 'عنصر ذكي', icon: Lightbulb, category: 'smart' }
  ];

  // العناصر الذكية
  const smartElements = [
    { id: 'brainstorm', label: 'محرك العصف الذهني', icon: Lightbulb },
    { id: 'root', label: 'الجذر', icon: GitBranch },
    { id: 'timeline', label: 'الخط الزمني', icon: Clock },
    { id: 'mindmap', label: 'الخرائط الذهنية', icon: Target },
    { id: 'moodboard', label: 'مودبورد ذكية', icon: Layout }
  ];

  // إضافة عنصر جديد
  const addElement = useCallback((x: number, y: number) => {
    if (selectedTool === 'select' || selectedTool === 'hand' || selectedTool === 'zoom') return;

    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type: selectedTool as any,
      position: { x, y },
      size: { width: 120, height: 80 },
      content: selectedTool === 'text' ? 'نص جديد' : selectedTool === 'sticky' ? 'ملاحظة' : undefined
    };

    setElements(prev => [...prev, newElement]);
  }, [selectedTool]);

  // التعامل مع النقر على الكانفس
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    addElement(x, y);
  }, [addElement, zoom, canvasPosition]);

  // واجهة افتراضية - 4 أيقونات رئيسية
  const DefaultView = () => (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center space-y-8 max-w-4xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 font-arabic">لوحة التخطيط التشاركي</h1>
          <p className="text-lg text-gray-600 font-arabic">ابدأ مشروعك الجديد أو تابع العمل على مشروع موجود</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
            onClick={() => {
              setShowDefaultView(false);
              setSelectedTool('select');
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-arabic">جديد</h3>
              <p className="text-sm text-gray-600 text-center font-arabic">
                كانفس جديدة تماماً للبدء من الصفر
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Layout className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-arabic">قالب</h3>
              <p className="text-sm text-gray-600 text-center font-arabic">
                ابدأ بقالب جاهز معد مسبقاً
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-arabic">ملف</h3>
              <p className="text-sm text-gray-600 text-center font-arabic">
                تحليل ملف وإنتاج كانفس بالذكاء الاصطناعي
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-arabic">مراجعة</h3>
              <p className="text-sm text-gray-600 text-center font-arabic">
                مراجعة المشاريع وإنتاج تقارير
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 font-arabic">الكانفسات المحفوظة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="cursor-pointer hover:shadow-md transition-all bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <Layout className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-800 font-arabic">كانفس المشروع {i}</h4>
                  <p className="text-sm text-gray-500 mt-1 font-arabic">آخر تعديل منذ {i} أيام</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // شريط الأدوات الرئيسي
  const MainToolbar = () => (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0">
        <CardContent className="flex items-center gap-2 p-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="sm"
                className={`h-10 px-3 ${selectedTool === tool.id ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                onClick={() => setSelectedTool(tool.id)}
                title={tool.label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );

  // شريط التواصل والمستخدمين (CollabBar)
  const CollabBar = () => (
    <div className="fixed top-4 left-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic flex items-center gap-2">
            <Users className="w-5 h-5" />
            التعاون والتواصل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['المستخدم 1', 'المستخدم 2'].map((user, i) => (
                <div key={i} className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                  {user[0]}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              دعوة
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                دردشة نصية
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                دردشة صوتية
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // شريط خصائص الأدوات (ToolPropsBar)
  const ToolPropsBar = () => (
    <div className="fixed bottom-24 left-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic">خصائص الأداة</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTool === 'select' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="الموقع X" />
                <Input placeholder="الموقع Y" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="العرض" />
                <Input placeholder="الارتفاع" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">قص</Button>
                <Button variant="outline" size="sm">نسخ</Button>
                <Button variant="outline" size="sm">لصق</Button>
                <Button variant="outline" size="sm">حذف</Button>
              </div>
            </div>
          )}
          
          {selectedTool === 'zoom' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Input value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                <Input placeholder="الأفقي" />
                <Input placeholder="العمودي" />
              </div>
              <select className="w-full p-2 border rounded">
                <option value="50">50%</option>
                <option value="75">75%</option>
                <option value="100">100%</option>
                <option value="125">125%</option>
                <option value="150">150%</option>
                <option value="fit">ملاءمة</option>
              </select>
            </div>
          )}

          {selectedTool === 'smart-element' && (
            <div className="space-y-3">
              <h4 className="font-medium font-arabic">العناصر الذكية</h4>
              <div className="grid grid-cols-1 gap-2">
                {smartElements.map((element) => {
                  const Icon = element.icon;
                  return (
                    <Button
                      key={element.id}
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {element.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // المفتش (Inspector)
  const Inspector = () => (
    <div className="fixed top-4 right-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic">المفتش</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedElementId ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium font-arabic">النص</label>
                <Input placeholder="أدخل النص..." />
              </div>
              <div>
                <label className="text-sm font-medium font-arabic">اللون</label>
                <div className="flex gap-2 mt-1">
                  {['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200'].map((color) => (
                    <div key={color} className={`w-8 h-8 rounded cursor-pointer border-2 ${color}`} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium font-arabic">الروابط</label>
                <Input placeholder="https://..." />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center font-arabic">حدد عنصراً لتحريره</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // حوار الذكاء الاصطناعي (AI Panel)
  const AIPanel = () => (
    <div className="fixed bottom-4 right-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            الذكاء الاصطناعي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm">أكمل</Button>
            <Button variant="outline" size="sm">حلل</Button>
            <Button variant="outline" size="sm">اختصر</Button>
          </div>
          
          <div className="space-y-2">
            <Input placeholder="اسأل المساعد الذكي..." />
            <Button className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              إرسال
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 font-arabic">اقتراح ذكي</span>
            </div>
            <p className="text-sm text-blue-700 font-arabic">
              يمكنني مساعدتك في تنظيم المهام وإنشاء جدول زمني للمشروع
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // الكانفس الرئيسية
  const Canvas = () => (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* الشبكة */}
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
      )}

      {/* منطقة الرسم */}
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        style={{
          transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`
        }}
        onClick={handleCanvasClick}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            className={`absolute border-2 ${selectedElementId === element.id ? 'border-blue-500' : 'border-transparent'} 
                      ${element.locked ? 'cursor-not-allowed' : 'cursor-move'} hover:border-blue-300 transition-colors`}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElementId(element.id);
            }}
          >
            {element.type === 'text' && (
              <div className="w-full h-full flex items-center justify-center bg-yellow-200 rounded p-2">
                <span className="text-sm font-arabic">{element.content || 'نص جديد'}</span>
              </div>
            )}
            {element.type === 'shape' && (
              <div className="w-full h-full bg-blue-200 rounded border-2 border-blue-400" />
            )}
            {element.type === 'sticky' && (
              <div className="w-full h-full bg-yellow-300 rounded shadow-md p-2 border border-yellow-400">
                <span className="text-xs font-arabic">{element.content || 'ملاحظة'}</span>
              </div>
            )}
            {element.type === 'timeline' && (
              <div className="w-full h-full bg-green-200 rounded border-2 border-green-400 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            )}
            {element.type === 'mindmap' && (
              <div className="w-full h-full bg-purple-200 rounded border-2 border-purple-400 flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* شريط الطبقات السفلي */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>العناصر: {elements.length}</span>
            <span>المحددة: {selectedElementId ? 1 : 0}</span>
            <span>الزوم: {zoom}%</span>
            <span>الأداة: {tools.find(t => t.id === selectedTool)?.label}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className={showGrid ? 'bg-blue-100' : ''}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSnapEnabled(!snapEnabled)}
              className={snapEnabled ? 'bg-blue-100' : ''}
            >
              <Move className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (showDefaultView) {
    return <DefaultView />;
  }

  return (
    <div className="relative w-full h-full">
      <Canvas />
      <CollabBar />
      <ToolPropsBar />
      <Inspector />
      <AIPanel />
      <MainToolbar />
    </div>
  );
};

export default CanvasBoardContents;