import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, Reply, Sparkles, Pen, Bot, 
  Users, Clock, Tag, Pin, Volume2, VolumeX
} from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'ai';
  resolved: boolean;
  tags: string[];
}

interface EnhancedCommentPanelProps {
  onAddComment: (text: string, type: 'text' | 'voice' | 'ai', tags?: string[]) => void;
  onToggleCommentPen: () => void;
  onResolveComment: (commentId: string) => void;
  onReplyToComment: (commentId: string, reply: string) => void;
  isCommentPenActive: boolean;
  isVoiceEnabled: boolean;
  comments: Comment[];
  collaborators: string[];
  onToggleVoice: (enabled: boolean) => void;
  onMentionUser: (username: string) => void;
}

const EnhancedCommentPanel: React.FC<EnhancedCommentPanelProps> = ({
  onAddComment,
  onToggleCommentPen,
  onResolveComment,
  onReplyToComment,
  isCommentPenActive,
  isVoiceEnabled,
  comments,
  collaborators,
  onToggleVoice,
  onMentionUser
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState<'text' | 'voice' | 'ai'>('text');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [autoResolve, setAutoResolve] = useState(false);
  const [showResolved, setShowResolved] = useState(false);

  const commentTypes = [
    { id: 'text', label: 'نص', icon: MessageSquare, color: 'text-blue-500' },
    { id: 'voice', label: 'صوتي', icon: Volume2, color: 'text-green-500' },
    { id: 'ai', label: 'ذكي', icon: Bot, color: 'text-purple-500' }
  ];

  const commonTags = [
    'عاجل', 'تصميم', 'وظيفة', 'خطأ', 'تحسين', 'اقتراح', 'مراجعة', 'موافقة'
  ];

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText.trim(), commentType, selectedTags);
      setCommentText('');
      setSelectedTags([]);
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // بدء التسجيل
      console.log('بدء التسجيل الصوتي');
    } else {
      // إيقاف التسجيل وإضافة التعليق
      console.log('إيقاف التسجيل');
      onAddComment('تعليق صوتي', 'voice', selectedTags);
      setSelectedTags([]);
    }
  };

  const handleAIComment = () => {
    const aiSuggestion = "اقتراح تحسين: يمكن تحسين هذا العنصر عبر...";
    onAddComment(aiSuggestion, 'ai', ['ai-suggestion', ...selectedTags]);
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredComments = showResolved 
    ? comments 
    : comments.filter(c => !c.resolved);

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          التعليقات التفاعلية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* قلم التعليق */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">أدوات التعليق</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onToggleCommentPen}
              variant={isCommentPenActive ? "default" : "outline"}
              size="sm"
              className={`text-xs font-arabic rounded-xl ${
                isCommentPenActive ? 'bg-blue-500 text-white' : ''
              }`}
            >
              <Pen className="w-3 h-3 mr-1" />
              {isCommentPenActive ? 'إيقاف القلم' : 'تفعيل القلم'}
            </Button>
            
            <Button
              onClick={() => onToggleVoice(!isVoiceEnabled)}
              variant={isVoiceEnabled ? "default" : "outline"}
              size="sm"
              className={`text-xs font-arabic rounded-xl ${
                isVoiceEnabled ? 'bg-green-500 text-white' : ''
              }`}
            >
              {isVoiceEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
              التعليق الصوتي
            </Button>
          </div>
        </div>

        <Separator />

        {/* نوع التعليق */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">نوع التعليق</h4>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {commentTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setCommentType(type.id as any)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-arabic transition-colors flex items-center justify-center gap-1 ${
                    commentType === type.id 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${commentType === type.id ? type.color : ''}`} />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* كتابة التعليق */}
        {commentType === 'text' && (
          <div>
            <h4 className="text-sm font-medium font-arabic mb-2">إضافة تعليق</h4>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="اكتب تعليقك هنا... استخدم @ لذكر المتعاونين"
              className="font-arabic text-sm rounded-xl border-gray-200 resize-none"
              rows={3}
            />
          </div>
        )}

        {/* التسجيل الصوتي */}
        {commentType === 'voice' && (
          <div>
            <h4 className="text-sm font-medium font-arabic mb-2">تسجيل صوتي</h4>
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <Button
                onClick={handleVoiceRecord}
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                className={`rounded-full w-16 h-16 ${isRecording ? 'animate-pulse' : ''}`}
              >
                <Volume2 className="w-6 h-6" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 text-center font-arabic mt-2">
              {isRecording ? 'جاري التسجيل... اضغط لإيقاف' : 'اضغط لبدء التسجيل'}
            </div>
          </div>
        )}

        {/* الوسوم */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الوسوم</h4>
          <div className="flex flex-wrap gap-1">
            {commonTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 rounded-lg text-xs font-arabic border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          
          {selectedTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="w-2 h-2 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* أزرار الإجراءات */}
        <div className="grid grid-cols-3 gap-2">
          {commentType === 'text' && (
            <Button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              size="sm"
              className="text-xs font-arabic rounded-xl bg-blue-500 hover:bg-blue-600"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              إضافة
            </Button>
          )}
          
          <Button
            onClick={handleAIComment}
            size="sm"
            className="text-xs font-arabic rounded-xl bg-purple-500 hover:bg-purple-600"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            اقتراح ذكي
          </Button>
          
          <Button
            onClick={() => console.log('ذكر مستخدم')}
            size="sm"
            variant="outline"
            className="text-xs font-arabic rounded-xl"
          >
            <Users className="w-3 h-3 mr-1" />
            ذكر
          </Button>
        </div>

        <Separator />

        {/* إعدادات التعليقات */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3">إعدادات</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-resolve" className="text-sm font-arabic">
                حل تلقائي بعد الرد
              </Label>
              <Switch
                id="auto-resolve"
                checked={autoResolve}
                onCheckedChange={setAutoResolve}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-resolved" className="text-sm font-arabic">
                إظهار المحلولة
              </Label>
              <Switch
                id="show-resolved"
                checked={showResolved}
                onCheckedChange={setShowResolved}
              />
            </div>
          </div>
        </div>

        {/* قائمة التعليقات */}
        {comments.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">
                التعليقات ({filteredComments.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredComments.map(comment => (
                  <div key={comment.id} className="p-2 bg-gray-50 rounded-xl border">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium font-arabic">{comment.author}</span>
                        {comment.type === 'ai' && (
                          <Badge variant="secondary" className="text-xs">
                            <Bot className="w-2 h-2 mr-1" />
                            ذكي
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {comment.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-arabic text-gray-700">{comment.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        <Clock className="w-2 h-2 inline mr-1" />
                        {comment.timestamp.toLocaleTimeString('ar')}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => onReplyToComment(comment.id, '')}
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                        >
                          <Reply className="w-2 h-2" />
                        </Button>
                        {!comment.resolved && (
                          <Button
                            onClick={() => onResolveComment(comment.id)}
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                          >
                            ✓
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>💬 انقر على الكانفس لإضافة تعليق</div>
            <div>🎤 استخدم التعليق الصوتي للسرعة</div>
            <div>🤖 الاقتراح الذكي يحلل العناصر</div>
            <div>👥 اذكر المتعاونين بـ @اسم</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCommentPanel;