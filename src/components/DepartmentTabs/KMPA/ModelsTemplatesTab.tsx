
import React, { useState } from "react";
import { BaseBox } from "@/components/ui/BaseBox";
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { BaseActionButton } from "@/components/shared/BaseActionButton";
import { BaseBadge } from "@/components/ui/BaseBadge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NumericStatCard } from "@/components/shared/visual-data/NumericStatCard";
import { DataCardFrame } from "@/components/shared/visual-data/DataCardFrame";
import {
  Upload, Download, FileText, BarChart3, Eye, Edit, Plus, Calculator,
  FileSpreadsheet, Trophy, TrendingUp, Users, Heart, Wifi, Target,
  Search, Calendar, Tag, ArrowRight,
} from "lucide-react";
import { mockSoaBraMetrics } from "./data/mockData";
import { GenericFormModal, FormField } from "../shared/GenericFormModal";
import { downloadAsJSON } from "../shared/downloadUtils";
import { toast } from "sonner";

// ─── Category Maps ──────────────────────────────────────────────
const CATEGORY_MAP: Record<string, { label: string; icon: any; color: string }> = {
  cultural_identity:      { label: "مؤشرات الهوية الثقافية",           icon: Trophy,    color: "#F6C445" },
  social_responsibility:  { label: "مؤشرات المسؤولية الاجتماعية",     icon: Heart,     color: "#E5564D" },
  brand_community:        { label: "مؤشرات مجتمع العلامة",           icon: Users,     color: "#3DA8F5" },
  digital_communication:  { label: "مؤشرات التواصل الرقمي الثقافي",   icon: Wifi,      color: "#3DBE8B" },
  independent:            { label: "مؤشرات مستقلة",                   icon: Target,    color: "#8B5CF6" },
};

const TEMPLATE_TYPE_MAP: Record<string, string> = {
  report: "تقرير", case_study: "دراسة حالة", survey: "استبيان",
};

// ─── Template form fields ───────────────────────────────────────
const templateFields: FormField[] = [
  { name: 'name', label: 'اسم القالب', type: 'text', required: true, placeholder: 'مثال: قالب التقرير الربعي' },
  { name: 'type', label: 'نوع القالب', type: 'select', required: true, options: [
    { value: 'report', label: 'تقرير' }, { value: 'case_study', label: 'دراسة حالة' },
    { value: 'survey', label: 'استبيان' },
  ]},
  { name: 'description', label: 'الوصف', type: 'textarea', required: true, placeholder: 'وصف مختصر للقالب والغرض منه...' },
];

export const ModelsTemplatesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("metrics");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Templates state
  const [templates, setTemplates] = useState([
    { id: "TEMP-001", name: "قالب التقرير الشهري", type: "report", description: "قالب موحد لإعداد التقارير الشهرية", downloads: 145, lastUpdated: "2024-04-10" },
    { id: "TEMP-002", name: "نموذج دراسة الحالة", type: "case_study", description: "نموذج لإعداد دراسات الحالة البحثية", downloads: 89, lastUpdated: "2024-04-08" },
    { id: "TEMP-003", name: "قالب الاستبيان", type: "survey", description: "قالب لإعداد الاستبيانات البحثية", downloads: 67, lastUpdated: "2024-04-05" },
  ]);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState<any>(null);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [isUploadMetricOpen, setIsUploadMetricOpen] = useState(false);

  // Metric upload fields
  const metricUploadFields: FormField[] = [
    { name: 'name', label: 'اسم المقياس', type: 'text', required: true, placeholder: 'مثال: مؤشر الانتماء الثقافي' },
    { name: 'nameEn', label: 'الاسم بالإنجليزية', type: 'text', required: true, placeholder: 'e.g. Cultural Belonging Index' },
    { name: 'category', label: 'الفئة', type: 'select', required: true, options: Object.entries(CATEGORY_MAP).map(([v, { label }]) => ({ value: v, label })) },
    { name: 'description', label: 'الوصف', type: 'textarea', required: true, placeholder: 'وصف المقياس والغرض منه...' },
  ];

  const metrics = mockSoaBraMetrics;
  const filteredMetrics = metrics.filter(
    (m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.nameEn.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ── Handlers ──
  const handleCreateTemplate = (data: Record<string, string>) => {
    const newTemplate = {
      id: `TEMP-${Date.now()}`, name: data.name, type: data.type,
      description: data.description, downloads: 0, lastUpdated: new Date().toISOString().split('T')[0],
    };
    setTemplates(prev => [newTemplate, ...prev]);
  };

  const handleEditTemplate = (data: Record<string, string>) => {
    if (!editingTemplate) return;
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? {
      ...t, name: data.name, type: data.type, description: data.description,
      lastUpdated: new Date().toISOString().split('T')[0],
    } : t));
    setEditingTemplate(null);
  };

  const handleDownloadTemplate = (template: any) => {
    downloadAsJSON(template, `قالب-${template.name}`);
    setTemplates(prev => prev.map(t => t.id === template.id ? { ...t, downloads: t.downloads + 1 } : t));
    toast.success(`تم تنزيل: ${template.name}`);
  };

  const handleDownloadMetric = (metric: any) => {
    downloadAsJSON(metric, `مقياس-${metric.name}`);
    toast.success(`تم تنزيل: ${metric.name}`);
  };

  const handleUploadMetric = (_data: Record<string, string>) => {
    toast.success("تم رفع المقياس بنجاح (سيظهر بعد المراجعة)");
  };

  // ── Metric Detail View ──
  const MetricDetails = ({ metric }: { metric: any }) => {
    const cat = CATEGORY_MAP[metric.category] || { label: metric.category, icon: BarChart3, color: "#6B7280" };
    const IconComp = cat.icon;

    return (
      <div className="space-y-5">
        <BaseActionButton variant="outline" size="sm" onClick={() => setSelectedMetric(null)}>
          <ArrowRight className="h-3.5 w-3.5 ml-1" /> العودة للمقاييس
        </BaseActionButton>

        {/* Hero */}
        <div className="p-5 bg-white/30 rounded-2xl border border-black/5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${cat.color}15` }}>
              <IconComp className="h-7 w-7" style={{ color: cat.color }} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold font-arabic">{metric.name}</h3>
              <p className="text-sm text-[rgba(11,15,18,0.5)] mt-0.5">{metric.nameEn}</p>
              <BaseBadge variant="outline" className="mt-2">{cat.label}</BaseBadge>
            </div>
            <div className="flex gap-2">
              <BaseActionButton variant="outline" size="sm" onClick={() => toast.info(`معاينة: ${metric.name}`, { description: metric.description })}>
                <Eye className="h-3 w-3 ml-1" /> معاينة
              </BaseActionButton>
              <BaseActionButton size="sm" onClick={() => handleDownloadMetric(metric)}>
                <Download className="h-3 w-3 ml-1" /> تحميل Excel
              </BaseActionButton>
            </div>
          </div>
        </div>

        {/* Description */}
        <DataCardFrame title="وصف المقياس">
          <p className="text-sm text-[rgba(11,15,18,0.7)] font-arabic leading-relaxed">{metric.description}</p>
        </DataCardFrame>

        {/* Scale levels */}
        <DataCardFrame title="مستويات التقييم">
          <div className="space-y-2">
            {metric.scale.levels.map((level: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl border border-[#DADCE0]">
                <div className="w-16 text-center">
                  <BaseBadge variant="outline">{level.range}</BaseBadge>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold font-arabic">{level.label}</div>
                  <div className="text-xs text-[rgba(11,15,18,0.5)] font-arabic">{level.description}</div>
                </div>
                <Progress value={parseInt(level.range.split("-")[1] || level.range) || 0} className="w-20 h-1.5" />
              </div>
            ))}
          </div>
        </DataCardFrame>

        {/* Criteria */}
        <DataCardFrame title="معايير القياس">
          <div className="space-y-4">
            {metric.criteria.map((criterion: any, index: number) => (
              <div key={index} className="rounded-xl border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold font-arabic mb-3">{criterion.name}</h4>
                <div className="space-y-1.5">
                  {criterion.statements.map((statement: any, stIndex: number) => (
                    <div key={stIndex} className="flex items-center gap-3 p-2 bg-[rgba(11,15,18,0.02)] rounded-lg">
                      <div className="flex-1 text-xs font-arabic">{statement.text}</div>
                      <span className="text-[10px] text-[rgba(11,15,18,0.4)] tabular-nums shrink-0">النقاط: {statement.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DataCardFrame>

        {/* Usage stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-4 bg-white/30 rounded-2xl border border-black/5">
            <BarChart3 className="h-5 w-5 text-[rgba(11,15,18,0.3)]" />
            <div>
              <div className="text-xl font-bold text-[#3DA8F5]">{metric.usage}</div>
              <div className="text-[10px] text-[rgba(11,15,18,0.5)] font-arabic">مرة استخدام</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/30 rounded-2xl border border-black/5">
            <Calendar className="h-5 w-5 text-[rgba(11,15,18,0.3)]" />
            <div>
              <div className="text-sm font-bold">{new Date(metric.lastUpdated).toLocaleDateString("ar-SA")}</div>
              <div className="text-[10px] text-[rgba(11,15,18,0.5)] font-arabic">آخر تحديث</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h3 className="text-lg font-bold font-arabic">النماذج والقوالب</h3>
        <div className="flex gap-2">
          <BaseActionButton variant="outline" onClick={() => setIsUploadMetricOpen(true)} className="flex items-center gap-1.5">
            <Upload className="h-4 w-4" /> رفع مقياس
          </BaseActionButton>
          <BaseActionButton onClick={() => { setActiveTab("templates"); setIsCreateTemplateOpen(true); }} className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> إنشاء قالب جديد
          </BaseActionButton>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metrics">مقاييس سوبرا</TabsTrigger>
          <TabsTrigger value="templates">القوالب والنماذج</TabsTrigger>
        </TabsList>

        {/* ═══════ METRICS TAB ═══════ */}
        <TabsContent value="metrics" className="space-y-6">
          {selectedMetric ? (
            <MetricDetails metric={metrics.find((m) => m.id === selectedMetric)} />
          ) : (
            <>
              {/* KPIs */}
              <AppDashboardGrid columns={12}>
                <AppGridItem colSpan={3}><NumericStatCard title="إجمالي المقاييس" value={metrics.length} accentColor="#3DA8F5" /></AppGridItem>
                <AppGridItem colSpan={3}><NumericStatCard title="ملفات Excel" value={metrics.length} accentColor="#3DBE8B" /></AppGridItem>
                <AppGridItem colSpan={3}><NumericStatCard title="إجمالي الاستخدامات" value={metrics.reduce((s, m) => s + m.usage, 0)} accentColor="#8B5CF6" /></AppGridItem>
                <AppGridItem colSpan={3}><NumericStatCard title="فئات رئيسية" value={Object.keys(CATEGORY_MAP).length} accentColor="#F6C445" /></AppGridItem>
              </AppDashboardGrid>

              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(11,15,18,0.4)]" />
                <Input placeholder="البحث في مقاييس سوبرا..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
              </div>

              {/* Metrics by category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(CATEGORY_MAP).map(([category, { label, icon: IconComp, color }]) => {
                  const categoryMetrics = filteredMetrics.filter((m) => m.category === category);
                  return (
                    <DataCardFrame key={category} title={label}>
                      <div className="space-y-2">
                        {categoryMetrics.map((metric) => (
                          <div
                            key={metric.id}
                            className="p-2.5 rounded-xl border border-[#DADCE0] cursor-pointer hover:bg-[rgba(11,15,18,0.02)] transition-colors group"
                            onClick={() => setSelectedMetric(metric.id)}
                          >
                            <div className="flex items-start gap-2">
                              <IconComp className="h-4 w-4 shrink-0 mt-0.5" style={{ color }} />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold font-arabic truncate">{metric.name}</div>
                                <div className="text-[10px] text-[rgba(11,15,18,0.4)]">{metric.nameEn}</div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-1.5">
                              <BaseBadge variant="secondary" className="text-[10px]">{metric.usage} استخدام</BaseBadge>
                              <BaseActionButton variant="ghost" size="sm" className="h-6 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="h-3 w-3" />
                              </BaseActionButton>
                            </div>
                          </div>
                        ))}
                        {categoryMetrics.length === 0 && (
                          <p className="text-xs text-[rgba(11,15,18,0.3)] font-arabic text-center py-3">لا توجد نتائج</p>
                        )}
                      </div>
                    </DataCardFrame>
                  );
                })}
              </div>

              {/* Usage guide */}
              <DataCardFrame title="دليل استخدام مقاييس سوبرا">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold font-arabic">خطوات الاستخدام:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-[rgba(11,15,18,0.6)] font-arabic">
                      <li>اختر المقياس المناسب لاحتياجاتك</li>
                      <li>حمّل ملف Excel الخاص بالمقياس</li>
                      <li>اقرأ تعليمات الاستخدام في الملف</li>
                      <li>قم بتقييم العبارات من 0 إلى 5</li>
                      <li>راجع النتائج في لوحة التحكم</li>
                    </ol>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold font-arabic">مقياس التقييم:</h4>
                    <div className="space-y-1 text-xs text-[rgba(11,15,18,0.6)] font-arabic">
                      {["0: غير موجود إطلاقاً", "1: موجود بشكل ضعيف جداً", "2: موجود بشكل ضعيف", "3: موجود بشكل متوسط", "4: موجود بشكل جيد", "5: موجود بشكل ممتاز"].map((line, i) => (
                        <div key={i}><strong>{line.split(":")[0]}:</strong>{line.split(":")[1]}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </DataCardFrame>
            </>
          )}
        </TabsContent>

        {/* ═══════ TEMPLATES TAB ═══════ */}
        <TabsContent value="templates" className="space-y-6">
          {/* KPIs */}
          <AppDashboardGrid columns={12}>
            <AppGridItem colSpan={4}><NumericStatCard title="إجمالي القوالب" value={templates.length} accentColor="#3DA8F5" /></AppGridItem>
            <AppGridItem colSpan={4}><NumericStatCard title="إجمالي التحميلات" value={templates.reduce((s, t) => s + t.downloads, 0)} accentColor="#3DBE8B" /></AppGridItem>
            <AppGridItem colSpan={4}><NumericStatCard title="أنواع القوالب" value={[...new Set(templates.map(t => t.type))].length} accentColor="#8B5CF6" /></AppGridItem>
          </AppDashboardGrid>

          {/* Templates list */}
          <DataCardFrame title="القوالب المتاحة">
            <div className="space-y-2">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-4 rounded-xl border border-[#DADCE0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-7 w-7 text-[#3DA8F5] shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold font-arabic truncate">{template.name}</h4>
                      <p className="text-xs text-[rgba(11,15,18,0.5)] font-arabic truncate">{template.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <BaseBadge variant="secondary" className="text-[10px]">{TEMPLATE_TYPE_MAP[template.type] || template.type}</BaseBadge>
                        <span className="text-[10px] text-[rgba(11,15,18,0.4)]">آخر تحديث: {new Date(template.lastUpdated).toLocaleDateString("ar-SA")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-center">
                      <div className="text-sm font-bold tabular-nums">{template.downloads}</div>
                      <div className="text-[10px] text-[rgba(11,15,18,0.4)]">تحميل</div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <BaseActionButton variant="outline" size="sm" onClick={() => setViewingTemplate(template)}>
                        <Eye className="h-3 w-3" />
                      </BaseActionButton>
                      <BaseActionButton size="sm" onClick={() => handleDownloadTemplate(template)}>
                        <Download className="h-3 w-3" />
                      </BaseActionButton>
                      <BaseActionButton variant="outline" size="sm" onClick={() => setEditingTemplate(template)}>
                        <Edit className="h-3 w-3" />
                      </BaseActionButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DataCardFrame>
        </TabsContent>
      </Tabs>

      {/* ═══════ MODALS ═══════ */}

      {/* Create Template */}
      <GenericFormModal
        isOpen={isCreateTemplateOpen}
        onClose={() => setIsCreateTemplateOpen(false)}
        title="إنشاء قالب جديد"
        fields={templateFields}
        onSubmit={handleCreateTemplate}
        submitLabel="إنشاء القالب"
        successMessage="تم إنشاء القالب بنجاح"
      />

      {/* Edit Template */}
      {editingTemplate && (
        <GenericFormModal
          isOpen={!!editingTemplate}
          onClose={() => setEditingTemplate(null)}
          title={`تعديل: ${editingTemplate.name}`}
          fields={templateFields.map(f => ({ ...f, defaultValue: String((editingTemplate as any)[f.name] || '') }))}
          onSubmit={handleEditTemplate}
          submitLabel="حفظ التعديلات"
          successMessage="تم تحديث القالب بنجاح"
        />
      )}

      {/* Upload Metric */}
      <GenericFormModal
        isOpen={isUploadMetricOpen}
        onClose={() => setIsUploadMetricOpen(false)}
        title="رفع مقياس جديد"
        fields={metricUploadFields}
        onSubmit={handleUploadMetric}
        submitLabel="رفع المقياس"
        successMessage="تم رفع المقياس بنجاح"
      />

      {/* View Template Detail */}
      {viewingTemplate && (
        <Dialog open={!!viewingTemplate} onOpenChange={() => setViewingTemplate(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-arabic text-center">تفاصيل القالب</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-white/30 rounded-2xl border border-black/5 text-center">
                <FileText className="h-10 w-10 mx-auto mb-2 text-[#3DA8F5]" />
                <h3 className="text-base font-bold font-arabic">{viewingTemplate.name}</h3>
                <BaseBadge variant="secondary" className="mt-1">{TEMPLATE_TYPE_MAP[viewingTemplate.type] || viewingTemplate.type}</BaseBadge>
              </div>
              <p className="text-sm text-[rgba(11,15,18,0.7)] font-arabic leading-relaxed">{viewingTemplate.description}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Download, label: 'التحميلات', value: `${viewingTemplate.downloads} مرة` },
                  { icon: Calendar, label: 'آخر تحديث', value: new Date(viewingTemplate.lastUpdated).toLocaleDateString("ar-SA") },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 bg-white/30 rounded-xl border border-black/5">
                    <item.icon className="h-4 w-4 text-[rgba(11,15,18,0.4)]" />
                    <div>
                      <div className="text-[10px] text-[rgba(11,15,18,0.5)] font-arabic">{item.label}</div>
                      <div className="text-sm font-semibold font-arabic">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <BaseActionButton size="sm" onClick={() => { handleDownloadTemplate(viewingTemplate); setViewingTemplate(null); }}>
                  <Download className="h-3.5 w-3.5 ml-1" /> تحميل
                </BaseActionButton>
                <BaseActionButton size="sm" variant="outline" onClick={() => { setViewingTemplate(null); setEditingTemplate(viewingTemplate); }}>
                  <Edit className="h-3.5 w-3.5 ml-1" /> تعديل
                </BaseActionButton>
                <BaseActionButton variant="outline" size="sm" onClick={() => setViewingTemplate(null)}>إغلاق</BaseActionButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
