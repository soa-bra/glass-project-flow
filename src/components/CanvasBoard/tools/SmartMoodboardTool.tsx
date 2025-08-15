import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Layout, Image, Palette, Zap, Link2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface MoodboardElement {
  id: string;
  type: 'image' | 'color' | 'text' | 'shape';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  metadata?: any;
}

interface MoodboardConnection {
  id: string;
  fromId: string;
  toId: string;
  relationship: string;
  strength: number; // 1-10
}

interface SmartMoodboard {
  id: string;
  title: string;
  elements: MoodboardElement[];
  connections: MoodboardConnection[];
  theme: string;
  position: { x: number; y: number };
}

interface SmartMoodboardToolProps {
  selectedTool: string;
  onCreateMoodboard: (moodboard: SmartMoodboard) => void;
  onExpandToCanvas: (elements: any[]) => void;
}

const SmartMoodboardTool: React.FC<SmartMoodboardToolProps> = ({
  selectedTool,
  onCreateMoodboard,
  onExpandToCanvas
}) => {
  const [moodboardTitle, setMoodboardTitle] = useState('');
  const [selectedElements, setSelectedElements] = useState<MoodboardElement[]>([]);
  const [theme, setTheme] = useState('creative');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [connections, setConnections] = useState<MoodboardConnection[]>([]);
  const [currentElement, setCurrentElement] = useState({ type: 'text', content: '' });

  if (selectedTool !== 'moodboard') return null;

  const handleAddElement = () => {
    if (!currentElement.content.trim()) return;

    const newElement: MoodboardElement = {
      id: `element-${Date.now()}`,
      type: currentElement.type as 'image' | 'color' | 'text' | 'shape',
      content: currentElement.content,
      position: { 
        x: Math.random() * 200 + 50, 
        y: Math.random() * 150 + 50 
      },
      size: { width: 100, height: 60 }
    };

    setSelectedElements(prev => [...prev, newElement]);
    setCurrentElement({ type: 'text', content: '' });
    toast.success('تم إضافة العنصر للمودبورد');
  };

  const handleAnalyzeConnections = async () => {
    if (selectedElements.length < 2) {
      toast.error('يجب إضافة عنصرين على الأقل');
      return;
    }

    setIsAnalyzing(true);
    
    // محاكاة تحليل الذكاء الاصطناعي
    setTimeout(() => {
      const aiConnections: MoodboardConnection[] = [];
      
      // تحليل العلاقات بين العناصر
      for (let i = 0; i < selectedElements.length - 1; i++) {
        for (let j = i + 1; j < selectedElements.length; j++) {
          const connection: MoodboardConnection = {
            id: `conn-${i}-${j}`,
            fromId: selectedElements[i].id,
            toId: selectedElements[j].id,
            relationship: generateRelationship(selectedElements[i], selectedElements[j]),
            strength: Math.floor(Math.random() * 10) + 1
          };
          aiConnections.push(connection);
        }
      }

      setConnections(aiConnections);
      setIsAnalyzing(false);
      toast.success(`تم اكتشاف ${aiConnections.length} رابط ذكي`);
    }, 2000);
  };

  const generateRelationship = (elem1: MoodboardElement, elem2: MoodboardElement): string => {
    const relationships = [
      'تناغم لوني',
      'تشابه موضوعي',
      'تباين مرئي',
      'تدفق بصري',
      'رابط مفاهيمي',
      'تناسق تصميمي'
    ];
    return relationships[Math.floor(Math.random() * relationships.length)];
  };

  const handleCreateMoodboard = () => {
    if (!moodboardTitle.trim() || selectedElements.length === 0) {
      toast.error('يرجى إدخال العنوان وإضافة عناصر');
      return;
    }

    const moodboard: SmartMoodboard = {
      id: `moodboard-${Date.now()}`,
      title: moodboardTitle,
      elements: selectedElements,
      connections,
      theme,
      position: { x: 100, y: 100 }
    };

    onCreateMoodboard(moodboard);
    resetForm();
    toast.success('تم إنشاء المودبورد الذكية');
  };

  const handleExpandToCanvas = () => {
    if (selectedElements.length === 0) {
      toast.error('لا توجد عناصر للتوسيع');
      return;
    }

    // تحويل عناصر المودبورد إلى عناصر كانفس
    const canvasElements = selectedElements.map((element, index) => ({
      id: `expanded-${element.id}`,
      type: element.type === 'image' ? 'shape' : 'text',
      content: element.content,
      position: { 
        x: 150 + (index % 3) * 200, 
        y: 150 + Math.floor(index / 3) * 150 
      },
      size: { width: 150, height: 100 },
      style: {
        backgroundColor: element.type === 'color' ? element.content : undefined
      }
    }));

    // إضافة الروابط كعناصر نصية
    const connectionElements = connections.map((conn, index) => ({
      id: `connection-${conn.id}`,
      type: 'sticky',
      content: `${conn.relationship} (قوة: ${conn.strength}/10)`,
      position: { 
        x: 300 + (index % 2) * 250, 
        y: 300 + Math.floor(index / 2) * 100 
      },
      size: { width: 200, height: 80 }
    }));

    onExpandToCanvas([...canvasElements, ...connectionElements]);
    toast.success('تم توسيع المودبورد على الكانفس');
  };

  const resetForm = () => {
    setMoodboardTitle('');
    setSelectedElements([]);
    setConnections([]);
    setCurrentElement({ type: 'text', content: '' });
  };

  const removeElement = (elementId: string) => {
    setSelectedElements(prev => prev.filter(el => el.id !== elementId));
    setConnections(prev => prev.filter(conn => 
      conn.fromId !== elementId && conn.toId !== elementId
    ));
    toast.success('تم حذف العنصر');
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm border-black/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Layout className="w-5 h-5 text-pink-500" />
          مودبورد ذكية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* عنوان المودبورد */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">عنوان المودبورد</label>
          <Input
            value={moodboardTitle}
            onChange={(e) => setMoodboardTitle(e.target.value)}
            placeholder="مثال: مودبورد العلامة التجارية"
            className="font-arabic"
          />
        </div>

        {/* إضافة عناصر */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">إضافة عنصر</label>
          <div className="flex gap-2 mb-2">
            <select 
              value={currentElement.type} 
              onChange={(e) => setCurrentElement(prev => ({ ...prev, type: e.target.value }))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="text">نص</option>
              <option value="color">لون</option>
              <option value="image">صورة</option>
              <option value="shape">شكل</option>
            </select>
            <Input
              value={currentElement.content}
              onChange={(e) => setCurrentElement(prev => ({ ...prev, content: e.target.value }))}
              placeholder={
                currentElement.type === 'color' ? '#ff0000' :
                currentElement.type === 'image' ? 'رابط الصورة' :
                'محتوى العنصر'
              }
              className="flex-1 font-arabic"
            />
            <Button onClick={handleAddElement} size="sm">
              <Image className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* العناصر المضافة */}
        {selectedElements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium font-arabic mb-2">العناصر ({selectedElements.length})</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedElements.map((element) => (
                <div key={element.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <BaseBadge variant="outline" className="text-xs">
                      {element.type}
                    </BaseBadge>
                    <span className="font-arabic truncate">{element.content}</span>
                  </div>
                  <Button
                    onClick={() => removeElement(element.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* تحليل الروابط */}
        <Button 
          onClick={handleAnalyzeConnections}
          disabled={selectedElements.length < 2 || isAnalyzing}
          variant="outline"
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              جاري التحليل...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              تحليل الروابط بالذكاء الاصطناعي
            </>
          )}
        </Button>

        {/* الروابط المكتشفة */}
        {connections.length > 0 && (
          <div>
            <h4 className="text-sm font-medium font-arabic mb-2">الروابط المكتشفة</h4>
            <div className="max-h-24 overflow-y-auto space-y-1">
              {connections.slice(0, 3).map((connection) => (
                <div key={connection.id} className="bg-blue-50 p-2 rounded text-xs">
                  <div className="flex items-center gap-1 font-arabic">
                    <Link2 className="w-3 h-3" />
                    {connection.relationship}
                    <BaseBadge variant="secondary" className="text-xs">
                      {connection.strength}/10
                    </BaseBadge>
                  </div>
                </div>
              ))}
              {connections.length > 3 && (
                <div className="text-center text-xs text-gray-500 font-arabic">
                  و {connections.length - 3} روابط أخرى...
                </div>
              )}
            </div>
          </div>
        )}

        {/* أزرار العمل */}
        <div className="space-y-2">
          <Button 
            onClick={handleCreateMoodboard}
            disabled={!moodboardTitle.trim() || selectedElements.length === 0}
            className="w-full"
          >
            <Palette className="w-4 h-4 mr-2" />
            إنشاء مودبورد
          </Button>
          
          {selectedElements.length > 0 && (
            <Button 
              onClick={handleExpandToCanvas}
              variant="outline"
              className="w-full"
            >
              <Layout className="w-4 h-4 mr-2" />
              توسيع على الكانفس
            </Button>
          )}
        </div>

        {/* معلومات */}
        <div className="bg-pink-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">المودبورد الذكية:</h4>
          <ul className="text-xs text-pink-800 font-arabic space-y-1">
            <li>• تحليل ذكي للعلاقات</li>
            <li>• ربط تلقائي أو يدوي</li>
            <li>• توسيع لعناصر كانفس</li>
            <li>• تصدير وتطوير الأفكار</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartMoodboardTool;