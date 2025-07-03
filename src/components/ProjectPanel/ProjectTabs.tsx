import React from 'react';
import { StatusBox } from '@/components/custom/StatusBox';
import { ClientProfile } from '@/components/custom/ClientProfile';
import { TeamRoster } from '@/components/custom/TeamRoster';
import { DocumentsGrid } from '@/components/custom/DocumentsGrid';
import { TemplateLibrary } from '@/components/custom/TemplateLibrary';

// تبويب الوضع المالي
export const FinancialTab = ({ data }: any) => {
  return (
    <div className="space-y-4">
      <StatusBox title="الحالة المالية" status="success">
        <p className="text-sm">المشروع ضمن الميزانية المحددة</p>
      </StatusBox>
      <div className="bg-white/20 rounded-2xl p-4">
        <h3 className="font-bold mb-2">الميزانية الحالية</h3>
        <p>المتبقي: 15,000 ر.س من إجمالي 50,000 ر.س</p>
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
  return (
    <div className="space-y-4">
      <StatusBox title="حالة الفريق" status="success">
        <p className="text-sm">الفريق يعمل بكفاءة عالية</p>
      </StatusBox>
      <TeamRoster data={teamData || []} />
    </div>
  );
};

// تبويب المرفقات
export const AttachmentsTab = ({ documents }: any) => {
  return (
    <div className="space-y-4">
      <StatusBox title="المرفقات" status="success">
        <p className="text-sm">جميع المستندات محدثة ومنظمة</p>
      </StatusBox>
      <DocumentsGrid documents={documents || []} />
    </div>
  );
};

// تبويب القوالب
export const TemplatesTab = ({ templates }: any) => {
  return (
    <div className="space-y-4">
      <StatusBox title="مكتبة القوالب" status="success">
        <p className="text-sm">القوالب المطلوبة متوفرة ومحدثة</p>
      </StatusBox>
      <TemplateLibrary templates={templates || []} />
    </div>
  );
};