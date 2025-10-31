import React from "react";
import { Lightbulb, Brain, Zap, Target } from "lucide-react";

export default function SmartElementsPanel() {
  const smartElements = [
    { id: "mindmap", label: "خريطة ذهنية", icon: <Brain className="w-5 h-5" /> },
    { id: "flowchart", label: "مخطط انسيابي", icon: <Zap className="w-5 h-5" /> },
    { id: "timeline", label: "جدول زمني", icon: <Target className="w-5 h-5" /> },
    { id: "kanban", label: "لوحة كانبان", icon: <Lightbulb className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[hsl(var(--ink))]">عناصر ذكية</h3>
      
      <div className="space-y-2">
        {smartElements.map(element => (
          <button
            key={element.id}
            className="w-full flex items-center gap-3 p-3 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--accent-green))] hover:text-white rounded-lg transition-all group"
          >
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20">
              {element.icon}
            </div>
            <span className="text-sm font-medium">{element.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-br from-[hsl(var(--accent-green))]/10 to-[hsl(var(--accent-blue))]/10 rounded-lg">
        <p className="text-sm text-[hsl(var(--ink-60))] mb-3">
          العناصر الذكية تستخدم الذكاء الصناعي لتنظيم المحتوى تلقائيًا
        </p>
        <button className="w-full px-4 py-2 bg-[hsl(var(--accent-green))] text-white rounded-lg text-sm hover:opacity-90">
          إنشاء عنصر ذكي
        </button>
      </div>
    </div>
  );
}
