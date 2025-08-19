
import React from "react";
import { cn } from "@/lib/utils";

export { ProjectManagementBoard } from './ProjectManagementBoard';
export { ProjectManagementHeader } from './ProjectManagementHeader';
export { ProjectProgressBar } from './ProjectProgressBar';
export { ProjectCardGrid } from './ProjectCardGrid';

export default function ProjectManagement() {
  return (
    <main
      className={cn(
        "h-[100dvh] flex flex-col overflow-hidden",
        "[padding-bottom:env(safe-area-inset-bottom)]"
      )}
    >
      {/* Header will be positioned by parent component */}
      <div className="flex-1 min-h-0">
        {/* Content will be rendered by ProjectManagementBoard */}
      </div>
    </main>
  );
}
