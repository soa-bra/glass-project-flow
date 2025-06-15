
import React from "react";
import { Coins } from "lucide-react";
import { DetailCard } from "./DetailCard";

export const FinanceDetailCard: React.FC = () => (
  <DetailCard
    title="الإدارة المالية"
    subtitle="قسم الشؤون المالية والحسابات"
    description="متابعة الميزانيات، الحسابات، وإعداد التقارير المالية."
    icon={<Coins size={30} color="#34D399" />}
    statItems={[
      { label: "المصاريف الشهرية", value: "220,000 ر.س" },
      { label: "التقارير السنوية", value: 12 },
    ]}
  >
    <div className="mt-3 text-right text-soabra-text-secondary/90 text-base">
      مسؤولة عن إعداد الميزانية ومراقبة المصروفات والعوائد والتقارير المالية، وضمان الشفافية المالية للمؤسسة.
    </div>
  </DetailCard>
);
