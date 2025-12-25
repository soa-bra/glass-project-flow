/**
 * Component Registry - سجل المكونات
 * يتتبع حالة جميع المكونات في النظام
 */

export type ComponentStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'DEPRECATED';
export type ComponentCategory = 'DS' | 'OC' | 'Hybrid';
export type ComponentPriority = 'high' | 'medium' | 'low';

export interface ComponentSpec {
  name: string;
  category: ComponentCategory;
  path: string;
  sprint: number;
  status: ComponentStatus;
  priority: ComponentPriority;
  tokens: { ds: string[]; oc: string[] };
}

export const COMPONENT_REGISTRY: Record<string, ComponentSpec> = {
  // DS Primitives
  'DatePicker': { name: 'DatePicker', category: 'DS', path: 'design-system/primitives/DatePicker.tsx', sprint: 1, status: 'TODO', priority: 'high', tokens: { ds: ['radius', 'spacing', 'colors'], oc: [] } },
  'TimePicker': { name: 'TimePicker', category: 'DS', path: 'design-system/primitives/TimePicker.tsx', sprint: 1, status: 'TODO', priority: 'high', tokens: { ds: ['radius', 'spacing', 'colors'], oc: [] } },
  'Combobox': { name: 'Combobox', category: 'DS', path: 'design-system/primitives/Combobox.tsx', sprint: 1, status: 'TODO', priority: 'high', tokens: { ds: ['radius', 'spacing', 'colors'], oc: [] } },
  'MultiSelect': { name: 'MultiSelect', category: 'DS', path: 'design-system/primitives/MultiSelect.tsx', sprint: 2, status: 'TODO', priority: 'high', tokens: { ds: ['radius', 'spacing', 'colors'], oc: [] } },
  'TagInput': { name: 'TagInput', category: 'DS', path: 'design-system/primitives/TagInput.tsx', sprint: 2, status: 'TODO', priority: 'medium', tokens: { ds: ['radius', 'spacing', 'colors'], oc: [] } },
  'CheckboxGroup': { name: 'CheckboxGroup', category: 'DS', path: 'design-system/primitives/CheckboxGroup.tsx', sprint: 1, status: 'TODO', priority: 'medium', tokens: { ds: ['spacing', 'colors'], oc: [] } },
  'Stepper': { name: 'Stepper', category: 'DS', path: 'design-system/navigation/Stepper.tsx', sprint: 2, status: 'TODO', priority: 'medium', tokens: { ds: ['spacing', 'colors', 'radius'], oc: [] } },
  'Rating': { name: 'Rating', category: 'DS', path: 'design-system/feedback/Rating.tsx', sprint: 2, status: 'TODO', priority: 'low', tokens: { ds: ['spacing', 'colors'], oc: [] } },
  
  // DS Charts
  'LineChart': { name: 'LineChart', category: 'DS', path: 'design-system/data-display/charts/LineChart.tsx', sprint: 3, status: 'TODO', priority: 'high', tokens: { ds: ['colors'], oc: ['visual-data'] } },
  'BarChart': { name: 'BarChart', category: 'DS', path: 'design-system/data-display/charts/BarChart.tsx', sprint: 3, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'radius'], oc: ['visual-data'] } },
  'PieChart': { name: 'PieChart', category: 'DS', path: 'design-system/data-display/charts/PieChart.tsx', sprint: 3, status: 'TODO', priority: 'high', tokens: { ds: ['colors'], oc: ['visual-data'] } },
  'AreaChart': { name: 'AreaChart', category: 'DS', path: 'design-system/data-display/charts/AreaChart.tsx', sprint: 3, status: 'TODO', priority: 'medium', tokens: { ds: ['colors'], oc: ['visual-data'] } },
  'RadarChart': { name: 'RadarChart', category: 'DS', path: 'design-system/data-display/charts/RadarChart.tsx', sprint: 3, status: 'TODO', priority: 'medium', tokens: { ds: ['colors'], oc: ['visual-data'] } },
  'Heatmap': { name: 'Heatmap', category: 'DS', path: 'design-system/data-display/charts/Heatmap.tsx', sprint: 3, status: 'TODO', priority: 'low', tokens: { ds: ['colors'], oc: ['visual-data'] } },

  // OC Components
  'ApprovalFlow': { name: 'ApprovalFlow', category: 'OC', path: 'operating/governance/ApprovalFlow.tsx', sprint: 5, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'spacing'], oc: ['status', 'priority'] } },
  'PermissionMatrix': { name: 'PermissionMatrix', category: 'OC', path: 'operating/governance/PermissionMatrix.tsx', sprint: 6, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'spacing'], oc: ['status'] } },
  'AuditTrail': { name: 'AuditTrail', category: 'OC', path: 'operating/governance/AuditTrail.tsx', sprint: 6, status: 'TODO', priority: 'medium', tokens: { ds: ['colors', 'spacing'], oc: [] } },
  'ActivityFeed': { name: 'ActivityFeed', category: 'OC', path: 'operating/collaboration/ActivityFeed.tsx', sprint: 5, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'spacing'], oc: [] } },
  'NotificationCenter': { name: 'NotificationCenter', category: 'OC', path: 'operating/collaboration/NotificationCenter.tsx', sprint: 5, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'spacing', 'elevation'], oc: [] } },
  'ConfidenceIndicator': { name: 'ConfidenceIndicator', category: 'OC', path: 'operating/ai/ConfidenceIndicator.tsx', sprint: 6, status: 'TODO', priority: 'medium', tokens: { ds: ['colors'], oc: ['status'] } },
  'AIInsightCard': { name: 'AIInsightCard', category: 'OC', path: 'operating/ai/AIInsightCard.tsx', sprint: 6, status: 'TODO', priority: 'medium', tokens: { ds: ['colors', 'spacing', 'radius'], oc: [] } },
  'SmartSuggestion': { name: 'SmartSuggestion', category: 'OC', path: 'operating/ai/SmartSuggestion.tsx', sprint: 6, status: 'TODO', priority: 'low', tokens: { ds: ['colors', 'spacing'], oc: [] } },
  'CommandPalette': { name: 'CommandPalette', category: 'OC', path: 'operating/navigation/CommandPalette.tsx', sprint: 5, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'spacing', 'elevation', 'radius'], oc: [] } },
  'GlobalSearch': { name: 'GlobalSearch', category: 'OC', path: 'operating/navigation/GlobalSearch.tsx', sprint: 5, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'spacing', 'elevation'], oc: [] } },
  'TopBar': { name: 'TopBar', category: 'OC', path: 'operating/shell/TopBar.tsx', sprint: 5, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'spacing', 'elevation'], oc: [] } },
  'BudgetTracker': { name: 'BudgetTracker', category: 'OC', path: 'operating/finance/BudgetTracker.tsx', sprint: 6, status: 'TODO', priority: 'medium', tokens: { ds: ['colors', 'spacing'], oc: ['financial', 'visual-data'] } },
  'ExpenseCard': { name: 'ExpenseCard', category: 'OC', path: 'operating/finance/ExpenseCard.tsx', sprint: 6, status: 'TODO', priority: 'medium', tokens: { ds: ['colors', 'spacing', 'radius'], oc: ['financial'] } },
  'EmployeeCard': { name: 'EmployeeCard', category: 'OC', path: 'operating/hr/EmployeeCard.tsx', sprint: 6, status: 'TODO', priority: 'low', tokens: { ds: ['colors', 'spacing', 'radius'], oc: [] } },
  'ClientCard': { name: 'ClientCard', category: 'OC', path: 'operating/crm/ClientCard.tsx', sprint: 6, status: 'TODO', priority: 'medium', tokens: { ds: ['colors', 'spacing', 'radius'], oc: [] } },
  'DealPipeline': { name: 'DealPipeline', category: 'OC', path: 'operating/crm/DealPipeline.tsx', sprint: 6, status: 'TODO', priority: 'medium', tokens: { ds: ['colors', 'spacing'], oc: ['status'] } },
  'CanvasZoomControl': { name: 'CanvasZoomControl', category: 'OC', path: 'operating/canvas/CanvasZoomControl.tsx', sprint: 4, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'spacing', 'radius'], oc: ['canvas'] } },
  'LayerPanel': { name: 'LayerPanel', category: 'OC', path: 'operating/canvas/LayerPanel.tsx', sprint: 4, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'spacing'], oc: ['canvas'] } },
  'CanvasExport': { name: 'CanvasExport', category: 'OC', path: 'operating/canvas/CanvasExport.tsx', sprint: 4, status: 'TODO', priority: 'medium', tokens: { ds: ['colors', 'spacing', 'radius'], oc: [] } },

  // Hybrid
  'DataTable': { name: 'DataTable', category: 'Hybrid', path: 'hybrid/DataTable.tsx', sprint: 3, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'spacing', 'radius'], oc: ['project', 'task'] } },
  'DynamicForm': { name: 'DynamicForm', category: 'Hybrid', path: 'hybrid/DynamicForm.tsx', sprint: 4, status: 'TODO', priority: 'high', tokens: { ds: ['colors', 'spacing', 'radius'], oc: [] } },
} as const;

// Helper functions
export const getComponentsByStatus = (status: ComponentStatus) => Object.values(COMPONENT_REGISTRY).filter(c => c.status === status);
export const getComponentsBySprint = (sprint: number) => Object.values(COMPONENT_REGISTRY).filter(c => c.sprint === sprint);
export const getComponentsByCategory = (category: ComponentCategory) => Object.values(COMPONENT_REGISTRY).filter(c => c.category === category);
