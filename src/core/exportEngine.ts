/**
 * Export Engine - Sprint 9 Enhanced
 * نظام التصدير متعدد الصيغ مع دعم RTL والخطوط العربية
 */

import jsPDF from "jspdf";
import { imageToBase64, getImageFormat, isValidBase64Image } from "@/utils/imageUtils";
import { containsArabic, loadArabicFont, ARABIC_FONT_CONFIG } from "./fonts/arabicFonts";

// أنواع التصدير المدعومة
export type ExportFormat = "pdf" | "png" | "svg" | "json";

// خيارات التصدير
export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  quality?: number;
  scale?: number;
  background?: string;
  padding?: number;
  includeMetadata?: boolean;
  // خيارات جديدة
  embedImages?: boolean;
  rtlSupport?: boolean;
  multiPage?: boolean;
  pageSize?: "A4" | "A3" | "Letter" | "Auto";
  margins?: { top: number; right: number; bottom: number; left: number };
}

// بيانات العنصر للتصدير
export interface ExportableElement {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: string;
  style?: Record<string, unknown>;
  rotation?: number;
  metadata?: Record<string, unknown>;
}

// نتيجة التصدير
export interface ExportResult {
  success: boolean;
  data?: string | Blob;
  filename?: string;
  error?: string;
  stats?: {
    elementsCount: number;
    pagesCount?: number;
    imagesEmbedded?: number;
  };
}

// أحجام الصفحات بالبكسل
const PAGE_SIZES = {
  A4: { width: 595, height: 842 },
  A3: { width: 842, height: 1191 },
  Letter: { width: 612, height: 792 },
};

/**
 * Export Engine Class
 */
export class ExportEngine {
  private defaultOptions: Partial<ExportOptions> = {
    quality: 0.92,
    scale: 2,
    background: "#FFFFFF",
    padding: 20,
    includeMetadata: true,
    embedImages: true,
    rtlSupport: true,
    multiPage: true,
    pageSize: "A4",
    margins: { top: 40, right: 40, bottom: 40, left: 40 },
  };

  private imageCache: Map<string, string> = new Map();

  /**
   * تصدير العناصر بالصيغة المحددة
   */
  async export(elements: ExportableElement[], options: ExportOptions): Promise<ExportResult> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const filename = mergedOptions.filename || `canvas-export-${Date.now()}`;

    try {
      // تحميل الخط العربي إذا كان مطلوبًا
      if (mergedOptions.rtlSupport) {
        await loadArabicFont();
      }

      switch (mergedOptions.format) {
        case "pdf":
          return await this.exportToPDF(elements, filename, mergedOptions);
        case "png":
          return await this.exportToPNG(elements, filename, mergedOptions);
        case "svg":
          return await this.exportToSVG(elements, filename, mergedOptions);
        case "json":
          return this.exportToJSON(elements, filename, mergedOptions);
        default:
          return { success: false, error: "صيغة غير مدعومة" };
      }
    } catch (error) {
      console.error("Export error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "خطأ في التصدير",
      };
    }
  }

  /**
   * حساب حدود العناصر
   */
  private calculateBounds(
    elements: ExportableElement[],
    padding: number = 0,
  ): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  } {
    if (elements.length === 0) {
      return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach((el) => {
      minX = Math.min(minX, el.position.x);
      minY = Math.min(minY, el.position.y);
      maxX = Math.max(maxX, el.position.x + el.size.width);
      maxY = Math.max(maxY, el.position.y + el.size.height);
    });

    return {
      minX: minX - padding,
      minY: minY - padding,
      maxX: maxX + padding,
      maxY: maxY + padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    };
  }

  /**
   * التصدير إلى PDF مع دعم متعدد الصفحات
   */
  private async exportToPDF(
    elements: ExportableElement[],
    filename: string,
    options: Partial<ExportOptions>,
  ): Promise<ExportResult> {
    const bounds = this.calculateBounds(elements, options.padding);
    const margins = options.margins || { top: 40, right: 40, bottom: 40, left: 40 };

    let imagesEmbedded = 0;
    let pagesCount = 1;

    // تحديد حجم الصفحة
    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === "Auto" || !options.multiPage) {
      pageWidth = bounds.width;
      pageHeight = bounds.height;
    } else {
      const size = PAGE_SIZES[options.pageSize || "A4"];
      pageWidth = size.width;
      pageHeight = size.height;
    }

    // حساب اتجاه الصفحة
    const orientation = bounds.width > bounds.height ? "landscape" : "portrait";

    // إنشاء PDF
    const pdf = new jsPDF({
      orientation,
      unit: "px",
      format: options.pageSize === "Auto" ? [pageWidth, pageHeight] : options.pageSize?.toLowerCase(),
    });

    // حساب الصفحات المطلوبة
    if (options.multiPage && options.pageSize !== "Auto") {
      const contentWidth = pageWidth - margins.left - margins.right;
      const contentHeight = pageHeight - margins.top - margins.bottom;

      const pagesX = Math.ceil(bounds.width / contentWidth);
      const pagesY = Math.ceil(bounds.height / contentHeight);
      pagesCount = pagesX * pagesY;

      // رسم كل صفحة
      for (let py = 0; py < pagesY; py++) {
        for (let px = 0; px < pagesX; px++) {
          if (px > 0 || py > 0) {
            pdf.addPage();
          }

          // رسم الخلفية
          if (options.background) {
            pdf.setFillColor(options.background);
            pdf.rect(0, 0, pageWidth, pageHeight, "F");
          }

          const offsetX = bounds.minX + px * contentWidth;
          const offsetY = bounds.minY + py * contentHeight;

          // رسم العناصر في هذه الصفحة
          for (const element of elements) {
            const elX = element.position.x - offsetX + margins.left;
            const elY = element.position.y - offsetY + margins.top;

            // تحقق من أن العنصر في هذه الصفحة
            if (
              elX + element.size.width > 0 &&
              elX < contentWidth + margins.left &&
              elY + element.size.height > 0 &&
              elY < contentHeight + margins.top
            ) {
              const embedded = await this.drawElementToPDF(pdf, element, elX, elY, options);
              if (embedded) imagesEmbedded++;
            }
          }
        }
      }
    } else {
      // صفحة واحدة
      if (options.background) {
        pdf.setFillColor(options.background);
        pdf.rect(0, 0, pageWidth, pageHeight, "F");
      }

      for (const element of elements) {
        const x = element.position.x - bounds.minX;
        const y = element.position.y - bounds.minY;
        const embedded = await this.drawElementToPDF(pdf, element, x, y, options);
        if (embedded) imagesEmbedded++;
      }
    }

    // إضافة البيانات الوصفية
    if (options.includeMetadata) {
      pdf.setProperties({
        title: filename,
        creator: "SoaBra Canvas",
        subject: "Canvas Export",
      });
    }

    // حفظ الملف
    const pdfBlob = pdf.output("blob");
    this.downloadBlob(pdfBlob, `${filename}.pdf`);

    return {
      success: true,
      data: pdfBlob,
      filename: `${filename}.pdf`,
      stats: {
        elementsCount: elements.length,
        pagesCount,
        imagesEmbedded,
      },
    };
  }

  /**
   * رسم عنصر في PDF مع دعم الصور والـ RTL
   */
  private async drawElementToPDF(
    pdf: jsPDF,
    element: ExportableElement,
    x: number,
    y: number,
    options: Partial<ExportOptions>,
  ): Promise<boolean> {
    const { width, height } = element.size;
    const style = element.style || {};
    let imageEmbedded = false;

    switch (element.type) {
      case "text":
        const text = element.content || "";
        const fontSize = Number(style.fontSize) || 14;
        const isArabic = containsArabic(text);

        pdf.setFontSize(fontSize);
        pdf.setTextColor(String(style.color || "#000000"));

        if (isArabic && options.rtlSupport) {
          // محاذاة من اليمين للنص العربي
          pdf.text(text, x + width, y + fontSize, {
            align: "right",
          });
        } else {
          pdf.text(text, x, y + fontSize);
        }
        break;

      case "shape":
        const shapeType = String(style.shapeType || "rectangle");
        pdf.setFillColor(String(style.fillColor || "#3DBE8B"));

        const strokeColor = String(style.strokeColor || "transparent");
        if (strokeColor !== "transparent") {
          pdf.setDrawColor(strokeColor);
          pdf.setLineWidth(Number(style.strokeWidth) || 1);
        }

        if (shapeType === "circle" || shapeType === "ellipse") {
          pdf.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, "F");
        } else if (shapeType === "triangle") {
          pdf.triangle(x + width / 2, y, x, y + height, x + width, y + height, "F");
        } else {
          pdf.rect(x, y, width, height, "F");
        }
        break;

      case "sticky_note":
        pdf.setFillColor(String(style.fillColor || "#F6C445"));
        pdf.rect(x, y, width, height, "F");

        if (element.content) {
          pdf.setFontSize(12);
          pdf.setTextColor("#000000");

          const noteText = element.content;
          const isNoteArabic = containsArabic(noteText);

          if (isNoteArabic && options.rtlSupport) {
            pdf.text(noteText, x + width - 8, y + 20, {
              maxWidth: width - 16,
              align: "right",
            });
          } else {
            pdf.text(noteText, x + 8, y + 20, { maxWidth: width - 16 });
          }
        }
        break;

      case "image":
        if (options.embedImages) {
          const src = String(style.src || "");
          if (src) {
            try {
              // تحميل الصورة وتحويلها لـ Base64
              let base64 = this.imageCache.get(src);

              if (!base64) {
                base64 = await imageToBase64(src);
                this.imageCache.set(src, base64);
              }

              if (isValidBase64Image(base64)) {
                const format = getImageFormat(base64);
                pdf.addImage(base64, format, x, y, width, height);
                imageEmbedded = true;
              }
            } catch (error) {
              console.warn("فشل تضمين الصورة:", error);
              // رسم placeholder
              this.drawImagePlaceholder(pdf, x, y, width, height);
            }
          } else {
            this.drawImagePlaceholder(pdf, x, y, width, height);
          }
        } else {
          this.drawImagePlaceholder(pdf, x, y, width, height);
        }
        break;

      default:
        pdf.setFillColor("#CCCCCC");
        pdf.rect(x, y, width, height, "F");
    }

    return imageEmbedded;
  }

  /**
   * رسم placeholder للصورة
   */
  private drawImagePlaceholder(pdf: jsPDF, x: number, y: number, width: number, height: number): void {
    pdf.setFillColor("#E0E0E0");
    pdf.rect(x, y, width, height, "F");
    pdf.setFontSize(10);
    pdf.setTextColor("#666666");
    pdf.text("صورة", x + width / 2, y + height / 2, { align: "center" });
  }

  /**
   * التصدير إلى PNG
   */
  private async exportToPNG(
    elements: ExportableElement[],
    filename: string,
    options: Partial<ExportOptions>,
  ): Promise<ExportResult> {
    const bounds = this.calculateBounds(elements, options.padding);
    const scale = options.scale || 2;

    const canvas = document.createElement("canvas");
    canvas.width = bounds.width * scale;
    canvas.height = bounds.height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return { success: false, error: "فشل إنشاء Canvas" };
    }

    ctx.scale(scale, scale);

    // رسم الخلفية
    ctx.fillStyle = options.background || "#FFFFFF";
    ctx.fillRect(0, 0, bounds.width, bounds.height);

    // رسم العناصر
    for (const element of elements) {
      const x = element.position.x - bounds.minX;
      const y = element.position.y - bounds.minY;
      await this.drawElementToCanvas(ctx, element, x, y, options);
    }

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            this.downloadBlob(blob, `${filename}.png`);
            resolve({
              success: true,
              data: blob,
              filename: `${filename}.png`,
              stats: { elementsCount: elements.length },
            });
          } else {
            resolve({ success: false, error: "فشل إنشاء الصورة" });
          }
        },
        "image/png",
        options.quality,
      );
    });
  }

  /**
   * رسم عنصر في Canvas
   */
  private async drawElementToCanvas(
    ctx: CanvasRenderingContext2D,
    element: ExportableElement,
    x: number,
    y: number,
    options: Partial<ExportOptions>,
  ): Promise<void> {
    const { width, height } = element.size;
    const style = element.style || {};

    ctx.save();

    // تطبيق الدوران
    if (element.rotation) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-(x + width / 2), -(y + height / 2));
    }

    switch (element.type) {
      case "text":
        const text = element.content || "";
        const fontSize = Number(style.fontSize) || 14;
        const isArabic = containsArabic(text);

        ctx.font = `${style.fontWeight || "normal"} ${fontSize}px ${ARABIC_FONT_CONFIG.fontFamily}`;
        ctx.fillStyle = String(style.color || "#000000");
        ctx.textBaseline = "top";

        if (isArabic && options.rtlSupport) {
          ctx.direction = "rtl";
          ctx.textAlign = "right";
          ctx.fillText(text, x + width, y);
        } else {
          ctx.fillText(text, x, y);
        }
        break;

      case "shape":
        const shapeType = String(style.shapeType || "rectangle");
        ctx.fillStyle = String(style.fillColor || "#3DBE8B");
        ctx.strokeStyle = String(style.strokeColor || "transparent");
        ctx.lineWidth = Number(style.strokeWidth || 0);

        ctx.beginPath();
        if (shapeType === "circle" || shapeType === "ellipse") {
          ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
        } else if (shapeType === "triangle") {
          ctx.moveTo(x + width / 2, y);
          ctx.lineTo(x, y + height);
          ctx.lineTo(x + width, y + height);
          ctx.closePath();
        } else {
          ctx.rect(x, y, width, height);
        }
        ctx.fill();
        if (Number(style.strokeWidth) > 0) {
          ctx.stroke();
        }
        break;

      case "sticky_note":
        ctx.fillStyle = String(style.fillColor || "#F6C445");
        ctx.shadowColor = "rgba(0,0,0,0.1)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        ctx.fillRect(x, y, width, height);
        ctx.shadowColor = "transparent";

        if (element.content) {
          const noteText = element.content;
          const isNoteArabic = containsArabic(noteText);

          ctx.fillStyle = "#000000";
          ctx.font = `12px ${ARABIC_FONT_CONFIG.fontFamily}`;

          if (isNoteArabic && options.rtlSupport) {
            ctx.direction = "rtl";
            ctx.textAlign = "right";
            ctx.fillText(noteText, x + width - 8, y + 20);
          } else {
            ctx.fillText(noteText, x + 8, y + 20);
          }
        }
        break;

      case "image":
        if (options.embedImages && style.src) {
          try {
            const img = new Image();
            img.crossOrigin = "anonymous";

            await new Promise<void>((resolve, reject) => {
              img.onload = () => {
                ctx.drawImage(img, x, y, width, height);
                resolve();
              };
              img.onerror = reject;
              img.src = String(style.src);
            });
          } catch {
            ctx.fillStyle = "#E0E0E0";
            ctx.fillRect(x, y, width, height);
          }
        } else {
          ctx.fillStyle = "#E0E0E0";
          ctx.fillRect(x, y, width, height);
        }
        break;

      case "drawing":
        if (style.paths && Array.isArray(style.paths)) {
          ctx.strokeStyle = String(style.strokeColor || "#000000");
          ctx.lineWidth = Number(style.strokeWidth || 2);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          (style.paths as Array<{ x: number; y: number }[]>).forEach((path) => {
            if (path.length > 0) {
              ctx.beginPath();
              ctx.moveTo(x + path[0].x, y + path[0].y);
              path.forEach((point) => {
                ctx.lineTo(x + point.x, y + point.y);
              });
              ctx.stroke();
            }
          });
        }
        break;

      default:
        ctx.fillStyle = "#CCCCCC";
        ctx.fillRect(x, y, width, height);
    }

    ctx.restore();
  }

  /**
   * التصدير إلى SVG مع دعم RTL
   */
  private async exportToSVG(
    elements: ExportableElement[],
    filename: string,
    options: Partial<ExportOptions>,
  ): Promise<ExportResult> {
    const bounds = this.calculateBounds(elements, options.padding);

    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${bounds.width}" 
     height="${bounds.height}" 
     viewBox="0 0 ${bounds.width} ${bounds.height}"
     direction="${options.rtlSupport ? "rtl" : "ltr"}">
  <defs>
    <style>
      @import url('${ARABIC_FONT_CONFIG.googleFontUrl}');
      .text { font-family: ${ARABIC_FONT_CONFIG.fontFamily}; }
      .rtl { direction: rtl; unicode-bidi: bidi-override; }
    </style>
  </defs>
  
  <rect width="100%" height="100%" fill="${options.background || "#FFFFFF"}"/>
  
`;

    for (const element of elements) {
      const x = element.position.x - bounds.minX;
      const y = element.position.y - bounds.minY;
      svgContent += await this.elementToSVG(element, x, y, options);
    }

    svgContent += "</svg>";

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    this.downloadBlob(blob, `${filename}.svg`);

    return {
      success: true,
      data: svgContent,
      filename: `${filename}.svg`,
      stats: { elementsCount: elements.length },
    };
  }

  /**
   * تحويل عنصر إلى SVG
   */
  private async elementToSVG(
    element: ExportableElement,
    x: number,
    y: number,
    options: Partial<ExportOptions>,
  ): Promise<string> {
    const { width, height } = element.size;
    const style = element.style || {};
    const transform = element.rotation
      ? ` transform="rotate(${element.rotation} ${x + width / 2} ${y + height / 2})"`
      : "";

    switch (element.type) {
      case "text":
        const text = element.content || "";
        const textColor = style.color || "#000000";
        const fontSize = style.fontSize || 14;
        const isArabic = containsArabic(text);
        const rtlClass = isArabic && options.rtlSupport ? ' class="text rtl"' : ' class="text"';
        const textAnchor = isArabic && options.rtlSupport ? ' text-anchor="end"' : "";
        const textX = isArabic && options.rtlSupport ? x + width : x;

        return `  <text x="${textX}" y="${y + Number(fontSize)}"${rtlClass} fill="${textColor}" font-size="${fontSize}"${textAnchor}${transform}>${this.escapeXML(text)}</text>\n`;

      case "shape":
        const shapeType = String(style.shapeType || "rectangle");
        const fillColor = style.fillColor || "#3DBE8B";
        const strokeColor = style.strokeColor || "none";
        const strokeWidth = style.strokeWidth || 0;

        if (shapeType === "circle" || shapeType === "ellipse") {
          return `  <ellipse cx="${x + width / 2}" cy="${y + height / 2}" rx="${width / 2}" ry="${height / 2}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"${transform}/>\n`;
        } else if (shapeType === "triangle") {
          const points = `${x + width / 2},${y} ${x},${y + height} ${x + width},${y + height}`;
          return `  <polygon points="${points}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"${transform}/>\n`;
        } else {
          return `  <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"${transform}/>\n`;
        }

      case "sticky_note":
        const noteColor = style.fillColor || "#F6C445";
        const noteText = element.content || "";
        const isNoteArabic = containsArabic(noteText);
        let svg = `  <g${transform}>\n`;
        svg += `    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${noteColor}"/>\n`;
        if (noteText) {
          const noteTextX = isNoteArabic && options.rtlSupport ? x + width - 8 : x + 8;
          const noteAnchor = isNoteArabic && options.rtlSupport ? ' text-anchor="end"' : "";
          svg += `    <text x="${noteTextX}" y="${y + 20}" class="text" fill="#000000" font-size="12"${noteAnchor}>${this.escapeXML(noteText)}</text>\n`;
        }
        svg += `  </g>\n`;
        return svg;

      case "image":
        if (options.embedImages && style.src) {
          try {
            const base64 = await imageToBase64(String(style.src));
            return `  <image x="${x}" y="${y}" width="${width}" height="${height}" xlink:href="${base64}"${transform}/>\n`;
          } catch {
            return `  <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#E0E0E0"${transform}/>\n`;
          }
        }
        return `  <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#E0E0E0"${transform}/>\n`;

      case "drawing":
        if (style.paths && Array.isArray(style.paths)) {
          const paths = (style.paths as Array<{ x: number; y: number }[]>)
            .map((path) => {
              if (path.length === 0) return "";
              const d = path.map((p, i) => `${i === 0 ? "M" : "L"} ${x + p.x} ${y + p.y}`).join(" ");
              return `    <path d="${d}" fill="none" stroke="${style.strokeColor || "#000000"}" stroke-width="${style.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round"/>`;
            })
            .join("\n");
          return `  <g${transform}>\n${paths}\n  </g>\n`;
        }
        return "";

      default:
        return `  <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#CCCCCC"${transform}/>\n`;
    }
  }

  /**
   * التصدير إلى JSON
   */
  private exportToJSON(elements: ExportableElement[], filename: string, options: Partial<ExportOptions>): ExportResult {
    const bounds = this.calculateBounds(elements, options.padding);

    const exportData = {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      metadata: options.includeMetadata
        ? {
            elementsCount: elements.length,
            bounds,
            rtlSupport: options.rtlSupport,
          }
        : undefined,
      elements,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    this.downloadBlob(blob, `${filename}.json`);

    return {
      success: true,
      data: jsonString,
      filename: `${filename}.json`,
      stats: { elementsCount: elements.length },
    };
  }

  /**
   * تحميل ملف
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * تهريب أحرف XML
   */
  private escapeXML(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  /**
   * مسح cache الصور
   */
  clearImageCache(): void {
    this.imageCache.clear();
  }
}

export const exportEngine = new ExportEngine();
