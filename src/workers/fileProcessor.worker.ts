/**
 * Web Worker for file processing to avoid blocking the main thread
 * معالج الملفات في خيط منفصل لمنع تجميد الواجهة
 */

interface FileProcessingMessage {
  type: 'PROCESS_FILE' | 'CHUNK_FILE' | 'ANALYZE_IMAGE' | 'EXTRACT_TEXT';
  payload: any;
  id: string;
}

interface FileChunk {
  data: ArrayBuffer;
  index: number;
  total: number;
  fileName: string;
  fileType: string;
}

interface ProcessedResult {
  id: string;
  type: string;
  result: any;
  error?: string;
}

// Main message handler
self.onmessage = async (event: MessageEvent<FileProcessingMessage>) => {
  const { type, payload, id } = event.data;

  try {
    let result: any;

    switch (type) {
      case 'PROCESS_FILE':
        result = await processFile(payload);
        break;
      case 'CHUNK_FILE':
        result = await chunkFile(payload);
        break;
      case 'ANALYZE_IMAGE':
        result = await analyzeImage(payload);
        break;
      case 'EXTRACT_TEXT':
        result = await extractText(payload);
        break;
      default:
        throw new Error(`Unknown task type: ${type}`);
    }

    postMessage({
      id,
      type,
      result
    } as ProcessedResult);

  } catch (error) {
    postMessage({
      id,
      type,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ProcessedResult);
  }
};

/**
 * معالجة الملف العامة
 */
async function processFile(file: File): Promise<any> {
  const fileInfo = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  };

  // Create thumbnail for images
  if (file.type.startsWith('image/')) {
    const thumbnail = await createImageThumbnail(file);
    return {
      ...fileInfo,
      thumbnail,
      category: 'image'
    };
  }

  // Extract text for text files
  if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
    const text = await extractTextFromFile(file);
    return {
      ...fileInfo,
      textContent: text.substring(0, 500), // First 500 chars
      wordCount: text.split(/\s+/).length,
      category: 'text'
    };
  }

  // Handle PDF files
  if (file.type === 'application/pdf') {
    return {
      ...fileInfo,
      category: 'document',
      pages: 'تحليل PDF يتطلب مكتبة خاصة'
    };
  }

  return {
    ...fileInfo,
    category: 'other'
  };
}

/**
 * تقطيع الملف إلى chunks للتحميل المتدرج
 */
async function chunkFile(payload: { file: File; chunkSize: number }): Promise<FileChunk[]> {
  const { file, chunkSize } = payload;
  const chunks: FileChunk[] = [];
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    const arrayBuffer = await chunk.arrayBuffer();
    
    chunks.push({
      data: arrayBuffer,
      index: i,
      total: totalChunks,
      fileName: file.name,
      fileType: file.type
    });

    // إرسال تحديث التقدم
    postMessage({
      id: 'progress',
      type: 'CHUNK_PROGRESS',
      result: {
        processed: i + 1,
        total: totalChunks,
        percentage: ((i + 1) / totalChunks) * 100
      }
    });
  }

  return chunks;
}

/**
 * تحليل الصور
 */
async function analyzeImage(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const analysis = {
          width: img.width,
          height: img.height,
          aspectRatio: (img.width / img.height).toFixed(2),
          megapixels: ((img.width * img.height) / 1000000).toFixed(1),
          colorSpace: 'RGB', // تحليل أعمق يتطلب مكتبة خاصة
          hasTransparency: file.type === 'image/png'
        };

        resolve(analysis);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * إنشاء thumbnail للصور
 */
async function createImageThumbnail(file: File, maxSize = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = new OffscreenCanvas(maxSize, maxSize);
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // حساب النسب للحفاظ على aspect ratio
        let { width, height } = img;
        if (width > height) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // تحويل إلى base64
        canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 })
          .then(blob => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * استخراج النص من الملفات النصية
 */
async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target?.result as string || '');
    };
    
    reader.onerror = reject;
    reader.readAsText(file, 'utf-8');
  });
}

/**
 * استخراج النص من أنواع مختلفة من الملفات
 */
async function extractText(payload: { file: File; maxLength?: number }): Promise<any> {
  const { file, maxLength = 1000 } = payload;
  
  if (file.type.startsWith('text/')) {
    const text = await extractTextFromFile(file);
    return {
      content: text.substring(0, maxLength),
      fullLength: text.length,
      encoding: 'utf-8',
      lines: text.split('\n').length
    };
  }

  // يمكن إضافة دعم لأنواع أخرى مثل DOCX, PDF
  return {
    content: '',
    fullLength: 0,
    encoding: 'unknown',
    lines: 0,
    error: 'نوع ملف غير مدعوم لاستخراج النص'
  };
}

export {};