
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { NumericStatCard } from '@/components/shared/visual-data';
import { BookOpen, Users, Clock, Star, Plus, Eye, Edit, X } from 'lucide-react';
import { mockCourses } from './data';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const CoursesTab: React.FC = () => {
  const [courses, setCourses] = useState(mockCourses);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [viewingCourse, setViewingCourse] = useState<any>(null);
  const [isCourseBuilderOpen, setIsCourseBuilderOpen] = useState(false);
  const [builderModules, setBuilderModules] = useState<{ title: string; type: string; duration: string }[]>([]);
  const [newModule, setNewModule] = useState({ title: '', type: 'video', duration: '' });

  const createFields: FormField[] = [
    { name: 'title', label: 'اسم الدورة', type: 'text', required: true, placeholder: 'عنوان الدورة التدريبية' },
    { name: 'description', label: 'الوصف', type: 'textarea', required: true, placeholder: 'وصف الدورة...' },
    { name: 'category', label: 'الفئة', type: 'select', required: true, options: [
      { value: 'onboarding', label: 'تأهيل' }, { value: 'technical', label: 'تقني' }, { value: 'management', label: 'إداري' }, { value: 'corporate', label: 'مؤسسي' }, { value: 'workshop', label: 'ورشة عمل' },
    ]},
    { name: 'type', label: 'النوع', type: 'select', required: true, options: [
      { value: 'internal', label: 'داخلي' }, { value: 'external', label: 'خارجي' }, { value: 'partnership', label: 'شراكة' },
    ]},
    { name: 'instructor', label: 'المدرب', type: 'text', required: true, placeholder: 'اسم المدرب' },
    { name: 'duration', label: 'المدة (ساعات)', type: 'number', required: true, placeholder: '0' },
    { name: 'maxStudents', label: 'الحد الأقصى للمتدربين', type: 'number', placeholder: '0' },
  ];

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = { 'onboarding': 'تأهيل', 'technical': 'تقني', 'management': 'إداري', 'corporate': 'مؤسسي', 'workshop': 'ورشة عمل' };
    return labels[category] || category;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { 'internal': 'داخلي', 'external': 'خارجي', 'partnership': 'شراكة' };
    return labels[type] || type;
  };

  const handleCreateCourse = (data: Record<string, string>) => {
    const newCourse: any = {
      id: `course-${Date.now()}`,
      title: data.title, description: data.description, category: data.category, type: data.type,
      status: 'draft', instructor: data.instructor, duration: Number(data.duration),
      maxStudents: Number(data.maxStudents) || undefined, skills: [], scormCompliant: false, xApiEnabled: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), modules: [], prerequisites: [],
    };
    setCourses(prev => [newCourse, ...prev]);
  };

  const handleEditCourse = (data: Record<string, string>) => {
    if (!editingCourse) return;
    setCourses(prev => prev.map(c => c.id === editingCourse.id ? {
      ...c, title: data.title, description: data.description, category: data.category as any, type: data.type as any, instructor: data.instructor, duration: Number(data.duration), maxStudents: Number(data.maxStudents) || c.maxStudents,
    } : c));
    setEditingCourse(null);
  };

  const getViewFields = (course: any): DetailField[] => [
    { label: 'العنوان', value: course.title },
    { label: 'الوصف', value: course.description },
    { label: 'الفئة', value: getCategoryLabel(course.category) },
    { label: 'النوع', value: getTypeLabel(course.type) },
    { label: 'المدرب', value: course.instructor },
    { label: 'المدة', value: `${course.duration} ساعة` },
    { label: 'الحد الأقصى', value: course.maxStudents ? `${course.maxStudents} متدرب` : 'غير محدد' },
    { label: 'الحالة', value: course.status === 'published' ? 'منشور' : course.status === 'draft' ? 'مسودة' : 'مؤرشف' },
    { label: 'المهارات', value: course.skills.join('، ') || 'لم تحدد بعد' },
  ];

  const handleAddModule = () => {
    if (!newModule.title) { toast.error('أدخل عنوان الوحدة'); return; }
    setBuilderModules(prev => [...prev, { ...newModule }]);
    setNewModule({ title: '', type: 'video', duration: '' });
  };

  const handleSaveCourseBuilder = () => {
    toast.success(`تم حفظ الدورة مع ${builderModules.length} وحدة`);
    setIsCourseBuilderOpen(false);
    setBuilderModules([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h3 className="text-2xl font-semibold">الدورات التدريبية</h3><p className="text-gray-600">إدارة وتطوير الدورات والبرامج التدريبية</p></div>
        <BaseActionButton onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" /> إنشاء دورة جديدة</BaseActionButton>
      </div>

      <AppDashboardGrid columns={12} minRowHeight="auto">
        {[{ label: 'دورات التأهيل', count: courses.filter(c => c.category === 'onboarding').length, accent: '#a4e2f6' },
          { label: 'دورات تقنية', count: courses.filter(c => c.category === 'technical').length, accent: '#bdeed3' },
          { label: 'دورات إدارية', count: courses.filter(c => c.category === 'management').length, accent: '#d9d2fd' },
          { label: 'برامج مؤسسية', count: courses.filter(c => c.category === 'corporate').length, accent: '#fbe2aa' },
          { label: 'ورش عمل', count: courses.filter(c => c.category === 'workshop').length, accent: '#f8c4c0' },
        ].map((item, i) => (
          <AppGridItem key={i} colSpan={2} tabletSpan={3}>
            <NumericStatCard title={item.label} value={item.count} description="دورة" accentColor={item.accent} />
          </AppGridItem>
        ))}
      </AppDashboardGrid>

      <AppDashboardGrid columns={12} minRowHeight="auto">
        {courses.map((course) => (
          <AppGridItem key={course.id} colSpan={4} tabletSpan={3}>
            <AppCardSurface density="standard" interactive="hoverable" className="h-full flex flex-col">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-lg font-semibold">{course.title}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{getCategoryLabel(course.category)}</Badge>
                    <Badge variant="secondary">{getTypeLabel(course.type)}</Badge>
                  </div>
                </div>
                <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                  {course.status === 'published' ? 'منشور' : course.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 mt-4">{course.description}</p>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> المدرب: {course.instructor}</span></div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration} ساعة</span>
                  {course.maxStudents && <span className="flex items-center gap-1"><Users className="h-4 w-4" /> حتى {course.maxStudents} متدرب</span>}
                </div>
                <div className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 text-yellow-500" /><span>4.5</span><span className="text-gray-500">(24 تقييم)</span></div>
                {course.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {course.skills.slice(0, 3).map((skill, index) => <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>)}
                    {course.skills.length > 3 && <Badge variant="outline" className="text-xs">+{course.skills.length - 3}</Badge>}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <BaseActionButton size="sm" className="flex-1" onClick={() => setViewingCourse(course)}>عرض التفاصيل</BaseActionButton>
                <BaseActionButton size="sm" variant="outline" onClick={() => setEditingCourse(course)}>تعديل</BaseActionButton>
              </div>
            </AppCardSurface>
          </AppGridItem>
        ))}
      </AppDashboardGrid>

      <AppCardSurface density="standard">
        <div className="mb-2"><div className="text-lg font-semibold">محرر الدورات البصري</div></div>
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Course Builder</h3>
          <p className="text-gray-600 mb-4">استخدم المحرر البصري لإنشاء دورات تفاعلية تتضمن وحدات ودروس واختبارات</p>
          <BaseActionButton onClick={() => setIsCourseBuilderOpen(true)}>إطلاق محرر الدورات</BaseActionButton>
        </div>
      </AppCardSurface>

      <GenericFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="إنشاء دورة تدريبية جديدة" fields={createFields} onSubmit={handleCreateCourse} submitLabel="إنشاء الدورة" successMessage="تم إنشاء الدورة بنجاح" />

      {editingCourse && (
        <GenericFormModal
          isOpen={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          title={`تعديل: ${editingCourse.title}`}
          fields={createFields.map(f => ({ ...f, defaultValue: String((editingCourse as any)[f.name] || '') }))}
          onSubmit={handleEditCourse}
          submitLabel="حفظ التعديلات"
          successMessage="تم تحديث الدورة بنجاح"
        />
      )}

      {viewingCourse && (
        <GenericDetailModal isOpen={!!viewingCourse} onClose={() => setViewingCourse(null)} title={`تفاصيل: ${viewingCourse.title}`} fields={getViewFields(viewingCourse)} />
      )}

      <Dialog open={isCourseBuilderOpen} onOpenChange={setIsCourseBuilderOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl">
          <DialogHeader><DialogTitle className="text-xl font-bold text-black font-arabic text-center">محرر الدورات البصري</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-white/30 p-4 rounded-2xl border border-black/5">
              <h4 className="font-semibold font-arabic mb-3">إضافة وحدة جديدة</h4>
              <div className="grid grid-cols-3 gap-3">
                <div><Label className="font-arabic text-sm">عنوان الوحدة</Label><Input value={newModule.title} onChange={e => setNewModule(p => ({ ...p, title: e.target.value }))} placeholder="عنوان الوحدة" className="rounded-xl" /></div>
                <div><Label className="font-arabic text-sm">النوع</Label>
                  <select value={newModule.type} onChange={e => setNewModule(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 border rounded-xl bg-white font-arabic">
                    <option value="video">فيديو</option><option value="document">مستند</option><option value="quiz">اختبار</option><option value="assignment">واجب</option><option value="live_session">جلسة مباشرة</option>
                  </select>
                </div>
                <div><Label className="font-arabic text-sm">المدة (دقائق)</Label><Input type="number" value={newModule.duration} onChange={e => setNewModule(p => ({ ...p, duration: e.target.value }))} placeholder="30" className="rounded-xl" /></div>
              </div>
              <BaseActionButton onClick={handleAddModule} size="sm" className="mt-3 bg-black text-white rounded-full font-arabic"><Plus className="h-4 w-4 ml-1" /> إضافة وحدة</BaseActionButton>
            </div>

            {builderModules.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold font-arabic">الوحدات ({builderModules.length})</h4>
                {builderModules.map((mod, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-black/5">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                      <div><p className="font-medium font-arabic">{mod.title}</p><p className="text-xs text-gray-500">{mod.type} • {mod.duration} دقيقة</p></div>
                    </div>
                    <button onClick={() => setBuilderModules(prev => prev.filter((_, idx) => idx !== i))}><X className="h-4 w-4 text-gray-400 hover:text-red-500" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <BaseActionButton variant="outline" onClick={() => setIsCourseBuilderOpen(false)} className="rounded-full font-arabic">إلغاء</BaseActionButton>
            <BaseActionButton onClick={handleSaveCourseBuilder} className="bg-black text-white rounded-full font-arabic">حفظ الدورة</BaseActionButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
