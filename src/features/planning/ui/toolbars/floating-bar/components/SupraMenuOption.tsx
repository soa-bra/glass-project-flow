import React from "react";
import { cn } from "@/lib/utils";

export const supraMenuOptionClassName =
  "rounded-full text-black transition-colors hover:bg-black/5 data-[highlighted]:bg-black/5 data-[state=checked]:bg-black data-[state=checked]:font-bold data-[state=checked]:text-white";

interface SupraMenuOptionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  selected?: boolean;
}

export const SupraMenuOption = React.forwardRef<HTMLButtonElement, SupraMenuOptionProps>(
  ({ icon, label, description, selected = false, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-right disabled:opacity-50",
        supraMenuOptionClassName,
        selected && "bg-black font-bold text-white hover:bg-black",
        className,
      )}
      {...props}
    >
      {icon ? <span className={cn("text-[hsl(var(--accent-green))]", selected && "text-white")}>{icon}</span> : null}
      <div className="flex-1">
        <div className={cn("text-[12px] font-medium", selected && "font-bold")}>{label}</div>
        {description ? <div className={cn("text-[10px] text-muted-foreground", selected && "text-white/75")}>{description}</div> : null}
        {children}
      </div>
    </button>
  ),
);

SupraMenuOption.displayName = "SupraMenuOption";
