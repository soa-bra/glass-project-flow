import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Calendar, User, Target, Sparkles } from 'lucide-react';

interface PlanCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: any) => void;
}

export const PlanCreationModal: React.FC<PlanCreationModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
    assignees: [] as string[],
    tags: [] as string[],
    aiEnabled: true
  });
  
  const [newTag, setNewTag] = useState('');
  const [newAssignee, setNewAssignee] = useState('');

  const availableAssignees = [
    'أحمد محمد',
    'فاطمة علي', 
    'سارة أحمد',
    'محمد خالد',
    'نور الدين',
    'مريم سالم',
    'عبدالله حسن'
  ];

  const suggestedTags = [
    'تسويق', 'تطوير', 'تصميم', 'مبيعات', 'محتوى',
    'بحوث', 'استراتيجية', 'عمليات', 'مالي', 'قانوني'
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddAssignee = (assignee: string) => {
    if (!formData.assignees.includes(assignee)) {
      setFormData(prev => ({
        ...prev,
        assignees: [...prev.assignees, assignee]
      }));
    }
  };

  const handleRemoveAssignee = (assigneeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.filter(assignee => assignee !== assigneeToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPlan = {
      id: Date.now().toString(),
      ...formData,
      status: 'planning',
      progress: 0,
      createdAt: new Date().toISOString()
    };
    
    onPlanCreated(newPlan);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignees: [],
      tags: [],
      aiEnabled: true
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            إنشاء مهمة جديدة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">عنوان المهمة *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان المهمة..."
                required
              />
            </div>

            <div>
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف تفصيلي للمهمة..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">الأولوية</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'high' | 'medium' | 'low') => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">عالي</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="low">منخفض</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Assignees */}
          <div>
            <Label>المكلفون بالمهمة</Label>
            <div className="space-y-3">
              <Select value="" onValueChange={handleAddAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر عضو الفريق..." />
                </SelectTrigger>
                <SelectContent>
                  {availableAssignees
                    .filter(assignee => !formData.assignees.includes(assignee))
                    .map((assignee) => (
                      <SelectItem key={assignee} value={assignee}>
                        {assignee}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>

              {formData.assignees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.assignees.map((assignee) => (
                    <Badge key={assignee} variant="secondary" className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {assignee}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive" 
                        onClick={() => handleRemoveAssignee(assignee)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>العلامات</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="أضف علامة جديدة..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Suggested Tags */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">علامات مقترحة:</div>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter(tag => !formData.tags.includes(tag))
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))}
                      >
                        {tag}
                      </Badge>
                    ))
                  }
                </div>
              </div>

              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive-foreground" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Features */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="font-medium">مساعدة الذكاء الاصطناعي</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              تفعيل اقتراحات الذكاء الاصطناعي لتحسين كفاءة المهمة وتقديم توصيات ذكية
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.aiEnabled}
                onChange={(e) => setFormData(prev => ({ ...prev, aiEnabled: e.target.checked }))}
              />
              <span className="text-sm">تفعيل المساعدة الذكية</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={!formData.title.trim()}>
              إنشاء المهمة
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};