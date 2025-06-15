
import React from "react";
import { CalendarCheck2 } from "lucide-react";
import { DetailCard } from "./DetailCard";

export const PlanningDetailCard: React.FC = () => (
  <DetailCard
    title="التخطيط والمتابعة"
    subtitle="قسم التخطيط والمتابعة الداخلية"
    description="وضع خطط العمل وضمان تحقيق الأهداف المرحلية."
    icon={<CalendarCheck2 size={30} color="#0099FF" />}
    statItems={[
      { label: "خطط قيد التنفيذ", value: 5 },
      { label: "اجتماعات شهرية", value: 4 },
    ]}
  >
    <div className="mt-3 text-right text-soabra-text-secondary/90 text-base">
      مسؤول عن إعداد ومتابعة الخطط التشغيلية وقياس الأداء ورفع التقارير للإدارة العليا.
    </div>
  </DetailCard>
);
