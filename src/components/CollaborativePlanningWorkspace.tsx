import React from 'react';
import { Users } from 'lucide-react';

interface CollaborativePlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const CollaborativePlanningWorkspace: React.FC<CollaborativePlanningWorkspaceProps> = ({ 
  isSidebarCollapsed 
}) => {
  return (
    <div
      className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] overflow-auto ${
        isSidebarCollapsed ? 'archive-panel-collapsed' : 'archive-panel-expanded'
      }`}
      style={{ background: '#F8F9FA' }}
    >
      <div className="p-6 h-full">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-4xl font-bold text-right mb-2"
            style={{ color: '#0B0F12' }}
          >
            التخطيط التضامني
          </h1>
          <p 
            className="text-lg text-right opacity-70"
            style={{ color: '#0B0F12' }}
          >
            خطط وتعاون مع فريقك لتحقيق الأهداف المشتركة
          </p>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Planning Card 1 */}
          <div 
            className="bg-white rounded-[41px] p-6 shadow-sm"
            style={{ border: '1px solid #DADCE0' }}
          >
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#F8F9FA', border: '2px solid #DADCE0' }}
              >
                <Users className="w-8 h-8" style={{ color: '#0B0F12' }} />
              </div>
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: '#0B0F12' }}
              >
                خطط المشاريع التضامنية
              </h3>
              <p 
                className="text-sm opacity-60"
                style={{ color: '#0B0F12' }}
              >
                قريباً...
              </p>
            </div>
          </div>

          {/* Planning Card 2 */}
          <div 
            className="bg-white rounded-[41px] p-6 shadow-sm"
            style={{ border: '1px solid #DADCE0' }}
          >
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#F8F9FA', border: '2px solid #DADCE0' }}
              >
                <Users className="w-8 h-8" style={{ color: '#0B0F12' }} />
              </div>
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: '#0B0F12' }}
              >
                إدارة المهام الجماعية
              </h3>
              <p 
                className="text-sm opacity-60"
                style={{ color: '#0B0F12' }}
              >
                قريباً...
              </p>
            </div>
          </div>

          {/* Planning Card 3 */}
          <div 
            className="bg-white rounded-[41px] p-6 shadow-sm"
            style={{ border: '1px solid #DADCE0' }}
          >
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#F8F9FA', border: '2px solid #DADCE0' }}
              >
                <Users className="w-8 h-8" style={{ color: '#0B0F12' }} />
              </div>
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: '#0B0F12' }}
              >
                تقويم الأنشطة
              </h3>
              <p 
                className="text-sm opacity-60"
                style={{ color: '#0B0F12' }}
              >
                قريباً...
              </p>
            </div>
          </div>
        </div>

        {/* Additional Content Placeholder */}
        <div className="mt-8">
          <div 
            className="bg-white rounded-[41px] p-8 shadow-sm text-center"
            style={{ border: '1px solid #DADCE0' }}
          >
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ color: '#0B0F12' }}
            >
              مساحة التخطيط التضامني
            </h2>
            <p 
              className="text-lg opacity-70"
              style={{ color: '#0B0F12' }}
            >
              هذه المساحة مخصصة لتطوير أدوات التخطيط التضامني والتعاوني. المزيد من المميزات قادمة قريباً!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativePlanningWorkspace;