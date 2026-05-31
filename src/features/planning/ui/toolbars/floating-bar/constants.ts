/**
 * Floating Bar Constants
 * الثوابت المستخدمة في شريط الأدوات الطافي
 */

import { 
  LayoutGrid, 
  Network, 
  Calendar, 
  Table2, 
  Zap,
  RectangleHorizontal,
  Pill,
  Square,
  Circle
} from "lucide-react";
import type { SmartElementType } from "@/types/smart-elements";
import type { TransformOption } from "./types";

// قائمة الخطوط المتاحة
export const FONT_FAMILIES = [
  { value: "IBM Plex Sans Arabic", label: "IBM Plex Sans Arabic" },
  { value: "Cairo", label: "Cairo" },
  { value: "Tajawal", label: "Tajawal" },
  { value: "Amiri", label: "Amiri" },
  { value: "Noto Sans Arabic", label: "Noto Sans Arabic" },
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
];

// أحجام الخطوط المتاحة
export const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

// أوزان الخطوط
export const FONT_WEIGHTS = [
  { value: "normal", label: "عادي" },
  { value: "500", label: "متوسط" },
  { value: "600", label: "نصف عريض" },
  { value: "700", label: "عريض" },
];

// ألوان المرافق
export const UTILITY_COLORS = [
  { color: "transparent", label: "شفاف" },
  { color: "#000000", label: "أسود" },
  { color: "#FFFFFF", label: "أبيض" },
  { color: "#808080", label: "رمادي" },
];

// ألوان سوبرا
export const SUPRA_COLORS = [
  { color: "#3DBE8B", label: "أخضر" },
  { color: "#F6C445", label: "أصفر" },
  { color: "#E5564D", label: "أحمر" },
  { color: "#3DA8F5", label: "أزرق" },
];

// ألوان عقد الخريطة الذهنية (معاد تصديرها)
export { NODE_COLORS } from "@/types/mindmap-canvas";

// أنماط عقد الخريطة الذهنية
export const MINDMAP_NODE_STYLES = [
  { type: "rounded", icon: RectangleHorizontal, label: "مستدير" },
  { type: "pill", icon: Pill, label: "كبسولة" },
  { type: "rectangle", icon: Square, label: "مستطيل" },
  { type: "circle", icon: Circle, label: "دائري" },
];

// خيارات التحويل للعناصر الذكية
export const TRANSFORM_OPTIONS: TransformOption[] = [
  { 
    type: "kanban" as SmartElementType, 
    label: "لوحة كانبان", 
    icon: LayoutGrid, 
    description: "تحويل إلى أعمدة ومهام" 
  },
  { 
    type: "mind_map" as SmartElementType, 
    label: "خريطة ذهنية", 
    icon: Network, 
    description: "تنظيم كخريطة مترابطة" 
  },
  { 
    type: "timeline" as SmartElementType, 
    label: "خط زمني", 
    icon: Calendar, 
    description: "ترتيب على محور زمني" 
  },
  {
    type: "decisions_matrix" as SmartElementType,
    label: "مصفوفة قرارات",
    icon: Table2,
    description: "تقييم ومقارنة الخيارات",
  },
  { 
    type: "brainstorming" as SmartElementType, 
    label: "عصف ذهني", 
    icon: Zap, 
    description: "تجميع كأفكار للنقاش" 
  },
];

// إعدادات التخطيط الافتراضية
export const DEFAULT_LAYOUT_SETTINGS = {
  orientation: 'horizontal' as const,
  symmetry: 'symmetric' as const,
  direction: 'rtl' as const,
};
