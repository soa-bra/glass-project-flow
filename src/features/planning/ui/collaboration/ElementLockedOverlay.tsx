/**
 * ElementLockedOverlay — blocks pointer interactions on a locked element
 * and surfaces a clear Arabic message identifying the current editor.
 *
 * Wrap any editable element renderer:
 *   <ElementLockedOverlay state={lockState}>
 *     <MyEditor ... />
 *   </ElementLockedOverlay>
 *
 * When `state.isEditable` is true, this renders children as-is.
 */
import type { PropsWithChildren } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElementLockState } from "@/features/planning/hooks/useElementLockState";

interface ElementLockedOverlayProps extends PropsWithChildren {
  state: ElementLockState;
  className?: string;
}

export function ElementLockedOverlay({
  state,
  className,
  children,
}: ElementLockedOverlayProps) {
  if (state.isEditable) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      <div aria-disabled="true" className="pointer-events-none select-none opacity-60">
        {children}
      </div>
      <div
        role="alert"
        aria-live="polite"
        className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-background/40"
        onPointerDownCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onClickCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <div className="flex items-center gap-2 rounded-full border border-destructive/30 bg-background ps-3 pe-4 py-1.5 text-xs font-medium text-destructive shadow-sm">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          <span>{state.message}</span>
        </div>
      </div>
    </div>
  );
}
