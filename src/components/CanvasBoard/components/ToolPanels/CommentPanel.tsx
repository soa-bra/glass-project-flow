import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Pen, Eraser, Palette } from 'lucide-react';

interface CommentPanelProps {
  onCommentAdd: (comment: CommentData) => void;
  onDrawingChange: (settings: DrawingSettings) => void;
  hasHostPermission: boolean;
}

export interface CommentData {
  text: string;
  bubbleStyle: 'normal' | 'highlighted';
  color: string;
}

export interface DrawingSettings {
  tool: 'pen' | 'eraser';
  color: string;
  strokeWidth: number;
}

const bubbleColors = [
  { name: 'أصفر', value: '#fef3c7', border: '#f59e0b' },
  { name: 'أزرق', value: '#dbeafe', border: '#3b82f6' },
  { name: 'رمادي', value: '#f3f4f6', border: '#6b7280' },
  { name: 'أخضر', value: '#d1fae5', border: '#10b981' },
  { name: 'وردي', value: '#fce7f3', border: '#ec4899' },
  { name: 'بنفسجي', value: '#e0e7ff', border: '#8b5cf6' }
];

const drawingColors = [
  { name: 'أحمر', value: '#ef4444' },
  { name: 'أخضر', value: '#10b981' },
  { name: 'أسود', value: '#000000' },
  { name: 'أزرق', value: '#3b82f6' },
  { name: 'برتقالي', value: '#f97316' },
  { name: 'بنفسجي', value: '#8b5cf6' }
];

export const CommentPanel: React.FC<CommentPanelProps> = ({
  onCommentAdd,
  onDrawingChange,
  hasHostPermission
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentStyle, setCommentStyle] = useState<'normal' | 'highlighted'>('normal');
  const [commentColor, setCommentColor] = useState(bubbleColors[0]);
  
  const [drawingSettings, setDrawingSettings] = useState<DrawingSettings>({
    tool: 'pen',
    color: '#ef4444',
    strokeWidth: 3
  });

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    onCommentAdd({
      text: commentText,
      bubbleStyle: commentStyle,
      color: commentColor.value
    });
    
    setCommentText('');
  };

  const updateDrawingSettings = (newSettings: Partial<DrawingSettings>) => {
    const updated = { ...drawingSettings, ...newSettings };
    setDrawingSettings(updated);
    onDrawingChange(updated);
  };

  const clearAllDrawings = () => {
    // إرسال إشارة لمسح جميع الرسوم
    onDrawingChange({ ...drawingSettings, tool: 'eraser' });
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-lg shadow-lg border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-arabic">أداة التعليق التفاعلي</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="text-xs flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              تعليق نصي
            </TabsTrigger>
            <TabsTrigger 
              value="drawing" 
              className="text-xs flex items-center gap-1"
              disabled={!hasHostPermission}
            >
              <Pen className="w-3 h-3" />
              رسم توضيحي
              {!hasHostPermission && (
                <Badge variant="secondary" className="text-xs">مضيف</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            {/* إدخال النص */}
            <div>
              <div className="text-xs font-medium text-gray-700 mb-2">نص التعليق</div>
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                className="min-h-[80px] text-sm"
                dir="rtl"
              />
            </div>

            {/* نمط الفقاعة */}
            <div>
              <div className="text-xs font-medium text-gray-700 mb-2">نمط الفقاعة</div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={commentStyle === 'normal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCommentStyle('normal')}
                  className="text-xs"
                >
                  عادي
                </Button>
                <Button
                  variant={commentStyle === 'highlighted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCommentStyle('highlighted')}
                  className="text-xs"
                >
                  مميز
                </Button>
              </div>
            </div>

            {/* ألوان الفقاعة */}
            <div>
              <div className="text-xs font-medium text-gray-700 mb-2">لون الفقاعة</div>
              <div className="grid grid-cols-3 gap-2">
                {bubbleColors.map((color) => (
                  <button
                    key={color.value}
                    className={`h-8 rounded border-2 transition-all ${
                      commentColor.value === color.value 
                        ? 'border-gray-400 scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: color.value,
                      borderColor: color.border 
                    }}
                    onClick={() => setCommentColor(color)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* معاينة */}
            <div>
              <div className="text-xs font-medium text-gray-700 mb-2">المعاينة</div>
              <div className="flex justify-center">
                <div
                  className={`
                    relative max-w-xs p-3 rounded-lg text-sm
                    ${commentStyle === 'highlighted' ? 'shadow-lg' : 'shadow-sm'}
                  `}
                  style={{ 
                    backgroundColor: commentColor.value,
                    border: `2px solid ${commentColor.border}` 
                  }}
                >
                  {commentText || 'مثال على التعليق'}
                  <div
                    className="absolute bottom-0 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                    style={{ borderTopColor: commentColor.border }}
                  />
                </div>
              </div>
            </div>

            {/* إضافة التعليق */}
            <Button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="w-full"
            >
              إضافة التعليق
            </Button>
          </TabsContent>
          
          <TabsContent value="drawing" className="space-y-4">
            {hasHostPermission ? (
              <>
                {/* أداة الرسم */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">أداة الرسم</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={drawingSettings.tool === 'pen' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateDrawingSettings({ tool: 'pen' })}
                      className="text-xs flex items-center gap-1"
                    >
                      <Pen className="w-3 h-3" />
                      قلم
                    </Button>
                    <Button
                      variant={drawingSettings.tool === 'eraser' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateDrawingSettings({ tool: 'eraser' })}
                      className="text-xs flex items-center gap-1"
                    >
                      <Eraser className="w-3 h-3" />
                      ممحاة
                    </Button>
                  </div>
                </div>

                {/* ألوان الرسم */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">لون الرسم</div>
                  <div className="grid grid-cols-3 gap-2">
                    {drawingColors.map((color) => (
                      <button
                        key={color.value}
                        className={`h-8 rounded border-2 transition-all ${
                          drawingSettings.color === color.value 
                            ? 'border-gray-400 scale-110' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => updateDrawingSettings({ color: color.value })}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* سمك الخط */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">
                    سمك الخط: {drawingSettings.strokeWidth}px
                  </div>
                  <Slider
                    value={[drawingSettings.strokeWidth]}
                    onValueChange={(value) => updateDrawingSettings({ strokeWidth: value[0] })}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>رفيع</span>
                    <span>عريض</span>
                  </div>
                </div>

                <Separator />

                {/* مسح الكل */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearAllDrawings}
                  className="w-full text-xs"
                >
                  مسح جميع الرسوم
                </Button>
              </>
            ) : (
              <div className="text-center text-sm text-gray-500 py-8">
                <Palette className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>يتطلب صلاحية المضيف للرسم التوضيحي</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Separator />

        {/* الاختصارات */}
        <div className="text-xs text-gray-500 space-y-1">
          <div><strong>C:</strong> تفعيل وضع التعليق</div>
          <div><strong>Enter:</strong> إضافة التعليق</div>
          <div><strong>Ctrl+Enter:</strong> تثبيت التعليق</div>
          <div><strong>Shift:</strong> تعليق جماعي</div>
          <div><strong>Delete:</strong> حذف التعليق</div>
          <div><strong>Esc:</strong> إلغاء الوضع</div>
        </div>
      </CardContent>
    </Card>
  );
};