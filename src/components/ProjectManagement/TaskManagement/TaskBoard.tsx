import React from "react";
import TaskColumn from "./TaskColumn";

export default function TaskBoard() {
  return (
    <div className="h-full min-h-0 flex gap-3 px-3 py-3 w-max">
      <TaskColumn title="قيد التنفيذ" />
      <TaskColumn title="تحت التجهيز" />
      <TaskColumn title="متأخرة" />
      {/* أضف أعمدة أخرى حسب الحاجة */}
    </div>
  );
}