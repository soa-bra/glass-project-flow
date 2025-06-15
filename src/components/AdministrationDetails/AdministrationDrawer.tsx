
import React from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { GeneralDetailCard } from "./GeneralDetailCard";
import { ProjectsDetailCard } from "./ProjectsDetailCard";
import { FinanceDetailCard } from "./FinanceDetailCard";
import { MarketingDetailCard } from "./MarketingDetailCard";
import { ClientsDetailCard } from "./ClientsDetailCard";
import { HRDetailCard } from "./HRDetailCard";
import { LegalDetailCard } from "./LegalDetailCard";
import { OperationsDetailCard } from "./OperationsDetailCard";
import { PlanningDetailCard } from "./PlanningDetailCard";
import { ITDetailCard } from "./ITDetailCard";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionKey:
    | "general"
    | "projects"
    | "finance"
    | "marketing"
    | "clients"
    | "hr"
    | "legal"
    | "operations"
    | "planning"
    | "it"
    | null;
}

const SECTION_DETAIL_COMPONENTS: Record<string, React.ReactNode> = {
  general: <GeneralDetailCard />,
  projects: <ProjectsDetailCard />,
  finance: <FinanceDetailCard />,
  marketing: <MarketingDetailCard />,
  clients: <ClientsDetailCard />,
  hr: <HRDetailCard />,
  legal: <LegalDetailCard />,
  operations: <OperationsDetailCard />,
  planning: <PlanningDetailCard />,
  it: <ITDetailCard />,
};

export const AdministrationDrawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  sectionKey,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full max-w-xl rounded-l-3xl bg-white/40 shadow-2xl backdrop-blur-[20px] border border-white/50 !p-0 transition"
        style={{
          direction: "rtl",
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        }}
      >
        <SheetHeader className="mb-0 mt-0" />
        <div className="px-5 py-7 md:px-10 md:py-10 h-full overflow-y-auto flex justify-center items-start">
          {sectionKey && SECTION_DETAIL_COMPONENTS[sectionKey]}
        </div>
      </SheetContent>
    </Sheet>
  );
};
