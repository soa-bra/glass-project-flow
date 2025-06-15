import React from "react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types/project";
import ProjectMilestonesProgressBar from "./ProjectMilestonesProgressBar";

interface ProjectPanelContentProps {
  project: Project;
}

export default function ProjectPanelContent({ project }: ProjectPanelContentProps) {
  const progress = project.progress ?? 75;

  // تعريف الديناميكية الافتراضية للمايل ستونز (يمكن تعديلها أو أخذها من project)
  const milestones = project.milestones
    ? project.milestones
    : [
        { key: "milestone1", label: "تخطيط", percent: 0 },
        { key: "milestone2", label: "تنفيذ", percent: 33 },
        { key: "milestone3", label: "مراجعة", percent: 66 },
        { key: "milestone4", label: "إكمال", percent: 100 },
      ];

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
      {/* شريط تقدّم المراحل الجديد */}
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="font-bold text-soabra-primary-blue">مراحل تقدم المشروع</span>
          <span className="text-sm font-semibold text-gray-600">المهمة الحالية: المراجعة النهائية</span>
        </div>
        <ProjectMilestonesProgressBar
          progress={progress}
          milestones={milestones}
          stepsCount={128} // عدد شرائط المصابيح العرضية (يمكن تعديل الرقم)
        />
      </div>

      <Tabs defaultValue="dashboard" dir="rtl" className="flex flex-col flex-1 min-h-0">
        {/* شريط التبويبات والإجراءات */}
        <div className="flex justify-between items-center mt-2 flex-shrink-0">
          <TabsList className="bg-transparent p-0 h-auto gap-1">
            <TabsTrigger value="dashboard" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">لوحة التحكم</TabsTrigger>
            <TabsTrigger value="tasks" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">قائمة المهام</TabsTrigger>
            <TabsTrigger value="budget" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">الميزانية</TabsTrigger>
            <TabsTrigger value="legal" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">الشؤون القانونية</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <QuickActionButton>➕ إضافة مهمة</QuickActionButton>
            <QuickActionButton>⚡ توليد ذكي</QuickActionButton>
            <QuickActionButton>✎ تعديل</QuickActionButton>
          </div>
        </div>

        {/* محتوى التبويبات */}
        <TabsContent value="dashboard" className="flex-1 mt-4 min-h-0">
          {/* شبكة البطاقات */}
          <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full">
            <Card className="glass-enhanced">
              <CardHeader><CardTitle>الميزانية</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-700">متبقي 15,000 ر.س من الميزانية.</p></CardContent>
            </Card>
            <Card className="glass-enhanced">
              <CardHeader><CardTitle>التنبيهات</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-700">لا توجد تنبيهات جديدة.</p></CardContent>
            </Card>
            <Card className="glass-enhanced row-span-2">
              <CardHeader><CardTitle>قائمة المهام</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-700">عرض لآخر 5 مهام وأكثرها استعجالاً.</p></CardContent>
            </Card>
            <Card className="glass-enhanced">
              <CardHeader><CardTitle>مرفقات المشروع</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-700">3 ملفات مرفقة.</p></CardContent>
            </Card>
            <Card className="glass-enhanced">
              <CardHeader><CardTitle>مقترح من الذكاء الاصطناعي</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-700">هل تود إضافة فريق العمل؟</p></CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="tasks" className="flex-1 mt-4 min-h-0">
          <Card className="glass-enhanced h-full flex flex-col items-center justify-center text-center">
            <CardHeader>
              <CardTitle>قائمة المهام</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-gray-700">هنا سيتم عرض جميع مهام المشروع.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="budget" className="flex-1 mt-4 min-h-0">
          <Card className="glass-enhanced h-full flex flex-col items-center justify-center text-center">
            <CardHeader>
              <CardTitle>تفاصيل الميزانية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-gray-700">هنا سيتم عرض تفاصيل ميزانية المشروع.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="legal" className="flex-1 mt-4 min-h-0">
          <Card className="glass-enhanced h-full flex flex-col items-center justify-center text-center">
             <CardHeader>
              <CardTitle>المستندات القانونية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-gray-700">هنا سيتم عرض المستندات والعقود القانونية للمشروع.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
