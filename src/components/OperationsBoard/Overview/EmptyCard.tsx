
import React from "react";

export const EmptyCard: React.FC = () => (
  <div
    className="rounded-[28px] bg-[#e6eeef]/90 border-none glass-enhanced shadow flex flex-col h-full min-h-[128px] px-7 py-6"
    style={{
      fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      background: "rgba(230, 238, 239, 0.90)",
    }}
  >
    {/* Placeholder فقط! */}
    <div className="flex-1 flex items-center justify-center text-gray-300 font-semibold text-lg">
      التنبيهات
    </div>
  </div>
);
