/**
 * Export Worker - معالجة التصدير في خيط منفصل
 */

interface ExportMessage {
  type: 'EXPORT_PNG' | 'EXPORT_SVG' | 'EXPORT_JSON';
  payload: {
    elements: any[];
    options: {
      width: number;
      height: number;
      scale: number;
      background: string;
      quality?: number;
    };
  };
  id: string;
}

self.onmessage = async (event: MessageEvent<ExportMessage>) => {
  const { type, payload, id } = event.data;

  try {
    let result: any;

    switch (type) {
      case 'EXPORT_PNG':
        result = await exportToPNG(payload.elements, payload.options);
        break;
      case 'EXPORT_SVG':
        result = exportToSVG(payload.elements, payload.options);
        break;
      case 'EXPORT_JSON':
        result = exportToJSON(payload.elements);
        break;
    }

    postMessage({ id, type, result, success: true });
  } catch (error) {
    postMessage({ 
      id, 
      type, 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    });
  }
};

async function exportToPNG(elements: any[], options: any): Promise<string> {
  const canvas = new OffscreenCanvas(
    options.width * options.scale,
    options.height * options.scale
  );
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = options.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(options.scale, options.scale);
  
  for (const element of elements) {
    await renderElement(ctx, element);
  }
  
  const blob = await canvas.convertToBlob({ type: 'image/png', quality: options.quality || 0.92 });
  return URL.createObjectURL(blob);
}

async function renderElement(ctx: OffscreenCanvasRenderingContext2D, element: any) {
  const { position, size, type, style } = element;
  
  ctx.save();
  ctx.translate(position.x, position.y);
  
  if (type === 'shape') {
    ctx.fillStyle = style?.backgroundColor || '#3DBE8B';
    ctx.fillRect(0, 0, size.width, size.height);
  } else if (type === 'text') {
    ctx.fillStyle = element.color || '#0B0F12';
    ctx.font = `${element.fontSize || 16}px ${element.fontFamily || 'sans-serif'}`;
    ctx.fillText(element.content || '', 0, size.height / 2);
  }
  
  ctx.restore();
}

function exportToSVG(elements: any[], options: any): string {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}">`;
  svg += `<rect width="100%" height="100%" fill="${options.background}"/>`;
  
  for (const el of elements) {
    if (el.type === 'shape') {
      svg += `<rect x="${el.position.x}" y="${el.position.y}" width="${el.size.width}" height="${el.size.height}" fill="${el.style?.backgroundColor || '#3DBE8B'}"/>`;
    } else if (el.type === 'text') {
      svg += `<text x="${el.position.x}" y="${el.position.y + el.size.height / 2}" fill="${el.color || '#0B0F12'}">${el.content || ''}</text>`;
    }
  }
  
  svg += '</svg>';
  return svg;
}

function exportToJSON(elements: any[]): string {
  return JSON.stringify({ elements, version: '1.0', exportedAt: new Date().toISOString() }, null, 2);
}

export {};
