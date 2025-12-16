// src/pages/Index.tsx
import React from "react";
import InfiniteCanvas from "@/components/Planning/InfiniteCanvas";

export default function Index() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <InfiniteCanvas boardId="soaBra-board" />
    </div>
  );
}
