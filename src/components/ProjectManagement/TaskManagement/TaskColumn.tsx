import React from "react";

export default function TaskColumn({ title }: { title: string }) {
  return (
    <section className="h-[calc(100%)] w-[clamp(260px,26vw,360px)] flex flex-col border bg-card rounded-t-2xl [border-bottom-left-radius:2px] [border-bottom-right-radius:2px]">
      {/* رأس العمود ثابت */}
      <header className="sticky top-0 z-10 px-3 py-2 border-b bg-card/95 backdrop-blur">
        <h3 className="text-sm font-medium">{title}</h3>
      </header>

      {/* البطاقات تتمرّر عموديًا */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
        {/* TODO: ضع بطاقات المهام هنا */}
        <div className="p-3 bg-background border rounded-lg">
          <p className="text-sm">مهمة تجريبية</p>
        </div>
        <div className="p-3 bg-background border rounded-lg">
          <p className="text-sm">مهمة أخرى</p>
        </div>
      </div>
    </section>
  );
}