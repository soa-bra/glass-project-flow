import React, { useState } from 'react';
import { X, Users, User, TrendingUp, TrendingDown, Brain, Target, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
interface TeamMember {
  id: string;
  name: string;
  role: string;
  productivity: number;
  tasksCompleted: number;
  totalTasks: number;
  hoursLogged: number;
  targetHours: number;
  strengths: string[];
  weaknesses: string[];
  recentProjects: number;
  qualityScore: number;
}
interface PerformanceEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export const PerformanceEvaluationModal: React.FC<PerformanceEvaluationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'individual'>('team');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock team data
  const teamMembers: TeamMember[] = [{
    id: '1',
    name: 'أحمد محمد',
    role: 'مطور رئيسي',
    productivity: 88,
    tasksCompleted: 24,
    totalTasks: 28,
    hoursLogged: 156,
    targetHours: 160,
    strengths: ['البرمجة المتقدمة', 'حل المشاكل', 'القيادة'],
    weaknesses: ['التوثيق', 'إدارة الوقت'],
    recentProjects: 3,
    qualityScore: 92
  }, {
    id: '2',
    name: 'فاطمة علي',
    role: 'مصممة واجهات',
    productivity: 95,
    tasksCompleted: 18,
    totalTasks: 19,
    hoursLogged: 152,
    targetHours: 150,
    strengths: ['التصميم الإبداعي', 'تجربة المستخدم', 'الاهتمام بالتفاصيل'],
    weaknesses: ['البرمجة التقنية'],
    recentProjects: 4,
    qualityScore: 96
  }, {
    id: '3',
    name: 'محمد خالد',
    role: 'محلل أنظمة',
    productivity: 75,
    tasksCompleted: 15,
    totalTasks: 20,
    hoursLogged: 140,
    targetHours: 160,
    strengths: ['التحليل المنطقي', 'قواعد البيانات'],
    weaknesses: ['التواصل', 'السرعة في التنفيذ'],
    recentProjects: 2,
    qualityScore: 85
  }, {
    id: '4',
    name: 'نورا سعد',
    role: 'مختبرة جودة',
    productivity: 82,
    tasksCompleted: 22,
    totalTasks: 25,
    hoursLogged: 145,
    targetHours: 150,
    strengths: ['دقة الاختبار', 'اكتشاف الأخطاء'],
    weaknesses: ['الأتمتة', 'البرمجة'],
    recentProjects: 3,
    qualityScore: 89
  }];
  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
  };
  const teamStats = {
    avgProductivity: Math.round(teamMembers.reduce((sum, member) => sum + member.productivity, 0) / teamMembers.length),
    totalTasksCompleted: teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0),
    totalTasks: teamMembers.reduce((sum, member) => sum + member.totalTasks, 0),
    avgQualityScore: Math.round(teamMembers.reduce((sum, member) => sum + member.qualityScore, 0) / teamMembers.length),
    totalHours: teamMembers.reduce((sum, member) => sum + member.hoursLogged, 0)
  };
  const selectedMember = teamMembers.find(m => m.id === selectedMemberId);
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  const getPerformanceIcon = (score: number) => {
    if (score >= 90) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (score >= 70) return <Target className="w-4 h-4 text-blue-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 font-arabic" style={{
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
          <DialogTitle className="text-xl font-bold text-black font-arabic">تقييم الأداء بالذكاء الاصطناعي</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-black/10">
          <button onClick={() => setActiveTab('team')} className={`flex-1 p-4 text-sm font-medium transition-colors ${activeTab === 'team' ? 'bg-black/5 text-black border-b-2 border-black' : 'text-black/70 hover:text-black hover:bg-black/5'}`}>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              تقييم الفريق
            </div>
          </button>
          <button onClick={() => setActiveTab('individual')} className={`flex-1 p-4 text-sm font-medium transition-colors ${activeTab === 'individual' ? 'bg-black/5 text-black border-b-2 border-black' : 'text-black/70 hover:text-black hover:bg-black/5'}`}>
            <div className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              تقييم فردي
            </div>
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          {activeTab === 'team' ? <div className="space-y-6">
              {/* AI Analysis Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-black/10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black">تحليل الذكاء الاصطناعي لاداء الفريق</h3>
                      <p className="text-sm text-black/70">تحليل شامل لأداء الفريق وتقديم توصيات للتطوير</p>
                    </div>
                  </div>
                  <button onClick={handleAIAnalysis} disabled={isAnalyzing} className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-black/80 transition-colors disabled:opacity-50">
                    {isAnalyzing ? 'جاري التحليل...' : 'بدء التحليل'}
                  </button>
                </div>

                {isAnalyzing && <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-black/70">يتم تحليل أداء الفريق...</p>
                    </div>
                  </div>}
              </div>

              {/* Team Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/50 rounded-2xl border border-black/10 p-4 text-center">
                  <div className="text-2xl font-bold text-black mb-1">{teamStats.avgProductivity}%</div>
                  <div className="text-sm text-black/70">متوسط الإنتاجية</div>
                  <div className="flex justify-center mt-2">
                    {getPerformanceIcon(teamStats.avgProductivity)}
                  </div>
                </div>
                <div className="bg-white/50 rounded-2xl border border-black/10 p-4 text-center">
                  <div className="text-2xl font-bold text-black mb-1">{Math.round(teamStats.totalTasksCompleted / teamStats.totalTasks * 100)}%</div>
                  <div className="text-sm text-black/70">معدل إنجاز المهام</div>
                  <div className="text-xs text-black/50 mt-1">{teamStats.totalTasksCompleted}/{teamStats.totalTasks}</div>
                </div>
                <div className="bg-white/50 rounded-2xl border border-black/10 p-4 text-center">
                  <div className="text-2xl font-bold text-black mb-1">{teamStats.avgQualityScore}%</div>
                  <div className="text-sm text-black/70">جودة العمل</div>
                  <div className="flex justify-center mt-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
                <div className="bg-white/50 rounded-2xl border border-black/10 p-4 text-center">
                  <div className="text-2xl font-bold text-black mb-1">{teamStats.totalHours}h</div>
                  <div className="text-sm text-black/70">إجمالي الساعات</div>
                  <div className="text-xs text-black/50 mt-1">هذا الشهر</div>
                </div>
              </div>

              {/* Team Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/50 rounded-2xl border border-black/10 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-black">نقاط القوة</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <h4 className="font-medium text-black mb-1">التعاون والعمل الجماعي</h4>
                      <p className="text-sm text-black/70">الفريق يظهر تعاوناً ممتازاً في المشاريع المشتركة</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <h4 className="font-medium text-black mb-1">جودة التنفيذ العالية</h4>
                      <p className="text-sm text-black/70">معدل جودة العمل يتجاوز المعايير المطلوبة</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <h4 className="font-medium text-black mb-1">التنوع في المهارات</h4>
                      <p className="text-sm text-black/70">تنوع مهارات الأعضاء يغطي جميع جوانب المشروع</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 rounded-2xl border border-black/10 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-black">مجالات التحسين</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <h4 className="font-medium text-black mb-1">إدارة الوقت</h4>
                      <p className="text-sm text-black/70">يحتاج الفريق لتحسين التخطيط الزمني للمهام</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <h4 className="font-medium text-black mb-1">التوثيق والتواصل</h4>
                      <p className="text-sm text-black/70">تحسين مستوى التوثيق والتواصل مع الإدارة</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <h4 className="font-medium text-black mb-1">الأتمتة والأدوات</h4>
                      <p className="text-sm text-black/70">الاستفادة أكثر من أدوات الأتمتة المتاحة</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Development Plan */}
              <div className="bg-white/50 rounded-2xl border border-black/10 p-4">
                <h3 className="text-lg font-semibold text-black mb-4">خطة التطوير المقترحة</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <h4 className="font-medium text-black mb-2">الهدف الأول</h4>
                    <p className="text-sm text-black/70 mb-2">تحسين إدارة الوقت بنسبة 20%</p>
                    <div className="text-xs text-black/60">المدة: 4 أسابيع</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <h4 className="font-medium text-black mb-2">الهدف الثاني</h4>
                    <p className="text-sm text-black/70 mb-2">تطوير مهارات التوثيق الفني</p>
                    <div className="text-xs text-black/60">المدة: 6 أسابيع</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <h4 className="font-medium text-black mb-2">الهدف الثالث</h4>
                    <p className="text-sm text-black/70 mb-2">تحسين استخدام أدوات الأتمتة</p>
                    <div className="text-xs text-black/60">المدة: 8 أسابيع</div>
                  </div>
                </div>
              </div>
            </div> : <div className="space-y-6">
              {/* Member Selection */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  اختيار عضو الفريق للتقييم الفردي
                </label>
                <select value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)} className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
                  <option value="">اختر عضو الفريق...</option>
                  {teamMembers.map(member => <option key={member.id} value={member.id}>
                      {member.name} - {member.role}
                    </option>)}
                </select>
              </div>

              {selectedMember && <div className="space-y-6">
                  {/* Individual Performance Overview */}
                  <div className="bg-white/50 rounded-2xl border border-black/10 p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-black/10 rounded-full p-2">
                        <User className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-black">{selectedMember.name}</h3>
                        <p className="text-sm text-black/70">{selectedMember.role}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-transparent border border-black/10 rounded-xl">
                        <div className={`text-2xl font-bold mb-1 ${getPerformanceColor(selectedMember.productivity)}`}>
                          {selectedMember.productivity}%
                        </div>
                        <div className="text-sm text-black/70">الإنتاجية</div>
                      </div>
                      <div className="text-center p-3 bg-transparent border border-black/10 rounded-xl">
                        <div className="text-2xl font-bold text-black mb-1">
                          {Math.round(selectedMember.tasksCompleted / selectedMember.totalTasks * 100)}%
                        </div>
                        <div className="text-sm text-black/70">معدل الإنجاز</div>
                      </div>
                      <div className="text-center p-3 bg-transparent border border-black/10 rounded-xl">
                        <div className={`text-2xl font-bold mb-1 ${getPerformanceColor(selectedMember.qualityScore)}`}>
                          {selectedMember.qualityScore}%
                        </div>
                        <div className="text-sm text-black/70">جودة العمل</div>
                      </div>
                      <div className="text-center p-3 bg-transparent border border-black/10 rounded-xl">
                        <div className="text-2xl font-bold text-black mb-1">{selectedMember.hoursLogged}h</div>
                        <div className="text-sm text-black/70">الساعات المسجلة</div>
                      </div>
                    </div>
                  </div>

                  {/* Individual Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/50 rounded-2xl border border-black/10 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-black">نقاط القوة</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedMember.strengths.map((strength, index) => <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-3">
                            <div className="font-medium text-black">{strength}</div>
                          </div>)}
                      </div>
                    </div>

                    <div className="bg-white/50 rounded-2xl border border-black/10 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold text-black">نقاط التحسين</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedMember.weaknesses.map((weakness, index) => <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                            <div className="font-medium text-black">{weakness}</div>
                          </div>)}
                      </div>
                    </div>
                  </div>

                  {/* Individual Development Plan */}
                  <div className="bg-white/50 rounded-2xl border border-black/10 p-4">
                    <h3 className="text-lg font-semibold text-black mb-4">خطة التطوير الشخصية</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <h4 className="font-medium text-black mb-2">التدريب المقترح</h4>
                        <p className="text-sm text-black/70">دورة تدريبية في مجالات التحسين المحددة</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <h4 className="font-medium text-black mb-2">المهام التطويرية</h4>
                        <p className="text-sm text-black/70">مشاريع إضافية لتطوير المهارات الضعيفة</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <h4 className="font-medium text-black mb-2">المتابعة والتقييم</h4>
                        <p className="text-sm text-black/70">مراجعة دورية كل أسبوعين لمتابعة التقدم</p>
                      </div>
                    </div>
                  </div>
                </div>}

              {!selectedMember && <div className="text-center py-12">
                  <User className="w-12 h-12 text-black/30 mx-auto mb-4" />
                  <p className="text-black/70">اختر عضو فريق لعرض التقييم الفردي</p>
                </div>}
            </div>}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-black/10">
          <button onClick={onClose} className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic transition-colors">
            إغلاق
          </button>
          <button className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors">
            تصدير التقرير
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};