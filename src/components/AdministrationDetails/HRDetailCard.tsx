
import React from "react";
import { UserCheck2 } from "lucide-react";
import { DetailCard } from "./DetailCard";

export const HRDetailCard: React.FC = () => (
  <DetailCard
    title="الموارد البشرية"
    subtitle="إدارة شؤون الموظفين والتطوير"
    description="توظيف وتقييم وتطوير الموظفين."
    icon={<UserCheck2 size={30} color="#34D399" />}
    statItems={[
      { label: "عدد الموظفين", value: 21 },
      { label: "وظائف شاغرة", value: 2 },
    ]}
  >
    <div className="mt-3 text-right text-soabra-text-secondary/90 text-base">
      الإدارة المسؤولة عن جذب الكفاءات، وتخطيط الموارد البشرية، وتطوير بيئة العمل الداخلية.
    </div>
  </DetailCard>
);
