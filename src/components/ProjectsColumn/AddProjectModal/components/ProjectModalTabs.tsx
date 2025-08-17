
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
