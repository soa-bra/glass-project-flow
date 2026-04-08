
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, Plus, Search, Download, Calendar, BarChart3, PieChart, TrendingUp,
  Users, DollarSign, Clock, RefreshCw, Eye, Share
} from 'lucide-react';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { downloadAsCSV } from '../shared/downloadUtils';
import { toast } from 'sonner';

export const ReportsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState('last30days');
  const [showNewReportForm, setShowNewReportForm] = useState(false);
  const [viewingReport, setViewingReport] = useState<any>(null);

  // Form state
  const [newReport, setNewReport] = useState({ title: '', type: 'customer', period: 'last30days', format: 'pdf' });
  const [aiPrompt, setAiPrompt] = useState('');

  const reportTypes = [
    { value: 'customer', label: 'تقارير العملاء', icon: Users, color: 'blue' },
    { value: 'sales', label: 'تقارير المبيعات', icon: DollarSign, color: 'green' },
    { value: 'service', label: 'تقارير الخدمة', icon: Clock, color: 'orange' },
    { value: 'analytics', label: 'تقارير التحليلات', icon: BarChart3, color: 'purple' },
    { value: 'performance', label: 'تقارير الأداء', icon: TrendingUp, color: 'indigo' }
  ];

  const [reports, setReports] = useState([
    { id: '1', title: 'تقرير العملاء الشهري', type: 'customer', description: 'تحليل شامل لنشاط العملاء وسلوكهم الشرائي', lastGenerated: '2024-06-28', frequency: 'شهري', status: 'جاهز', format: ['PDF', 'Excel'], insights: ['نمو العملاء بنسبة 15%', 'تحسن في معدل الاحتفاظ'], charts: 3 },
    { id: '2', title: 'تقرير أداء المبيعات', type: 'sales', description: 'تحليل مفصل للإيرادات والفرص المحققة', lastGenerated: '2024-06-27', frequency: 'أسبوعي', status: 'قيد الإنشاء', format: ['PDF', 'PowerPoint'], insights: ['تجاوز الهدف بنسبة 8%', 'نمو في الفرص الجديدة'], charts: 5 },
    { id: '3', title: 'تقرير رضا العملاء', type: 'service', description: 'قياس مستويات الرضا ومؤشرات NPS', lastGenerated: '2024-06-26', frequency: 'ربع سنوي', status: 'جاهز', format: ['PDF'], insights: ['تحسن NPS إلى 81', 'انخفاض الشكاوى بنسبة 23%'], charts: 4 },
    { id: '4', title: 'التحليل التنافسي', type: 'analytics', description: 'مقارنة الأداء مع المنافسين وتحليل السوق', lastGenerated: '2024-06-25', frequency: 'شهري', status: 'جاهز', format: ['PDF', 'Word'], insights: ['تفوق في سرعة الاستجابة', 'فرص تحسين في التسعير'], charts: 6 }
  ]);

  const getTypeConfig = (type: string) => {
    const config = reportTypes.find(t => t.value === type);
    return config || { icon: FileText, color: 'gray', label: type };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'جاهز': return 'bg-green-100 text-green-800';
      case 'قيد الإنشاء': return 'bg-yellow-100 text-yellow-800';
      case 'خطأ': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleRefresh = () => toast.success('تم تحديث البيانات بنجاح');

  const handleCreateReport = () => {
    if (!newReport.title) { toast.error('يرجى إدخال عنوان التقرير'); return; }
    const report = {
      id: `r-${Date.now()}`,
      title: newReport.title,
      type: newReport.type,
      description: 'تقرير مخصص',
      lastGenerated: new Date().toISOString().split('T')[0],
      frequency: 'مرة واحدة',
      status: 'جاهز',
      format: [newReport.format.toUpperCase()],
      insights: ['تقرير جديد - يتم تحليل البيانات'],
      charts: 2
    };
    setReports(prev => [report, ...prev]);
    setShowNewReportForm(false);
    setNewReport({ title: '', type: 'customer', period: 'last30days', format: 'pdf' });
    toast.success('تم إنشاء التقرير بنجاح');
  };

  const handleDownloadReport = (report: any) => {
    downloadAsCSV(
      ['العنوان', 'النوع', 'التكرار', 'الحالة', 'آخر إنشاء'],
      [[report.title, report.type, report.frequency, report.status, report.lastGenerated]],
      `تقرير-${report.id}`
    );
    toast.success(`تم تحميل التقرير: ${report.title}`);
  };

  const handleShareReport = (report: any) => {
    navigator.clipboard.writeText(`تقرير: ${report.title} - الحالة: ${report.status} - آخر تحديث: ${report.lastGenerated}`);
    toast.success('تم نسخ رابط التقرير');
  };

  const handleRefreshReport = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, lastGenerated: new Date().toISOString().split('T')[0], status: 'جاهز' } : r));
    toast.success('تم تحديث التقرير');
  };

  const handleAIReport = () => {
    if (!aiPrompt) { toast.error('يرجى كتابة وصف التقرير'); return; }
    const report = {
      id: `ai-${Date.now()}`,
      title: `تقرير ذكي: ${aiPrompt.substring(0, 40)}...`,
      type: 'analytics',
      description: aiPrompt,
      lastGenerated: new Date().toISOString().split('T')[0],
      frequency: 'مرة واحدة',
      status: 'جاهز',
      format: ['PDF'],
      insights: ['تقرير مولد بالذكاء الاصطناعي', 'يتطلب مراجعة يدوية'],
      charts: 3
    };
    setReports(prev => [report, ...prev]);
    setAiPrompt('');
    toast.success('تم إنشاء التقرير الذكي بنجاح');
  };

  const getViewFields = (report: any): DetailField[] => [
    { label: 'العنوان', value: report.title },
    { label: 'النوع', value: getTypeConfig(report.type).label },
    { label: 'الوصف', value: report.description },
    { label: 'الحالة', value: report.status },
    { label: 'التكرار', value: report.frequency },
    { label: 'آخر إنشاء', value: report.lastGenerated },
    { label: 'التنسيقات', value: report.format.join(', ') },
    { label: 'أهم النتائج', value: report.insights.join(' | ') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="البحث في التقارير..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
          </div>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
            <option value="all">جميع الأنواع</option>
            {reportTypes.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
          </select>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
            <option value="last7days">آخر 7 أيام</option>
            <option value="last30days">آخر 30 يوم</option>
            <option value="last3months">آخر 3 أشهر</option>
            <option value="last6months">آخر 6 أشهر</option>
            <option value="lastyear">السنة الماضية</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-arabic" onClick={handleRefresh}>
            <RefreshCw className="ml-2 h-4 w-4" />تحديث
          </Button>
          <Button onClick={() => setShowNewReportForm(!showNewReportForm)} className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
            <Plus className="ml-2 h-4 w-4" />تقرير مخصص
          </Button>
        </div>
      </div>

      {/* Custom Report Builder */}
      {showNewReportForm && (
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4">إنشاء تقرير مخصص</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold font-arabic mb-2">عنوان التقرير *</label>
              <Input placeholder="اسم وصفي للتقرير" value={newReport.title} onChange={e => setNewReport(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold font-arabic mb-2">نوع التقرير</label>
              <select value={newReport.type} onChange={e => setNewReport(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
                {reportTypes.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold font-arabic mb-2">الفترة الزمنية</label>
              <select value={newReport.period} onChange={e => setNewReport(p => ({ ...p, period: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
                <option value="last30days">آخر 30 يوم</option>
                <option value="last3months">آخر 3 أشهر</option>
                <option value="last6months">آخر 6 أشهر</option>
                <option value="lastyear">السنة الماضية</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold font-arabic mb-2">تنسيق التصدير</label>
              <select value={newReport.format} onChange={e => setNewReport(p => ({ ...p, format: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="word">Word</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateReport} className="bg-green-600 hover:bg-green-700 text-white font-arabic">إنشاء التقرير</Button>
            <Button variant="outline" onClick={() => setShowNewReportForm(false)} className="font-arabic">إلغاء</Button>
          </div>
        </GenericCard>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GenericCard className="text-center">
          <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <h3 className="text-lg font-bold font-arabic text-gray-900">{reports.length}</h3>
          <p className="text-gray-600 font-arabic text-sm">إجمالي التقارير</p>
        </GenericCard>
        <GenericCard className="text-center">
          <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-bold font-arabic text-gray-900">{reports.filter(r => r.status === 'جاهز').length}</h3>
          <p className="text-gray-600 font-arabic text-sm">تقارير جاهزة</p>
        </GenericCard>
        <GenericCard className="text-center">
          <RefreshCw className="h-6 w-6 text-orange-600 mx-auto mb-2" />
          <h3 className="text-lg font-bold font-arabic text-gray-900">{reports.filter(r => r.frequency === 'شهري').length}</h3>
          <p className="text-gray-600 font-arabic text-sm">تقارير دورية</p>
        </GenericCard>
        <GenericCard className="text-center">
          <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <h3 className="text-lg font-bold font-arabic text-gray-900">{reports.reduce((sum, r) => sum + r.charts, 0)}</h3>
          <p className="text-gray-600 font-arabic text-sm">إجمالي الرسوم البيانية</p>
        </GenericCard>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => {
          const typeConfig = getTypeConfig(report.type);
          const IconComponent = typeConfig.icon;
          return (
            <GenericCard key={report.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${typeConfig.color}-100`}>
                    <IconComponent className={`h-5 w-5 text-${typeConfig.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-semibold font-arabic text-gray-900">{report.title}</h4>
                    <p className="text-sm text-gray-600 font-arabic">{report.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>{report.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm font-arabic">
                <div><span className="text-gray-500">آخر إنشاء:</span><div className="font-semibold">{report.lastGenerated}</div></div>
                <div><span className="text-gray-500">التكرار:</span><div className="font-semibold">{report.frequency}</div></div>
                <div><span className="text-gray-500">الرسوم البيانية:</span><div className="font-semibold">{report.charts} رسم</div></div>
                <div><span className="text-gray-500">التنسيقات:</span><div className="font-semibold">{report.format.join(', ')}</div></div>
              </div>
              <div className="mb-4">
                <h5 className="font-semibold font-arabic text-gray-900 mb-2">أهم النتائج:</h5>
                <ul className="space-y-1">
                  {report.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-600 font-arabic flex items-center">
                      <div className="h-1 w-1 bg-blue-500 rounded-full ml-2" />{insight}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 font-arabic" onClick={() => setViewingReport(report)}>
                  <Eye className="h-3 w-3 ml-1" />عرض
                </Button>
                <Button size="sm" variant="outline" className="font-arabic" onClick={() => handleDownloadReport(report)}>
                  <Download className="h-3 w-3 ml-1" />تحميل
                </Button>
                <Button size="sm" variant="outline" className="font-arabic" onClick={() => handleShareReport(report)}>
                  <Share className="h-3 w-3 ml-1" />مشاركة
                </Button>
                {report.status === 'جاهز' && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-arabic" onClick={() => handleRefreshReport(report.id)}>
                    <RefreshCw className="h-3 w-3 ml-1" />تحديث
                  </Button>
                )}
              </div>
            </GenericCard>
          );
        })}
      </div>

      {/* AI Report Generator */}
      <GenericCard>
        <h3 className="text-lg font-bold font-arabic mb-4 flex items-center"><BarChart3 className="ml-2 h-5 w-5" />مولد التقارير بالذكاء الاصطناعي</h3>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <div>
            <h4 className="font-semibold font-arabic text-gray-900 mb-2">اطلب تقريراً مخصصاً بالذكاء الاصطناعي</h4>
            <p className="text-gray-600 font-arabic text-sm mb-4">اكتب ما تريد تحليله وسيقوم الذكاء الاصطناعي بإنشاء تقرير شامل مع الرؤى والتوصيات</p>
            <div className="flex gap-2">
              <Input placeholder="مثال: أريد تحليل أداء المبيعات في الربع الأخير مع مقارنة بالمنافسين" className="flex-1" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
              <Button onClick={handleAIReport} className="bg-purple-600 hover:bg-purple-700 text-white font-arabic whitespace-nowrap">إنشاء تقرير ذكي</Button>
            </div>
          </div>
        </div>
      </GenericCard>

      {/* View Report Modal */}
      {viewingReport && (
        <GenericDetailModal isOpen={!!viewingReport} onClose={() => setViewingReport(null)} title={viewingReport.title} fields={getViewFields(viewingReport)} />
      )}
    </div>
  );
};
