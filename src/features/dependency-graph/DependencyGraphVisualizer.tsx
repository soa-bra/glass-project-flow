/**
 * DependencyGraphVisualizer — تصوّر بصري لحواف dependencies بين الكيانات المركزية.
 * يستخدم SVG يدوي (دون مكتبة graph) لإبقاء البندل خفيفًا. كل كيان يُحدَّد بنوعه ولونه،
 * والأسهم تشير من from إلى to. Layout: دائري بسيط — مناسب حتى ~50 عقدة.
 */
import React, { useMemo } from "react";
import { useDependencies, useProjects, useEngineJobs } from "@/hooks/central";
import { AppCardSurface } from "@/components/shared/surfaces/AppCardSurface";
import { Network, Loader2 } from "lucide-react";
import type { CentralEntityType } from "@/types/central";

const ENTITY_COLORS: Record<CentralEntityType | string, string> = {
  project: "#3DA8F5",
  task: "#3DBE8B",
  tool: "#F6C445",
  engine_job: "#9B6DFF",
  central_board: "#0B0F12",
  department: "#E5564D",
};

interface Node { id: string; label: string; type: string; x: number; y: number; }

export const DependencyGraphVisualizer: React.FC = () => {
  const { data: deps = [], isLoading } = useDependencies();
  const { data: projects = [] } = useProjects();
  const { data: jobs = [] } = useEngineJobs();

  const labelMap = useMemo(() => {
    const m = new Map<string, string>();
    projects.forEach((p) => m.set(p.id, p.name));
    jobs.forEach((j) => m.set(j.id, j.name));
    return m;
  }, [projects, jobs]);

  const { nodes, width, height } = useMemo(() => {
    const seen = new Map<string, { id: string; type: string }>();
    deps.forEach((d) => {
      seen.set(d.from_entity_id, { id: d.from_entity_id, type: d.from_entity_type });
      seen.set(d.to_entity_id, { id: d.to_entity_id, type: d.to_entity_type });
    });
    const arr = Array.from(seen.values());
    const W = 720;
    const H = 480;
    const cx = W / 2;
    const cy = H / 2;
    const r = Math.min(W, H) / 2 - 60;
    const n = Math.max(arr.length, 1);
    const nodes: Node[] = arr.map((node, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return {
        id: node.id,
        type: node.type,
        label: labelMap.get(node.id) ?? `${node.type}:${node.id.slice(0, 6)}`,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      };
    });
    return { nodes, width: W, height: H };
  }, [deps, labelMap]);

  const nodeById = useMemo(() => {
    const m = new Map<string, Node>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center border border-border">
          <Network className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">خريطة التبعيات</h2>
          <p className="text-sm text-muted-foreground">
            {nodes.length} كيان · {deps.length} علاقة
          </p>
        </div>
      </header>

      <AppCardSurface className="p-4 overflow-auto">
        {nodes.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            لا توجد علاقات تبعية مسجّلة بعد.
          </div>
        ) : (
          <svg width={width} height={height} className="mx-auto block">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(11,15,18,0.5)" />
              </marker>
            </defs>
            {deps.map((d) => {
              const a = nodeById.get(d.from_entity_id);
              const b = nodeById.get(d.to_entity_id);
              if (!a || !b) return null;
              return (
                <line
                  key={d.id}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="rgba(11,15,18,0.35)"
                  strokeWidth={1.5}
                  markerEnd="url(#arrow)"
                />
              );
            })}
            {nodes.map((n) => {
              const color = ENTITY_COLORS[n.type] ?? "#6b7280";
              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={14} fill={color} stroke="white" strokeWidth={2} />
                  <text
                    x={n.x} y={n.y + 28}
                    textAnchor="middle"
                    fontSize={11}
                    fill="#0B0F12"
                    fontFamily="IBM Plex Sans Arabic, system-ui"
                  >
                    {n.label.slice(0, 22)}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          {Object.entries(ENTITY_COLORS).map(([k, c]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: c }} />
              <span className="text-muted-foreground">{k}</span>
            </div>
          ))}
        </div>
      </AppCardSurface>
    </div>
  );
};
