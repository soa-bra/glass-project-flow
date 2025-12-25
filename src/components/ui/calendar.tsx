import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      dir="rtl"
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:gap-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-[14px] font-[var(--ds-font-weight-medium)] text-[hsl(var(--ds-color-ink))]",
        nav: "gap-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-[hsl(var(--ds-color-border))]"
        ),
        nav_button_previous: "absolute right-1",
        nav_button_next: "absolute left-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-[hsl(var(--ds-color-ink-60))] rounded-[var(--ds-radius-chip)] w-9 font-normal text-[12px]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-[14px] p-0 relative [&:has([aria-selected].day-range-end)]:rounded-l-[var(--ds-radius-chip)] [&:has([aria-selected].day-outside)]:bg-[hsl(var(--ds-color-panel))]/50 [&:has([aria-selected])]:bg-[hsl(var(--ds-color-panel))] first:[&:has([aria-selected])]:rounded-r-[var(--ds-radius-chip)] last:[&:has([aria-selected])]:rounded-l-[var(--ds-radius-chip)] focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-[hsl(var(--ds-color-ink))]"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[hsl(var(--ds-color-ink))] text-[hsl(var(--ds-color-white))] hover:bg-[hsl(var(--ds-color-ink-80))] hover:text-[hsl(var(--ds-color-white))] focus:bg-[hsl(var(--ds-color-ink))] focus:text-[hsl(var(--ds-color-white))]",
        day_today: "bg-[hsl(var(--ds-color-panel))] text-[hsl(var(--ds-color-ink))]",
        day_outside:
          "day-outside text-[hsl(var(--ds-color-ink-30))] opacity-50 aria-selected:bg-[hsl(var(--ds-color-panel))]/50 aria-selected:text-[hsl(var(--ds-color-ink-60))] aria-selected:opacity-30",
        day_disabled: "text-[hsl(var(--ds-color-ink-30))] opacity-50",
        day_range_middle:
          "aria-selected:bg-[hsl(var(--ds-color-panel))] aria-selected:text-[hsl(var(--ds-color-ink))]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };