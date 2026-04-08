import React, { useState } from 'react';
import { BarChart, Download, Calendar, Filter, Eye } from 'lucide-react';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { downloadAsCSV } from '../shared/downloadUtils';
import { toast } from 'sonner';

const initialReports = [
  { id: 'RPT-001', title: 'تقرير العقود الشهري', description: 'تقرير شامل عن حالة العقود والاتفاقيات', type: 'monthly', category: 'contracts', lastGenerated: '2024-06-30', format: 'PDF', status: 'ready' },
  { id: 'RPT-002', title: 'تقرير الامتثال الربع سنوي', description: 'تحليل مستوى الامتثال للمتطلبات القانونية', type: 'quarterly', category: 'compliance', lastGenerated: '2024-06-30', format: 'Excel', status: 'ready' },
];

export const ReportsTab: React.FC = () => {
  const [reports, setReports] = useState(initialReports);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<any>(null);

  const createFields: FormField[] = [
    { name: 'title', label: 'عنوان التقرير', type: 'text', required: true, placeholder: 'أدخل عنوان التقرير' },
    { name: 'description', label: 'الوصف', type: 'textarea', required: true, placeholder: 'وصف التقرير...' },
    { name: 'category', label: 'الفئة', type: 'select', required: true, options: [
      { value: 'contracts', label: 'عقود' }, { value: 'compliance', label: 'امتثال' }, { value: 'risks', label: 'مخاطر' }, { value: 'licenses', label: 'تراخيص' },
    ]},
    { name: 'type', label: 'النوع', type: 'select', required: true, options: [
      { value: 'monthly', label: 'شهري' }, { value: 'quarterly', label: 'ربع سنوي' }, { value: 'annual', label: 'سنوي' }, { value: 'custom', label: 'مخصص' },
    ]},
    { name: 'format', label: 'التنسيق', type: 'select', required: true, options: [
      { value: 'PDF', label: 'PDF' }, { value: 'Excel', label: 'Excel' }, { value: 'Word', label: 'Word' },
    ]},
  ];

  const handleCreate = (data: Record<string, string>) => {
    const newReport = {
      id: `RPT-${Date.now().toString().slice(-4)}`,
      title: data.title,
      description: data.description,
      type: data.type,
      category: data.category,
      lastGenerated: new Date().toISOString().split('T')[0],
      format: data.format,
      status: 'ready',
    };
    setReports(prev => [newReport, ...prev]);
  };

  const handleDownload = (report: any) => {
    downloadAsCSV(
      ['رقم التقرير', 'العنوان', 'الفئة', 'النوع', 'التنسيق', 'آخر إنشاء'],
      [[report.id, report.title, report.category, report.type, report.format, report.lastGenerated]],
      `تقرير-${report.id}`
    );
    toast.success(`تم تحميل التقرير: ${report.title}`);
  };

  const getViewFields = (report: any): DetailField[] => [
    { label: 'الرقم', value: report.id },
    { label: 'العنوان', value: report.title },
    { label: 'الوصف', value: report.description },
    { label: 'الفئة', value: report.category },
    { label: 'النوع', value: report.type },
    { label: 'التنسيق', value: report.format },
    { label: 'آخر إنشاء', value: new Date(report.lastGenerated).toLocaleDateString('ar-SA') },
    { label: 'الحالة', value: report.status === 'ready' ? 'جاهز' : 'قيد الإنشاء' },
  ];

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">التقارير القانونية</h3>
        <button onClick={() => setIsCreateOpen(true)} className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black/90 transition-colors">
          <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center"><BarChart className="w-4 h-4" /></div>
          إنشاء تقرير مخصص
        </button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6"><h3 className="text-xl font-semibold text-black font-arabic">إحصائيات التقارير</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2"><BarChart className="h-4 w-4 text-black" /></div>
            <div className="text-2xl font-bold text-black font-arabic">{reports.length}</div>
            <div className="text-sm font-medium text-black font-arabic">التقارير المتاحة</div>
          </div>
          <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2"><Calendar className="h-4 w-4 text-black" /></div>
            <div className="text-2xl font-bold text-black font-arabic">{reports.filter(r => r.type === 'monthly').length}</div>
            <div className="text-sm font-medium text-black font-arabic">تقارير شهرية</div>
          </div>
          <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2"><Download className="h-4 w-4 text-black" /></div>
            <div className="text-2xl font-bold text-black font-arabic">156</div>
            <div className="text-sm font-medium text-black font-arabic">مرات التحميل</div>
          </div>
          <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2"><Filter className="h-4 w-4 text-black" /></div>
            <div className="text-2xl font-bold text-black font-arabic">{reports.filter(r => r.type === 'quarterly').length}</div>
            <div className="text-sm font-medium text-black font-arabic">تقارير ربع سنوية</div>
          </div>
        </div>
      </div>

      {/* قائمة التقارير */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6"><h3 className="text-xl font-semibold text-black font-arabic">التقارير المتاحة</h3></div>
        <div className="space-y-4">
          {reports.map(report => <div key={report.id} className="flex items-center justify-between p-4 bg-transparent border border-[#DADCE0] rounded-[41px] hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-transparent border border-[#DADCE0] rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center"><BarChart className="w-4 h-4 text-black" /></div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-black font-arabic">{report.title}</h4>
                  <p className="text-sm font-normal text-black font-arabic">{report.description}</p>
                  <div className="text-xs font-normal text-black font-arabic mt-1">آخر إنشاء: {new Date(report.lastGenerated).toLocaleDateString('ar-SA')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewingReport(report)} className="px-4 py-2 rounded-full border border-black text-sm font-medium font-arabic hover:bg-black/5 transition-colors flex items-center gap-1">
                  <Eye className="w-4 h-4" /> عرض
                </button>
                <button onClick={() => handleDownload(report)} className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black/90 transition-colors font-arabic">تحميل</button>
              </div>
            </div>)}
        </div>
      </div>

      <GenericFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="إنشاء تقرير مخصص" fields={createFields} onSubmit={handleCreate} submitLabel="إنشاء التقرير" successMessage="تم إنشاء التقرير بنجاح" />
      {viewingReport && <GenericDetailModal isOpen={!!viewingReport} onClose={() => setViewingReport(null)} title={`تفاصيل: ${viewingReport.title}`} fields={getViewFields(viewingReport)} />}
    </div>;
};
