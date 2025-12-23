/**
 * Canvas Engine - محرك الكانفاس الموحد
 * @module engine/canvas
 * 
 * يستخدم barrel exports من المجلدات الفرعية لتبسيط الاستيراد
 */

// Kernel - نواة المحرك
export * from './kernel';

// Rendering - وحدة العرض
export * from './rendering';

// Math - المحرك الرياضي
export * from './math/snapEngine';

// Spatial - الفضاء المكاني
export * from './spatial';

// Interaction - التفاعل
export * from './interaction';

// Routing - التوجيه
export * from './routing';

// History - السجل
export * from './history';

// Graph - الرسم البياني (تصديرات محددة لتجنب تعارض EdgeEndpoint)
export { 
  type NodeType,
  type NodeAnchor,
  type GraphNode,
  type EdgeType,
  type EdgeEndStyle,
  type EdgeControlPoint,
  type GraphEdge,
  type CanvasGraph,
  type GraphQuery
} from './graph';

// Collaboration - التعاون
export * from './collaboration';

// Transform - التحويلات
export * from './transform';

// IO - الاستيراد والتصدير
export * from './io/exportEngine';
export * from './io/importEngine';

// Events - الأحداث
export * from './events';

// Voice - الصوت
export * from './voice';
