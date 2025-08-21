"use client";
import React from "react";
import { useSmartAssistant } from "@/src/features/planning/hooks/useSmartAssistant";

const AiReview: React.FC = () => {
  const { review, insights, busy } = useSmartAssistant();
  return (
    <div className="p-3 space-y-3">
      <p className="text-sm">مراجعة التماسك والفجوات والأولويات، مع توصيات مرتبة بالأثر.</p>
      <button className="px-2 py-1 text-sm border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
        onClick={review} disabled={busy}>🔍 Analyze</button>
      <div className="space-y-2">
        {insights.map((g, i)=>(
          <div key={i} className="border rounded p-2">
            <div className="text-sm font-semibold">{g.title}</div>
            <ul className="text-xs list-disc ps-5">
              {g.items.map((it:any, idx:number)=>(
                <li key={idx}><span className="font-medium">{it.score}%</span> — {it.text}</li>
              ))}
            </ul>
          </div>
        ))}
        {insights.length===0 && <div className="text-xs text-gray-500">لا توجد توصيات بعد.</div>}
      </div>
    </div>
  );
};
export default AiReview;
