
import { X, Building2, Users, FileText, Calculator, Briefcase, Settings, Database, Shield, Headphones, Globe } from 'lucide-react';
import { useState } from 'react';
import { useDepartmentsData } from '@/hooks/useDepartmentsData';
import DepartmentSearch from './DepartmentSearch';
import DepartmentKeyboardShortcuts from './DepartmentKeyboardShortcuts';
import DepartmentNotificationBadge from './DepartmentNotificationBadge';

interface DepartmentsSidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const DepartmentsSidebar = ({ isVisible, onClose }: DepartmentsSidebarProps) => {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const {
    departments,
    searchQuery,
    setSearchQuery,
    selectedDepartmentId,
    selectDepartment,
    isLoading
  } = useDepartmentsData();

  const iconMap = {
    Users, FileText, Calculator, Briefcase, Settings, 
    Database, Shield, Headphones, Globe, Building2
  };

  const handleDepartmentClick = async (deptId: string) => {
    await selectDepartment(deptId);
    // يمكن إضافة المزيد من المنطق هنا لفتح صفحة الإدارة
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex"
      style={{ 
        background: 'rgba(223, 236, 242, 0.95)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* اختصارات لوحة المفاتيح */}
      <DepartmentKeyboardShortcuts 
        departments={departments}
        onDepartmentSelect={handleDepartmentClick}
      />

      {/* شريط الإدارات الجانبي */}
      <aside 
        className="w-[400px] h-full overflow-hidden animate-slide-in-right relative"
        style={{
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* شاشة التحميل */}
        {isLoading && (
          <div 
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ background: 'rgba(255, 255, 255, 0.8)' }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#3e494c]/20 border-t-[#3e494c] rounded-full animate-spin"></div>
              <p className="text-[#3e494c] font-medium" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
                جاري التحميل...
              </p>
            </div>
          </div>
        )}

        <nav className="flex flex-col h-full p-6">
          {/* العنوان وزر الإغلاق */}
          <div className="flex items-center justify-between mb-6">
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

          {/* مربع البحث */}
          <DepartmentSearch 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* قائمة الإدارات */}
          <div className="flex-1 space-y-3 overflow-y-auto">
            {departments.map((dept, index) => {
              const IconComponent = iconMap[dept.icon as keyof typeof iconMap];
              const isHovered = hoveredDept === dept.id;
              const isSelected = selectedDepartmentId === dept.id;
              
              return (
                <button
                  key={dept.id}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-right group transition-all duration-300 hover:scale-105 hover:shadow-lg relative"
                  style={{
                    background: isSelected 
                      ? 'rgba(255, 255, 255, 0.8)' 
                      : isHovered 
                        ? 'rgba(255, 255, 255, 0.6)' 
                        : 'rgba(255, 255, 255, 0.3)',
                    border: isSelected 
                      ? `2px solid ${dept.color}` 
                      : '1px solid rgba(255, 255, 255, 0.3)',
                    transform: isHovered ? 'translateX(-8px)' : 'translateX(0)',
                    transitionDelay: `${index * 50}ms`
                  }}
                  onMouseEnter={() => setHoveredDept(dept.id)}
                  onMouseLeave={() => setHoveredDept(null)}
                  onClick={() => handleDepartmentClick(dept.id)}
                >
                  {/* أيقونة الإدارة */}
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 relative"
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
                    
                    {/* شارة التنبيهات */}
                    {dept.hasNotification && dept.notificationCount && (
                      <DepartmentNotificationBadge 
                        count={dept.notificationCount}
                        color={dept.color}
                      />
                    )}
                  </div>
                  
                  {/* اسم الإدارة ورقم الاختصار */}
                  <div className="flex-1 flex items-center justify-between">
                    <span 
                      className="text-lg font-medium transition-all duration-300"
                      style={{ 
                        fontFamily: 'IBM Plex Sans Arabic',
                        color: isHovered || isSelected ? dept.color : '#3e494c'
                      }}
                    >
                      {dept.name}
                    </span>
                    
                    {/* رقم الاختصار */}
                    {index < 9 && (
                      <span 
                        className="text-xs px-2 py-1 rounded-md opacity-60 transition-all duration-300"
                        style={{ 
                          background: `${dept.color}20`,
                          color: dept.color,
                          fontFamily: 'IBM Plex Sans Arabic'
                        }}
                      >
                        Alt+{index + 1}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* معلومات إضافية في الأسفل */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
            <p className="text-sm text-[#3e494c]/70 text-center mb-2" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
              اختر الإدارة للوصول إلى الأدوات والتقارير المخصصة
            </p>
            <p className="text-xs text-[#3e494c]/50 text-center" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
              استخدم Alt + الرقم للوصول السريع
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
