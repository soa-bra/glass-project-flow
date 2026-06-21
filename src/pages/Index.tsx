
import HeaderBar from '@/components/HeaderBar';
import MainContent from '@/components/MainContent';
import { PageMeta } from '@/components/seo/PageMeta';

const Index = () => {
  return (
    <div 
      dir="rtl" 
      className="relative min-h-screen w-full font-arabic overflow-hidden"
      style={{ background: '#dfecf2' }}
    >
      <PageMeta
        title="لوحة العمليات — منصة سـوبــرا"
        description="لوحة العمليات الرئيسية في منصة سـوبــرا لإدارة المشاريع والأقسام والتخطيط والأرشيف في مكان واحد متكامل."
        path="/"
      />
      {/*
        ملاحظة مهمة: لا نضع z-index على هذه الحاوية حتى لا تُنشئ stacking context
        يحصر القوائم المنسدلة للهيدر (popover) داخل طبقة الأب، مما يجعلها تظهر
        خلف لوحة إدارة المشروع والسايد بار. الهيدر نفسه يضبط z-index داخليًا.
      */}
      <div
        className="fixed top-0 inset-x-0"
        style={{ background: '#dfecf2' }}
      >
        <HeaderBar />
      </div>
      <MainContent />
    </div>
  );
};

export default Index;
