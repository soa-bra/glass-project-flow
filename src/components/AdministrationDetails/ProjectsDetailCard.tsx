
import React from "react";
import { FolderOpen } from "lucide-react";
import { DetailCard } from "./DetailCard";

export const ProjectsDetailCard: React.FC = () => (
  <DetailCard
    title="إدارة المشاريع"
    subtitle="قسم الإشراف على تنفيذ المشروعات"
    description="متابعة وتخطيط ومراقبة تنفيذ مشاريع المؤسسة."
    icon={<FolderOpen size={30} color="#f77a36" />}
    statItems={[
      { label: "المشاريع الجارية", value: 4 },
      { label: "المهام المفتوحة", value: 17 }
    ]}
  >
    <div className="mt-3 text-right text-soabra-text-secondary/90 text-base">
      الإشراف على تنفيذ المشاريع وتوزيع المهام والموارد وضمان إنجاز المخرجات ضمن الجدول الزمني.
    </div>
  </DetailCard>
);
