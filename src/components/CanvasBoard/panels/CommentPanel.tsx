import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Reply, Sparkles, Pen } from 'lucide-react';

interface CommentPanelProps {
  onAddComment: (text: string, useAI?: boolean) => void;
  onToggleCommentPen: () => void;
  isCommentPenActive: boolean;
}

const CommentPanel: React.FC<CommentPanelProps> = ({
  onAddComment,
  onToggleCommentPen,
  isCommentPenActive
}) => {
  const [commentText, setCommentText] = useState('');

  const handleAddComment = (useAI = false) => {
    if (commentText.trim()) {
      onAddComment(commentText.trim(), useAI);
      setCommentText('');
    }
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          أداة التعليق
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* قلم التعليق */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">قلم التعليق</h4>
          <Button
            onClick={onToggleCommentPen}
            variant={isCommentPenActive ? "default" : "outline"}
            className={`w-full text-xs font-arabic rounded-xl ${
              isCommentPenActive ? 'bg-blue-500 text-white' : ''
            }`}
          >
            <Pen className="w-3 h-3 mr-1" />
            {isCommentPenActive ? 'إيقاف قلم التعليق' : 'تفعيل قلم التعليق'}
          </Button>
          <div className="text-xs text-gray-500 font-arabic mt-1">
            اضغط مع السحب للرسم، يظهر للمتعاونين فقط
          </div>
        </div>

        <Separator />

        {/* كتابة التعليق */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">إضافة تعليق</h4>
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="اكتب تعليقك هنا..."
            className="font-arabic text-sm rounded-xl border-gray-200 resize-none"
            rows={3}
          />
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
            <MessageSquare className="w-3 h-3 mr-1" />
            تطبيق التعليق
          </Button>
          <Button
            onClick={() => handleAddComment(true)}
            disabled={!commentText.trim()}
            size="sm"
            className="text-xs font-arabic rounded-xl bg-purple-500 hover:bg-purple-600"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            تطبيق مع الذكاء الصناعي
          </Button>
        </div>

        <Separator />

        {/* أدوات التفاعل */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">أدوات التفاعل</h4>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs font-arabic rounded-xl justify-start"
            >
              <Reply className="w-3 h-3 mr-1" />
              الرد على التعليقات
            </Button>
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>💬 انقر على الكانفس لإضافة تعليق</div>
            <div>🖊️ قلم التعليق يظهر للمتعاونين فقط</div>
            <div>✨ الذكاء الصناعي يحسن التعليقات تلقائياً</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentPanel;