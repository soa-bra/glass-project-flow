
import React from "react";
import { Scale } from "lucide-react";
import { DetailCard } from "./DetailCard";

export const LegalDetailCard: React.FC = () => (
  <DetailCard
    title="الإدارة القانونية"
    subtitle="قسم الشؤون القانونية والعقود"
    description="ضمان الامتثال القانوني للمؤسسة ومتابعة العقود."
    icon={<Scale size={30} color="#FBBF24" />}
    statItems={[
      { label: "العقود الفعّالة", value: 15 },
      { label: "الاستشارات", value: 6 },
    ]}
  >
    <div className="mt-3 text-right text-soabra-text-secondary/90 text-base">
      معالجة كافة المسائل القانونية، ومتابعة العقود والاستشارات وضمان الامتثال للوائح والقوانين.
    </div>
  </DetailCard>
);
