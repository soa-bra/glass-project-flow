
import React from 'react';
import { TemplateSearchBar } from './Templates/TemplateSearchBar';
import { TemplateCategoriesGrid } from './Templates/TemplateCategoriesGrid';
import { PopularTemplatesList } from './Templates/PopularTemplatesList';
import { RecentTemplatesList } from './Templates/RecentTemplatesList';
import { TemplateStatsGrid } from './Templates/TemplateStatsGrid';

interface TemplatesTabProps {
  departmentTitle: string;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ departmentTitle }) => {
  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* شريط البحث والفلترة */}
      <TemplateSearchBar />

      {/* فئات النماذج */}
      <TemplateCategoriesGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* النماذج الأكثر استخداماً */}
        <PopularTemplatesList />

        {/* النماذج الحديثة */}
        <RecentTemplatesList />
      </div>

      {/* إحصائيات سريعة */}
      <TemplateStatsGrid />
    </div>
  );
};
