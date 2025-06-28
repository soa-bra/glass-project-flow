
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BasicInfoForm } from '../BasicInfoForm';
import { ClientForm } from '../ClientForm';
import { TasksTab } from '../TasksTab';
import { PartnershipsTab } from '../PartnershipsTab';
import { ContractForm } from '../ContractForm';
import type { ProjectFormData, ContractPayment } from '../types';
import type { TaskData } from '@/types';

interface ProjectModalTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  projectData: ProjectFormData;
  onInputChange: (field: string, value: unknown) => void;
  onClientDataChange: (field: string, value: string) => void;
  onAddTask: () => void;
  onGenerateSmartTasks: () => void;
  onAddPayment: () => void;
  onRemovePayment: (id: number) => void;
  onUpdatePayment: (id: number, field: string, value: string) => void;
  teamMembers: string[];
}

export const ProjectModalTabs: React.FC<ProjectModalTabsProps> = ({
  activeTab,
  onTabChange,
  projectData,
  onInputChange,
  onClientDataChange,
  onAddTask,
  onGenerateSmartTasks,
  onAddPayment,
  onRemovePayment,
  onUpdatePayment,
  teamMembers,
}) => {
  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={onTabChange} dir="rtl" className="flex flex-col h-full">
        {/* قائمة التبويبات الثابتة */}
        <div className="flex-shrink-0 px-8 pb-4 border-b border-white/20">
          <TabsList className="bg-transparent gap-2 justify-end w-full">
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-black/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:border data-[state=inactive]:border-white/20 data-[state=inactive]:text-white rounded-full px-4 py-2 font-arabic"
            >
              المعلومات الأساسية
            </TabsTrigger>
            <TabsTrigger 
              value="client" 
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-black/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:border data-[state=inactive]:border-white/20 data-[state=inactive]:text-white rounded-full px-4 py-2 font-arabic"
            >
              بيانات العميل
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-black/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:border data-[state=inactive]:border-white/20 data-[state=inactive]:text-white rounded-full px-4 py-2 font-arabic"
            >
              المهام
            </TabsTrigger>
            <TabsTrigger 
              value="partnerships" 
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-black/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:border data-[state=inactive]:border-white/20 data-[state=inactive]:text-white rounded-full px-4 py-2 font-arabic"
            >
              الشراكات
            </TabsTrigger>
            <TabsTrigger 
              value="contract" 
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-black/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:border data-[state=inactive]:border-white/20 data-[state=inactive]:text-white rounded-full px-4 py-2 font-arabic"
            >
              العقد
            </TabsTrigger>
          </TabsList>
        </div>

        {/* محتوى التبويبات القابل للتمرير */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <TabsContent value="basic" className="mt-0">
            <BasicInfoForm
              projectData={projectData}
              onInputChange={onInputChange}
              teamMembers={teamMembers}
            />
          </TabsContent>

          <TabsContent value="client" className="mt-0">
            <ClientForm
              projectData={projectData}
              onInputChange={onInputChange}
              onClientDataChange={onClientDataChange}
            />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <TasksTab
              tasks={projectData.tasks}
              onAddTask={onAddTask}
              onGenerateSmartTasks={onGenerateSmartTasks}
            />
          </TabsContent>

          <TabsContent value="partnerships" className="mt-0">
            <PartnershipsTab />
          </TabsContent>

          <TabsContent value="contract" className="mt-0">
            <ContractForm
              projectData={projectData}
              onInputChange={onInputChange}
              onAddPayment={onAddPayment}
              onRemovePayment={onRemovePayment}
              onUpdatePayment={onUpdatePayment}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
