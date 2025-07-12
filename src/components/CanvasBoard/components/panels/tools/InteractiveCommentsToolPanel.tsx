import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, PenTool, Settings, Trash2 } from 'lucide-react';

export const InteractiveCommentsToolPanel: React.FC = () => {
  const [commentText, setCommentText] = useState('');
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    // Add comment logic here
    setCommentText('');
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    // Toggle drawing mode logic
  };

  const clearAllDrawings = () => {
    // Clear all annotations logic
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-transparent">
          <TabsTrigger 
            value="text" 
            className="rounded-[12px] text-xs font-arabic data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-black"
          >
            تعليق نصي
          </TabsTrigger>
          <TabsTrigger 
            value="drawing" 
            className="rounded-[12px] text-xs font-arabic data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-black"
          >
            رسم توضيحي
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4 mt-4">
          {/* Text Comment Configuration */}
          <div className="bg-[#e9eff4] p-3 rounded-[16px]">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-[#96d8d0]" />
              <span className="text-sm font-medium font-arabic text-black">فقاعة التعليق النصي</span>
            </div>
            <div className="text-xs text-black/70">
              انقر على أي مكان في الكانفس لإضافة تعليق نصي
            </div>
          </div>

          {/* Comment Text Input */}
          <div>
            <h4 className="text-sm font-medium font-arabic mb-3 text-black">نص التعليق</h4>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="اكتب تعليقك هنا..."
              className="resize-none font-arabic text-sm rounded-[16px] border-[#d1e1ea] text-black placeholder:text-black/50"
              rows={3}
            />
            <Button
              onClick={handleAddComment}
              className="w-full mt-2 rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none font-arabic"
              disabled={!commentText.trim()}
            >
              إضافة التعليق
            </Button>
          </div>

          <Separator className="bg-[#d1e1ea]" />

          {/* Comment Style Options */}
          <div>
            <h4 className="text-sm font-medium font-arabic mb-3 text-black">نمط الفقاعة</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none font-arabic"
              >
                فقاعة عادية
              </Button>
              <Button
                size="sm"
                className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none font-arabic"
              >
                فقاعة مهمة
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="drawing" className="space-y-4 mt-4">
          {/* Drawing Mode Status */}
          <div className={`p-3 rounded-[16px] ${isDrawingMode ? 'bg-[#bdeed3]/30 border border-[#bdeed3]' : 'bg-[#e9eff4]'}`}>
            <div className="flex items-center gap-2 mb-2">
              <PenTool className={`w-4 h-4 ${isDrawingMode ? 'text-[#bdeed3]' : 'text-[#96d8d0]'}`} />
              <span className="text-sm font-medium font-arabic text-black">
                {isDrawingMode ? 'وضع الرسم التوضيحي نشط' : 'وضع الرسم التوضيحي متوقف'}
              </span>
            </div>
            <div className="text-xs text-black/70">
              {isDrawingMode 
                ? 'يمكنك الآن الرسم على الكانفس للتوضيح'
                : 'اضغط على تفعيل للبدء في الرسم التوضيحي'
              }
            </div>
          </div>

          {/* Drawing Controls */}
          <div>
            <h4 className="text-sm font-medium font-arabic mb-3 text-black">أدوات الرسم</h4>
            <div className="space-y-2">
              <Button
                onClick={toggleDrawingMode}
                className={`w-full rounded-[12px] font-arabic border-none ${
                  isDrawingMode 
                    ? 'bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 text-black' 
                    : 'bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black'
                }`}
              >
                <PenTool className="w-4 h-4 mr-2" />
                {isDrawingMode ? 'إيقاف الرسم' : 'تفعيل الرسم'}
              </Button>
              
              <Button
                onClick={clearAllDrawings}
                disabled={!isDrawingMode}
                className="w-full rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 disabled:bg-[#d1e1ea] text-black border-none font-arabic"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                مسح جميع الرسومات
              </Button>
            </div>
          </div>

          <Separator className="bg-[#d1e1ea]" />

          {/* Drawing Settings */}
          <div>
            <h4 className="text-sm font-medium font-arabic mb-3 text-black">إعدادات الرسم</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-arabic text-black/70 mb-1 block">لون القلم</label>
                <div className="flex gap-2">
                  {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'].map((color) => (
                    <Button
                      key={color}
                      className="w-8 h-8 rounded-[8px] border-2 border-[#d1e1ea] p-0"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-arabic text-black/70 mb-1 block">سمك القلم</label>
                <div className="flex gap-2">
                  {[2, 4, 6, 8].map((size) => (
                    <Button
                      key={size}
                      size="sm"
                      className="rounded-[8px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none"
                    >
                      {size}px
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Auto-clear Warning */}
          <div className="bg-[#f1b5b9]/30 p-3 rounded-[16px] border border-[#f1b5b9]/50">
            <div className="text-xs text-black font-arabic space-y-1">
              <div>⚠️ تنبيه: الرسومات التوضيحية مؤقتة</div>
              <div>🗑️ سيتم مسحها تلقائياً عند إلغاء تحديد الأداة</div>
              <div>👥 مرئية فقط للمضيف والمشاركين المخولين</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};