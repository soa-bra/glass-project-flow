import React from "react";
import type { Guides } from "@/src/features/planning/types/canvas";

export function SvgOverlays({ width, height, guides }:{ width:number;height:number; guides:Guides }){
  return (
    <svg width={width} height={height} style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
      {/* Guides */}
      {guides.v.map((x,i)=> <line key={`v-${i}`} x1={x} y1={0} x2={x} y2={height} stroke="#38bdf8" strokeDasharray="4 4"/>)}
      {guides.h.map((y,i)=> <line key={`h-${i}`} x1={0} y1={y} x2={width} y2={y} stroke="#38bdf8" strokeDasharray="4 4"/>)}
    </svg>
  );
}
