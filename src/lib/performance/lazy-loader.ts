// Lazy Loading Manager for Attachments
export interface LoadableAsset {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size?: number;
  loaded?: boolean;
  loading?: boolean;
  error?: string;
}

export class LazyLoader {
  private cache = new Map<string, HTMLElement | string>();
  private loadingPromises = new Map<string, Promise<any>>();
  private intersectionObserver: IntersectionObserver | null = null;
  private elementsToLoad = new Set<HTMLElement>();

  constructor(private threshold = 0.1) {
    this.initializeIntersectionObserver();
  }

  private initializeIntersectionObserver(): void {
    if (typeof window === 'undefined') return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const assetId = element.dataset.assetId;
            const assetUrl = element.dataset.assetUrl;
            const assetType = element.dataset.assetType as LoadableAsset['type'];

            if (assetId && assetUrl && assetType) {
              this.loadAsset({
                id: assetId,
                url: assetUrl,
                type: assetType
              }, element);
            }
          }
        });
      },
      { threshold: this.threshold }
    );
  }

  observeElement(element: HTMLElement, asset: LoadableAsset): void {
    if (!this.intersectionObserver) return;

    // Set data attributes for the observer
    element.dataset.assetId = asset.id;
    element.dataset.assetUrl = asset.url;
    element.dataset.assetType = asset.type;

    this.intersectionObserver.observe(element);
    this.elementsToLoad.add(element);
  }

  async loadAsset(asset: LoadableAsset, targetElement?: HTMLElement): Promise<any> {
    // Check cache first
    if (this.cache.has(asset.id)) {
      const cached = this.cache.get(asset.id);
      if (targetElement && cached instanceof HTMLElement) {
        this.replaceElement(targetElement, cached);
      }
      return cached;
    }

    // Check if already loading
    if (this.loadingPromises.has(asset.id)) {
      return this.loadingPromises.get(asset.id);
    }

    // Start loading
    const loadPromise = this.performLoad(asset);
    this.loadingPromises.set(asset.id, loadPromise);

    try {
      const result = await loadPromise;
      this.cache.set(asset.id, result);
      
      if (targetElement) {
        this.replaceElement(targetElement, result);
      }
      
      return result;
    } catch (error) {
      console.error(`Failed to load asset ${asset.id}:`, error);
      throw error;
    } finally {
      this.loadingPromises.delete(asset.id);
    }
  }

  private async performLoad(asset: LoadableAsset): Promise<HTMLElement | string> {
    switch (asset.type) {
      case 'image':
        return this.loadImage(asset.url);
      case 'video':
        return this.loadVideo(asset.url);
      case 'document':
        return this.loadDocument(asset.url);
      default:
        throw new Error(`Unsupported asset type: ${asset.type}`);
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      
      img.src = url;
    });
  }

  private loadVideo(url: string): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => resolve(video);
      video.onerror = () => reject(new Error(`Failed to load video: ${url}`));
      
      video.src = url;
    });
  }

  private async loadDocument(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to load document: ${url}`);
    }
  }

  private replaceElement(placeholder: HTMLElement, loaded: HTMLElement | string): void {
    if (loaded instanceof HTMLElement) {
      // Copy classes and styles from placeholder
      loaded.className = placeholder.className;
      if (placeholder.style.cssText) {
        loaded.style.cssText = placeholder.style.cssText;
      }
      
      placeholder.parentNode?.replaceChild(loaded, placeholder);
    } else if (typeof loaded === 'string') {
      placeholder.innerHTML = loaded;
    }
  }

  preloadAssets(assets: LoadableAsset[]): Promise<any[]> {
    return Promise.allSettled(
      assets.map(asset => this.loadAsset(asset))
    );
  }

  unobserveElement(element: HTMLElement): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(element);
      this.elementsToLoad.delete(element);
    }
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  destroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    this.clearCache();
    this.elementsToLoad.clear();
  }
}