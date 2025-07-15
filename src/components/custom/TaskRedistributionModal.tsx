import React, { useState } from 'react';
import { X, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  experience: number;
  currentWorkload: number;
  maxCapacity: number;
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

interface TaskRedistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedistribute: (redistributedTasks: { taskId: string; assigneeId: string }[]) => void;
}

export const TaskRedistributionModal: React.FC<TaskRedistributionModalProps> = ({
  isOpen,
  onClose,
  onRedistribute
}) => {
  const [isRedistributing, setIsRedistributing] = useState(false);

  // Mock data - in real app this would come from props or API
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      role: 'مطور رئيسي',
      skills: ['React', 'TypeScript', 'Node.js'],
      experience: 5,
      currentWorkload: 32,
      maxCapacity: 40
    },
    {
      id: '2',
      name: 'فاطمة علي',
      role: 'مصممة واجهات',
      skills: ['UI/UX', 'Figma', 'CSS'],
      experience: 3,
      currentWorkload: 28,
      maxCapacity: 35
    },
    {
      id: '3',
      name: 'محمد خالد',
      role: 'محلل أنظمة',
      skills: ['تحليل الأنظمة', 'قواعد البيانات', 'SQL'],
      experience: 4,
      currentWorkload: 20,
      maxCapacity: 40
    },
    {
      id: '4',
      name: 'نورا سعد',
      role: 'مختبرة جودة',
      skills: ['اختبار البرمجيات', 'Selenium', 'Jest'],
      experience: 2,
      currentWorkload: 15,
      maxCapacity: 35
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'تطوير واجهة المستخدم الرئيسية',
      description: 'إنشاء الصفحة الرئيسية للتطبيق',
      requiredSkills: ['React', 'CSS'],
      priority: 'high',
      estimatedHours: 16,
      currentAssignee: '1',
      status: 'in-progress'
    },
    {
      id: '2',
      title: 'تصميم نظام المصادقة',
      description: 'تصميم وتطوير نظام تسجيل الدخول',
      requiredSkills: ['UI/UX', 'React'],
      priority: 'high',
      estimatedHours: 12,
      currentAssignee: '2',
      status: 'pending'
    },
    {
      id: '3',
      title: 'إعداد قاعدة البيانات',
      description: 'تصميم وإعداد جداول قاعدة البيانات',
      requiredSkills: ['قواعد البيانات', 'SQL'],
      priority: 'medium',
      estimatedHours: 20,
      currentAssignee: '3',
      status: 'in-progress'
    },
    {
      id: '4',
      title: 'اختبار الوحدات البرمجية',
      description: 'كتابة واجراء اختبارات الوحدات',
      requiredSkills: ['اختبار البرمجيات', 'Jest'],
      priority: 'medium',
      estimatedHours: 14,
      currentAssignee: '4',
      status: 'pending'
    },
    {
      id: '5',
      title: 'تطوير واجهة برمجة التطبيقات',
      description: 'إنشاء APIs للتطبيق',
      requiredSkills: ['Node.js', 'TypeScript'],
      priority: 'high',
      estimatedHours: 18,
      currentAssignee: '1',
      status: 'pending'
    }
  ]);

  const handleAIRedistribution = async () => {
    setIsRedistributing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // AI redistribution logic (simplified)
    const redistributedTasks = tasks.map(task => {
      // Find best fit member based on skills, workload, and experience
      const suitableMembers = teamMembers.filter(member => 
        task.requiredSkills.some(skill => member.skills.includes(skill)) &&
        member.currentWorkload + task.estimatedHours <= member.maxCapacity
      );
      
      if (suitableMembers.length > 0) {
        // Sort by experience and available capacity
        const bestMember = suitableMembers.sort((a, b) => {
          const aScore = a.experience * 0.6 + (a.maxCapacity - a.currentWorkload) * 0.4;
          const bScore = b.experience * 0.6 + (b.maxCapacity - b.currentWorkload) * 0.4;
          return bScore - aScore;
        })[0];
        
        return { taskId: task.id, assigneeId: bestMember.id };
      }
      
      return { taskId: task.id, assigneeId: task.currentAssignee || teamMembers[0].id };
    });
    
    // Update tasks with new assignments
    const updatedTasks = tasks.map(task => {
      const redistribution = redistributedTasks.find(r => r.taskId === task.id);
      return redistribution ? { ...task, currentAssignee: redistribution.assigneeId } : task;
    });
    
    setTasks(updatedTasks);
    setIsRedistributing(false);
    
    onRedistribute(redistributedTasks);
  };

  const getAssigneeName = (assigneeId?: string) => {
    const member = teamMembers.find(m => m.id === assigneeId);
    return member ? member.name : 'غير محدد';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-black/10 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <h2 className="text-xl font-bold text-black">إعادة توزيع المهام بالذكاء الاصطناعي</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Team Members Overview */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-black mb-4">أعضاء الفريق والحمولة الحالية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map(member => (
                <div key={member.id} className="bg-white/50 rounded-2xl border border-black/10 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-black/10 rounded-full p-2">
                      <User className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">{member.name}</h4>
                      <p className="text-sm text-black/70">{member.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-black/70">الحمولة الحالية:</span>
                      <span className="text-black font-medium">{member.currentWorkload}/{member.maxCapacity} ساعة</span>
                    </div>
                    <div className="w-full bg-black/10 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(member.currentWorkload / member.maxCapacity) * 100}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="bg-black/10 px-2 py-1 rounded-full text-xs text-black">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Tasks */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-black mb-4">المهام الحالية وتوزيعها</h3>
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
                      <p className="text-sm text-black/70 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-black/70">مُسند إلى: <span className="font-medium text-black">{getAssigneeName(task.currentAssignee)}</span></span>
                        <span className="text-black/70">الوقت المقدر: <span className="font-medium text-black">{task.estimatedHours} ساعة</span></span>
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

          {/* AI Analysis Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-black/10 p-4 mb-6">
            <h3 className="text-lg font-semibold text-black mb-2">تحليل الذكاء الاصطناعي</h3>
            <p className="text-sm text-black/70 mb-3">
              سيقوم الذكاء الاصطناعي بتحليل مهارات الفريق، الخبرة، الحمولة الحالية، ومتطلبات المهام لإعادة التوزيع الأمثل
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/50 rounded-xl p-3">
                <div className="text-lg font-bold text-black">85%</div>
                <div className="text-xs text-black/70">تطابق المهارات</div>
              </div>
              <div className="bg-white/50 rounded-xl p-3">
                <div className="text-lg font-bold text-black">92%</div>
                <div className="text-xs text-black/70">توزيع الحمولة</div>
              </div>
              <div className="bg-white/50 rounded-xl p-3">
                <div className="text-lg font-bold text-black">78%</div>
                <div className="text-xs text-black/70">كفاءة الإنجاز</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-black/10">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/50 border border-black/20 text-black rounded-full text-sm hover:bg-black/5 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleAIRedistribution}
            disabled={isRedistributing}
            className="px-6 py-3 bg-black text-white rounded-full text-sm hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRedistributing ? 'جاري التوزيع بالذكاء الاصطناعي...' : 'توزيع المهام بالذكاء الاصطناعي'}
          </button>
        </div>
      </div>
    </div>
  );
};