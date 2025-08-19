// Web Worker for heavy file processing operations
export {};

interface FileProcessingTask {
  id: string;
  type: 'image-resize' | 'image-optimize' | 'svg-parse' | 'large-file-chunk';
  data: any;
}

interface ProcessingResult {
  id: string;
  success: boolean;
  data?: any;
  error?: string;
}

self.onmessage = function(e: MessageEvent<FileProcessingTask>) {
  const task = e.data;
  
  try {
    switch (task.type) {
      case 'image-resize':
        handleImageResize(task);
        break;
      case 'image-optimize':
        handleImageOptimize(task);
        break;
      case 'svg-parse':
        handleSVGParse(task);
        break;
      case 'large-file-chunk':
        handleLargeFileChunk(task);
        break;
      default:
        sendError(task.id, `Unknown task type: ${task.type}`);
    }
  } catch (error) {
    sendError(task.id, error instanceof Error ? error.message : 'Processing failed');
  }
};

async function handleImageResize(task: FileProcessingTask): Promise<void> {
  const { file, maxWidth, maxHeight, quality } = task.data;
  
  const canvas = new OffscreenCanvas(maxWidth, maxHeight);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    sendError(task.id, 'Could not create canvas context');
    return;
  }
  
  try {
    const bitmap = await createImageBitmap(file);
    
    // Calculate new dimensions maintaining aspect ratio
    const scale = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height);
    const newWidth = bitmap.width * scale;
    const newHeight = bitmap.height * scale;
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);
    
    const blob = await canvas.convertToBlob({ 
      type: 'image/jpeg', 
      quality: quality || 0.8 
    });
    
    sendSuccess(task.id, { 
      blob, 
      width: newWidth, 
      height: newHeight,
      originalSize: file.size,
      newSize: blob.size
    });
    
  } catch (error) {
    sendError(task.id, `Image resize failed: ${error}`);
  }
}

async function handleImageOptimize(task: FileProcessingTask): Promise<void> {
  const { file, quality, format } = task.data;
  
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      sendError(task.id, 'Could not create canvas context');
      return;
    }
    
    ctx.drawImage(bitmap, 0, 0);
    
    const blob = await canvas.convertToBlob({ 
      type: format || 'image/jpeg', 
      quality: quality || 0.8 
    });
    
    sendSuccess(task.id, { 
      blob, 
      originalSize: file.size, 
      newSize: blob.size,
      compressionRatio: (1 - blob.size / file.size) * 100
    });
    
  } catch (error) {
    sendError(task.id, `Image optimization failed: ${error}`);
  }
}

function handleSVGParse(task: FileProcessingTask): void {
  const { svgText } = task.data;
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    
    const svgElement = doc.querySelector('svg');
    if (!svgElement) {
      sendError(task.id, 'Invalid SVG: No SVG element found');
      return;
    }
    
    // Extract basic SVG information
    const width = svgElement.getAttribute('width');
    const height = svgElement.getAttribute('height');
    const viewBox = svgElement.getAttribute('viewBox');
    
    // Count elements
    const paths = doc.querySelectorAll('path').length;
    const circles = doc.querySelectorAll('circle').length;
    const rects = doc.querySelectorAll('rect').length;
    const texts = doc.querySelectorAll('text').length;
    
    sendSuccess(task.id, {
      dimensions: { width, height, viewBox },
      elementCounts: { paths, circles, rects, texts },
      isValid: true
    });
    
  } catch (error) {
    sendError(task.id, `SVG parsing failed: ${error}`);
  }
}

function handleLargeFileChunk(task: FileProcessingTask): void {
  const { chunk, chunkIndex, totalChunks, operation } = task.data;
  
  try {
    let result;
    
    switch (operation) {
      case 'hash':
        result = generateChunkHash(chunk);
        break;
      case 'compress':
        result = compressChunk(chunk);
        break;
      default:
        sendError(task.id, `Unknown chunk operation: ${operation}`);
        return;
    }
    
    sendSuccess(task.id, {
      chunkIndex,
      totalChunks,
      result,
      progress: ((chunkIndex + 1) / totalChunks) * 100
    });
    
  } catch (error) {
    sendError(task.id, `Chunk processing failed: ${error}`);
  }
}

function generateChunkHash(chunk: ArrayBuffer): string {
  // Simple hash function for demo - in production use crypto.subtle
  let hash = 0;
  const view = new Uint8Array(chunk);
  
  for (let i = 0; i < view.length; i++) {
    hash = ((hash << 5) - hash + view[i]) & 0xffffffff;
  }
  
  return hash.toString(16);
}

function compressChunk(chunk: ArrayBuffer): ArrayBuffer {
  // Simple compression simulation - in production use actual compression
  const view = new Uint8Array(chunk);
  const compressed = new Uint8Array(Math.floor(view.length * 0.7)); // Simulate 30% compression
  
  for (let i = 0; i < compressed.length; i++) {
    compressed[i] = view[i] || 0;
  }
  
  return compressed.buffer;
}

function sendSuccess(id: string, data: any): void {
  const result: ProcessingResult = {
    id,
    success: true,
    data
  };
  
  self.postMessage(result);
}

function sendError(id: string, error: string): void {
  const result: ProcessingResult = {
    id,
    success: false,
    error
  };
  
  self.postMessage(result);
}