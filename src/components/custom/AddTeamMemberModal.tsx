import React, { useState } from 'react';
import { X, User, Check } from 'lucide-react';

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

  // Mock data - available members not in current project
  const availableMembers: AvailableMember[] = [
    {
      id: '5',
      name: 'سارة أحمد',
      role: 'مطورة واجهات خلفية',
      department: 'التطوير',
      skills: ['Node.js', 'Python', 'MongoDB'],
      email: 'sara@company.com'
    },
    {
      id: '6',
      name: 'عبدالله محمد',
      role: 'مهندس DevOps',
      department: 'البنية التحتية',
      skills: ['Docker', 'Kubernetes', 'AWS'],
      email: 'abdullah@company.com'
    },
    {
      id: '7',
      name: 'ريم سالم',
      role: 'محللة أعمال',
      department: 'التحليل',
      skills: ['تحليل الأعمال', 'تجربة المستخدم', 'Figma'],
      email: 'reem@company.com'
    },
    {
      id: '8',
      name: 'خالد عبدالرحمن',
      role: 'مختص أمن معلومات',
      department: 'الأمن السيبراني',
      skills: ['أمن المعلومات', 'Penetration Testing', 'CISSP'],
      email: 'khalid@company.com'
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
    },
    {
      id: '6',
      title: 'تحسين الأداء والأمان',
      description: 'مراجعة وتحسين أداء التطبيق وأمانه',
      priority: 'medium',
      estimatedHours: 24,
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
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-black/10 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <h2 className="text-xl font-bold text-black">إضافة عضو جديد للمشروع</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Member Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-black mb-3">
              اختيار عضو الفريق
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full p-4 bg-white/50 border border-black/20 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30"
            >
              <option value="">اختر عضو الفريق...</option>
              {availableMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.role} ({member.department})
                </option>
              ))}
            </select>
            
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
                    <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Task Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-black mb-3">
              اختيار المهام المراد إسنادها ({selectedTaskIds.length} مهمة محددة)
            </label>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {projectTasks.map(task => (
                <div 
                  key={task.id}
                  className={`bg-white/50 rounded-2xl border border-black/10 p-4 cursor-pointer transition-all ${
                    selectedTaskIds.includes(task.id) ? 'ring-2 ring-black/20 bg-black/5' : 'hover:bg-black/5'
                  }`}
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
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-black/10 p-4">
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
        <div className="flex justify-end gap-3 p-6 border-t border-black/10">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/50 border border-black/20 text-black rounded-full text-sm hover:bg-black/5 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedMemberId || selectedTaskIds.length === 0}
            className="px-6 py-3 bg-black text-white rounded-full text-sm hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إضافة العضو وإسناد المهام
          </button>
        </div>
      </div>
    </div>
  );
};