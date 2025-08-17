
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
        <div className="flex-shrink-0 p-6 pb-4 border-b border-black/10">
          <TabsList className="bg-transparent gap-1 justify-end w-full border border-black/10 rounded-full p-1">
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-black data-[state=inactive]:hover:bg-black/5 rounded-full px-4 py-2 text-sm font-medium transition-colors font-arabic"
            >
              المعلومات الأساسية
            </TabsTrigger>
            <TabsTrigger 
              value="client" 
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-black data-[state=inactive]:hover:bg-black/5 rounded-full px-4 py-2 text-sm font-medium transition-colors font-arabic"
            >
              بيانات العميل
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-black data-[state=inactive]:hover:bg-black/5 rounded-full px-4 py-2 text-sm font-medium transition-colors font-arabic"
            >
              المهام
            </TabsTrigger>
            <TabsTrigger 
              value="partnerships" 
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-black data-[state=inactive]:hover:bg-black/5 rounded-full px-4 py-2 text-sm font-medium transition-colors font-arabic"
            >
              الشراكات
            </TabsTrigger>
            <TabsTrigger 
              value="contract" 
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-black data-[state=inactive]:hover:bg-black/5 rounded-full px-4 py-2 text-sm font-medium transition-colors font-arabic"
            >
              العقد
            </TabsTrigger>
          </TabsList>
        </div>

        {/* محتوى التبويبات القابل للتمرير */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
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
