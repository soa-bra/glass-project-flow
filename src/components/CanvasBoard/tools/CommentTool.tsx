import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Plus, Users, Clock } from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  position: { x: number; y: number };
}

interface CommentToolProps {
  selectedTool: string;
  comments: Comment[];
  onAddComment: (text: string, position: { x: number; y: number }) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentTool: React.FC<CommentToolProps> = ({ 
  selectedTool, 
  comments = [],
  onAddComment,
  onDeleteComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true);

  if (selectedTool !== 'comment') return null;

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim(), { x: 100, y: 100 });
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium font-arabic">التعليقات</span>
        </div>
        <div className="text-sm font-arabic text-gray-600">
          أضف تعليقات على العناصر
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium font-arabic">تعليق جديد</label>
        <Textarea
          placeholder="اكتب تعليقك هنا..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="text-sm resize-none"
          rows={3}
        />
        <Button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          size="sm"
          className="w-full text-xs font-arabic"
        >
          <Plus className="w-3 h-3 mr-1" />
          إضافة تعليق
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium font-arabic">التعليقات الحالية</label>
          <Button
            onClick={() => setShowComments(!showComments)}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            {showComments ? 'إخفاء' : 'إظهار'}
          </Button>
        </div>
        
        {showComments && (
          <div className="max-h-40 overflow-y-auto space-y-2">
            {comments.length === 0 ? (
              <div className="text-xs text-gray-500 font-arabic text-center p-2">
                لا توجد تعليقات بعد
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white border rounded p-2 text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <Users className="w-3 h-3" />
                    <span className="font-medium font-arabic">{comment.author}</span>
                    <Clock className="w-3 h-3 ml-auto" />
                    <span className="text-gray-400">
                      {comment.timestamp.toLocaleTimeString('ar-SA', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="font-arabic text-gray-700">{comment.text}</div>
                  <Button
                    onClick={() => onDeleteComment(comment.id)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-500 mt-1 p-0 h-auto"
                  >
                    حذف
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 font-arabic space-y-1">
        <div>💬 انقر على الكانفس لإضافة تعليق</div>
        <div>👥 التعليقات مرئية لجميع المتعاونين</div>
      </div>
    </div>
  );
};