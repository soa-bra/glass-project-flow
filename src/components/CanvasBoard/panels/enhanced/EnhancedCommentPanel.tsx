
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  MessageSquare, Pen, Sparkles, Mic, MicOff,
  Send, Users, Tag, Reply
} from 'lucide-react';

interface EnhancedCommentPanelProps {
  onAddComment: (text: string, type: string, tags?: string[]) => void;
  onToggleCommentPen: () => void;
  onResolveComment: (commentId: string) => void;
  onReplyToComment: (commentId: string, reply: string) => void;
  isCommentPenActive: boolean;
  isVoiceEnabled: boolean;
  comments: any[];
  collaborators: string[];
  onToggleVoice: (enabled: boolean) => void;
  onMentionUser: (username: string) => void;
}

const EnhancedCommentPanel: React.FC<EnhancedCommentPanelProps> = ({
  onAddComment,
  onToggleCommentPen,
  isCommentPenActive,
  isVoiceEnabled,
  collaborators,
  onToggleVoice,
  onMentionUser
}) => {
  const [commentText, setCommentText] = useState('');
  const [selectedBubbleStyle, setSelectedBubbleStyle] = useState('normal');
  const [selectedBubbleColor, setSelectedBubbleColor] = useState('yellow');
  const [drawingColor, setDrawingColor] = useState('red');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const bubbleStyles = [
    { id: 'normal', label: 'عادي' },
    { id: 'featured', label: 'مميز' }
  ];

  const bubbleColors = [
    { id: 'yellow', label: 'أصفر', color: '#FEF3C7' },
    { id: 'blue', label: 'أزرق', color: '#DBEAFE' },
    { id: 'gray', label: 'رمادي', color: '#F3F4F6' }
  ];

  const drawingColors = [
    { id: 'red', label: 'أحمر', color: '#EF4444' },
    { id: 'green', label: 'أخضر', color: '#10B981' },
    { id: 'black', label: 'أسود', color: '#1F2937' }
  ];

  const strokeWidths = [2, 4, 6];

  const handleAddComment = (useAI = false) => {
    if (commentText.trim()) {
      const type = useAI ? 'ai-enhanced' : 'normal';
      onAddComment(commentText.trim(), type);
      setCommentText('');
    }
  };

  const handleMention = (username: string) => {
    setCommentText(prev => prev + `@${username} `);
    onMentionUser(username);
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          أداة التعليق التفاعلي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="text-comment" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text-comment" className="text-xs font-arabic">
              تعليق نصي
            </TabsTrigger>
            <TabsTrigger value="drawing-comment" className="text-xs font-arabic">
              رسم توضيحي
            </TabsTrigger>
          </TabsList>

          {/* تبويب التعليق النصي */}
          <TabsContent value="text-comment" className="space-y-4">
            {/* مربع إدخال النص */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">إضافة تعليق</h4>
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                className="font-arabic text-sm rounded-xl border-gray-200 resize-none min-h-[80px]"
                rows={3}
              />
            </div>

            {/* اختيار شكل الفقاعة */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">شكل الفقاعة</h4>
              <div className="grid grid-cols-2 gap-2">
                {bubbleStyles.map((style) => (
                  <Button
                    key={style.id}
                    size="sm"
                    variant={selectedBubbleStyle === style.id ? "default" : "outline"}
                    onClick={() => setSelectedBubbleStyle(style.id)}
                    className="text-xs font-arabic"
                  >
                    {style.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* ألوان الفقاعة */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">لون الفقاعة</h4>
              <div className="grid grid-cols-3 gap-2">
                {bubbleColors.map((color) => (
                  <Button
                    key={color.id}
                    size="sm"
                    variant={selectedBubbleColor === color.id ? "default" : "outline"}
                    onClick={() => setSelectedBubbleColor(color.id)}
                    className="text-xs font-arabic h-10"
                    style={{ 
                      backgroundColor: selectedBubbleColor === color.id ? color.color : undefined 
                    }}
                  >
                    {color.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* ذكر المتعاونين */}
            {collaborators.length > 0 && (
              <div>
                <h4 className="text-sm font-medium font-arabic mb-2">ذكر متعاون</h4>
                <div className="flex flex-wrap gap-1">
                  {collaborators.map((user) => (
                    <Badge
                      key={user}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-100 text-xs"
                      onClick={() => handleMention(user)}
                    >
                      @{user}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* التحكم الصوتي */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-arabic">التعليق الصوتي</span>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isVoiceEnabled}
                  onCheckedChange={onToggleVoice}
                />
                {isVoiceEnabled ? (
                  <Mic className="w-4 h-4 text-green-500" />
                ) : (
                  <MicOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleAddComment(false)}
                disabled={!commentText.trim()}
                size="sm"
                variant="outline"
                className="text-xs font-arabic rounded-xl"
              >
                <Send className="w-3 h-3 ml-1" />
                إضافة تعليق
              </Button>
              <Button
                onClick={() => handleAddComment(true)}
                disabled={!commentText.trim()}
                size="sm"
                className="text-xs font-arabic rounded-xl bg-purple-500 hover:bg-purple-600"
              >
                <Sparkles className="w-3 h-3 ml-1" />
                تعليق ذكي
              </Button>
            </div>
          </TabsContent>

          {/* تبويب الرسم التوضيحي */}
          <TabsContent value="drawing-comment" className="space-y-4">
            {/* تفعيل قلم التعليق */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">قلم التعليق</h4>
              <Button
                onClick={onToggleCommentPen}
                variant={isCommentPenActive ? "default" : "outline"}
                className={`w-full text-xs font-arabic rounded-xl ${
                  isCommentPenActive ? 'bg-blue-500 text-white' : ''
                }`}
              >
                <Pen className="w-3 h-3 ml-1" />
                {isCommentPenActive ? 'إيقاف قلم التعليق' : 'تفعيل قلم التعليق'}
              </Button>
              <div className="text-xs text-gray-500 font-arabic mt-1">
                يتطلب تفويض من المضيف
              </div>
            </div>

            <Separator />

            {/* ألوان الرسم */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">لون الرسم</h4>
              <div className="grid grid-cols-3 gap-2">
                {drawingColors.map((color) => (
                  <Button
                    key={color.id}
                    size="sm"
                    variant={drawingColor === color.id ? "default" : "outline"}
                    onClick={() => setDrawingColor(color.id)}
                    className="text-xs font-arabic h-10"
                    style={{ 
                      backgroundColor: drawingColor === color.id ? color.color : undefined,
                      color: drawingColor === color.id ? 'white' : undefined
                    }}
                  >
                    {color.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* سمك الخط */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">سمك الخط</h4>
              <div className="grid grid-cols-3 gap-2">
                {strokeWidths.map((width) => (
                  <Button
                    key={width}
                    size="sm"
                    variant={strokeWidth === width ? "default" : "outline"}
                    onClick={() => setStrokeWidth(width)}
                    className="text-xs font-arabic"
                  >
                    {width}px
                  </Button>
                ))}
              </div>
            </div>

            {/* مسح الكل */}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-arabic rounded-xl text-red-600 hover:text-red-700"
            >
              مسح الكل
            </Button>
          </TabsContent>
        </Tabs>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>💬 انقر على الكانفاس لإضافة تعليق</div>
            <div>🖊️ قلم التعليق يظهر للمتعاونين فقط</div>
            <div>✨ الذكاء الصناعي يحسن التعليقات تلقائياً</div>
            <div>👥 استخدم @ لذكر المتعاونين</div>
            <div>⌨️ C تفعيل | Enter إضافة | Esc إلغاء</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCommentPanel;
