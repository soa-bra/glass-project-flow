import React from 'react';
import { Users, Target, DollarSign, TrendingUp, Calendar, Lightbulb, Plus, Save, Share2 } from 'lucide-react';

interface SolidarityPlanningToolbarProps {
  onAddElement: (elementType: string) => void;
  onSave: () => void;
  onShare: () => void;
}

const SolidarityPlanningToolbar: React.FC<SolidarityPlanningToolbarProps> = ({
  onAddElement,
  onSave,
  onShare
}) => {
  const solidarityElements = [
    { id: 'solidarity_team', label: 'فريق العمل', icon: Users, color: 'text-accent-green' },
    { id: 'solidarity_goals', label: 'الأهداف', icon: Target, color: 'text-accent-blue' },
    { id: 'solidarity_budget', label: 'الميزانية', icon: DollarSign, color: 'text-accent-yellow' },
    { id: 'solidarity_impact', label: 'قياس الأثر', icon: TrendingUp, color: 'text-accent-green' },
    { id: 'solidarity_timeline', label: 'الخط الزمني', icon: Calendar, color: 'text-ink' },
    { id: 'solidarity_innovation', label: 'الأفكار', icon: Lightbulb, color: 'text-accent-yellow' }
  ];

  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Plus size={16} className="text-ink/70" />
            <span className="text-sm font-medium text-ink">أدوات التخطيط التضامني</span>
          </div>

          {/* Solidarity Elements */}
          <div className="grid grid-cols-2 gap-2">
            {solidarityElements.map((element) => (
              <button
                key={element.id}
                onClick={() => onAddElement(element.id)}
                className="flex items-center gap-2 p-2 hover:bg-panel/50 rounded-lg transition-all group"
                title={element.label}
              >
                <element.icon size={16} className={`${element.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs text-ink/80 group-hover:text-ink">{element.label}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-border">
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent-green/10 hover:bg-accent-green/20 text-accent-green rounded-lg text-xs transition-all"
            >
              <Save size={14} />
              حفظ
            </button>
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue rounded-lg text-xs transition-all"
            >
              <Share2 size={14} />
              مشاركة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolidarityPlanningToolbar;