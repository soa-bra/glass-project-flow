// Solidarity Smart Elements - Specialized elements for solidarity planning
import React from 'react';
import { SmartElementDefinition } from './smart-elements-registry';
import { 
  Users, 
  Target, 
  Heart, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Lightbulb,
  TrendingUp,
  Award,
  HandHeart
} from 'lucide-react';

// Team Management Element
const teamManagementElement: SmartElementDefinition = {
  type: 'solidarity-team',
  name: 'فريق تضامني',
  icon: React.createElement(Users, { className: 'w-4 h-4' }),
  category: 'social',
  defaultState: {
    size: { width: 280, height: 200 },
    style: {
      fill: '#e0f2fe',
      stroke: '#0288d1',
      strokeWidth: 2
    },
    metadata: {
      teamName: 'فريق المبادرة',
      members: [],
      roles: ['منسق', 'متطوع', 'أخصائي'],
      capacity: 10
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      teamName: { type: 'string', title: 'اسم الفريق' },
      capacity: { type: 'number', title: 'السعة القصوى', minimum: 1, maximum: 50 }
    },
    required: ['teamName']
  },
  renderer: (node, context) => {
    const { teamName, members = [], capacity } = node.metadata || {};
    return React.createElement('div', {
      className: `p-4 h-full flex flex-col justify-between ${context.isSelected ? 'ring-2 ring-primary' : ''}`,
      style: { backgroundColor: node.style?.fill }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-2' }, [
        React.createElement(Users, { key: 'icon', className: 'w-5 h-5 text-blue-600' }),
        React.createElement('h3', { key: 'title', className: 'font-medium text-sm' }, teamName)
      ]),
      React.createElement('div', { key: 'content', className: 'flex-1' }, [
        React.createElement('div', { key: 'members', className: 'text-xs text-gray-600' }, `${members.length} / ${capacity} عضو`),
        React.createElement('div', { key: 'roles', className: 'text-xs text-gray-500 mt-1' }, 'أدوار متنوعة')
      ]),
      React.createElement('div', { key: 'footer', className: 'text-xs text-blue-600 font-medium' }, 'فريق نشط')
    ]);
  }
};

// Goal/Objective Element
const goalElement: SmartElementDefinition = {
  type: 'solidarity-goal',
  name: 'هدف تضامني',
  icon: React.createElement(Target, { className: 'w-4 h-4' }),
  category: 'project',
  defaultState: {
    size: { width: 260, height: 160 },
    style: {
      fill: '#f3e5f5',
      stroke: '#8e24aa',
      strokeWidth: 2
    },
    metadata: {
      title: 'هدف المبادرة',
      description: 'وصف الهدف المراد تحقيقه',
      target: 1000,
      achieved: 0,
      unit: 'شخص',
      deadline: new Date().toISOString()
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: 'عنوان الهدف' },
      target: { type: 'number', title: 'الهدف المطلوب' },
      unit: { type: 'string', title: 'وحدة القياس' }
    },
    required: ['title', 'target']
  },
  renderer: (node, context) => {
    const { title, target = 0, achieved = 0, unit } = node.metadata || {};
    const progress = target > 0 ? Math.round((achieved / target) * 100) : 0;
    
    return React.createElement('div', {
      className: `p-4 h-full flex flex-col ${context.isSelected ? 'ring-2 ring-primary' : ''}`,
      style: { backgroundColor: node.style?.fill }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-3' }, [
        React.createElement(Target, { key: 'icon', className: 'w-5 h-5 text-purple-600' }),
        React.createElement('h3', { key: 'title', className: 'font-medium text-sm' }, title)
      ]),
      React.createElement('div', { key: 'progress', className: 'flex-1' }, [
        React.createElement('div', { key: 'numbers', className: 'text-xs text-gray-600 mb-2' }, `${achieved} / ${target} ${unit}`),
        React.createElement('div', { key: 'bar', className: 'w-full bg-gray-200 rounded-full h-2' }, [
          React.createElement('div', { 
            key: 'fill',
            className: 'bg-purple-600 h-2 rounded-full transition-all',
            style: { width: `${progress}%` }
          })
        ]),
        React.createElement('div', { key: 'percentage', className: 'text-xs text-purple-600 font-medium mt-1' }, `${progress}% مكتمل`)
      ])
    ]);
  }
};

// Budget/Resource Element
const budgetElement: SmartElementDefinition = {
  type: 'solidarity-budget',
  name: 'ميزانية المشروع',
  icon: React.createElement(DollarSign, { className: 'w-4 h-4' }),
  category: 'finance',
  defaultState: {
    size: { width: 300, height: 180 },
    style: {
      fill: '#e8f5e8',
      stroke: '#4caf50',
      strokeWidth: 2
    },
    metadata: {
      title: 'ميزانية المشروع',
      totalBudget: 100000,
      spentBudget: 0,
      currency: 'ريال',
      categories: ['موارد بشرية', 'مواد', 'لوجستيات']
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: 'عنوان الميزانية' },
      totalBudget: { type: 'number', title: 'إجمالي الميزانية' },
      currency: { type: 'string', title: 'العملة' }
    },
    required: ['title', 'totalBudget']
  },
  renderer: (node, context) => {
    const { title, totalBudget = 0, spentBudget = 0, currency } = node.metadata || {};
    const remaining = totalBudget - spentBudget;
    const spentPercentage = totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0;
    
    return React.createElement('div', {
      className: `p-4 h-full flex flex-col ${context.isSelected ? 'ring-2 ring-primary' : ''}`,
      style: { backgroundColor: node.style?.fill }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-3' }, [
        React.createElement(DollarSign, { key: 'icon', className: 'w-5 h-5 text-green-600' }),
        React.createElement('h3', { key: 'title', className: 'font-medium text-sm' }, title)
      ]),
      React.createElement('div', { key: 'content', className: 'flex-1 space-y-2' }, [
        React.createElement('div', { key: 'total', className: 'text-lg font-bold text-green-600' }, 
          `${totalBudget.toLocaleString()} ${currency}`),
        React.createElement('div', { key: 'spent', className: 'text-xs text-gray-600' }, 
          `مصروف: ${spentBudget.toLocaleString()} ${currency}`),
        React.createElement('div', { key: 'remaining', className: 'text-xs text-gray-600' }, 
          `متبقي: ${remaining.toLocaleString()} ${currency}`),
        React.createElement('div', { key: 'progress', className: 'w-full bg-gray-200 rounded-full h-2' }, [
          React.createElement('div', { 
            key: 'fill',
            className: 'bg-green-600 h-2 rounded-full',
            style: { width: `${spentPercentage}%` }
          })
        ])
      ])
    ]);
  }
};

// Impact Measurement Element
const impactElement: SmartElementDefinition = {
  type: 'solidarity-impact',
  name: 'قياس الأثر',
  icon: React.createElement(Heart, { className: 'w-4 h-4' }),
  category: 'analytics',
  defaultState: {
    size: { width: 280, height: 200 },
    style: {
      fill: '#fce4ec',
      stroke: '#e91e63',
      strokeWidth: 2
    },
    metadata: {
      title: 'الأثر الاجتماعي',
      beneficiaries: 0,
      satisfaction: 0,
      communityEngagement: 0,
      sustainabilityScore: 0
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: 'عنوان القياس' },
      beneficiaries: { type: 'number', title: 'عدد المستفيدين' }
    },
    required: ['title']
  },
  renderer: (node, context) => {
    const { title, beneficiaries = 0, satisfaction = 0 } = node.metadata || {};
    
    return React.createElement('div', {
      className: `p-4 h-full flex flex-col ${context.isSelected ? 'ring-2 ring-primary' : ''}`,
      style: { backgroundColor: node.style?.fill }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-3' }, [
        React.createElement(Heart, { key: 'icon', className: 'w-5 h-5 text-pink-600' }),
        React.createElement('h3', { key: 'title', className: 'font-medium text-sm' }, title)
      ]),
      React.createElement('div', { key: 'content', className: 'flex-1 space-y-2' }, [
        React.createElement('div', { key: 'beneficiaries', className: 'flex justify-between' }, [
          React.createElement('span', { key: 'label', className: 'text-xs text-gray-600' }, 'المستفيدين'),
          React.createElement('span', { key: 'value', className: 'text-sm font-medium' }, beneficiaries.toLocaleString())
        ]),
        React.createElement('div', { key: 'satisfaction', className: 'flex justify-between' }, [
          React.createElement('span', { key: 'label', className: 'text-xs text-gray-600' }, 'الرضا'),
          React.createElement('span', { key: 'value', className: 'text-sm font-medium text-pink-600' }, `${satisfaction}%`)
        ]),
        React.createElement('div', { key: 'status', className: 'text-center text-xs text-pink-600 font-medium mt-3' }, 
          'تأثير إيجابي')
      ])
    ]);
  }
};

// Timeline/Schedule Element
const timelineElement: SmartElementDefinition = {
  type: 'solidarity-timeline',
  name: 'جدول زمني',
  icon: React.createElement(Calendar, { className: 'w-4 h-4' }),
  category: 'project',
  defaultState: {
    size: { width: 320, height: 220 },
    style: {
      fill: '#fff3e0',
      stroke: '#ff9800',
      strokeWidth: 2
    },
    metadata: {
      title: 'الخطة الزمنية',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      milestones: []
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: 'عنوان الجدول' },
      startDate: { type: 'string', title: 'تاريخ البداية' },
      endDate: { type: 'string', title: 'تاريخ النهاية' }
    },
    required: ['title']
  },
  renderer: (node, context) => {
    const { title, startDate, endDate } = node.metadata || {};
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return React.createElement('div', {
      className: `p-4 h-full flex flex-col ${context.isSelected ? 'ring-2 ring-primary' : ''}`,
      style: { backgroundColor: node.style?.fill }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-3' }, [
        React.createElement(Calendar, { key: 'icon', className: 'w-5 h-5 text-orange-600' }),
        React.createElement('h3', { key: 'title', className: 'font-medium text-sm' }, title)
      ]),
      React.createElement('div', { key: 'content', className: 'flex-1 space-y-2' }, [
        React.createElement('div', { key: 'start', className: 'text-xs text-gray-600' }, 
          `البداية: ${start.toLocaleDateString('ar-SA')}`),
        React.createElement('div', { key: 'end', className: 'text-xs text-gray-600' }, 
          `النهاية: ${end.toLocaleDateString('ar-SA')}`),
        React.createElement('div', { key: 'duration', className: 'text-sm font-medium text-orange-600' }, 
          `${duration} يوم`),
        React.createElement('div', { key: 'status', className: 'text-xs text-center text-gray-500 mt-3' }, 
          'مجدول للتنفيذ')
      ])
    ]);
  }
};

// Innovation/Idea Element
const innovationElement: SmartElementDefinition = {
  type: 'solidarity-innovation',
  name: 'فكرة إبداعية',
  icon: React.createElement(Lightbulb, { className: 'w-4 h-4' }),
  category: 'basic',
  defaultState: {
    size: { width: 250, height: 180 },
    style: {
      fill: '#fff8e1',
      stroke: '#ffc107',
      strokeWidth: 2
    },
    metadata: {
      title: 'فكرة جديدة',
      description: 'وصف الفكرة الإبداعية',
      feasibility: 'متوسطة',
      impact: 'عالي',
      resources: 'منخفضة'
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: 'عنوان الفكرة' },
      description: { type: 'string', title: 'وصف الفكرة' }
    },
    required: ['title']
  },
  renderer: (node, context) => {
    const { title, description, feasibility, impact } = node.metadata || {};
    
    return React.createElement('div', {
      className: `p-4 h-full flex flex-col ${context.isSelected ? 'ring-2 ring-primary' : ''}`,
      style: { backgroundColor: node.style?.fill }
    }, [
      React.createElement('div', { key: 'header', className: 'flex items-center gap-2 mb-2' }, [
        React.createElement(Lightbulb, { key: 'icon', className: 'w-5 h-5 text-yellow-600' }),
        React.createElement('h3', { key: 'title', className: 'font-medium text-sm' }, title)
      ]),
      React.createElement('div', { key: 'content', className: 'flex-1' }, [
        React.createElement('p', { key: 'desc', className: 'text-xs text-gray-600 mb-2' }, description),
        React.createElement('div', { key: 'feasibility', className: 'text-xs' }, [
          React.createElement('span', { key: 'label', className: 'text-gray-500' }, 'الجدوى: '),
          React.createElement('span', { key: 'value', className: 'font-medium' }, feasibility)
        ]),
        React.createElement('div', { key: 'impact', className: 'text-xs' }, [
          React.createElement('span', { key: 'label', className: 'text-gray-500' }, 'الأثر: '),
          React.createElement('span', { key: 'value', className: 'font-medium text-yellow-600' }, impact)
        ])
      ])
    ]);
  }
};

// Export all solidarity elements
export const solidarityElements = [
  teamManagementElement,
  goalElement,
  budgetElement,
  impactElement,
  timelineElement,
  innovationElement
];

// Register function to be called during initialization
export function registerSolidarityElements() {
  const { smartElementsRegistry } = require('./smart-elements-registry');
  
  solidarityElements.forEach(element => {
    smartElementsRegistry.registerSmartElement(element);
  });
  
  console.log(`🤝 Registered ${solidarityElements.length} solidarity planning elements`);
}