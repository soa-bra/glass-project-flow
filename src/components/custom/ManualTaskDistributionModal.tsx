import React, { useState } from 'react';
import { X, User, CheckCircle, Clock, AlertCircle, Brain, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  experience: number;
  currentWorkload: number;
  maxCapacity: number;
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  currentAssignee?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface ManualTaskDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (redistributedTasks: {
    taskId: string;
    assigneeId: string;
  }[]) => void;
}

export const ManualTaskDistributionModal: React.FC<ManualTaskDistributionModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [isSmartDistributing, setIsSmartDistributing] = useState(false);

  // Mock data - in real app this would come from props or API
  const [teamMembers] = useState<TeamMember[]>([{
    id: '1',
    name: 'أحمد محمد',
    role: 'مطور رئيسي',
    skills: ['React', 'TypeScript', 'Node.js'],
    experience: 5,
    currentWorkload: 32,
    maxCapacity: 40
  }, {
    id: '2',
    name: 'فاطمة علي',
    role: 'مصممة واجهات',
    skills: ['UI/UX', 'Figma', 'CSS'],
    experience: 3,
    currentWorkload: 28,
    maxCapacity: 35
  }, {
    id: '3',
    name: 'محمد خالد',
    role: 'محلل أنظمة',
    skills: ['تحليل الأنظمة', 'قواعد البيانات', 'SQL'],
    experience: 4,
    currentWorkload: 20,
    maxCapacity: 40
  }, {
    id: '4',
    name: 'نورا سعد',
    role: 'مختبرة جودة',
    skills: ['اختبار البرمجيات', 'Selenium', 'Jest'],
    experience: 2,
    currentWorkload: 15,
    maxCapacity: 35
  }]);

  const [tasks, setTasks] = useState<Task[]>([{
    id: '1',
    title: 'تطوير واجهة المستخدم الرئيسية',
    description: 'إنشاء الصفحة الرئيسية للتطبيق',
    requiredSkills: ['React', 'CSS'],
    priority: 'high',
    estimatedHours: 16,
    currentAssignee: '1',
    status: 'in-progress'
  }, {
    id: '2',
    title: 'تصميم نظام المصادقة',
    description: 'تصميم وتطوير نظام تسجيل الدخول',
    requiredSkills: ['UI/UX', 'React'],
    priority: 'high',
    estimatedHours: 12,
    currentAssignee: '2',
    status: 'pending'
  }, {
    id: '3',
    title: 'إعداد قاعدة البيانات',
    description: 'تصميم وإعداد جداول قاعدة البيانات',
    requiredSkills: ['قواعد البيانات', 'SQL'],
    priority: 'medium',
    estimatedHours: 20,
    currentAssignee: '3',
    status: 'in-progress'
  }, {
    id: '4',
    title: 'اختبار الوحدات البرمجية',
    description: 'كتابة واجراء اختبارات الوحدات',
    requiredSkills: ['اختبار البرمجيات', 'Jest'],
    priority: 'medium',
    estimatedHours: 14,
    currentAssignee: '4',
    status: 'pending'
  }, {
    id: '5',
    title: 'تطوير واجهة برمجة التطبيقات',
    description: 'إنشاء APIs للتطبيق',
    requiredSkills: ['Node.js', 'TypeScript'],
    priority: 'high',
    estimatedHours: 18,
    currentAssignee: '1',
    status: 'pending'
  }]);

  const handleTaskAssigneeChange = (taskId: string, newAssigneeId: string) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? {
      ...task,
      currentAssignee: newAssigneeId
    } : task));
  };

  const handleSmartDistribution = async () => {
    setIsSmartDistributing(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2500));

    // AI redistribution logic (enhanced)
    const redistributedTasks = tasks.map(task => {
      // Find best fit member based on skills, workload, and experience
      const suitableMembers = teamMembers.filter(member => task.requiredSkills.some(skill => member.skills.includes(skill)) && member.currentWorkload + task.estimatedHours <= member.maxCapacity);
      if (suitableMembers.length > 0) {
        // Calculate compatibility score
        const bestMember = suitableMembers.sort((a, b) => {
          const aSkillMatch = task.requiredSkills.filter(skill => a.skills.includes(skill)).length / task.requiredSkills.length;
          const bSkillMatch = task.requiredSkills.filter(skill => b.skills.includes(skill)).length / task.requiredSkills.length;
          const aCapacityScore = (a.maxCapacity - a.currentWorkload) / a.maxCapacity;
          const bCapacityScore = (b.maxCapacity - b.currentWorkload) / b.maxCapacity;
          const aScore = aSkillMatch * 0.5 + a.experience * 0.3 + aCapacityScore * 0.2;
          const bScore = bSkillMatch * 0.5 + b.experience * 0.3 + bCapacityScore * 0.2;
          return bScore - aScore;
        })[0];
        return {
          ...task,
          currentAssignee: bestMember.id
        };
      }
      return task;
    });
    setTasks(redistributedTasks);
    setIsSmartDistributing(false);
  };

  const handleSave = () => {
    const redistributedTasks = tasks.map(task => ({
      taskId: task.id,
      assigneeId: task.currentAssignee || teamMembers[0].id
    }));
    onSave(redistributedTasks);
  };

  const getAssigneeName = (assigneeId?: string) => {
    const member = teamMembers.find(m => m.id === assigneeId);
    return member ? member.name : 'غير محدد';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  // Calculate workload for each member
  const memberWorkloads = teamMembers.map(member => {
    const assignedTasks = tasks.filter(task => task.currentAssignee === member.id);
    const totalHours = assignedTasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    return {
      ...member,
      assignedHours: totalHours,
      assignedTasks: assignedTasks.length
    };
  });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 font-arabic" style={{
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
          <DialogTitle className="text-xl font-bold text-black font-arabic">اعادة توزيع المهام على الفريق</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Smart Distribution Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-black/10 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">التوزيع الذكي للمهام</h3>
                  <p className="text-sm text-black/70">يحلل المهارات والخبرة والحمولة لتوزيع مثالي</p>
                </div>
              </div>
              <button onClick={handleSmartDistribution} disabled={isSmartDistributing} className="px-6 py-3 bg-black text-white rounded-full text-sm hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isSmartDistributing ? <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري التحليل الذكي...
                  </> : <>
                    <Brain className="w-4 h-4" />
                    توزيع المهام الذكي
                  </>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Members Column */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">أعضاء الفريق والحمولة</h3>
              <div className="space-y-3">
                {memberWorkloads.map(member => (
                  <div key={member.id} className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none min-h-[100px]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-black/10 rounded-full p-2">
                        <User className="w-4 h-4 text-black" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-black">{member.name}</h4>
                        <p className="text-sm text-black/70">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-black">{member.assignedTasks} مهام</div>
                        <div className="text-xs text-black/70">{member.assignedHours}h / {member.maxCapacity}h</div>
                      </div>
                    </div>
                    <div className="w-full bg-black/10 rounded-full h-2 mb-2">
                      <div className="bg-black h-2 rounded-full transition-all duration-300" style={{
                        width: `${Math.min(member.assignedHours / member.maxCapacity * 100, 100)}%`
                      }} />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="bg-black/10 px-2 py-1 rounded-full text-xs text-black">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Column */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">المهام وإعادة التوزيع</h3>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white/50 rounded-2xl border border-black/10 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(task.status)}
                          <h4 className="font-semibold text-black">{task.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                          </span>
                        </div>
                        <p className="text-sm text-black/70 mb-3">{task.description}</p>
                        
                        {/* Manual Assignment Dropdown */}
                        <div className="mb-2">
                          <label className="block text-xs text-black/70 mb-1">إعادة إسناد إلى:</label>
                          <Select value={task.currentAssignee || ''} onValueChange={(value) => handleTaskAssigneeChange(task.id, value)}>
                            <SelectTrigger className="w-full px-3 py-2 rounded-2xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none text-sm">
                              <SelectValue placeholder="اختر عضو الفريق..." />
                            </SelectTrigger>
                            <SelectContent 
                              className="z-[10000] text-[#0B0F12] font-arabic"
                              style={{
                                background: 'rgba(255,255,255,0.4)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '24px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {teamMembers.map(member => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name} - {member.role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-black/70">الوقت المقدر: <span className="font-medium text-black">{task.estimatedHours} ساعة</span></span>
                          <div className="flex items-center gap-1 text-xs text-black/70">
                            <span>مُسند حالياً:</span>
                            <span className="font-medium text-black">{getAssigneeName(task.currentAssignee)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {task.requiredSkills.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-black/10 p-4">
            <h3 className="text-lg font-semibold text-black mb-2">ملخص التوزيع</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/50 rounded-xl p-3">
                <div className="text-lg font-bold text-black">{tasks.length}</div>
                <div className="text-xs text-black/70">إجمالي المهام</div>
              </div>
              <div className="bg-white/50 rounded-xl p-3">
                <div className="text-lg font-bold text-black">{tasks.reduce((sum, task) => sum + task.estimatedHours, 0)}h</div>
                <div className="text-xs text-black/70">إجمالي الساعات</div>
              </div>
              <div className="bg-white/50 rounded-xl p-3">
                <div className="text-lg font-bold text-black">{Math.round(tasks.filter(t => t.currentAssignee).length / tasks.length * 100)}%</div>
                <div className="text-xs text-black/70">نسبة التوزيع</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-black/10">
          <button onClick={onClose} className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic transition-colors">
            إلغاء
          </button>
          <button onClick={handleSave} className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors">
            حفظ التوزيع الجديد
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};