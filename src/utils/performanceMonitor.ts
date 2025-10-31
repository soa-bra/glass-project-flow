// Advanced Performance Monitoring for Canvas

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private fps: number[] = [];
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private isMonitoring: boolean = false;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.measureFPS();
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }

  private measureFPS() {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const delta = now - this.lastFrameTime;
    
    if (delta > 0) {
      const currentFPS = 1000 / delta;
      this.fps.push(currentFPS);
      
      // Keep only last 60 frames
      if (this.fps.length > 60) {
        this.fps.shift();
      }
    }

    this.lastFrameTime = now;
    this.frameCount++;

    requestAnimationFrame(() => this.measureFPS());
  }

  getAverageFPS(): number {
    if (this.fps.length === 0) return 0;
    const sum = this.fps.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fps.length);
  }

  measureOperation<T>(label: string, operation: () => T): T {
    const start = performance.now();
    const result = operation();
    const duration = performance.now() - start;

    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    const operations = this.metrics.get(label)!;
    operations.push(duration);
    
    // Keep only last 100 measurements
    if (operations.length > 100) {
      operations.shift();
    }

    return result;
  }

  async measureAsyncOperation<T>(label: string, operation: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await operation();
    const duration = performance.now() - start;

    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    const operations = this.metrics.get(label)!;
    operations.push(duration);
    
    if (operations.length > 100) {
      operations.shift();
    }

    return result;
  }

  getMetricStats(label: string) {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) {
      return { avg: 0, min: 0, max: 0, count: 0 };
    }

    const sum = values.reduce((a, b) => a + b, 0);
    return {
      avg: Math.round(sum / values.length * 100) / 100,
      min: Math.round(Math.min(...values) * 100) / 100,
      max: Math.round(Math.max(...values) * 100) / 100,
      count: values.length
    };
  }

  getAllMetrics() {
    const result: Record<string, any> = {
      fps: this.getAverageFPS(),
      frameCount: this.frameCount
    };

    this.metrics.forEach((_, label) => {
      result[label] = this.getMetricStats(label);
    });

    return result;
  }

  checkPerformanceIssues(): string[] {
    const issues: string[] = [];
    const avgFPS = this.getAverageFPS();

    if (avgFPS < 30 && avgFPS > 0) {
      issues.push(`Low FPS detected: ${avgFPS} FPS`);
    }

    this.metrics.forEach((values, label) => {
      const stats = this.getMetricStats(label);
      if (stats.avg > 100) {
        issues.push(`Slow operation \"${label}\": ${stats.avg}ms average`);
      }
      if (stats.max > 500) {
        issues.push(`Very slow operation \"${label}\": ${stats.max}ms maximum`);
      }
    });

    return issues;
  }

  reset() {
    this.metrics.clear();
    this.fps = [];
    this.frameCount = 0;
  }

  getReport(): string {
    const metrics = this.getAllMetrics();
    const issues = this.checkPerformanceIssues();
    
    let report = '=== Performance Report ===\n\n';
    report += `Average FPS: ${metrics.fps}\n`;
    report += `Total Frames: ${metrics.frameCount}\n\n`;
    
    report += 'Operation Timings:\n';
    Object.keys(metrics).forEach(key => {
      if (key !== 'fps' && key !== 'frameCount') {
        const stat = metrics[key];
        report += `  ${key}:\n`;
        report += `    Average: ${stat.avg}ms\n`;
        report += `    Min: ${stat.min}ms\n`;
        report += `    Max: ${stat.max}ms\n`;
        report += `    Count: ${stat.count}\n`;
      }
    });

    if (issues.length > 0) {
      report += '\nPerformance Issues:\n';
      issues.forEach(issue => {
        report += `  ⚠️ ${issue}\n`;
      });
    } else {
      report += '\n✅ No performance issues detected\n';
    }

    return report;
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
