import React from 'react';
import { StatusBox } from '@/components/custom/StatusBox';
import { ClientProfile } from '@/components/custom/ClientProfile';
import { TeamRoster } from '@/components/custom/TeamRoster';
import { DocumentsGrid } from '@/components/custom/DocumentsGrid';
import { TemplateLibrary } from '@/components/custom/TemplateLibrary';

// تبويب الوضع المالي
export const FinancialTab = ({ data }: any) => {
  return (
    <div className="space-y-6">
      {/* حالة الميزانية */}
      <StatusBox title="الحالة المالية" status="success">
        <p className="text-sm">المشروع ضمن الميزانية المحددة</p>
      </StatusBox>

      {/* الإحصائيات المالية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-green-600">المتبقي</h4>
          <p className="text-2xl font-bold">15,000 ر.س</p>
          <p className="text-sm text-gray-600">من إجمالي 50,000 ر.س</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-blue-600">المصروف</h4>
          <p className="text-2xl font-bold">35,000 ر.س</p>
          <p className="text-sm text-gray-600">70% من الميزانية</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-purple-600">الربح المتوقع</h4>
          <p className="text-2xl font-bold">12,000 ر.س</p>
          <p className="text-sm text-gray-600">24% هامش ربح</p>
        </div>
      </div>

      {/* تفاصيل المصروفات */}
      <div className="bg-white/20 rounded-2xl p-4">
        <h3 className="font-bold mb-4">تفصيل المصروفات</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>رواتب الفريق</span>
            <div className="text-right">
              <span className="font-bold">20,000 ر.س</span>
              <span className="text-sm text-gray-600 block">57%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>أدوات وبرمجيات</span>
            <div className="text-right">
              <span className="font-bold">8,000 ر.س</span>
              <span className="text-sm text-gray-600 block">23%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>استشارات خارجية</span>
            <div className="text-right">
              <span className="font-bold">5,000 ر.س</span>
              <span className="text-sm text-gray-600 block">14%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>مصاريف أخرى</span>
            <div className="text-right">
              <span className="font-bold">2,000 ر.س</span>
              <span className="text-sm text-gray-600 block">6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* التدفق النقدي المتوقع */}
      <div className="bg-white/20 rounded-2xl p-4">
        <h3 className="font-bold mb-4">التدفق النقدي المتوقع</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-white/10 rounded-xl">
            <p className="text-sm text-gray-600">الشهر الحالي</p>
            <p className="font-bold text-lg">8,000 ر.س</p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl">
            <p className="text-sm text-gray-600">الشهر القادم</p>
            <p className="font-bold text-lg">12,000 ر.س</p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl">
            <p className="text-sm text-gray-600">بعد شهرين</p>
            <p className="font-bold text-lg">15,000 ر.س</p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl">
            <p className="text-sm text-gray-600">المتبقي</p>
            <p className="font-bold text-lg">15,000 ر.س</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// تبويب العميل
export const ClientTab = ({ clientData }: any) => {
  const mockClient = {
    id: '1',
    name: 'شركة التقنية المتقدمة',
    company: 'شركة التقنية المتقدمة',
    email: 'info@techcompany.com',
    phone: '+966501234567',
    address: 'الرياض، المملكة العربية السعودية',
    contractStatus: 'active' as const,
    joinDate: '2024-01-01',
    totalProjects: 5,
    sentiment: 0.85
  };

  return (
    <div className="space-y-4">
      <StatusBox title="رضا العميل" status="success">
        <p className="text-sm">العميل راضٍ عن سير المشروع</p>
      </StatusBox>
      <ClientProfile client={mockClient} />
    </div>
  );
};

// تبويب الفريق
export const TeamTab = ({ teamData }: any) => {
  const mockTeamData = [
    { 
      id: '1', 
      name: 'أحمد محمد', 
      role: 'مطور رئيسي', 
      email: 'ahmed@company.com',
      phone: '+966501234567',
      avatar: '', 
      utilization: 85, 
      availability: 'available' as const,
      currentTasks: 3,
      hoursLogged: 156,
      targetHours: 180
    },
    { 
      id: '2', 
      name: 'فاطمة علي', 
      role: 'مصممة واجهات', 
      email: 'fatima@company.com',
      phone: '+966502345678',
      avatar: '', 
      utilization: 95, 
      availability: 'busy' as const,
      currentTasks: 4,
      hoursLogged: 168,
      targetHours: 180
    },
    { 
      id: '3', 
      name: 'محمد خالد', 
      role: 'محلل أنظمة', 
      email: 'mohammed@company.com',
      phone: '+966503456789',
      avatar: '', 
      utilization: 70, 
      availability: 'available' as const,
      currentTasks: 2,
      hoursLogged: 125,
      targetHours: 180
    },
    { 
      id: '4', 
      name: 'نورا سعد', 
      role: 'مختبرة جودة', 
      email: 'nora@company.com',
      phone: '+966504567890',
      avatar: '', 
      utilization: 0, 
      availability: 'away' as const,
      currentTasks: 0,
      hoursLogged: 0,
      targetHours: 180
    }
  ];

  return (
    <div className="space-y-6">
      <StatusBox title="حالة الفريق" status="success">
        <p className="text-sm">الفريق يعمل بكفاءة عالية - معدل الإنجاز 94%</p>
      </StatusBox>

      {/* إحصائيات الفريق */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-blue-600">إجمالي الأعضاء</h4>
          <p className="text-2xl font-bold">4</p>
          <p className="text-sm text-gray-600">أعضاء نشطين</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-green-600">معدل الأداء</h4>
          <p className="text-2xl font-bold">91%</p>
          <p className="text-sm text-gray-600">أداء ممتاز</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-orange-600">معدل الحمولة</h4>
          <p className="text-2xl font-bold">83%</p>
          <p className="text-sm text-gray-600">ضمن المعدل المثالي</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-purple-600">المهام المكتملة</h4>
          <p className="text-2xl font-bold">47</p>
          <p className="text-sm text-gray-600">من أصل 50 مهمة</p>
        </div>
      </div>

      <TeamRoster data={mockTeamData} />

      {/* تحليل توزيع المهارات */}
      <div className="bg-white/20 rounded-2xl p-4">
        <h3 className="font-bold mb-4">توزيع المهارات في الفريق</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>تطوير البرمجيات</span>
              <span className="font-bold">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>تصميم الواجهات</span>
              <span className="font-bold">92%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>تحليل الأنظمة</span>
              <span className="font-bold">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>اختبار الجودة</span>
              <span className="font-bold">88%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// تبويب المرفقات
export const AttachmentsTab = ({ documents }: any) => {
  const mockDocuments = [
    { 
      id: '1', 
      name: 'مواصفات المشروع.pdf', 
      type: 'document' as const, 
      size: '2.5 MB', 
      uploadDate: '2024-01-15',
      classification: 'Medium' as const,
      version: '1.0',
      uploadedBy: 'أحمد محمد',
      tags: ['مواصفات', 'متطلبات']
    },
    { 
      id: '2', 
      name: 'التصاميم الأولية.figma', 
      type: 'image' as const, 
      size: '15.8 MB', 
      uploadDate: '2024-01-20',
      classification: 'High' as const,
      version: '2.1',
      uploadedBy: 'فاطمة علي',
      tags: ['تصميم', 'واجهات']
    },
    { 
      id: '3', 
      name: 'خطة المشروع.xlsx', 
      type: 'document' as const, 
      size: '1.2 MB', 
      uploadDate: '2024-01-18',
      classification: 'High' as const,
      version: '1.5',
      uploadedBy: 'محمد خالد',
      tags: ['تخطيط', 'جدولة']
    },
    { 
      id: '4', 
      name: 'تقرير الاختبار.docx', 
      type: 'document' as const, 
      size: '3.7 MB', 
      uploadDate: '2024-01-22',
      classification: 'Low' as const,
      version: '1.0',
      uploadedBy: 'نورا سعد',
      tags: ['اختبار', 'جودة']
    }
  ];

  return (
    <div className="space-y-6">
      <StatusBox title="المرفقات" status="success">
        <p className="text-sm">جميع المستندات محدثة ومنظمة - آخر رفع منذ ساعتين</p>
      </StatusBox>

      {/* إحصائيات المرفقات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-blue-600">إجمالي الملفات</h4>
          <p className="text-2xl font-bold">23</p>
          <p className="text-sm text-gray-600">ملف مرفوع</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-green-600">الحجم الإجمالي</h4>
          <p className="text-2xl font-bold">156 MB</p>
          <p className="text-sm text-gray-600">مساحة مستخدمة</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-purple-600">المشاركة</h4>
          <p className="text-2xl font-bold">8</p>
          <p className="text-sm text-gray-600">ملفات مشتركة</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-orange-600">المعدلة حديثاً</h4>
          <p className="text-2xl font-bold">5</p>
          <p className="text-sm text-gray-600">خلال اليوم</p>
        </div>
      </div>

      {/* فئات الملفات */}
      <div className="bg-white/20 rounded-2xl p-4">
        <h3 className="font-bold mb-4">توزيع الملفات حسب النوع</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-lg font-bold text-red-600">7</p>
            <p className="text-sm">PDF</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-lg font-bold text-blue-600">5</p>
            <p className="text-sm">Word</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-lg font-bold text-green-600">4</p>
            <p className="text-sm">Excel</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-lg font-bold text-purple-600">7</p>
            <p className="text-sm">أخرى</p>
          </div>
        </div>
      </div>

      <DocumentsGrid documents={mockDocuments} />
    </div>
  );
};

// تبويب القوالب
export const TemplatesTab = ({ templates }: any) => {
  const mockTemplates = [
    { id: '1', name: 'قالب تقرير المشروع الشهري', category: 'تقارير', downloads: 45, lastUsed: '2024-01-20' },
    { id: '2', name: 'نموذج اتفاقية العمل', category: 'قانوني', downloads: 32, lastUsed: '2024-01-18' },
    { id: '3', name: 'قالب خطة المشروع', category: 'تخطيط', downloads: 67, lastUsed: '2024-01-22' },
    { id: '4', name: 'نموذج تقييم الأداء', category: 'موارد بشرية', downloads: 28, lastUsed: '2024-01-15' },
    { id: '5', name: 'قالب المراسلات الرسمية', category: 'إداري', downloads: 51, lastUsed: '2024-01-19' },
    { id: '6', name: 'نموذج محضر الاجتماع', category: 'إداري', downloads: 38, lastUsed: '2024-01-21' }
  ];

  return (
    <div className="space-y-6">
      <StatusBox title="مكتبة القوالب" status="success">
        <p className="text-sm">القوالب محدثة وجاهزة للاستخدام - 12 قالب متاح</p>
      </StatusBox>

      {/* إحصائيات القوالب */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-blue-600">إجمالي القوالب</h4>
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-600">قالب متاح</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-green-600">الأكثر استخداماً</h4>
          <p className="text-2xl font-bold">6</p>
          <p className="text-sm text-gray-600">قوالب شائعة</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-purple-600">تم التحديث</h4>
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm text-gray-600">هذا الأسبوع</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 text-center">
          <h4 className="font-bold text-lg text-orange-600">إجمالي التحميلات</h4>
          <p className="text-2xl font-bold">261</p>
          <p className="text-sm text-gray-600">هذا الشهر</p>
        </div>
      </div>

      {/* فئات القوالب */}
      <div className="bg-white/20 rounded-2xl p-4">
        <h3 className="font-bold mb-4">القوالب حسب الفئة</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-lg font-bold text-blue-600">4</p>
            <p className="text-sm">تقارير</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-lg font-bold text-green-600">3</p>
            <p className="text-sm">إداري</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-lg font-bold text-purple-600">2</p>
            <p className="text-sm">قانوني</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-lg font-bold text-red-600">2</p>
            <p className="text-sm">تخطيط</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-lg font-bold text-yellow-600">1</p>
            <p className="text-sm">موارد بشرية</p>
          </div>
        </div>
      </div>

      <TemplateLibrary templates={mockTemplates} />
    </div>
  );
};