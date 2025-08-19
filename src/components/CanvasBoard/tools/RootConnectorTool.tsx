import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GitBranch, Zap, ArrowRight, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface Connection {
  id: string;
  fromElementId: string;
  toElementId: string;
  label: string;
  position: { x: number; y: number };
}

interface RootConnectorToolProps {
  selectedTool: string;
  elements: any[];
  onCreateConnection: (connection: Connection) => void;
  onCreateElements: (elements: any[]) => void;
}

const RootConnectorTool: React.FC<RootConnectorToolProps> = ({
  selectedTool,
  elements,
  onCreateConnection,
  onCreateElements
}) => {
  const [connectionText, setConnectionText] = useState('');
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [connectionEnd, setConnectionEnd] = useState<string | null>(null);
  const [showFloatingInput, setShowFloatingInput] = useState(false);
  const [floatingInputPosition, setFloatingInputPosition] = useState({ x: 0, y: 0 });

  if (selectedTool !== 'root') return null;

  const handleStartConnection = (elementId: string) => {
    setConnectionStart(elementId);
    setIsDrawingConnection(true);
    toast.success('ابدأ بسحب خط إلى العنصر الهدف');
  };

  const handleCompleteConnection = (targetElementId: string, position: { x: number; y: number }) => {
    if (!connectionStart || connectionStart === targetElementId) return;

    setConnectionEnd(targetElementId);
    setFloatingInputPosition(position);
    setShowFloatingInput(true);
    setIsDrawingConnection(false);
  };

  const handleCreateConnection = () => {
    if (!connectionStart || !connectionEnd || !connectionText.trim()) return;

    const connection: Connection = {
      id: `connection-${Date.now()}`,
      fromElementId: connectionStart,
      toElementId: connectionEnd,
      label: connectionText,
      position: floatingInputPosition
    };

    onCreateConnection(connection);
    
    // محاكاة اقتراحات الذكاء الاصطناعي
    generateAIConnectionSuggestions(connection);
    
    // إعادة تعيين الحالة
    resetConnectionState();
    toast.success('تم إنشاء الرابط بنجاح');
  };

  const generateAIConnectionSuggestions = (connection: Connection) => {
    // محاكاة تحليل الذكاء الاصطناعي للرابط
    const suggestions = [
      `تحويل الرابط "${connection.label}" إلى مجموعة عناصر`,
      'إضافة عناصر متصلة بالرابط',
      'توسيع الرابط بتفاصيل إضافية'
    ];

    setTimeout(() => {
      toast.success(`💡 الذكاء الاصطناعي اقترح: ${suggestions[0]}`);
    }, 1000);
  };

  const handleConvertToElements = () => {
    if (!connectionText.trim()) return;

    // محاكاة تحويل النص إلى عناصر
    const newElements = [
      {
        id: `element-${Date.now()}-1`,
        type: 'text',
        content: connectionText,
        position: { x: floatingInputPosition.x - 60, y: floatingInputPosition.y - 30 },
        size: { width: 120, height: 60 }
      },
      {
        id: `element-${Date.now()}-2`,
        type: 'sticky',
        content: `متصل بـ: ${connectionText}`,
        position: { x: floatingInputPosition.x + 80, y: floatingInputPosition.y - 30 },
        size: { width: 150, height: 80 }
      }
    ];

    onCreateElements(newElements);
    resetConnectionState();
    toast.success('تم تحويل الرابط إلى عناصر');
  };

  const resetConnectionState = () => {
    setConnectionStart(null);
    setConnectionEnd(null);
    setConnectionText('');
    setShowFloatingInput(false);
    setIsDrawingConnection(false);
  };

  return (
    <>
      <Card className="w-80 bg-white/95 backdrop-blur-sm border-black/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-500" />
            أداة الجذر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 font-arabic">
            اربط بين العناصر لإنشاء علاقات ذكية
          </div>

          {/* حالة الرسم */}
          {isDrawingConnection && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800 font-arabic">
                <Link2 className="w-4 h-4" />
                جاري رسم الرابط...
              </div>
              <p className="text-sm text-blue-600 font-arabic mt-1">
                انقر على العنصر الهدف لإكمال الرابط
              </p>
              <Button
                onClick={resetConnectionState}
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
              >
                إلغاء
              </Button>
            </div>
          )}

          {/* العناصر المتاحة للربط */}
          {!isDrawingConnection && (
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">العناصر المتاحة</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {elements.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm font-arabic py-4">
                    لا توجد عناصر للربط
                  </div>
                ) : (
                  elements.map((element) => (
                    <Button
                      key={element.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs font-arabic"
                      onClick={() => handleStartConnection(element.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          element.type === 'text' ? 'bg-yellow-400' :
                          element.type === 'sticky' ? 'bg-green-400' :
                          element.type === 'shape' ? 'bg-blue-400' : 'bg-gray-400'
                        }`} />
                        {element.content || element.type}
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* التعليمات */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium font-arabic mb-2">كيفية الاستخدام:</h4>
            <ol className="text-xs text-gray-600 font-arabic space-y-1">
              <li>1. انقر على العنصر الأول</li>
              <li>2. انقر على العنصر الثاني</li>
              <li>3. اكتب وصف الرابط</li>
              <li>4. حول إلى عناصر أو احفظ كرابط</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* النافذة العائمة لإدخال النص */}
      {showFloatingInput && (
        <div
          className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
          style={{
            left: floatingInputPosition.x,
            top: floatingInputPosition.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-64 space-y-3">
            <h4 className="font-medium font-arabic">وصف الرابط</h4>
            <Input
              value={connectionText}
              onChange={(e) => setConnectionText(e.target.value)}
              placeholder="اكتب وصف العلاقة..."
              className="font-arabic"
              autoFocus
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateConnection} size="sm" className="flex-1">
                حفظ كرابط
              </Button>
              <Button onClick={handleConvertToElements} variant="outline" size="sm" className="flex-1">
                <Zap className="w-3 h-3 mr-1" />
                تحويل
              </Button>
            </div>
            <Button onClick={resetConnectionState} variant="ghost" size="sm" className="w-full">
              إلغاء
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default RootConnectorTool;