
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { Input } from '@/components/ui/input';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Search, Download, Eye, Calendar, User, FileText, Star, Upload,
  BookOpen, Tag, HardDrive, BarChart3, Quote, Globe, Hash,
} from 'lucide-react';
import { mockKnowledgeDocuments } from './data/mockData';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { downloadAsJSON } from '../shared/downloadUtils';
import { toast } from 'sonner';

// ─── Labels ─────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  research: 'بحث', publication: 'منشور', report: 'تقرير',
  guide: 'دليل', template: 'نموذج', metric: 'مقياس',
};
const STATUS_LABELS: Record<string, string> = {
  published: 'منشور', draft: 'مسودة', review: 'مراجعة', archived: 'مؤرشف',
};

export const KnowledgeRepositoryTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [documents, setDocuments] = useState(mockKnowledgeDocuments);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<any>(null);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'review': return 'outline';
      case 'archived': return 'error';
      default: return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'research': return 'default';
      case 'publication': return 'secondary';
      case 'report': return 'outline';
      case 'guide': return 'secondary';
      case 'template': return 'outline';
      case 'metric': return 'default';
      default: return 'secondary';
    }
  };

  // ── Upload fields ──
  const uploadFields: FormField[] = [
    { name: 'title', label: 'عنوان الوثيقة', type: 'text', required: true, placeholder: 'مثال: دراسة تأثير الهوية الثقافية على ولاء العملاء' },
    { name: 'content', label: 'ملخص المحتوى', type: 'textarea', required: true, placeholder: 'وصف مختصر لمحتوى الوثيقة وأهدافها...' },
    { name: 'type', label: 'نوع الوثيقة', type: 'select', required: true, options: Object.entries(TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })) },
    { name: 'category', label: 'الفئة', type: 'select', required: true, options: [
      { value: 'brand-sociology', label: 'علم اجتماع العلامة' },
      { value: 'cultural-identity', label: 'الهوية الثقافية' },
      { value: 'research-methods', label: 'مناهج البحث' },
      { value: 'metrics', label: 'المقاييس' },
    ]},
    { name: 'author', label: 'المؤلف', type: 'text', required: true, placeholder: 'اسم الباحث أو الكاتب' },
    { name: 'tags', label: 'الوسوم (مفصولة بفاصلة)', type: 'text', placeholder: 'هوية ثقافية، علامة تجارية، بحث' },
    { name: 'version', label: 'رقم الإصدار', type: 'text', placeholder: '1.0' },
  ];

  const CATEGORY_LABELS: Record<string, string> = {
    'brand-sociology': 'علم اجتماع العلامة',
    'cultural-identity': 'الهوية الثقافية',
    'research-methods': 'مناهج البحث',
    'metrics': 'المقاييس',
  };

  // ── Handlers ──
  const handleUpload = (data: Record<string, string>) => {
    const newDoc: any = {
      id: `DOC-${Date.now()}`,
      title: data.title,
      type: data.type,
      category: data.category,
      author: data.author,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      tags: data.tags ? data.tags.split('،').map(t => t.trim()).filter(Boolean) : [],
      content: data.content,
      readCount: 0,
      citations: 0,
      downloads: 0,
      version: data.version || '1.0',
      permissions: { read: ['all'], write: ['researcher', 'admin'], admin: ['admin'] },
      metadata: { size: 0, format: 'PDF', language: 'ar', keywords: [] },
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const toggleFavorite = (docId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(docId)) {
        next.delete(docId);
        toast.success('تمت إزالة الوثيقة من المفضلة');
      } else {
        next.add(docId);
        toast.success('تمت إضافة الوثيقة إلى المفضلة');
      }
      return next;
    });
  };

  const handleDownload = (doc: any) => {
    downloadAsJSON(
      { title: doc.title, type: doc.type, author: doc.author, category: doc.category, content: doc.content, tags: doc.tags, version: doc.version },
      `وثيقة-${doc.title}`
    );
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, downloads: d.downloads + 1 } : d));
    toast.success(`تم تنزيل: ${doc.title}`);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return 'غير محدد';
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <BaseBox>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold flex items-center gap-2"><Search className="h-4 w-4" /> البحث والتصفية</h3>
          <span className="text-sm text-[rgba(11,15,18,0.5)]">{filteredDocuments.length} وثيقة</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(11,15,18,0.4)]" />
            <Input placeholder="البحث بالعنوان أو الوسم..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger><SelectValue placeholder="نوع الوثيقة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              {Object.entries(TYPE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger><SelectValue placeholder="الحالة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger><SelectValue placeholder="الفئة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </BaseBox>

      {/* Upload Section */}
      <BaseBox>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">إضافة وثيقة جديدة</h3>
            <p className="text-xs text-[rgba(11,15,18,0.5)]">رفع وثائق بحثية أو أدلة إلى مستودع المعرفة</p>
          </div>
          <BaseActionButton onClick={() => setIsUploadOpen(true)} className="flex items-center gap-1.5">
            <Upload className="h-4 w-4" /> رفع وثيقة
          </BaseActionButton>
        </div>
      </BaseBox>

      {/* Documents Grid */}
      <AppDashboardGrid columns={12} minRowHeight="auto">
        {filteredDocuments.map((doc) => (
          <AppGridItem key={doc.id} colSpan={4} tabletSpan={6}>
            <BaseBox className="hover:shadow-lg transition-shadow h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{doc.title}</h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <BaseBadge variant={getTypeBadgeVariant(doc.type)} className="text-xs">
                      {TYPE_LABELS[doc.type] || doc.type}
                    </BaseBadge>
                    <BaseBadge variant={getStatusBadgeVariant(doc.status)} className="text-xs">
                      {STATUS_LABELS[doc.status] || doc.status}
                    </BaseBadge>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(doc.id)}
                  className="p-1.5 rounded-lg hover:bg-[rgba(11,15,18,0.05)] transition-colors shrink-0"
                >
                  <Star className={`h-4 w-4 transition-colors ${favorites.has(doc.id) ? 'fill-[#F6C445] text-[#F6C445]' : 'text-[rgba(11,15,18,0.3)]'}`} />
                </button>
              </div>

              {/* Metadata */}
              <div className="space-y-2 flex-1 text-xs text-[rgba(11,15,18,0.6)]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {doc.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(doc.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {doc.readCount} قراءة</span>
                  <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {doc.downloads} تحميل</span>
                  {doc.citations > 0 && <span className="flex items-center gap-1"><Quote className="h-3 w-3" /> {doc.citations}</span>}
                </div>
                {doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {doc.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 bg-[rgba(11,15,18,0.05)] rounded-full">{tag}</span>
                    ))}
                    {doc.tags.length > 3 && <span className="text-[10px] px-1.5 py-0.5 bg-[rgba(11,15,18,0.05)] rounded-full">+{doc.tags.length - 3}</span>}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 mt-3 border-t border-[#DADCE0]">
                <BaseActionButton size="sm" variant="outline" className="flex-1 flex items-center justify-center gap-1" onClick={() => setViewingDoc(doc)}>
                  <Eye className="h-3 w-3" /> عرض
                </BaseActionButton>
                <BaseActionButton size="sm" variant="outline" className="flex-1 flex items-center justify-center gap-1" onClick={() => handleDownload(doc)}>
                  <Download className="h-3 w-3" /> تحميل
                </BaseActionButton>
              </div>
            </BaseBox>
          </AppGridItem>
        ))}
      </AppDashboardGrid>

      {filteredDocuments.length === 0 && (
        <BaseBox>
          <div className="text-center py-8 text-[rgba(11,15,18,0.4)]">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <h3 className="font-medium mb-1">لا توجد وثائق</h3>
            <p className="text-sm">لم يتم العثور على وثائق تطابق معايير البحث المحددة</p>
          </div>
        </BaseBox>
      )}

      {/* ═══════ MODAL: Upload Document ═══════ */}
      <GenericFormModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="رفع وثيقة جديدة إلى المستودع"
        fields={uploadFields}
        onSubmit={handleUpload}
        submitLabel="رفع الوثيقة"
        successMessage="تم رفع الوثيقة بنجاح — ستظهر بحالة «مسودة» حتى المراجعة"
      />

      {/* ═══════ MODAL: View Document Details ═══════ */}
      {viewingDoc && (
        <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-arabic text-center">تفاصيل الوثيقة</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              {/* Hero */}
              <div className="p-4 bg-white/30 rounded-2xl border border-black/5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold font-arabic flex-1">{viewingDoc.title}</h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <BaseBadge variant={getTypeBadgeVariant(viewingDoc.type)} className="text-xs">{TYPE_LABELS[viewingDoc.type]}</BaseBadge>
                    <BaseBadge variant={getStatusBadgeVariant(viewingDoc.status)} className="text-xs">{STATUS_LABELS[viewingDoc.status]}</BaseBadge>
                  </div>
                </div>
                <p className="text-sm text-[rgba(11,15,18,0.7)] font-arabic">{viewingDoc.content}</p>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: User, label: 'المؤلف', value: viewingDoc.author },
                  { icon: BookOpen, label: 'الفئة', value: viewingDoc.category },
                  { icon: Calendar, label: 'تاريخ الإنشاء', value: new Date(viewingDoc.createdAt).toLocaleDateString('ar-SA') },
                  { icon: Calendar, label: 'آخر تحديث', value: new Date(viewingDoc.updatedAt).toLocaleDateString('ar-SA') },
                  { icon: Hash, label: 'الإصدار', value: `v${viewingDoc.version}` },
                  { icon: HardDrive, label: 'الصيغة / الحجم', value: `${viewingDoc.metadata?.format || 'PDF'} • ${formatSize(viewingDoc.metadata?.size)}` },
                  { icon: Eye, label: 'القراءات', value: `${viewingDoc.readCount} قراءة` },
                  { icon: Download, label: 'التحميلات', value: `${viewingDoc.downloads} مرة` },
                  { icon: Quote, label: 'الاستشهادات', value: `${viewingDoc.citations} استشهاد` },
                  { icon: Globe, label: 'اللغة', value: viewingDoc.metadata?.language === 'ar' ? 'العربية' : viewingDoc.metadata?.language || 'العربية' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 bg-white/30 rounded-xl border border-black/5">
                    <item.icon className="h-4 w-4 text-[rgba(11,15,18,0.4)] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-[rgba(11,15,18,0.5)] font-arabic">{item.label}</div>
                      <div className="text-sm font-semibold font-arabic truncate">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {viewingDoc.tags?.length > 0 && (
                <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag className="h-4 w-4 text-[rgba(11,15,18,0.4)]" />
                    <span className="text-sm font-semibold font-arabic">الوسوم</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingDoc.tags.map((tag: string, i: number) => (
                      <BaseBadge key={i} variant="outline">{tag}</BaseBadge>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              {viewingDoc.metadata?.keywords?.length > 0 && (
                <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BarChart3 className="h-4 w-4 text-[rgba(11,15,18,0.4)]" />
                    <span className="text-sm font-semibold font-arabic">الكلمات المفتاحية</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingDoc.metadata.keywords.map((kw: string, i: number) => (
                      <BaseBadge key={i} variant="outline" className="text-xs">{kw}</BaseBadge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <BaseActionButton variant="outline" size="sm" onClick={() => handleDownload(viewingDoc)}>
                <Download className="h-3.5 w-3.5 ml-1" /> تنزيل
              </BaseActionButton>
              <BaseActionButton variant="outline" onClick={() => setViewingDoc(null)}>إغلاق</BaseActionButton>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
