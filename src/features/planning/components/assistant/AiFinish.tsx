"use client";
import React from "react";
import { useSmartAssistant } from "@/src/features/planning/hooks/useSmartAssistant";

const AiFinish: React.FC = () => {
  const { finishPlan, finishPreview, busy } = useSmartAssistant();

  return (
    <div className="p-3 space-y-3">
      <p className="text-sm">تحليل المشهد الحالي وتكميل الخطة تلقائيًا (مهام، روابط، مواعيد).</p>
      <div className="flex items-center gap-2">
        <button className="btn" onClick={finishPreview} disabled={busy}>🔎 Preview</button>
        <button className="btn-primary" onClick={finishPlan} disabled={busy}>⏩ Apply</button>
      </div>
      <LogView />
      <style jsx>{`
        .btn{ @apply px-2 py-1 text-sm border rounded bg-white hover:bg-gray-50 disabled:opacity-50; }
        .btn-primary{ @apply px-2 py-1 text-sm border rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50; }
      `}</style>
    </div>
  );
};

const LogView = () => {
  const { lastOps } = useSmartAssistant();
  if (!lastOps?.length) return null;
  return (
    <div className="border rounded p-2 bg-gray-50">
      <div className="text-xs font-semibold mb-1">Actions</div>
      <ul className="text-xs space-y-1 max-h-40 overflow-auto">
        {lastOps.map((op,i)=>(<li key={i}>• {op}</li>))}
      </ul>
    </div>
  );
};

export default AiFinish;
