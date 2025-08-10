import React from "react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types/project";
import { FinancialTab, ClientTab, TeamTab, AttachmentsTab, TemplatesTab } from "./ProjectTabs";
import { Reveal, Stagger } from "@/components/shared/motion";

interface ProjectPanelContentProps {
  project: Project;
}

export default function ProjectPanelContent({ project }: ProjectPanelContentProps) {
  const progress = project.progress ?? 75;

  const QuickActionButton = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <button
      className={`
        bg-soabra-primary-blue/80 text-white font-bold
        px-4 py-2 rounded-full text-sm
        hover:bg-soabra-primary-blue transition-all duration-200
        backdrop-blur-md border border-white/20 shadow-lg
        flex items-center gap-2
        ${className}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col gap-5 w-full h-full font-arabic">
      {/* شريط تقدّم المراحل */}
      <Reveal delay={0}>
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="font-bold text-soabra-primary-blue">مراحل تقدم المشروع</span>
            <span className="text-sm font-semibold text-gray-600">المهمة الحالية: المراجعة النهائية</span>
          </div>
          <Progress
            value={progress}
            indicatorClassName="bg-gradient-to-r from-soabra-primary-blue to-[#8A2BE2]"
            className="h-3"
          />
        </div>
      </Reveal>

      <Tabs defaultValue="financial" dir="rtl" className="flex flex-col flex-1 min-h-0">
        {/* شريط التبويبات والإجراءات */}
        <Reveal delay={0.15}>
          <div className="flex justify-between items-center mt-2 flex-shrink-0">
            <TabsList className="bg-transparent p-0 h-auto gap-1">
              <TabsTrigger value="financial" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">الوضع المالي</TabsTrigger>
              <TabsTrigger value="client" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">العميل</TabsTrigger>
              <TabsTrigger value="team" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">الفريق</TabsTrigger>
              <TabsTrigger value="attachments" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">المرفقات</TabsTrigger>
              <TabsTrigger value="templates" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">القوالب</TabsTrigger>
            </TabsList>
            <Stagger delay={0.25} gap={0.12} className="flex gap-2">
              <Stagger.Item><QuickActionButton>➕ إضافة مهمة</QuickActionButton></Stagger.Item>
              <Stagger.Item><QuickActionButton>⚡ توليد ذكي</QuickActionButton></Stagger.Item>
              <Stagger.Item><QuickActionButton>✎ تعديل</QuickActionButton></Stagger.Item>
            </Stagger>
          </div>
        </Reveal>

        {/* محتوى التبويبات */}
        <TabsContent value="financial" className="flex-1 mt-4 min-h-0 overflow-auto">
          <Reveal delay={0.2}>
            <FinancialTab data={project} />
          </Reveal>
        </TabsContent>
        
        <TabsContent value="client" className="flex-1 mt-4 min-h-0 overflow-auto">
          <Reveal delay={0.2}>
            <ClientTab clientData={null} />
          </Reveal>
        </TabsContent>
        
        <TabsContent value="team" className="flex-1 mt-4 min-h-0 overflow-auto">
          <Reveal delay={0.2}>
            <TeamTab teamData={null} />
          </Reveal>
        </TabsContent>
        
        <TabsContent value="attachments" className="flex-1 mt-4 min-h-0 overflow-auto">
          <Reveal delay={0.2}>
            <AttachmentsTab documents={null} />
          </Reveal>
        </TabsContent>
        
        <TabsContent value="templates" className="flex-1 mt-4 min-h-0 overflow-auto">
          <Reveal delay={0.2}>
            <TemplatesTab templates={null} />
          </Reveal>
        </TabsContent>
      </Tabs>
    </div>
  );
}
