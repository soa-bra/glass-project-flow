
import React from "react";
import { Megaphone } from "lucide-react";
import { DetailCard } from "./DetailCard";

export const MarketingDetailCard: React.FC = () => (
  <DetailCard
    title="إدارة التسويق"
    subtitle="قسم التسويق والهوية المؤسسية"
    description="إعداد وتنفيذ الخطط التسويقية والترويجية."
    icon={<Megaphone size={30} color="#f77a36" />}
    statItems={[
      { label: "حملات نشطة", value: 3 },
      { label: "متوسط الوصول", value: "18 ألف" },
    ]}
  >
    <div className="mt-3 text-right text-soabra-text-secondary/90 text-base">
      المساهمة في زيادة الوعي بالعلامة التجارية، وتحقيق أهداف المؤسسة عبر الحملات الرقمية والإعلامية.
    </div>
  </DetailCard>
);
