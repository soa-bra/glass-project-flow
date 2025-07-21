/**
 * AI Analysis Service with streaming capabilities
 * خدمة التحليل الذكي مع البث المباشر
 */

import { pipeline, env } from '@huggingface/transformers';

// تكوين transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface AnalysisResult {
  id: string;
  type: 'image' | 'text' | 'document';
  status: 'processing' | 'completed' | 'error';
  progress: number;
  results?: any;
  error?: string;
  timestamp: number;
}

export interface StreamingCallback {
  onProgress: (progress: number, message: string) => void;
  onResult: (result: any) => void;
  onError: (error: string) => void;
  onComplete: () => void;
}

class AIAnalysisService {
  private imageClassifier: any = null;
  private textAnalyzer: any = null;
  private imageSegmenter: any = null;
  private activeAnalyses = new Map<string, boolean>();

  /**
   * تهيئة النماذج
   */
  async initializeModels() {
    try {
      // تحميل نموذج تصنيف الصور
      if (!this.imageClassifier) {
        this.imageClassifier = await pipeline(
          'image-classification',
          'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
          { device: 'webgpu' }
        );
      }

      // تحميل نموذج تحليل النصوص
      if (!this.textAnalyzer) {
        this.textAnalyzer = await pipeline(
          'text-classification',
          'cardiffnlp/twitter-roberta-base-sentiment-latest',
          { device: 'webgpu' }
        );
      }

      // تحميل نموذج تقسيم الصور
      if (!this.imageSegmenter) {
        this.imageSegmenter = await pipeline(
          'image-segmentation',
          'Xenova/segformer-b0-finetuned-ade-512-512',
          { device: 'webgpu' }
        );
      }

      return true;
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      // إعادة المحاولة مع CPU
      try {
        this.imageClassifier = await pipeline(
          'image-classification',
          'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k'
        );
        return true;
      } catch (cpuError) {
        console.error('Failed to initialize AI models:', cpuError);
        return false;
      }
    }
  }

  /**
   * تحليل الصور مع streaming
   */
  async analyzeImage(
    imageFile: File,
    options: {
      includeClassification?: boolean;
      includeSegmentation?: boolean;
      includeObjectDetection?: boolean;
    } = {},
    callbacks: StreamingCallback
  ): Promise<AnalysisResult> {
    const analysisId = crypto.randomUUID();
    this.activeAnalyses.set(analysisId, true);

    const result: AnalysisResult = {
      id: analysisId,
      type: 'image',
      status: 'processing',
      progress: 0,
      timestamp: Date.now()
    };

    try {
      callbacks.onProgress(10, 'تحميل الصورة...');

      // تحويل الملف إلى URL
      const imageUrl = URL.createObjectURL(imageFile);
      
      callbacks.onProgress(20, 'تهيئة النماذج...');
      
      // التأكد من تهيئة النماذج
      const modelsReady = await this.initializeModels();
      if (!modelsReady) {
        throw new Error('فشل في تهيئة نماذج الذكاء الاصطناعي');
      }

      const analysisResults: any = {
        imageInfo: {
          name: imageFile.name,
          size: imageFile.size,
          type: imageFile.type
        }
      };

      let currentProgress = 30;

      // تصنيف الصور
      if (options.includeClassification !== false && this.imageClassifier) {
        if (!this.activeAnalyses.get(analysisId)) return result;
        
        callbacks.onProgress(currentProgress, 'تصنيف الصورة...');
        
        try {
          const classification = await this.imageClassifier(imageUrl);
          analysisResults.classification = classification.slice(0, 5); // أفضل 5 نتائج
          callbacks.onResult({ type: 'classification', data: classification });
        } catch (error) {
          console.warn('Image classification failed:', error);
        }
        
        currentProgress += 25;
      }

      // تقسيم الصورة
      if (options.includeSegmentation && this.imageSegmenter) {
        if (!this.activeAnalyses.get(analysisId)) return result;
        
        callbacks.onProgress(currentProgress, 'تقسيم الصورة...');
        
        try {
          const segmentation = await this.imageSegmenter(imageUrl);
          analysisResults.segmentation = segmentation;
          callbacks.onResult({ type: 'segmentation', data: segmentation });
        } catch (error) {
          console.warn('Image segmentation failed:', error);
        }
        
        currentProgress += 25;
      }

      // معلومات إضافية عن الصورة
      if (!this.activeAnalyses.get(analysisId)) return result;
      
      callbacks.onProgress(currentProgress, 'استخراج المعلومات...');
      
      const imageElement = await this.loadImageElement(imageUrl);
      analysisResults.dimensions = {
        width: imageElement.naturalWidth,
        height: imageElement.naturalHeight,
        aspectRatio: (imageElement.naturalWidth / imageElement.naturalHeight).toFixed(2)
      };

      // تنظيف
      URL.revokeObjectURL(imageUrl);
      
      callbacks.onProgress(100, 'اكتمل التحليل');
      
      result.status = 'completed';
      result.progress = 100;
      result.results = analysisResults;
      
      callbacks.onResult({ type: 'final', data: analysisResults });
      callbacks.onComplete();

      return result;

    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : 'خطأ غير معروف';
      callbacks.onError(result.error);
      return result;
    } finally {
      this.activeAnalyses.delete(analysisId);
    }
  }

  /**
   * تحليل النصوص مع streaming
   */
  async analyzeText(
    text: string,
    options: {
      includeSentiment?: boolean;
      includeKeywords?: boolean;
      includeSummary?: boolean;
    } = {},
    callbacks: StreamingCallback
  ): Promise<AnalysisResult> {
    const analysisId = crypto.randomUUID();
    this.activeAnalyses.set(analysisId, true);

    const result: AnalysisResult = {
      id: analysisId,
      type: 'text',
      status: 'processing',
      progress: 0,
      timestamp: Date.now()
    };

    try {
      callbacks.onProgress(10, 'معالجة النص...');

      const analysisResults: any = {
        textInfo: {
          length: text.length,
          wordCount: text.split(/\s+/).length,
          sentences: text.split(/[.!?]+/).length - 1
        }
      };

      let currentProgress = 20;

      // تحليل المشاعر
      if (options.includeSentiment !== false && this.textAnalyzer) {
        if (!this.activeAnalyses.get(analysisId)) return result;
        
        callbacks.onProgress(currentProgress, 'تحليل المشاعر...');
        
        try {
          // تقسيم النص إلى أجزاء صغيرة إذا كان طويلاً
          const maxLength = 512;
          const textChunks = text.length > maxLength ? 
            this.splitText(text, maxLength) : [text];
          
          const sentiments = [];
          for (const chunk of textChunks) {
            const sentiment = await this.textAnalyzer(chunk);
            sentiments.push(sentiment[0]);
          }
          
          analysisResults.sentiment = sentiments;
          callbacks.onResult({ type: 'sentiment', data: sentiments });
        } catch (error) {
          console.warn('Sentiment analysis failed:', error);
        }
        
        currentProgress += 30;
      }

      // استخراج الكلمات المفتاحية
      if (options.includeKeywords !== false) {
        if (!this.activeAnalyses.get(analysisId)) return result;
        
        callbacks.onProgress(currentProgress, 'استخراج الكلمات المفتاحية...');
        
        const keywords = this.extractKeywords(text);
        analysisResults.keywords = keywords;
        callbacks.onResult({ type: 'keywords', data: keywords });
        
        currentProgress += 25;
      }

      // ملخص بسيط
      if (options.includeSummary !== false && text.length > 200) {
        if (!this.activeAnalyses.get(analysisId)) return result;
        
        callbacks.onProgress(currentProgress, 'إنشاء الملخص...');
        
        const summary = this.generateSimpleSummary(text);
        analysisResults.summary = summary;
        callbacks.onResult({ type: 'summary', data: summary });
      }

      callbacks.onProgress(100, 'اكتمل التحليل');
      
      result.status = 'completed';
      result.progress = 100;
      result.results = analysisResults;
      
      callbacks.onResult({ type: 'final', data: analysisResults });
      callbacks.onComplete();

      return result;

    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : 'خطأ غير معروف';
      callbacks.onError(result.error);
      return result;
    } finally {
      this.activeAnalyses.delete(analysisId);
    }
  }

  /**
   * تحليل المستندات
   */
  async analyzeDocument(
    file: File,
    callbacks: StreamingCallback
  ): Promise<AnalysisResult> {
    const analysisId = crypto.randomUUID();
    
    const result: AnalysisResult = {
      id: analysisId,
      type: 'document',
      status: 'processing',
      progress: 0,
      timestamp: Date.now()
    };

    try {
      callbacks.onProgress(10, 'قراءة المستند...');

      let extractedText = '';
      
      if (file.type.startsWith('text/')) {
        extractedText = await file.text();
      } else {
        // يمكن إضافة دعم لـ PDF وDOCX لاحقاً
        throw new Error('نوع المستند غير مدعوم حالياً');
      }

      callbacks.onProgress(30, 'تحليل المحتوى...');

      // تحليل النص المستخرج
      return await this.analyzeText(extractedText, {
        includeSentiment: true,
        includeKeywords: true,
        includeSummary: true
      }, {
        onProgress: (progress, message) => {
          callbacks.onProgress(30 + (progress * 0.7), message);
        },
        onResult: callbacks.onResult,
        onError: callbacks.onError,
        onComplete: callbacks.onComplete
      });

    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : 'خطأ غير معروف';
      callbacks.onError(result.error);
      return result;
    }
  }

  /**
   * إلغاء التحليل
   */
  cancelAnalysis(analysisId: string): void {
    this.activeAnalyses.delete(analysisId);
  }

  /**
   * وظائف مساعدة
   */
  private async loadImageElement(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private splitText(text: string, maxLength: number): string[] {
    const chunks = [];
    for (let i = 0; i < text.length; i += maxLength) {
      chunks.push(text.substring(i, i + maxLength));
    }
    return chunks;
  }

  private extractKeywords(text: string): string[] {
    // استخراج بسيط للكلمات المفتاحية
    const words = text.toLowerCase()
      .replace(/[^\u0600-\u06FF\w\s]/g, '') // الاحتفاظ بالعربية والإنجليزية
      .split(/\s+/)
      .filter(word => word.length > 3);

    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private generateSimpleSummary(text: string): string {
    // ملخص بسيط بأخذ أول وآخر جملتين
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return text;
    
    const firstSentences = sentences.slice(0, 2).join('. ');
    const lastSentences = sentences.slice(-2).join('. ');
    
    return `${firstSentences}... ${lastSentences}`;
  }
}

export const aiAnalysisService = new AIAnalysisService();