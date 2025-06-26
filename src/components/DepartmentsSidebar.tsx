
import { X, Building2, Users, FileText, Calculator, Briefcase, Settings, Database, Shield, Headphones, Globe } from 'lucide-react';
import { useState } from 'react';

interface DepartmentsSidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const DepartmentsSidebar = ({ isVisible, onClose }: DepartmentsSidebarProps) => {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  const departments = [
    { id: 'hr', name: 'الموارد البشرية', icon: Users, color: '#4f46e5' },
    { id: 'finance', name: 'المالية والمحاسبة', icon: Calculator, color: '#059669' },
    { id: 'legal', name: 'الشؤون القانونية', icon: FileText, color: '#dc2626' },
    { id: 'operations', name: 'العمليات', icon: Briefcase, color: '#ea580c' },
    { id: 'it', name: 'تقنية المعلومات', icon: Database, color: '#7c3aed' },
    { id: 'security', name: 'الأمن والسلامة', icon: Shield, color: '#be123c' },
    { id: 'customer', name: 'خدمة العملاء', icon: Headphones, color: '#0891b2' },
    { id: 'marketing', name: 'التسويق', icon: Globe, color: '#c2410c' },
    { id: 'admin', name: 'الشؤون الإدارية', icon: Settings, color: '#6b7280' },
    { id: 'projects', name: 'إدارة المشاريع', icon: Building2, color: '#0d9488' }
  ];

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex"
      style={{ 
        background: 'rgba(223, 236, 242, 0.95)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* شريط الإدارات الجانبي */}
      <aside 
        className="w-[400px] h-full overflow-hidden animate-slide-in-right"
        style={{
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <nav className="flex flex-col h-full p-6">
          {/* العنوان وزر الإغلاق */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#3e494c]" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
              الإدارات
            </h2>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#3e494c]/30 hover:border-[#3e494c]/60 hover:bg-white/20 hover:shadow-lg transition-all duration-300"
            >
              <X className="w-6 h-6 text-[#3e494c]" />
            </button>
          </div>

          {/* قائمة الإدارات */}
          <div className="flex-1 space-y-3 overflow-y-auto">
            {departments.map((dept, index) => {
              const IconComponent = dept.icon;
              const isHovered = hoveredDept === dept.id;
              
              return (
                <button
                  key={dept.id}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-right group transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: isHovered ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transform: isHovered ? 'translateX(-8px)' : 'translateX(0)',
                    transitionDelay: `${index * 50}ms`
                  }}
                  onMouseEnter={() => setHoveredDept(dept.id)}
                  onMouseLeave={() => setHoveredDept(null)}
                >
                  {/* أيقونة الإدارة */}
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: `${dept.color}20`,
                      border: `2px solid ${dept.color}40`,
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    <IconComponent 
                      className="w-7 h-7 transition-all duration-300" 
                      style={{ color: dept.color }}
                    />
                  </div>
                  
                  {/* اسم الإدارة */}
                  <div className="flex-1">
                    <span 
                      className="text-lg font-medium block transition-all duration-300"
                      style={{ 
                        fontFamily: 'IBM Plex Sans Arabic',
                        color: isHovered ? dept.color : '#3e494c'
                      }}
                    >
                      {dept.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* معلومات إضافية في الأسفل */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
            <p className="text-sm text-[#3e494c]/70 text-center" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
              اختر الإدارة للوصول إلى الأدوات والتقارير المخصصة
            </p>
          </div>
        </nav>
      </aside>

      {/* منطقة فارغة للنقر عليها لإغلاق الشريط */}
      <div 
        className="flex-1 cursor-pointer"
        onClick={onClose}
      />
    </div>
  );
};

export default DepartmentsSidebar;
