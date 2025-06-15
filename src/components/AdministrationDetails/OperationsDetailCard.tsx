
import React from "react";
import { Workflow } from "lucide-react";
import { DetailCard } from "./DetailCard";

export const OperationsDetailCard: React.FC = () => (
  <DetailCard
    title="إدارة التشغيل"
    subtitle="قسم العمليات والتشغيل الميداني"
    description="متابعة سير العمل اليومي وضمان جودة التشغيل."
    icon={<Workflow size={30} color="#4B5563" />}
    statItems={[
      { label: "عمليات يومية", value: 24 },
      { label: "بلاغات الطوارئ", value: 1 },
    ]}
  >
    <div className="mt-3 text-right text-soabra-text-secondary/90 text-base">
      دعم الهيكل التشغيلي ورفع كفاءة الإجراءات التشغيلية لتحسين الأداء العام.
    </div>
  </DetailCard>
);
