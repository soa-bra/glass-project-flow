import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, PenTool, Send } from 'lucide-react';

interface CommentPanelProps {
  onAddComment: (text: string) => void;
  onToggleCommentPen: () => void;
  isCommentPenActive: boolean;
}

const CommentPanel: React.FC<CommentPanelProps> = ({
  onAddComment,
  onToggleCommentPen,
  isCommentPenActive
}) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
    }
  };

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={16} />
          التعليقات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant={isCommentPenActive ? 'default' : 'outline'}
          className="w-full"
          onClick={onToggleCommentPen}
        >
          <PenTool size={14} className="mr-2" />
          {isCommentPenActive ? 'إيقاف قلم التعليق' : 'تفعيل قلم التعليق'}
        </Button>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">إضافة تعليق نصي</p>
          <Textarea
            placeholder="اكتب تعليقك هنا..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
          />
          <Button
            onClick={handleSubmit}
            disabled={!commentText.trim()}
            className="w-full"
          >
            <Send size={14} className="mr-2" />
            إضافة تعليق
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>• استخدم قلم التعليق للرسم على اللوحة</p>
          <p>• أو اكتب تعليقاً نصياً واختر موقعه</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentPanel;