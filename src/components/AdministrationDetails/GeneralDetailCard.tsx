
import React from "react";
import { UserCog } from "lucide-react";
import { DetailCard } from "./DetailCard";

export const GeneralDetailCard: React.FC = () => (
  <DetailCard
    title="الإدارة العامة"
    subtitle="قسم الإدارة الكلية للمؤسسة"
    description="تشمل المسؤوليات: التوجيه العام، صنع القرار، ورسم السياسات الاستراتيجية."
    icon={<UserCog size={30} color="#106886" />}
    statItems={[
      { label: "عدد الموظفين", value: 21 },
      { label: "عدد المشاريع", value: 8 }
    ]}
  >
    <div className="mt-3 text-right text-soabra-text-secondary/90 text-base">
      مسؤوليات الإدارة العامة تشمل التنسيق بين جميع الأقسام ووضع الرؤية العامة للمؤسسة، وضمان تحقيق الأهداف الإستراتيجية.
    </div>
  </DetailCard>
);
