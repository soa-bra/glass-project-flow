
import React from "react";
import { MonitorSmartphone } from "lucide-react";
import { DetailCard } from "./DetailCard";

export const ITDetailCard: React.FC = () => (
  <DetailCard
    title="تقنية المعلومات"
    subtitle="قسم إدارة نظم المعلومات"
    description="دعم وصيانة الأنظمة التقنية والبنية التحتية."
    icon={<MonitorSmartphone size={30} color="#7C3AED" />}
    statItems={[
      { label: "أنظمة مدعومة", value: 7 },
      { label: "تذاكر حالية", value: 3 },
    ]}
  >
    <div className="mt-3 text-right text-soabra-text-secondary/90 text-base">
      مسؤولة عن التحول الرقمي، وصيانة البنية التحتية التقنية، وضمان توافر الأنظمة بأمان.
    </div>
  </DetailCard>
);
