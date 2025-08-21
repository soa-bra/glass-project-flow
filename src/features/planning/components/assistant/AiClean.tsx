"use client";
import React from "react";
import { useSmartAssistant } from "@/src/features/planning/hooks/useSmartAssistant";

const AiClean: React.FC = () => {
  const { clean, archivedCount, busy } = useSmartAssistant();
  return (
    <div className="p-3 space-y-3">
      <p className="text-sm">تنظيف العناصر خارج الإطار/غير النشطة ونقلها إلى طبقة Archived/Hidden.</p>
      <button className="px-2 py-1 text-sm border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
        onClick={clean} disabled={busy}>🧹 Clean Up</button>
      {archivedCount > 0 && <div className="text-xs text-emerald-700">تم أرشفة {archivedCount} عنصر.</div>}
    </div>
  );
};
export default AiClean;
