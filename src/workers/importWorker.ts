/**
 * Import Worker - معالجة الاستيراد في خيط منفصل
 */

interface ImportMessage {
  type: 'PARSE_JSON' | 'PARSE_SVG' | 'VALIDATE_DATA';
  payload: { data: string };
  id: string;
}

self.onmessage = async (event: MessageEvent<ImportMessage>) => {
  const { type, payload, id } = event.data;

  try {
    let result: any;
    switch (type) {
      case 'PARSE_JSON': result = parseJSON(payload.data); break;
      case 'VALIDATE_DATA': result = validateImportData(payload.data); break;
    }
    postMessage({ id, type, result, success: true });
  } catch (error) {
    postMessage({ id, type, error: error instanceof Error ? error.message : 'Unknown error', success: false });
  }
};

function parseJSON(jsonString: string) {
  const data = JSON.parse(jsonString);
  if (!data.elements || !Array.isArray(data.elements)) throw new Error('Invalid canvas data format');
  
  return {
    elements: data.elements.map((el: any) => ({
      ...el,
      id: el.id || crypto.randomUUID(),
      position: el.position || { x: 0, y: 0 },
      size: el.size || { width: 100, height: 100 }
    })),
    metadata: data.metadata || {},
    version: data.version || '1.0'
  };
}

function validateImportData(jsonString: string) {
  try {
    const data = JSON.parse(jsonString);
    const errors: string[] = [], warnings: string[] = [];
    
    if (!data.elements) errors.push('Missing elements array');
    data.elements?.forEach((el: any, i: number) => {
      if (!el.type) errors.push(`Element ${i}: missing type`);
      if (!el.position) warnings.push(`Element ${i}: missing position`);
    });
    
    return { valid: errors.length === 0, errors, warnings };
  } catch {
    return { valid: false, errors: ['Invalid JSON'], warnings: [] };
  }
}

export {};
