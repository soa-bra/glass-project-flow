
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectPanelContentProps {
  project: {
    title: string;
    description: string;
    owner: string;
    value: string;
    daysLeft: number;
    team?: { name: string; avatar?: string }[];
    progress?: number;
    links?: { label: string; url: string }[];
  };
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
      <div>
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

      {/* شريط التبويبات والإجراءات */}
      <div className="flex justify-between items-center mt-2">
        <Tabs defaultValue="dashboard" dir="rtl">
          <TabsList className="bg-transparent p-0 h-auto gap-1">
            <TabsTrigger value="dashboard" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">لوحة التحكم</TabsTrigger>
            <TabsTrigger value="tasks" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">قائمة المهام</TabsTrigger>
            <TabsTrigger value="budget" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">الميزانية</TabsTrigger>
            <TabsTrigger value="legal" className="text-base data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2">الشؤون القانونية</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <QuickActionButton>➕ إضافة مهمة</QuickActionButton>
          <QuickActionButton>⚡ توليد ذكي</QuickActionButton>
          <QuickActionButton>✎ تعديل</QuickActionButton>
        </div>
      </div>

      {/* شبكة البطاقات */}
      <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4 mt-2">
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
    </div>
  );
}
