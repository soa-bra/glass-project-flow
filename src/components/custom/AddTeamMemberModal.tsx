import React, { useState } from 'react';
import { X, User, Check, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AvailableMember {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  email: string;
}

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  status: 'pending' | 'in-progress' | 'completed';
}

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberId: string, taskIds: string[]) => void;
}

export const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    memberId: string;
    taskIds: string[];
    reason: string;
  } | null>(null);

  // Mock data - available members not in current project
  const availableMembers: AvailableMember[] = [
    {
      id: '5',
      name: 'سارة أحمد',
      role: 'مطورة واجهات أمامية',
      department: 'التطوير',
      skills: ['React', 'TypeScript', 'CSS', 'UI/UX'],
      email: 'sara@company.com'
    },
    {
      id: '6',
      name: 'خالد عبدالله',
      role: 'مطور واجهات خلفية',
      department: 'التطوير',
      skills: ['Node.js', 'Python', 'Database', 'API'],
      email: 'khalid@company.com'
    },
    {
      id: '7',
      name: 'هند محمد',
      role: 'مختص أمان',
      department: 'الأمن السيبراني',
      skills: ['Security', 'Penetration Testing', 'Compliance'],
      email: 'hind@company.com'
    },
    {
      id: '8',
      name: 'عمر علي',
      role: 'مطور تطبيقات جوال',
      department: 'التطوير',
      skills: ['React Native', 'Flutter', 'Mobile Dev'],
      email: 'omar@company.com'
    }
  ];

  const projectTasks: ProjectTask[] = [
    {
      id: '1',
      title: 'تطوير واجهة المستخدم الرئيسية',
      description: 'إنشاء الصفحة الرئيسية للتطبيق',
      priority: 'high',
      estimatedHours: 16,
      status: 'in-progress'
    },
    {
      id: '2',
      title: 'تصميم نظام المصادقة',
      description: 'تصميم وتطوير نظام تسجيل الدخول',
      priority: 'high',
      estimatedHours: 12,
      status: 'pending'
    },
    {
      id: '3',
      title: 'إعداد قاعدة البيانات',
      description: 'تصميم وإعداد جداول قاعدة البيانات',
      priority: 'medium',
      estimatedHours: 20,
      status: 'in-progress'
    },
    {
      id: '4',
      title: 'اختبار الوحدات البرمجية',
      description: 'كتابة واجراء اختبارات الوحدات',
      priority: 'medium',
      estimatedHours: 14,
      status: 'pending'
    },
    {
      id: '5',
      title: 'تطوير واجهة برمجة التطبيقات',
      description: 'إنشاء APIs للتطبيق',
      priority: 'high',
      estimatedHours: 18,
      status: 'pending'
    }
  ];

  const handleTaskToggle = (taskId: string) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSave = () => {
    if (!selectedMemberId) {
      alert('يرجى اختيار عضو الفريق');
      return;
    }
    
    if (selectedTaskIds.length === 0) {
      alert('يرجى اختيار مهمة واحدة على الأقل');
      return;
    }

    onSave(selectedMemberId, selectedTaskIds);
    
    // Reset form
    setSelectedMemberId('');
    setSelectedTaskIds([]);
    setAiSuggestion(null);
  };

  const handleAISuggestion = async () => {
    setIsLoadingAI(true);
    
    // محاكاة تحليل الذكاء الاصطناعي
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // تحليل المهارات والمهام لاقتراح أفضل عضو
    const skills = {
      '5': ['React', 'TypeScript', 'CSS', 'UI/UX'], // سارة أحمد
      '6': ['Node.js', 'Python', 'Database', 'API'], // خالد عبدالله
      '7': ['Security', 'Penetration Testing', 'Compliance'], // هند محمد
      '8': ['React Native', 'Flutter', 'Mobile Dev'] // عمر علي
    };
    
    const taskRequirements = {
      '1': ['React', 'TypeScript'],
      '2': ['Node.js', 'API'],
      '3': ['Database'],
      '4': ['Testing'],
      '5': ['API', 'Node.js']
    };
    
    // العثور على أفضل تطابق
    let bestMatch = { memberId: '5', score: 0, matchedTasks: [] as string[] };
    
    availableMembers.forEach(member => {
      const memberSkills = skills[member.id as keyof typeof skills] || [];
      let score = 0;
      const matchedTasks: string[] = [];
      
      projectTasks.forEach(task => {
        const taskReqs = taskRequirements[task.id as keyof typeof taskRequirements] || [];
        const matchCount = taskReqs.filter(req => memberSkills.includes(req)).length;
        if (matchCount > 0) {
          score += matchCount;
          matchedTasks.push(task.id);
        }
      });
      
      if (score > bestMatch.score) {
        bestMatch = { memberId: member.id, score, matchedTasks };
      }
    });
    
    const suggestedMember = availableMembers.find(m => m.id === bestMatch.memberId);
    
    setAiSuggestion({
      memberId: bestMatch.memberId,
      taskIds: bestMatch.matchedTasks.slice(0, 3), // أقصى 3 مهام
      reason: `تم اختيار ${suggestedMember?.name} بناءً على تطابق المهارات مع متطلبات المشروع (نسبة التطابق: ${Math.round((bestMatch.score / 5) * 100)}%)`
    });
    
    setSelectedMemberId(bestMatch.memberId);
    setSelectedTaskIds(bestMatch.matchedTasks.slice(0, 3));
    setIsLoadingAI(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#f1b5b9] text-black';
      case 'medium': return 'bg-[#fbe2aa] text-black';
      case 'low': return 'bg-[#bdeed3] text-black';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتملة';
      case 'in-progress': return 'قيد التنفيذ';
      case 'pending': return 'في الانتظار';
      default: return status;
    }
  };

  const selectedMember = availableMembers.find(m => m.id === selectedMemberId);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 font-arabic" style={{
        background: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '24px'
      }}>
        <button 
          onClick={onClose} 
          className="absolute top-4 left-4 rounded-full bg-transparent hover:bg-black/10 border border-black w-[32px] h-[32px] flex items-center justify-center transition z-10"
        >
          <X size={18} className="text-black" />
        </button>

        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-black font-arabic">إضافة عضو جديد للمشروع</DialogTitle>
            <div className="flex gap-2">
              <button
                onClick={handleAISuggestion}
                disabled={isLoadingAI}
                className="flex items-center gap-2 px-4 py-2 bg-[#96d8d0] text-black rounded-full text-sm hover:bg-[#84c5bd] transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isLoadingAI ? 'جاري التحليل...' : 'اقتراح العضو الأنسب'}
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* اقتراح الذكاء الاصطناعي */}
          {aiSuggestion && (
            <div className="bg-[#96d8d0]/20 border border-[#96d8d0] rounded-2xl p-4">
              <h3 className="text-sm font-bold text-black mb-2">🤖 اقتراح الذكاء الاصطناعي</h3>
              <p className="text-xs text-black/70 mb-3">{aiSuggestion.reason}</p>
              <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
                <span className="text-xs font-medium text-black">
                  {availableMembers.find(m => m.id === aiSuggestion.memberId)?.name} - {aiSuggestion.taskIds.length} مهام مقترحة
                </span>
              </div>
            </div>
          )}

          {/* Member Selection */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              اختيار عضو الفريق
            </label>
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
              <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
                <SelectValue placeholder="اختر عضو الفريق..." />
              </SelectTrigger>
              <SelectContent 
                className=" text-[#0B0F12] font-arabic"
              >
                {availableMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} - {member.role} ({member.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Member Details */}
            {selectedMember && (
              <div className="mt-4 bg-white/50 rounded-2xl border border-black/10 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-black/10 rounded-full p-2">
                    <User className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">{selectedMember.name}</h4>
                    <p className="text-sm text-black/70">{selectedMember.role}</p>
                    <p className="text-xs text-black/50">{selectedMember.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedMember.skills.map(skill => (
                    <span key={skill} className="bg-[#a4e2f6] text-black px-2 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Task Selection */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              اختيار المهام المراد إسنادها ({selectedTaskIds.length} مهمة محددة)
            </label>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {projectTasks.map(task => (
                <div 
                  key={task.id}
                  className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none min-h-[100px] cursor-pointer"
                  onClick={() => handleTaskToggle(task.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 border-black/20 flex items-center justify-center mt-0.5 ${
                      selectedTaskIds.includes(task.id) ? 'bg-black border-black' : 'bg-white'
                    }`}>
                      {selectedTaskIds.includes(task.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-black">{task.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </span>
                      </div>
                      <p className="text-sm text-black/70 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-black/60">
                        <span>الوقت المقدر: {task.estimatedHours} ساعة</span>
                        <span>الحالة: {getStatusText(task.status)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedMemberId && selectedTaskIds.length > 0 && (
            <div className="bg-[#F2FFFF] rounded-2xl border border-black/10 p-4">
              <h3 className="text-sm font-semibold text-black mb-2">ملخص الإضافة</h3>
              <p className="text-sm text-black/70 mb-2">
                سيتم إضافة <strong>{selectedMember?.name}</strong> للمشروع وإسناد <strong>{selectedTaskIds.length}</strong> مهمة إليه
              </p>
              <p className="text-xs text-black/60">
                إجمالي الساعات المقدرة: {projectTasks.filter(t => selectedTaskIds.includes(t.id)).reduce((sum, task) => sum + task.estimatedHours, 0)} ساعة
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-black/10">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedMemberId || selectedTaskIds.length === 0}
            className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            إضافة العضو وإسناد المهام
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};