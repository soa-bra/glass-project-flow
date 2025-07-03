import React from "react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types/project";
import { FinancialTab, ClientTab, TeamTab, AttachmentsTab, TemplatesTab } from "./ProjectTabs";

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

      <Tabs defaultValue="financial" dir="rtl" className="flex flex-col flex-1 min-h-0">
        {/* شريط التبويبات والإجراءات */}
        <div className="flex justify-between items-center mt-2 flex-shrink-0">
          <TabsList className="bg-transparent p-0 h-auto gap-1">
            <TabsTrigger value="financial" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">الوضع المالي</TabsTrigger>
            <TabsTrigger value="client" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">العميل</TabsTrigger>
            <TabsTrigger value="team" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">الفريق</TabsTrigger>
            <TabsTrigger value="attachments" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">المرفقات</TabsTrigger>
            <TabsTrigger value="templates" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">القوالب</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <QuickActionButton>➕ إضافة مهمة</QuickActionButton>
            <QuickActionButton>⚡ توليد ذكي</QuickActionButton>
            <QuickActionButton>✎ تعديل</QuickActionButton>
          </div>
        </div>

        {/* محتوى التبويبات */}
        <TabsContent value="financial" className="flex-1 mt-4 min-h-0 overflow-auto">
          <FinancialTab data={project} />
        </TabsContent>
        
        <TabsContent value="client" className="flex-1 mt-4 min-h-0 overflow-auto">
          <ClientTab clientData={null} />
        </TabsContent>
        
        <TabsContent value="team" className="flex-1 mt-4 min-h-0 overflow-auto">
          <TeamTab teamData={null} />
        </TabsContent>
        
        <TabsContent value="attachments" className="flex-1 mt-4 min-h-0 overflow-auto">
          <AttachmentsTab documents={null} />
        </TabsContent>
        
        <TabsContent value="templates" className="flex-1 mt-4 min-h-0 overflow-auto">
          <TemplatesTab templates={null} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
