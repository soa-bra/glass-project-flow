
import React from "react";
import { Users } from "lucide-react";
import { DetailCard } from "./DetailCard";

export const ClientsDetailCard: React.FC = () => (
  <DetailCard
    title="إدارة العملاء"
    subtitle="قسم خدمة ودعم العملاء"
    description="متابعة رضا العملاء ومعالجة استفساراتهم."
    icon={<Users size={30} color="#106886" />}
    statItems={[
      { label: "العملاء النشطون", value: 42 },
      { label: "طلبات الدعم", value: 9 },
    ]}
  >
    <div className="mt-3 text-right text-soabra-text-secondary/90 text-base">
      مسؤول عن تعزيز ولاء العملاء والاستجابة لملاحظاتهم وتقديم حلول فعّالة وفورية لاستفساراتهم.
    </div>
  </DetailCard>
);
