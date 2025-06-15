
import React from "react";

export const EmptyCard: React.FC = () => (
  <div
    className="rounded-[30px] bg-[#F5FAFC] border border-white/40 glass-enhanced shadow flex flex-col h-full min-h-[205px] px-6 py-5"
    style={{
      fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
    }}
  >
    {/* Placeholder فقط! */}
    <div className="flex-1 flex items-center justify-center text-gray-300 font-semibold text-lg">
      التنبيهات
    </div>
  </div>
);
