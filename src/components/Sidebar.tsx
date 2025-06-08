
const Sidebar = () => {
  const menuItems = [
    { icon: '🏠', label: 'الرئيسية', active: true },
    { icon: '📊', label: 'المشاريع', active: false },
    { icon: '✅', label: 'المهام', active: false },
    { icon: '🏢', label: 'الإدارات', active: false },
    { icon: '🤝', label: 'التخطيط التشاركي', active: false },
    { icon: '📁', label: 'الأرشيف', active: false },
  ];

  return (
    <aside className="w-20 bg-soabra-sidebar-bg border-l border-gray-200 z-sidebar">
      <nav className="flex flex-col items-center py-6 gap-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`
              w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200
              ${item.active 
                ? 'bg-soabra-primary-blue text-white shadow-lg' 
                : 'hover:bg-white/20 text-soabra-text-secondary'
              }
            `}
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
