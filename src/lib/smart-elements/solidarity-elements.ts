// Solidarity Planning Smart Elements
import React from 'react';
import { Users, Target, DollarSign, TrendingUp, Calendar, Lightbulb } from 'lucide-react';
import { SmartElementDefinition, smartElementsRegistry } from './smart-elements-registry';
import { CanvasNode } from '../canvas/types';

// Register function
export function registerSolidaritySmartElements() {
  smartElementsRegistry.registerSmartElement(solidarityTeamElement);
  smartElementsRegistry.registerSmartElement(solidarityGoalsElement);
  smartElementsRegistry.registerSmartElement(solidarityBudgetElement);
  smartElementsRegistry.registerSmartElement(solidarityImpactElement);
  smartElementsRegistry.registerSmartElement(solidarityTimelineElement);
  smartElementsRegistry.registerSmartElement(solidarityInnovationElement);
  console.log('✨ Solidarity smart elements registered');
}

// Team Element
export const solidarityTeamElement: SmartElementDefinition = {
  type: 'solidarity_team',
  name: 'فريق العمل',
  icon: React.createElement(Users, { size: 20 }),
  category: 'social',
  defaultState: {
    type: 'rect',
    transform: { position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
    size: { width: 200, height: 120 },
    style: { fill: 'hsl(var(--accent-green))', stroke: 'hsl(var(--border))', strokeWidth: 2 },
    metadata: {
      teamName: 'فريق جديد',
      memberCount: 0,
      skills: [],
      availability: 'متاح'
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      teamName: { type: 'string', title: 'اسم الفريق' },
      memberCount: { type: 'number', title: 'عدد الأعضاء' },
      skills: { type: 'array', title: 'المهارات المطلوبة' },
      availability: { type: 'string', title: 'حالة التوفر' }
    }
  },
  renderer: (node: CanvasNode) => {
    const teamName = node.metadata?.teamName || 'فريق جديد';
    const memberCount = node.metadata?.memberCount || 0;
    
    return React.createElement('div', {
      className: 'w-full h-full p-3 bg-accent-green/10 border border-accent-green rounded-lg',
      style: { minHeight: '120px' }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-2' }, [
        React.createElement(Users, { key: 'icon', size: 16, className: 'text-accent-green' }),
        React.createElement('h3', { key: 'title', className: 'font-semibold text-sm' }, teamName)
      ]),
      React.createElement('div', { key: 'content', className: 'text-xs text-ink/80' }, [
        React.createElement('p', { key: 'count' }, `عدد الأعضاء: ${memberCount}`),
        React.createElement('p', { key: 'status', className: 'mt-1' }, 'حالة التوفر: متاح')
      ])
    ]);
  }
};

// Goals Element
export const solidarityGoalsElement: SmartElementDefinition = {
  type: 'solidarity_goals',
  name: 'الأهداف والمؤشرات',
  icon: React.createElement(Target, { size: 20 }),
  category: 'project',
  defaultState: {
    type: 'rect',
    transform: { position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
    size: { width: 250, height: 150 },
    style: { fill: 'hsl(var(--accent-blue))', stroke: 'hsl(var(--border))', strokeWidth: 2 },
    metadata: {
      mainGoal: 'هدف رئيسي جديد',
      subGoals: [],
      progress: 0,
      kpi: []
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      mainGoal: { type: 'string', title: 'الهدف الرئيسي' },
      subGoals: { type: 'array', title: 'الأهداف الفرعية' },
      progress: { type: 'number', title: 'نسبة الإنجاز', minimum: 0, maximum: 100 },
      kpi: { type: 'array', title: 'مؤشرات الأداء' }
    }
  },
  renderer: (node: CanvasNode) => {
    const mainGoal = node.metadata?.mainGoal || 'هدف رئيسي جديد';
    const progress = node.metadata?.progress || 0;
    
    return React.createElement('div', {
      className: 'w-full h-full p-3 bg-accent-blue/10 border border-accent-blue rounded-lg',
      style: { minHeight: '150px' }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-2' }, [
        React.createElement(Target, { key: 'icon', size: 16, className: 'text-accent-blue' }),
        React.createElement('h3', { key: 'title', className: 'font-semibold text-sm' }, 'الأهداف')
      ]),
      React.createElement('div', { key: 'content', className: 'text-xs' }, [
        React.createElement('p', { key: 'goal', className: 'mb-2 text-ink/90' }, mainGoal),
        React.createElement('div', { key: 'progress', className: 'mt-2' }, [
          React.createElement('div', { key: 'label', className: 'text-ink/70 mb-1' }, 'نسبة الإنجاز'),
          React.createElement('div', { key: 'bar', className: 'w-full bg-ink/10 rounded-full h-2' }, [
            React.createElement('div', {
              key: 'fill',
              className: 'bg-accent-blue h-2 rounded-full transition-all',
              style: { width: `${progress}%` }
            })
          ])
        ])
      ])
    ]);
  }
};

// Budget Element
export const solidarityBudgetElement: SmartElementDefinition = {
  type: 'solidarity_budget',
  name: 'الميزانية والموارد',
  icon: React.createElement(DollarSign, { size: 20 }),
  category: 'finance',
  defaultState: {
    type: 'rect',
    transform: { position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
    size: { width: 200, height: 130 },
    style: { fill: 'hsl(var(--accent-yellow))', stroke: 'hsl(var(--border))', strokeWidth: 2 },
    metadata: {
      totalBudget: 0,
      spentAmount: 0,
      currency: 'ر.س',
      categories: []
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      totalBudget: { type: 'number', title: 'الميزانية الإجمالية' },
      spentAmount: { type: 'number', title: 'المبلغ المستخدم' },
      currency: { type: 'string', title: 'العملة' },
      categories: { type: 'array', title: 'فئات الإنفاق' }
    }
  },
  renderer: (node: CanvasNode) => {
    const totalBudget = node.metadata?.totalBudget || 0;
    const spentAmount = node.metadata?.spentAmount || 0;
    const currency = node.metadata?.currency || 'ر.س';
    const percentage = totalBudget > 0 ? (spentAmount / totalBudget) * 100 : 0;
    
    return React.createElement('div', {
      className: 'w-full h-full p-3 bg-accent-yellow/10 border border-accent-yellow rounded-lg',
      style: { minHeight: '130px' }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-2' }, [
        React.createElement(DollarSign, { key: 'icon', size: 16, className: 'text-accent-yellow' }),
        React.createElement('h3', { key: 'title', className: 'font-semibold text-sm' }, 'الميزانية')
      ]),
      React.createElement('div', { key: 'content', className: 'text-xs' }, [
        React.createElement('p', { key: 'total' }, `الإجمالي: ${totalBudget.toLocaleString()} ${currency}`),
        React.createElement('p', { key: 'spent', className: 'text-accent-red' }, `المستخدم: ${spentAmount.toLocaleString()} ${currency}`),
        React.createElement('div', { key: 'progress', className: 'mt-2' }, [
          React.createElement('div', { key: 'bar', className: 'w-full bg-ink/10 rounded-full h-2' }, [
            React.createElement('div', {
              key: 'fill',
              className: `h-2 rounded-full transition-all ${percentage > 80 ? 'bg-accent-red' : 'bg-accent-yellow'}`,
              style: { width: `${Math.min(percentage, 100)}%` }
            })
          ])
        ])
      ])
    ]);
  }
};

// Impact Element
export const solidarityImpactElement: SmartElementDefinition = {
  type: 'solidarity_impact',
  name: 'قياس الأثر',
  icon: React.createElement(TrendingUp, { size: 20 }),
  category: 'analytics',
  defaultState: {
    type: 'rect',
    transform: { position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
    size: { width: 220, height: 140 },
    style: { fill: 'hsl(var(--accent-green))', stroke: 'hsl(var(--border))', strokeWidth: 2 },
    metadata: {
      beneficiaries: 0,
      impactScore: 0,
      metrics: [],
      lastUpdated: new Date().toISOString()
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      beneficiaries: { type: 'number', title: 'عدد المستفيدين' },
      impactScore: { type: 'number', title: 'درجة الأثر', minimum: 0, maximum: 10 },
      metrics: { type: 'array', title: 'مؤشرات القياس' }
    }
  },
  renderer: (node: CanvasNode) => {
    const beneficiaries = node.metadata?.beneficiaries || 0;
    const impactScore = node.metadata?.impactScore || 0;
    
    return React.createElement('div', {
      className: 'w-full h-full p-3 bg-accent-green/10 border border-accent-green rounded-lg',
      style: { minHeight: '140px' }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-2' }, [
        React.createElement(TrendingUp, { key: 'icon', size: 16, className: 'text-accent-green' }),
        React.createElement('h3', { key: 'title', className: 'font-semibold text-sm' }, 'قياس الأثر')
      ]),
      React.createElement('div', { key: 'content', className: 'text-xs space-y-1' }, [
        React.createElement('p', { key: 'beneficiaries' }, `المستفيدون: ${beneficiaries.toLocaleString()}`),
        React.createElement('div', { key: 'score' }, [
          React.createElement('p', { key: 'label', className: 'text-ink/70' }, 'درجة الأثر'),
          React.createElement('div', { key: 'rating', className: 'flex gap-1 mt-1' }, 
            Array.from({ length: 10 }, (_, i) => 
              React.createElement('div', {
                key: i,
                className: `w-2 h-2 rounded-full ${i < impactScore ? 'bg-accent-green' : 'bg-ink/20'}`
              })
            )
          )
        ])
      ])
    ]);
  }
};

// Timeline Element
export const solidarityTimelineElement: SmartElementDefinition = {
  type: 'solidarity_timeline',
  name: 'الخط الزمني',
  icon: React.createElement(Calendar, { size: 20 }),
  category: 'project',
  defaultState: {
    type: 'rect',
    transform: { position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
    size: { width: 300, height: 100 },
    style: { fill: 'hsl(var(--panel))', stroke: 'hsl(var(--border))', strokeWidth: 2 },
    metadata: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      milestones: [],
      currentPhase: 'التخطيط'
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      startDate: { type: 'string', title: 'تاريخ البداية', format: 'date' },
      endDate: { type: 'string', title: 'تاريخ النهاية', format: 'date' },
      milestones: { type: 'array', title: 'المعالم الزمنية' },
      currentPhase: { type: 'string', title: 'المرحلة الحالية' }
    }
  },
  renderer: (node: CanvasNode) => {
    const currentPhase = node.metadata?.currentPhase || 'التخطيط';
    const startDate = node.metadata?.startDate ? new Date(node.metadata.startDate).toLocaleDateString('ar-SA') : 'غير محدد';
    
    return React.createElement('div', {
      className: 'w-full h-full p-3 bg-panel/50 border border-border rounded-lg',
      style: { minHeight: '100px' }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-2' }, [
        React.createElement(Calendar, { key: 'icon', size: 16, className: 'text-ink/70' }),
        React.createElement('h3', { key: 'title', className: 'font-semibold text-sm' }, 'الخط الزمني')
      ]),
      React.createElement('div', { key: 'content', className: 'text-xs' }, [
        React.createElement('p', { key: 'phase', className: 'font-medium mb-1' }, `المرحلة: ${currentPhase}`),
        React.createElement('p', { key: 'date', className: 'text-ink/70' }, `البداية: ${startDate}`)
      ])
    ]);
  }
};

// Innovation Element
export const solidarityInnovationElement: SmartElementDefinition = {
  type: 'solidarity_innovation',
  name: 'الأفكار الابتكارية',
  icon: React.createElement(Lightbulb, { size: 20 }),
  category: 'basic',
  defaultState: {
    type: 'rect',
    transform: { position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
    size: { width: 180, height: 120 },
    style: { fill: 'hsl(var(--accent-yellow))', stroke: 'hsl(var(--border))', strokeWidth: 2 },
    metadata: {
      ideaTitle: 'فكرة جديدة',
      description: '',
      feasibilityScore: 5,
      priority: 'متوسط'
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      ideaTitle: { type: 'string', title: 'عنوان الفكرة' },
      description: { type: 'string', title: 'الوصف' },
      feasibilityScore: { type: 'number', title: 'درجة الجدوى', minimum: 1, maximum: 10 },
      priority: { type: 'string', title: 'الأولوية', enum: ['عالي', 'متوسط', 'منخفض'] }
    }
  },
  renderer: (node: CanvasNode) => {
    const ideaTitle = node.metadata?.ideaTitle || 'فكرة جديدة';
    const priority = node.metadata?.priority || 'متوسط';
    const feasibilityScore = node.metadata?.feasibilityScore || 5;
    
    const priorityColors = {
      'عالي': 'text-accent-red',
      'متوسط': 'text-accent-yellow',
      'منخفض': 'text-accent-green'
    };
    
    return React.createElement('div', {
      className: 'w-full h-full p-3 bg-accent-yellow/10 border border-accent-yellow rounded-lg',
      style: { minHeight: '120px' }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-2' }, [
        React.createElement(Lightbulb, { key: 'icon', size: 16, className: 'text-accent-yellow' }),
        React.createElement('h3', { key: 'title', className: 'font-semibold text-sm' }, 'فكرة ابتكارية')
      ]),
      React.createElement('div', { key: 'content', className: 'text-xs space-y-1' }, [
        React.createElement('p', { key: 'title', className: 'font-medium' }, ideaTitle),
        React.createElement('p', { key: 'priority', className: priorityColors[priority as keyof typeof priorityColors] || 'text-ink/70' }, `الأولوية: ${priority}`),
        React.createElement('p', { key: 'score', className: 'text-ink/70' }, `الجدوى: ${feasibilityScore}/10`)
      ])
    ]);
  }
};