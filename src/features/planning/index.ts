/**
 * Planning Feature
 * ميزة التخطيط والتصميم البصري
 * 
 * @description
 * هذه الميزة تتضمن جميع مكونات لوحة التخطيط التفاعلية
 * بما في ذلك الخرائط الذهنية، المخططات، والعناصر الذكية
 * 
 * @architecture
 * - ui/       → مكونات واجهة المستخدم (panels, overlays, toolbars)
 * - canvas/   → مكونات اللوحة (viewport, selection, gestures)
 * - elements/ → عناصر اللوحة (mindmap, diagram, smart)
 * - domain/   → منطق الأعمال (commands, policies, selectors)
 * - state/    → إدارة الحالة (store, slices)
 * - integration/ → تكامل خارجي (collaboration, export, persistence)
 */

// UI Layer
export * from './ui';

// Canvas Layer
export * from './canvas';

// Elements Layer
export * from './elements';

// Domain Layer
export * from './domain';

// State Layer
export * from './state';

// Integration Layer
export * from './integration';
