
import React, { useState } from 'react';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, Edit, Save, Eye, History, GitBranch, Users, MessageCircle,
  FileText, Image, Link, Bold, Italic, List, Calendar, User, Tag, Clock
} from 'lucide-react';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { toast } from 'sonner';

// ─── Status Map ─────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft:   { label: 'مسودة',       color: 'rgba(11,15,18,0.40)' },
  review:  { label: 'قيد المراجعة', color: '#F6C445' },
  ready:   { label: 'جاهز للنشر',   color: '#3DBE8B' },
  published: { label: 'منشور',      color: '#3DA8F5' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const entry = STATUS_MAP[status];
  if (!entry) return <BaseBadge variant="secondary">{status}</BaseBadge>;
  return (
    <span className="px-2 py-0.5 text-[10px] rounded-full font-medium font-arabic"
      style={{ backgroundColor: `${entry.color}18`, color: entry.color, border: `1px solid ${entry.color}30` }}>
      {entry.label}
    </span>
  );
};

// ─── Form Fields ────────────────────────────────────────────────
const docFields: FormField[] = [
  { name: 'title', label: 'عنوان الوثيقة', type: 'text', required: true, placeholder: 'مثال: دليل قياس الأثر الثقافي' },
  { name: 'category', label: 'الفئة', type: 'select', required: true, options: [
    { value: 'guide', label: 'دليل' }, { value: 'research', label: 'بحث' },
    { value: 'report', label: 'تقرير' }, { value: 'template', label: 'قالب' },
  ]},
  { name: 'author', label: 'المؤلف', type: 'text', required: true, placeholder: 'اسم المؤلف' },
  { name: 'tags', label: 'الوسوم', type: 'text', placeholder: 'مفصولة بفاصلة: ثقافة, علامة, بحث' },
  { name: 'status', label: 'الحالة', type: 'select', options: [
    { value: 'draft', label: 'مسودة' }, { value: 'review', label: 'قيد المراجعة' }, { value: 'ready', label: 'جاهز للنشر' },
  ]},
];

const CATEGORY_LABELS: Record<string, string> = { guide: 'دليل', research: 'بحث', report: 'تقرير', template: 'قالب' };

export const AuthoringVersionsTab: React.FC = () => {
  const [activeEditor, setActiveEditor] = useState('wysiwyg');
  const [content, setContent] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('guide');
  const [docStatus, setDocStatus] = useState('draft');
  const [docTags, setDocTags] = useState('');

  const [documents, setDocuments] = useState([
    { id: 'DOC-003', title: 'دليل قياس الأثر الثقافي', status: 'draft', lastModified: '2024-04-15', author: 'د. أحمد المحمد', version: '1.0', collaborators: 3, category: 'guide', tags: 'ثقافة, قياس' },
    { id: 'DOC-004', title: 'بحث في التسويق الرقمي الثقافي', status: 'review', lastModified: '2024-04-14', author: 'د. فاطمة العلي', version: '2.1', collaborators: 2, category: 'research', tags: 'تسويق, رقمي' },
  ]);

  const [versionHistory, setVersionHistory] = useState([
    { version: '2.1', date: '2024-04-15', author: 'د. أحمد المحمد', changes: 'إضافة قسم جديد حول المقاييس الكمية', status: 'current' },
    { version: '2.0', date: '2024-04-10', author: 'د. فاطمة العلي', changes: 'مراجعة شاملة للمحتوى وتحديث المراجع', status: 'previous' },
    { version: '1.5', date: '2024-04-05', author: 'د. أحمد المحمد', changes: 'إضافة أمثلة تطبيقية وحالات دراسية', status: 'previous' },
  ]);

  const [comments, setComments] = useState([
    { id: 'c1', author: 'د. فاطمة العلي', time: 'منذ ساعتين', text: 'يُنصح بإضافة مثال تطبيقي في القسم الثالث' },
    { id: 'c2', author: 'أ. محمد السالم', time: 'أمس', text: 'المراجع تحتاج تحديث وفقاً لأحدث الدراسات' },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [viewingVersion, setViewingVersion] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // ── Handlers ──
  const handleCreateDocument = (data: Record<string, string>) => {
    const newDoc = {
      id: `DOC-${Date.now()}`, title: data.title, status: data.status || 'draft',
      lastModified: new Date().toISOString().split('T')[0], author: data.author,
      version: '1.0', collaborators: 1, category: data.category, tags: data.tags || '',
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleEditDocument = (data: Record<string, string>) => {
    if (!editingDoc) return;
    setDocuments(prev => prev.map(d => d.id === editingDoc.id ? {
      ...d, title: data.title, category: data.category, author: data.author,
      tags: data.tags || d.tags, status: data.status || d.status,
      lastModified: new Date().toISOString().split('T')[0],
    } : d));
    setEditingDoc(null);
  };

  const handleLoadDocument = (doc: any) => {
    setDocTitle(doc.title);
    setDocCategory(doc.category || 'guide');
    setDocStatus(doc.status);
    setDocTags(doc.tags || '');
    setContent(`# ${doc.title}\n\nمحتوى الوثيقة يتم تحميله هنا...`);
    toast.success(`تم تحميل: ${doc.title}`);
  };

  const handleSaveContent = () => {
    if (!docTitle.trim()) { toast.error('يرجى إدخال عنوان الوثيقة'); return; }
    const newVersion = `${parseFloat(versionHistory[0]?.version || '1.0') + 0.1}`;
    setVersionHistory(prev => [
      { version: newVersion, date: new Date().toISOString().split('T')[0], author: 'المستخدم الحالي', changes: 'حفظ تعديلات جديدة', status: 'current' },
      ...prev.map(v => ({ ...v, status: 'previous' })),
    ]);
    toast.success('تم حفظ الوثيقة بنجاح');
  };

  const handlePreviewContent = () => {
    toast.info('معاينة المحتوى', { description: content.slice(0, 100) || 'لا يوجد محتوى للمعاينة' });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [
      { id: `c-${Date.now()}`, author: 'المستخدم الحالي', time: 'الآن', text: newComment },
      ...prev,
    ]);
    setNewComment('');
    toast.success('تم إضافة التعليق');
  };

  const handleAddCollaborator = () => {
    toast.info('إضافة متعاون', { description: 'سيتم فتح نظام دعوة المتعاونين قريباً' });
  };

  const handleToolbarAction = (action: string) => {
    const actions: Record<string, string> = {
      bold: '**نص عريض**', italic: '*نص مائل*', list: '\n- عنصر قائمة',
      link: '[نص الرابط](https://)', image: '![وصف الصورة](url)', file: '[مرفق](url)',
    };
    setContent(prev => prev + (actions[action] || ''));
  };

  const EditorToolbar = () => (
    <div className="flex items-center gap-1.5 p-2 border-b border-[#DADCE0]">
      {[
        { key: 'bold', icon: Bold }, { key: 'italic', icon: Italic }, { key: 'list', icon: List },
      ].map(({ key, icon: Icon }) => (
        <BaseActionButton key={key} size="sm" variant="outline" onClick={() => handleToolbarAction(key)}>
          <Icon className="h-3 w-3" />
        </BaseActionButton>
      ))}
      <div className="w-px h-5 bg-[#DADCE0] mx-1" />
      {[
        { key: 'link', icon: Link }, { key: 'image', icon: Image }, { key: 'file', icon: FileText },
      ].map(({ key, icon: Icon }) => (
        <BaseActionButton key={key} size="sm" variant="outline" onClick={() => handleToolbarAction(key)}>
          <Icon className="h-3 w-3" />
        </BaseActionButton>
      ))}
      <div className="mr-auto flex gap-1.5">
        <BaseActionButton size="sm" variant="outline" onClick={handleSaveContent}>
          <Save className="h-3 w-3 ml-1" /> حفظ
        </BaseActionButton>
        <BaseActionButton size="sm" onClick={handlePreviewContent}>
          <Eye className="h-3 w-3 ml-1" /> معاينة
        </BaseActionButton>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h3 className="text-lg font-bold font-arabic">التأليف والإصدارات</h3>
        <div className="flex gap-2">
          <BaseActionButton variant="outline" onClick={() => setShowVersionHistory(!showVersionHistory)} className="flex items-center gap-1.5">
            <History className="h-4 w-4" /> تاريخ الإصدارات
          </BaseActionButton>
          <BaseActionButton onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> إنشاء وثيقة جديدة
          </BaseActionButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <DataCardFrame title="محرر المحتوى">
            <Tabs value={activeEditor} onValueChange={setActiveEditor} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-3">
                <TabsTrigger value="wysiwyg">محرر بصري</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
              </TabsList>
            </Tabs>
            <EditorToolbar />
            <textarea
              className="w-full min-h-[400px] p-4 resize-none border-none outline-none text-sm font-arabic bg-transparent"
              style={{ fontFamily: activeEditor === 'markdown' ? 'monospace' : 'inherit' }}
              placeholder={activeEditor === 'markdown' ? '# عنوان رئيسي\n\nاكتب المحتوى بصيغة Markdown...' : 'ابدأ بكتابة المحتوى هنا...'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </DataCardFrame>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Document Properties */}
          <DataCardFrame title="خصائص الوثيقة">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-arabic text-[rgba(11,15,18,0.5)] mb-1">العنوان</label>
                <Input value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="عنوان الوثيقة" />
              </div>
              <div>
                <label className="block text-[10px] font-arabic text-[rgba(11,15,18,0.5)] mb-1">الفئة</label>
                <Select value={docCategory} onValueChange={setDocCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-[10px] font-arabic text-[rgba(11,15,18,0.5)] mb-1">الوسوم</label>
                <Input value={docTags} onChange={e => setDocTags(e.target.value)} placeholder="مفصولة بفاصلة" />
              </div>
              <div>
                <label className="block text-[10px] font-arabic text-[rgba(11,15,18,0.5)] mb-1">الحالة</label>
                <Select value={docStatus} onValueChange={setDocStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_MAP).map(([v, { label }]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DataCardFrame>

          {/* Collaboration */}
          <DataCardFrame title="التعاون">
            <div className="space-y-2">
              {[
                { initial: 'أ', name: 'د. أحمد المحمد', role: 'مؤلف رئيسي', color: '#3DA8F5' },
                { initial: 'ف', name: 'د. فاطمة العلي', role: 'مراجع', color: '#3DBE8B' },
              ].map((person, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: person.color }}>
                    {person.initial}
                  </div>
                  <div>
                    <div className="text-xs font-semibold font-arabic">{person.name}</div>
                    <div className="text-[10px] text-[rgba(11,15,18,0.4)] font-arabic">{person.role}</div>
                  </div>
                </div>
              ))}
              <BaseActionButton size="sm" variant="outline" className="w-full mt-1" onClick={handleAddCollaborator}>
                <Plus className="h-3 w-3 ml-1" /> إضافة متعاون
              </BaseActionButton>
            </div>
          </DataCardFrame>

          {/* Comments */}
          <DataCardFrame title="التعليقات">
            <div className="space-y-2">
              {comments.map(c => (
                <div key={c.id} className="p-2 bg-[rgba(11,15,18,0.02)] rounded-lg">
                  <div className="text-xs font-semibold font-arabic">{c.author}</div>
                  <div className="text-[10px] text-[rgba(11,15,18,0.4)] mb-0.5">{c.time}</div>
                  <div className="text-xs text-[rgba(11,15,18,0.7)] font-arabic">{c.text}</div>
                </div>
              ))}
              <div className="flex gap-1.5 mt-1">
                <Input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="أضف تعليقاً..." className="text-xs" onKeyDown={e => e.key === 'Enter' && handleAddComment()} />
                <BaseActionButton size="sm" variant="outline" onClick={handleAddComment} disabled={!newComment.trim()}>
                  <MessageCircle className="h-3 w-3" />
                </BaseActionButton>
              </div>
            </div>
          </DataCardFrame>
        </div>
      </div>

      {/* Recent Documents */}
      <DataCardFrame title={`الوثائق الحديثة (${documents.length})`}>
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-[#DADCE0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow group">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold font-arabic truncate">{doc.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-[rgba(11,15,18,0.4)] mt-1 font-arabic">
                  <span>{doc.author}</span>
                  <span>•</span>
                  <span>{new Date(doc.lastModified).toLocaleDateString('ar-SA')}</span>
                  <span>•</span>
                  <span>الإصدار {doc.version}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={doc.status} />
                <div className="flex items-center gap-0.5 text-[10px] text-[rgba(11,15,18,0.4)]">
                  <Users className="h-3 w-3" />{doc.collaborators}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <BaseActionButton size="sm" variant="outline" onClick={() => handleLoadDocument(doc)}>
                    <Edit className="h-3 w-3 ml-1" /> تحرير
                  </BaseActionButton>
                  <BaseActionButton size="sm" variant="outline" onClick={() => setEditingDoc(doc)}>
                    <Tag className="h-3 w-3" />
                  </BaseActionButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DataCardFrame>

      {/* Version History (toggleable) */}
      {showVersionHistory && (
        <DataCardFrame title="تاريخ الإصدارات">
          <div className="space-y-3">
            {versionHistory.map((version) => (
              <div key={version.version} className="flex items-start gap-3 p-3 rounded-xl border border-[#DADCE0]">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${version.status === 'current' ? 'bg-[#3DBE8B]' : 'bg-[rgba(11,15,18,0.15)]'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold font-arabic">الإصدار {version.version}</span>
                    {version.status === 'current' && <StatusBadge status="published" />}
                  </div>
                  <div className="text-[10px] text-[rgba(11,15,18,0.4)] font-arabic mb-1">
                    {version.author} • {new Date(version.date).toLocaleDateString('ar-SA')}
                  </div>
                  <div className="text-xs text-[rgba(11,15,18,0.6)] font-arabic">{version.changes}</div>
                </div>
                <BaseActionButton size="sm" variant="outline" onClick={() => setViewingVersion(version)}>
                  <Eye className="h-3 w-3" />
                </BaseActionButton>
              </div>
            ))}
          </div>
        </DataCardFrame>
      )}

      {/* ═══════ MODALS ═══════ */}

      {/* Create Document */}
      <GenericFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="إنشاء وثيقة جديدة"
        fields={docFields}
        onSubmit={handleCreateDocument}
        submitLabel="إنشاء الوثيقة"
        successMessage="تم إنشاء الوثيقة بنجاح"
      />

      {/* Edit Document Properties */}
      {editingDoc && (
        <GenericFormModal
          isOpen={!!editingDoc}
          onClose={() => setEditingDoc(null)}
          title={`تعديل خصائص: ${editingDoc.title}`}
          fields={docFields.map(f => ({ ...f, defaultValue: String((editingDoc as any)[f.name] || '') }))}
          onSubmit={handleEditDocument}
          submitLabel="حفظ التعديلات"
          successMessage="تم تحديث خصائص الوثيقة"
        />
      )}

      {/* View Version Detail */}
      {viewingVersion && (
        <Dialog open={!!viewingVersion} onOpenChange={() => setViewingVersion(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-arabic text-center">تفاصيل الإصدار</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-white/30 rounded-2xl border border-black/5 text-center">
                <GitBranch className="h-8 w-8 mx-auto mb-2 text-[#3DA8F5]" />
                <div className="text-xl font-bold">الإصدار {viewingVersion.version}</div>
                {viewingVersion.status === 'current' && <StatusBadge status="published" />}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: User, label: 'المؤلف', value: viewingVersion.author },
                  { icon: Calendar, label: 'التاريخ', value: new Date(viewingVersion.date).toLocaleDateString('ar-SA') },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-white/30 rounded-xl border border-black/5">
                    <item.icon className="h-4 w-4 text-[rgba(11,15,18,0.4)]" />
                    <div>
                      <div className="text-[10px] text-[rgba(11,15,18,0.5)] font-arabic">{item.label}</div>
                      <div className="text-sm font-semibold font-arabic">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-white/30 rounded-xl border border-black/5">
                <div className="text-[10px] text-[rgba(11,15,18,0.5)] font-arabic mb-1">التغييرات</div>
                <div className="text-sm font-arabic text-[rgba(11,15,18,0.7)]">{viewingVersion.changes}</div>
              </div>
              <div className="flex justify-end">
                <BaseActionButton variant="outline" size="sm" onClick={() => setViewingVersion(null)}>إغلاق</BaseActionButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
