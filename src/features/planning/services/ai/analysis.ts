// src/features/planning/services/ai/analysis.ts
export const analyzeScene = async (scene:any)=> {
  // تحليل بسيط: عدد العناصر + أنواعها
  const stats = scene.shapes.reduce((a:any,s:any)=>{ a[s.kind]=(a[s.kind]||0)+1; return a; },{});
  return { stats };
};
