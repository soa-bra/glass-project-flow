// src/features/planning/services/export/export-svg.ts
import { useCanvasStore } from '../../store/canvas.store';

export async function exportSVG() {
  const { scene } = useCanvasStore.getState();
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">`,
    `<rect width="100%" height="100%" fill="#fff"/>`,
    ...scene.shapes.map(s=>{
      if (s.kind==='rect') return `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="${s.style?.fill||'none'}" stroke="${s.style?.stroke||'#111'}"/>`;
      if (s.kind==='ellipse') return `<ellipse cx="${s.x+(s.w||0)/2}" cy="${s.y+(s.h||0)/2}" rx="${(s.w||0)/2}" ry="${(s.h||0)/2}" fill="${s.style?.fill||'none'}" stroke="${s.style?.stroke||'#111'}"/>`;
      if (s.kind==='path') return `<polyline fill="none" stroke="${s.style?.stroke||'#111'}" points="${(s.path||[]).map(p=>p.join(',')).join(' ')}"/>`;
      if (s.kind==='text') return `<text x="${s.x}" y="${s.y}" font-family="Inter" font-size="${(s as any).style?.fontSize||16}" fill="${s.style?.stroke||'#111'}">${escapeXml(s.text||'')}</text>`;
      return '';
    }),
    `</svg>`
  ].join('');
  const blob = new Blob([svg], {type:'image/svg+xml'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'board.svg'; a.click();
  URL.revokeObjectURL(url);
}

function escapeXml(s:string){ return s.replace(/[<>&'"]/g, c=>({ '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;' } as any)[c]); }
