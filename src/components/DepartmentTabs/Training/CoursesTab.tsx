
import React, { useState } from 'react';

import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { NumericStatCard } from '@/components/shared/visual-data';
import {
  BookOpen, Users, Clock, Star, Plus, X, GraduationCap,
  Video, FileText, HelpCircle, ClipboardList, Radio,
  Edit, Eye, Layers, Award, BarChart3,
} from 'lucide-react';
import { mockCourses } from './data';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { toast } from 'sonner';

// ─── Helpers ────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, string> = {
  onboarding: 'تأهيل', technical: 'تقني', management: 'إداري',
  corporate: 'مؤسسي', workshop: 'ورشة عمل',
};
const TYPE_MAP: Record<string, string> = {
  internal: 'داخلي', external: 'خارجي', partnership: 'شراكة',
};
const STATUS_MAP: Record<string, string> = {
  published: 'منشور', draft: 'مسودة', archived: 'مؤرشف',
};
const MODULE_TYPE_MAP: Record<string, { label: string; icon: React.ElementType }> = {
  video: { label: 'فيديو', icon: Video },
  document: { label: 'مستند', icon: FileText },
  quiz: { label: 'اختبار', icon: HelpCircle },
  assignment: { label: 'واجب', icon: ClipboardList },
  live_session: { label: 'جلسة مباشرة', icon: Radio },
};

export const CoursesTab: React.FC = () => {
  const [courses, setCourses] = useState(mockCourses);

  // ── Modal states ──
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [viewingCourse, setViewingCourse] = useState<any>(null);
  const [builderCourse, setBuilderCourse] = useState<any>(null);
  const [builderModules, setBuilderModules] = useState<{ title: string; type: string; duration: string; description: string }[]>([]);
  const [newModule, setNewModule] = useState({ title: '', type: 'video', duration: '', description: '' });

  // ── Form fields (course-management specific) ──
  const createFields: FormField[] = [
    { name: 'title', label: 'عنوان الدورة التدريبية', type: 'text', required: true, placeholder: 'مثال: أساسيات علم اجتماع العلامة التجارية' },
    { name: 'description', label: 'وصف الدورة وأهدافها التعليمية', type: 'textarea', required: true, placeholder: 'اشرح الأهداف التعليمية، الفئة المستهدفة، والمخرجات المتوقعة من الدورة...' },
    { name: 'category', label: 'المسار التدريبي', type: 'select', required: true, options: [
      { value: 'onboarding', label: 'تأهيل الموظفين الجدد' }, { value: 'technical', label: 'مهارات تقنية' },
      { value: 'management', label: 'مهارات إدارية وقيادية' }, { value: 'corporate', label: 'ثقافة مؤسسية' },
      { value: 'workshop', label: 'ورشة عمل تطبيقية' },
    ]},
    { name: 'type', label: 'أسلوب التقديم', type: 'select', required: true, options: [
      { value: 'internal', label: 'تدريب داخلي (فريق سوبرا)' }, { value: 'external', label: 'مدرب خارجي معتمد' },
      { value: 'partnership', label: 'شراكة تدريبية' },
    ]},
    { name: 'instructor', label: 'المدرب / المسؤول التعليمي', type: 'text', required: true, placeholder: 'اسم المدرب أو الجهة المسؤولة' },
    { name: 'duration', label: 'إجمالي ساعات التدريب', type: 'number', required: true, placeholder: '0' },
    { name: 'maxStudents', label: 'السعة القصوى (عدد المتدربين)', type: 'number', placeholder: '25' },
  ];

  // ── Handlers ──
  const handleCreateCourse = (data: Record<string, string>) => {
    const newCourse: any = {
      id: `COURSE-${Date.now()}`,
      title: data.title, description: data.description, category: data.category, type: data.type,
      status: 'draft', instructor: data.instructor, duration: Number(data.duration),
      maxStudents: Number(data.maxStudents) || 25, skills: [], scormCompliant: false, xApiEnabled: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), modules: [], prerequisites: [],
    };
    setCourses(prev => [newCourse, ...prev]);
  };

  const handleEditCourse = (data: Record<string, string>) => {
    if (!editingCourse) return;
    setCourses(prev => prev.map(c => c.id === editingCourse.id ? {
      ...c, title: data.title, description: data.description, category: data.category as any,
      type: data.type as any, instructor: data.instructor, duration: Number(data.duration),
      maxStudents: Number(data.maxStudents) || c.maxStudents, updatedAt: new Date().toISOString(),
    } : c));
    setEditingCourse(null);
  };

  const openBuilder = (course: any) => {
    setBuilderCourse(course);
    setBuilderModules(
      (course.modules || []).map((m: any) => ({
        title: m.title, type: m.type, duration: String(m.duration || ''), description: m.description || '',
      }))
    );
  };

  const handleAddModule = () => {
    if (!newModule.title) { toast.error('أدخل عنوان الوحدة'); return; }
    setBuilderModules(prev => [...prev, { ...newModule }]);
    setNewModule({ title: '', type: 'video', duration: '', description: '' });
    toast.success('تم إضافة الوحدة');
  };

  const handleSaveBuilder = () => {
    if (!builderCourse) return;
    setCourses(prev => prev.map(c => c.id === builderCourse.id ? {
      ...c,
      modules: builderModules.map((m, i) => ({
        id: `MOD-${builderCourse.id}-${i + 1}`,
        courseId: builderCourse.id,
        title: m.title, description: m.description, order: i + 1,
        type: m.type as 'video' | 'document' | 'quiz' | 'assignment' | 'live_session',
        content: '', duration: Number(m.duration) || 0,
        completionCriteria: { type: 'time_based' as const, threshold: 100 }, resources: [],
      })),
      updatedAt: new Date().toISOString(),
    } : c));
    toast.success(`تم حفظ ${builderModules.length} وحدة في "${builderCourse.title}"`);
    setBuilderCourse(null);
    setBuilderModules([]);
  };

  const ModuleTypeIcon = ({ type }: { type: string }) => {
    const entry = MODULE_TYPE_MAP[type];
    if (!entry) return null;
    const Icon = entry.icon;
    return <Icon className="h-4 w-4" />;
  };

  // ── KPI stats ──
  const statItems = [
    { label: 'إجمالي الدورات', count: courses.length, accent: '#3DA8F5' },
    { label: 'منشورة', count: courses.filter(c => c.status === 'published').length, accent: '#3DBE8B' },
    { label: 'مسودات', count: courses.filter(c => c.status === 'draft').length, accent: '#F6C445' },
    { label: 'إجمالي الساعات', count: courses.reduce((s, c) => s + c.duration, 0), accent: '#a4e2f6' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">الدورات التدريبية</h3>
          <p className="text-[rgba(11,15,18,0.6)] text-sm">إدارة وتطوير الدورات والبرامج التدريبية</p>
        </div>
        <BaseActionButton onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> إنشاء دورة جديدة
        </BaseActionButton>
      </div>

      {/* ── KPI Row ── */}
      <AppDashboardGrid columns={12} minRowHeight="auto">
        {statItems.map((item, i) => (
          <AppGridItem key={i} colSpan={3} tabletSpan={3}>
            <NumericStatCard title={item.label} value={item.count} description={i === 3 ? 'ساعة' : 'دورة'} accentColor={item.accent} />
          </AppGridItem>
        ))}
      </AppDashboardGrid>

      {/* ── Course Cards ── */}
      <AppDashboardGrid columns={12} minRowHeight="auto">
        {courses.map((course) => (
          <AppGridItem key={course.id} colSpan={4} tabletSpan={6}>
            <AppCardSurface density="standard" interactive="hoverable" className="h-full flex flex-col">
              {/* Card header */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold leading-snug line-clamp-2">{course.title}</div>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <Badge variant="outline">{CATEGORY_MAP[course.category] || course.category}</Badge>
                    <Badge variant="secondary">{TYPE_MAP[course.type] || course.type}</Badge>
                  </div>
                </div>
                <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="shrink-0">
                  {STATUS_MAP[course.status] || course.status}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-[rgba(11,15,18,0.6)] text-sm mb-4 line-clamp-2 mt-3">{course.description}</p>

              {/* Metadata */}
              <div className="space-y-2 flex-1 text-sm text-[rgba(11,15,18,0.8)]">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 shrink-0" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration} ساعة</span>
                  {course.maxStudents && (
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course.maxStudents} متدرب</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Layers className="h-4 w-4" /> {course.modules?.length || 0} وحدة</span>
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 text-[#F6C445]" /> 4.5</span>
                </div>
                {course.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {course.skills.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                    {course.skills.length > 3 && <Badge variant="outline" className="text-xs">+{course.skills.length - 3}</Badge>}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-[#DADCE0]">
                <BaseActionButton size="sm" className="flex-1 flex items-center justify-center gap-1" onClick={() => setViewingCourse(course)}>
                  <Eye className="h-3.5 w-3.5" /> التفاصيل
                </BaseActionButton>
                <BaseActionButton size="sm" variant="outline" onClick={() => setEditingCourse(course)}>
                  <Edit className="h-3.5 w-3.5" />
                </BaseActionButton>
                <BaseActionButton size="sm" variant="outline" onClick={() => openBuilder(course)}>
                  <Layers className="h-3.5 w-3.5" />
                </BaseActionButton>
              </div>
            </AppCardSurface>
          </AppGridItem>
        ))}
      </AppDashboardGrid>

      {/* ════════════════════════════════════════════════
          MODAL: Create Course
         ════════════════════════════════════════════════ */}
      <GenericFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="تصميم دورة تدريبية جديدة"
        fields={createFields}
        onSubmit={handleCreateCourse}
        submitLabel="إنشاء الدورة التدريبية"
        successMessage="تم إنشاء الدورة بنجاح — انتقل إلى محرر الوحدات لإضافة المحتوى التعليمي"
      />

      {/* ════════════════════════════════════════════════
          MODAL: Edit Course
         ════════════════════════════════════════════════ */}
      {editingCourse && (
        <GenericFormModal
          isOpen={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          title={`تعديل الدورة التدريبية: ${editingCourse.title}`}
          fields={createFields.map(f => ({ ...f, defaultValue: String((editingCourse as any)[f.name] || '') }))}
          onSubmit={handleEditCourse}
          submitLabel="حفظ تعديلات الدورة"
          successMessage="تم تحديث بيانات الدورة التدريبية بنجاح"
        />
      )}

      {/* ════════════════════════════════════════════════
          MODAL: View Course Details (specialized)
         ════════════════════════════════════════════════ */}
      {viewingCourse && (
        <Dialog open={!!viewingCourse} onOpenChange={() => setViewingCourse(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-arabic text-center">
                تفاصيل الدورة
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              {/* Title + status hero */}
              <div className="p-4 bg-white/30 rounded-2xl border border-black/5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold font-arabic">{viewingCourse.title}</h3>
                  <Badge variant={viewingCourse.status === 'published' ? 'default' : 'secondary'}>
                    {STATUS_MAP[viewingCourse.status] || viewingCourse.status}
                  </Badge>
                </div>
                <p className="text-sm text-[rgba(11,15,18,0.7)] font-arabic">{viewingCourse.description}</p>
              </div>

              {/* Key metadata grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: GraduationCap, label: 'المدرب', value: viewingCourse.instructor },
                  { icon: BookOpen, label: 'التصنيف', value: CATEGORY_MAP[viewingCourse.category] || viewingCourse.category },
                  { icon: Clock, label: 'المدة', value: `${viewingCourse.duration} ساعة` },
                  { icon: Users, label: 'الحد الأقصى', value: viewingCourse.maxStudents ? `${viewingCourse.maxStudents} متدرب` : 'غير محدد' },
                  { icon: BarChart3, label: 'نوع التقديم', value: TYPE_MAP[viewingCourse.type] || viewingCourse.type },
                  { icon: Layers, label: 'الوحدات', value: `${viewingCourse.modules?.length || 0} وحدة` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 bg-white/30 rounded-xl border border-black/5">
                    <item.icon className="h-4 w-4 text-[rgba(11,15,18,0.5)] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-[rgba(11,15,18,0.5)] font-arabic">{item.label}</div>
                      <div className="text-sm font-semibold font-arabic truncate">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              {viewingCourse.skills?.length > 0 && (
                <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Award className="h-4 w-4 text-[rgba(11,15,18,0.5)]" />
                    <span className="text-sm font-semibold font-arabic">المهارات المكتسبة</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingCourse.skills.map((skill: string, i: number) => (
                      <Badge key={i} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Modules list */}
              {viewingCourse.modules?.length > 0 && (
                <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Layers className="h-4 w-4 text-[rgba(11,15,18,0.5)]" />
                    <span className="text-sm font-semibold font-arabic">وحدات الدورة</span>
                  </div>
                  <div className="space-y-2">
                    {viewingCourse.modules.map((mod: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 bg-white/40 rounded-xl">
                        <span className="w-7 h-7 bg-[#0B0F12] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium font-arabic truncate">{mod.title}</p>
                          <p className="text-xs text-[rgba(11,15,18,0.5)]">
                            {MODULE_TYPE_MAP[mod.type]?.label || mod.type}
                            {mod.duration ? ` • ${mod.duration} دقيقة` : ''}
                          </p>
                        </div>
                        <ModuleTypeIcon type={mod.type} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical flags */}
              <div className="flex items-center gap-3 text-xs text-[rgba(11,15,18,0.5)] font-arabic">
                {viewingCourse.scormCompliant && <Badge variant="outline" className="text-xs">SCORM</Badge>}
                {viewingCourse.xApiEnabled && <Badge variant="outline" className="text-xs">xAPI</Badge>}
                <span>آخر تحديث: {new Date(viewingCourse.updatedAt).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <BaseActionButton variant="outline" size="sm" onClick={() => { setViewingCourse(null); setEditingCourse(viewingCourse); }}>
                <Edit className="h-3.5 w-3.5 ml-1" /> تعديل
              </BaseActionButton>
              <BaseActionButton variant="outline" size="sm" onClick={() => { setViewingCourse(null); openBuilder(viewingCourse); }}>
                <Layers className="h-3.5 w-3.5 ml-1" /> محرر الوحدات
              </BaseActionButton>
              <BaseActionButton variant="outline" onClick={() => setViewingCourse(null)}>إغلاق</BaseActionButton>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ════════════════════════════════════════════════
          MODAL: Course Builder (specialized)
         ════════════════════════════════════════════════ */}
      {builderCourse && (
        <Dialog open={!!builderCourse} onOpenChange={() => { setBuilderCourse(null); setBuilderModules([]); }}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-arabic text-center">
                محرر وحدات: {builderCourse.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              {/* Add module form */}
              <div className="p-4 bg-white/30 rounded-2xl border border-black/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold font-arabic text-sm flex items-center gap-1.5">
                    <Plus className="h-4 w-4" /> إضافة وحدة تعليمية
                  </h4>
                  <span className="text-[10px] text-[rgba(11,15,18,0.4)] font-arabic">الحقول المطلوبة معلّمة بـ *</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="font-arabic text-xs font-medium">عنوان الوحدة التعليمية *</Label>
                    <Input
                      value={newModule.title}
                      onChange={e => setNewModule(p => ({ ...p, title: e.target.value }))}
                      placeholder="مثال: مقدمة في أساسيات علم اجتماع العلامة"
                      className="bg-white/40 border-black/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-arabic text-xs font-medium">نوع المحتوى التعليمي</Label>
                    <Select value={newModule.type} onValueChange={v => setNewModule(p => ({ ...p, type: v }))}>
                      <SelectTrigger className="bg-white/40 border-black/10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(MODULE_TYPE_MAP).map(([value, { label, icon: Icon }]) => (
                          <SelectItem key={value} value={value}>
                            <span className="flex items-center gap-2"><Icon className="h-3.5 w-3.5" /> {label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-arabic text-xs font-medium">مدة الوحدة (دقائق)</Label>
                    <Input
                      type="number"
                      value={newModule.duration}
                      onChange={e => setNewModule(p => ({ ...p, duration: e.target.value }))}
                      placeholder="30"
                      className="bg-white/40 border-black/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="font-arabic text-xs font-medium">وصف المحتوى (اختياري)</Label>
                    <Input
                      value={newModule.description}
                      onChange={e => setNewModule(p => ({ ...p, description: e.target.value }))}
                      placeholder="ملخص قصير لما يتعلمه المتدرب في هذه الوحدة"
                      className="bg-white/40 border-black/10 rounded-xl"
                    />
                  </div>
                </div>
                <BaseActionButton onClick={handleAddModule} size="sm" className="flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> إضافة الوحدة
                </BaseActionButton>
              </div>

              {/* Modules list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold font-arabic text-sm">
                    محتوى الدورة — {builderModules.length} {builderModules.length === 1 ? 'وحدة' : 'وحدات'}
                  </h4>
                  {builderModules.length > 0 && (
                    <span className="text-xs text-[rgba(11,15,18,0.5)] font-arabic bg-[rgba(11,15,18,0.04)] px-2 py-0.5 rounded-full">
                      ⏱ {builderModules.reduce((s, m) => s + (Number(m.duration) || 0), 0)} دقيقة إجمالاً
                    </span>
                  )}
                </div>

                {builderModules.length === 0 ? (
                  <div className="text-center py-8 text-[rgba(11,15,18,0.4)]">
                    <Layers className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-arabic">لم تُضف وحدات بعد — ابدأ بإضافة أول وحدة أعلاه</p>
                  </div>
                ) : (
                  builderModules.map((mod, i) => {
                    const typeEntry = MODULE_TYPE_MAP[mod.type];
                    const TypeIcon = typeEntry?.icon || BookOpen;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/40 rounded-xl border border-black/5 group">
                        <span className="w-8 h-8 bg-[#0B0F12] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                          {i + 1}
                        </span>
                        <TypeIcon className="h-4 w-4 text-[rgba(11,15,18,0.5)] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium font-arabic text-sm truncate">{mod.title}</p>
                          <p className="text-xs text-[rgba(11,15,18,0.5)]">
                            {typeEntry?.label || mod.type}
                            {mod.duration ? ` • ${mod.duration} دقيقة` : ''}
                            {mod.description ? ` — ${mod.description}` : ''}
                          </p>
                        </div>
                        <button
                          onClick={() => setBuilderModules(prev => prev.filter((_, idx) => idx !== i))}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4 text-[rgba(11,15,18,0.4)] hover:text-[#E5564D]" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <BaseActionButton variant="outline" onClick={() => { setBuilderCourse(null); setBuilderModules([]); }}>
                إلغاء
              </BaseActionButton>
              <BaseActionButton variant="primary" onClick={handleSaveBuilder}>
                حفظ الوحدات ({builderModules.length})
              </BaseActionButton>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
