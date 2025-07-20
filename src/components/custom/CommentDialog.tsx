import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, User } from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
  comments: Comment[];
  onAddComment: (fileId: string, comment: string) => void;
}

export const CommentDialog: React.FC<CommentDialogProps> = ({
  isOpen,
  onClose,
  fileId,
  fileName,
  comments,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(fileId, newComment.trim());
      setNewComment('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddComment();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <MessageCircle className="w-5 h-5" />
            تعليقات - {fileName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* عرض التعليقات */}
          <ScrollArea className="h-60">
            {comments.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                لا توجد تعليقات بعد
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-gray-500 mr-auto">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* إضافة تعليق جديد */}
          <div className="space-y-3">
            <Textarea
              placeholder="اكتب تعليقك هنا... (Ctrl+Enter للإرسال)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              className="resize-none"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                إلغاء
              </Button>
              <Button 
                onClick={handleAddComment} 
                disabled={!newComment.trim()}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                إرسال
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};