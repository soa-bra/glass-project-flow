
import React from "react";

export const EmptyCard: React.FC = () => (
  <div
    className="rounded-[28px] glass-enhanced shadow flex flex-col h-full min-h-[128px] px-7 py-6"
    style={{
      fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      background: "rgba(255,255,255,0.40)",
      boxShadow: "0 2px 16px 0 rgba(54,52,53,0.06)",
    }}
  >
    {/* Placeholder فقط! */}
    <div className="flex-1 flex items-center justify-center text-gray-300 font-semibold text-lg">
      التنبيهات {/* نص تنبيهات عام */}
    </div>
  </div>
);
