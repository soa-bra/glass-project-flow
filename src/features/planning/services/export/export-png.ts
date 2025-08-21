// src/features/planning/services/export/export-png.ts
import { useCanvasStore } from '../../store/canvas.store';

export async function exportPNG({ background = '#fff', scale = 2 }: { background?: string; scale?: number } = {}) {
  const c = document.createElement('canvas');
  const base = document.querySelector<HTMLCanvasElement>('.canvas')!;
  const w = base.clientWidth, h = base.clientHeight;
  c.width = w*scale; c.height = h*scale;
  const ctx = c.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.fillStyle = background; ctx.fillRect(0,0,w,h);
  // snapshot من الـ DOM canvas الحالي
  ctx.drawImage(base, 0, 0, w, h);
  const blob = await new Promise<Blob|null>(res=>c.toBlob(res, 'image/png'));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'board.png'; a.click();
  URL.revokeObjectURL(url);
}
