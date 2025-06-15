
import React, { useState } from "react";
import { GenericCard } from "@/components/ui/GenericCard";
import { AdministrationDrawer } from "@/components/AdministrationDetails/AdministrationDrawer";

const ADMIN_SECTIONS = [
  { key: "general", name: "الإدارة العامة" },
  { key: "projects", name: "إدارة المشاريع" },
  { key: "finance", name: "الإدارة المالية" },
  { key: "marketing", name: "إدارة التسويق" },
  { key: "clients", name: "إدارة العملاء" },
  { key: "hr", name: "الموارد البشرية" },
  { key: "legal", name: "الإدارة القانونية" },
  { key: "operations", name: "التشغيل" },
  { key: "planning", name: "التخطيط والمتابعة" },
  { key: "it", name: "تقنية المعلومات" },
];

const Administrations = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // الحد الأقصى لعدد الأعمدة حسب حجم الشاشة
  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-x-hidden overflow-y-auto pt-[var(--header-height)]"
      style={{ fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif' }}
    >
      <AdministrationDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) setActiveSection(null);
        }}
        sectionKey={activeSection as any}
      />
      <div className="container mx-auto px-0 py-12">
        <h1 className="text-3xl font-bold mb-8 text-right">الإدارات</h1>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {ADMIN_SECTIONS.map((section) => (
            <GenericCard
              key={section.key}
              className="rounded-3xl shadow-xl hover-scale transition-all text-right font-arabic select-none cursor-pointer"
              variant="glass"
              padding="lg"
              onClick={() => {
                setActiveSection(section.key);
                setDrawerOpen(true);
              }}
            >
              <div className="flex flex-col items-end gap-2">
                <span className="text-lg font-semibold">{section.name}</span>
                <span className="text-xs text-soabra-text-secondary/70">قسم {section.key}</span>
              </div>
            </GenericCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Administrations;
